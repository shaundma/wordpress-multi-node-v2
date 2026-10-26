#!/usr/bin/env bash
#
# cli-restore.sh - find and repair nginxphp-dockerized CTs that have lost
# /usr/local/bin/wp and/or /usr/local/bin/composer after a PHP engine swap
# / container redeploy.
#
# Why this exists: both wp-cli (installBedrock.jps) and composer
# (manifest.yml:installComposer) are installed under /usr/local/bin/ at
# env-creation time only. That path is in the ephemeral container image,
# so every onAfterRedeployContainer[cp] (eg a Jelastic PHP major-version
# update) wipes both binaries. events.jps now self-heals on future
# redeploys, but existing envs need a one-shot repair.
#
# Run on bpc3 (jumpserver), where /data/nfs/paas/... is readable and the
# PaaS hardnodes (userN.paas) are reachable with the usual root key.
#
# Usage:
#   ./cli-restore.sh scan            # per CT, status of wp and composer
#   ./cli-restore.sh fix <ctid>...   # reinstall whatever is missing on named CTIDs
#   ./cli-restore.sh fix-missing     # scan, then reinstall across every affected CT
#
# Idempotent. Install actions no-op if the binary is already runnable.

set -euo pipefail

IDX=${IDX:-/data/nfs/paas/_dma_tools/_index_jelastic.csv}
WPCLI_URL=${WPCLI_URL:-https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar}
COMPOSER_URL=${COMPOSER_URL:-https://getcomposer.org/download/latest-stable/composer.phar}

die() { echo "ERROR: $*" >&2; exit 1; }

[[ -r $IDX ]] || die "cannot read $IDX (run on bpc3?)"

# Emit: ctid,host,env for every nginxphp-dockerized CT.
list_cts() {
  awk -F, '/nginxphp-dockerized/{
    split($2,a,".")
    host=$8
    sub(/\.dma\.nl$/,"",host)
    sub(/^user0/,"user",host)
    print a[2]","host","$3
  }' "$IDX"
}

# Resolve a single CTID to its hardnode shortname via the index.
lookup_host() {
  local want=$1
  awk -F, -v c="$want" '/nginxphp-dockerized/{
    split($2,a,".")
    if (a[2]==c) {
      host=$8
      sub(/\.dma\.nl$/,"",host)
      sub(/^user0/,"user",host)
      print host
      exit
    }
  }' "$IDX"
}

# Returns "wp=<state> composer=<state>" where state is OK|MISSING, or a
# single-token UNREACHABLE if the ssh/vzctl exec fails.
probe_one() {
  local ctid=$1 host=$2
  ssh -n -o ConnectTimeout=10 -o BatchMode=yes "root@$host" \
    "vzctl exec $ctid 'w=MISSING; c=MISSING; test -x /usr/local/bin/wp && /usr/local/bin/wp --info --allow-root >/dev/null 2>&1 && w=OK; test -x /usr/local/bin/composer && /usr/local/bin/composer --version >/dev/null 2>&1 && c=OK; echo wp=\$w composer=\$c'" \
    2>/dev/null || echo UNREACHABLE
}

install_wp() {
  local ctid=$1 host=$2
  ssh -n -o ConnectTimeout=15 "root@$host" "vzctl exec $ctid '
    set -e
    if [ -x /usr/local/bin/wp ] && /usr/local/bin/wp --info --allow-root >/dev/null 2>&1; then
      echo \"  wp-cli already OK\"
      exit 0
    fi
    for attempt in 1 2 3; do
      if curl -fsSL -o /tmp/wp-cli.phar $WPCLI_URL \
         && php /tmp/wp-cli.phar --info >/dev/null 2>&1; then
        chmod +x /tmp/wp-cli.phar
        mv /tmp/wp-cli.phar /usr/local/bin/wp
        echo \"  wp-cli: \$(/usr/local/bin/wp --version --allow-root 2>&1 | head -1)\"
        exit 0
      fi
      rm -f /tmp/wp-cli.phar
      sleep 5
    done
    echo \"  FAILED to install wp-cli\" >&2
    exit 1
  '"
}

install_composer() {
  local ctid=$1 host=$2
  ssh -n -o ConnectTimeout=15 "root@$host" "vzctl exec $ctid '
    set -e
    if [ -x /usr/local/bin/composer ] && /usr/local/bin/composer --version >/dev/null 2>&1; then
      echo \"  composer already OK\"
      exit 0
    fi
    for attempt in 1 2 3; do
      if curl -fsSL -o /tmp/composer.phar $COMPOSER_URL \
         && php /tmp/composer.phar --version >/dev/null 2>&1; then
        chmod +x /tmp/composer.phar
        mv /tmp/composer.phar /usr/local/bin/composer
        echo \"  composer: \$(/usr/local/bin/composer --version 2>&1 | head -1)\"
        exit 0
      fi
      rm -f /tmp/composer.phar
      sleep 5
    done
    echo \"  FAILED to install composer\" >&2
    exit 1
  '"
}

cmd=${1:-scan}
shift || true

case "$cmd" in
  scan)
    printf '%-6s %-10s %-32s %s\n' CTID HOST ENV STATUS
    while IFS=, read -r ctid host env; do
      st=$(probe_one "$ctid" "$host")
      printf '%-6s %-10s %-32s %s\n' "$ctid" "$host" "$env" "$st"
    done < <(list_cts)
    ;;

  fix)
    [[ $# -ge 1 ]] || die "usage: $0 fix <ctid> [<ctid>...]"
    for ctid in "$@"; do
      host=$(lookup_host "$ctid")
      [[ -n $host ]] || { echo "skip: $ctid not in index" >&2; continue; }
      echo "== $ctid on $host =="
      install_wp "$ctid" "$host" || true
      install_composer "$ctid" "$host" || true
    done
    ;;

  fix-missing)
    affected=()
    while IFS=, read -r ctid host env; do
      st=$(probe_one "$ctid" "$host")
      case "$st" in
        "wp=OK composer=OK") ;;
        UNREACHABLE)        echo "skip: $ctid on $host ($env) UNREACHABLE" >&2 ;;
        *)                  affected+=("$ctid|$host|$env|$st") ;;
      esac
    done < <(list_cts)

    if ((${#affected[@]} == 0)); then
      echo "nothing to fix"
      exit 0
    fi

    echo "will fix ${#affected[@]} CT(s):"
    for a in "${affected[@]}"; do echo "  $a"; done
    read -r -p "proceed? [y/N] " ans
    [[ $ans == y || $ans == Y ]] || { echo "aborted"; exit 0; }

    for a in "${affected[@]}"; do
      IFS='|' read -r ctid host env st <<<"$a"
      echo "== $ctid on $host ($env) =="
      [[ $st == *"wp=MISSING"* ]]       && install_wp       "$ctid" "$host" || true
      [[ $st == *"composer=MISSING"* ]] && install_composer "$ctid" "$host" || true
    done
    ;;

  *)
    die "unknown command: $cmd (want scan|fix|fix-missing)"
    ;;
esac
