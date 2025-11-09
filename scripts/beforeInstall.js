// Multi-node WordPress topology following Trellis LEMP stack architecture
// Node 1: Nginx + PHP-FPM (Application Server)
// Node 2: MariaDB (Database Server)
// Node 3: Redis (Cache Server)

var resp = {
  result: 0,
  ssl: !!jelastic.billing.account.GetQuotas('environment.jelasticssl.enabled').array[0].value,
  nodes: []
}

// Node 1: Nginx + PHP-FPM Application Server
resp.nodes.push({
  nodeType: "nginxphp",
  engine: "${settings.php_engine:php8.3}",
  count: 1,
  cloudlets: "${settings.app_cloudlets:16}",
  diskLimit: "${settings.app_diskspace:10}",
  nodeGroup: "cp",
  skipNodeEmails: "true",
  displayName: "Application",
  env: {
    SERVER_WEBROOT: "/var/www/webroot/ROOT",
    JELASTIC_AUTOCONFIG: "true",
    JELASTIC_EXPOSE: "false"
  }
})

// Node 2: MariaDB Database Server
resp.nodes.push({
  nodeType: "mariadb",
  engine: "11.4.4",
  count: 1,
  cloudlets: "${settings.db_cloudlets:8}",
  diskLimit: "${settings.db_diskspace:10}",
  nodeGroup: "sqldb",
  skipNodeEmails: "true",
  displayName: "Database",
  env: {
    ON_ENV_INSTALL: ""
  }
})

// Node 3: Redis Cache Server
resp.nodes.push({
  nodeType: "redis",
  engine: "7.2.4",
  count: 1,
  cloudlets: "${settings.redis_cloudlets:4}",
  diskLimit: "${settings.redis_diskspace:5}",
  nodeGroup: "nosqldb",
  skipNodeEmails: "true",
  displayName: "Cache"
})

return resp;
