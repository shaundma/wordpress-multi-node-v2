# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.9] - 2025-12-04

### Added
- **Custom PHP Configuration Files**: Added modular PHP configuration via `/etc/php.d/` instead of modifying `/etc/php.ini` directly
  - Added `configs/php.d/opcache.ini` with optimized OPcache settings for production
    - 512 MB memory consumption (increased from 256 MB)
    - 64 MB interned strings buffer (increased from 16 MB)
    - 32,500 max accelerated files (increased from 10,000)
    - 60 second revalidation frequency (increased from 2 seconds for production)
    - OPcache CLI enabled
    - save_comments enabled for better compatibility
  - Added `configs/php.d/wordpress.ini` with WordPress-specific PHP settings
    - 256 MB upload and post size limits
    - 300 second execution and input timeouts
    - 2048 max input variables
    - Europe/Amsterdam timezone
    - Security hardening (expose_php off, httponly cookies)
    - Error reporting configured for production

### Changed
- manifest.yml: Updated PHP configuration deployment to use modular `/etc/php.d/` files
  - Configuration files are now downloaded from repository and placed in `/etc/php.d/`
  - More maintainable approach compared to sed commands on `/etc/php.ini`
  - Automatic deployment during environment setup with error checking

### Benefits
- Cleaner separation of custom PHP settings from base configuration
- Easier to update and maintain PHP settings
- Better organization following Linux/PHP best practices
- Settings persist across PHP version upgrades

## [1.2.8] - 2025-12-02

### Fixed
- **CRITICAL: Prominent Warning for Collaboration Users**: Added highly visible warning since automatic detection proved unreliable
  - Collaboration user detection via API checks did not work reliably across different platform configurations
  - Switched to manual approach: prominent red warning message visible to all users
  - Added displayfield with bold red warning text above Let's Encrypt checkbox
  - Changed Let's Encrypt default from checked to unchecked (safer default)
  - Warning clearly explains that collaboration users will get "permission denied" errors if they enable SSL during installation
  - Instructs collaboration users to add Let's Encrypt after deployment via marketplace

### Changed
- manifest.yml: Added le-warning displayfield with prominent HTML-formatted warning
- manifest.yml: Changed le-addon default value from true to false (unchecked by default)
- Installation form now shows clear red warning: "⚠️ COLLABORATION USERS: do NOT check Install Let's Encrypt SSL"
- Account owners can still enable it, but must consciously check the box

### Rationale
After testing multiple API-based detection methods (GetTasks, GetQuotas, GetUserInfo, GetAccount), none reliably identified collaboration users across different platform configurations. The manual warning approach is more reliable and prevents installation failures.

## [1.2.7] - 2025-12-02

### Fixed
- **CRITICAL: Automatic Detection of Collaboration Users**: Now automatically detects and disables Let's Encrypt for collaboration users
  - Collaboration users cannot create scheduled scripts due to platform API restrictions
  - This caused "permission denied (access not allowed)" errors during Let's Encrypt installation
  - Added automatic detection in beforeInit.js using jelastic.utils.scheduler.GetTasks() API check
  - Let's Encrypt checkbox is now automatically disabled for collaboration users
  - Clear tooltip message explains the limitation and instructs users to add SSL after deployment
  - Account owners can still install with Let's Encrypt enabled during initial deployment

### Added
- Collaboration user detection logic in scripts/beforeInit.js
  - Checks utils.Scheduler API access to determine if user has script creation permissions
  - Handles multiple permission denied error codes (701, 702, 8, Response.PERMISSION_DENIED)
  - Falls back to assuming collaboration user if API check fails for safety
  - Dynamically updates Let's Encrypt checkbox: disabled + unchecked + explanatory tooltip

### Changed
- scripts/beforeInit.js: Added isCollaborationUser detection and conditional checkbox disabling
- Improved user experience by preventing installation failures before they occur

## [1.2.6] - 2025-12-02

### Fixed
- **CRITICAL: Let's Encrypt Permission Error for Collaboration Users**: Fixed installation failure with collaboration users
  - Error: "permission denied (access not allowed)" when createScript is called during addon installation
  - The installLEaddon action was using direct `install:` which runs in manifest context without elevated permissions
  - Changed to use `onAfterReturn: { install: {} }` pattern following wordpress-cluster best practice
  - This defers addon installation until after the script completes, allowing proper permission handling
  - Collaboration users with full environment permissions can now install with Let's Encrypt enabled
  - Also reverted GitHub URL back to blob format (both work; blob is the standard used by wordpress-cluster)

### Changed
- manifest.yml:216-232: Refactored installLEaddon to use onAfterReturn pattern
  - Wraps addon installation in script block that returns onAfterReturn object
  - Platform handles addon installation with proper permissions after script execution
  - Matches pattern used by official jelastic-jps/wordpress-cluster package

## [1.2.5] - 2025-12-02

### Fixed
- **CRITICAL: Let's Encrypt Installation Failure**: Fixed incorrect GitHub URL causing permission errors
  - Error: "permission denied (access not allowed)" when installing with Let's Encrypt enabled
  - The installLEaddon action was using GitHub blob URL instead of raw content URL
  - Changed from `github.com/.../blob/master/manifest.jps` to `raw.githubusercontent.com/.../master/manifest.jps`
  - Platform was attempting to parse GitHub's HTML interface instead of the actual manifest
  - Let's Encrypt now installs correctly during initial deployment
  - Collaboration users can now install with Let's Encrypt enabled

### Changed
- manifest.yml:217: Updated Let's Encrypt addon URL to use raw.githubusercontent.com

## [1.2.4] - 2025-12-02

### Fixed
- **CRITICAL: Missing setupWP.sh Script**: Fixed installation failure when Let's Encrypt SSL addon is installed
  - Error: "bash: /var/lib/nginx/bin/setupWP.sh: No such file or directory" (exit status 127)
  - The onAfterInstallAddon event handler referenced non-existent setupWP.sh script
  - Replaced script call with inline WP-CLI commands for URL updates
  - Now properly updates WordPress URLs to HTTPS after SSL installation
  - Added WordPress installation check before attempting URL updates
  - Added multisite detection with appropriate handling

### Changed
- scripts/events.jps:8-50: Replaced `bash ~/bin/setupWP.sh` with complete inline URL update logic
  - Uses WP-CLI for database search-replace operations
  - Updates .env file to use HTTPS protocol
  - Flushes caches and re-enables Redis after URL changes
  - Provides clear status messages for each operation

## [1.2.3] - 2025-12-01

### Fixed
- **WRONGPASS Error**: Fixed password extraction including quotes from redis.conf
  - Password in redis.conf may be stored with quotes: `requirepass "password123"`
  - Previous extraction captured quotes, causing 12-char password instead of 10-char
  - AUTH failed with "WRONGPASS invalid username-password pair"
  - Now strips both single and double quotes from extracted password
  - Added final cleanup with xargs to trim any remaining whitespace

### Changed
- scripts/events.jps:109-131: Added quote stripping to all password extraction methods
  - tr -d '"' removes double quotes
  - tr -d "'" removes single quotes
  - xargs trims whitespace
- Enhanced error logging to show actual redis.conf line

## [1.2.2] - 2025-12-01

### Fixed
- **Redis Scaling Authentication**: Fixed NOAUTH errors when scaling Redis node
  - Password extraction was failing during scaling events
  - Added multiple fallback methods to extract Redis password
  - Added password validation and length logging
  - Filter out redis-cli warning messages from output
  - Capture and log CONFIG SET and CONFIG REWRITE results for debugging

### Changed
- scripts/events.jps: Enhanced password extraction with 3 methods
  - Method 1: Standard grep from redis.conf
  - Method 2: Grep with flexible whitespace handling
  - Method 3: Fallback to Jelastic password file
- Added detailed logging for troubleshooting authentication issues

## [1.2.1] - 2025-12-01

### Fixed
- **Dynamic Initial Redis maxmemory**: Now calculates optimal maxmemory on first install
  - Was hardcoded to 256MB regardless of node size
  - Now sets maxmemory to 80% of allocated RAM (same formula as scaling)
  - Calculates based on flexible/fixed cloudlets at installation time
  - Persists configuration with CONFIG REWRITE

- **Redis Credentials in Success Email**: Added Redis connection info to WordPress success emails
  - Redis password was missing from WordPress installation success emails
  - Now includes Host, Port, and Password in both default and CDN success emails
  - Matches information provided in skeleton deployment emails

### Changed
- manifest.yml (setupNodes): Removed hardcoded 256mb from initial redis.conf
- manifest.yml (configureRedis): Added dynamic calculation similar to scaling logic
- success/email/success-nginxphp-default.md: Added Redis credentials section
- success/email/success-nginxphp-cdn.md: Added Redis credentials section

## [1.2.0] - 2025-12-01

### Fixed
- **CRITICAL**: Redis scaling events now installed for ALL deployments, not just WordPress installs
  - events.jps was only being installed if "Install WordPress" was checked
  - This caused Redis auto-scaling to fail silently for skeleton/custom deployments
  - Moved events.jps installation outside wp-addon conditional (manifest.yml:116-118)
  - Redis scaling now works regardless of WordPress installation choice

### Changed
- events.jps now installs immediately after configureRedis, before WordPress setup
- Ensures Redis scaling events are always registered in the environment

## [1.1.4] - 2025-12-01

### Fixed
- **Permission Error Fix**: Removed ExecCmdById logging that was running without root permissions
  - The logging attempt was failing with "Permission denied" on /var/log/redis-scaling.log
  - This caused the entire scaling action to fail before redis-cli commands could execute
  - Now all logging happens in the cmd[nosqldb] block which runs as root
  - Maxmemory updates will now execute successfully

### Changed
- Added cloudlet counts (fixed/flexible) to global variables for better logging
- Enhanced log messages to show cloudlet allocation details

## [1.1.3] - 2025-12-01

### Fixed
- **Critical Fix**: Moved scaling events back to events.jps (type: update) where they belong
  - Events in install-type manifests (manifest.yml) don't persist as environment events
  - Events in update-type manifests (events.jps) properly register as persistent environment events
  - This is why the events weren't firing - they were in the wrong file type

### Changed
- Scaling events (onAfterScaleIn, onAfterScaleOut, onAfterSetCloudletCount) now correctly defined in events.jps
- Removed non-functional events from manifest.yml
- Events now properly trigger when Redis node is scaled

## [1.1.2] - 2025-12-01

### Added
- **Multiple Scaling Event Triggers**: Now responds to three different scaling events for maximum reliability
  - `onAfterScaleIn`: Triggers when scaling down (reducing cloudlets)
  - `onAfterScaleOut`: Triggers when scaling up (increasing cloudlets)
  - `onAfterSetCloudletCount`: Triggers on any cloudlet count change
- **Comprehensive Logging**: Added detailed logging to `/var/log/redis-scaling.log` on Redis node
  - Logs cloudlet counts, memory calculations, and maxmemory changes
  - Helps diagnose scaling behavior and verify proper operation
- **Enhanced Error Reporting**: Better error messages in Jelastic action logs

### Changed
- Refactored scaling logic into reusable `updateRedisMaxmemory` action
- Improved calculation logging with fixed/flexible cloudlet breakdown

## [1.1.1] - 2025-12-01

### Fixed
- **Redis Auto-Scaling Reliability**: Moved `onAfterSetCloudletCount` event from separate events.jps to main manifest.yml
  - Event now registers at installation time for better persistence
  - Fixes inconsistent triggering when Redis node is scaled
  - Ensures maxmemory updates reliably on every scaling operation
  - Removed duplicate event handler from events.jps

### Changed
- Improved logging for Redis scaling events

## [1.1.0] - 2025-12-01

### Added
- **Automatic Redis Memory Scaling**: Redis maxmemory now automatically adjusts when the node is scaled
  - Implements `onAfterSetCloudletCount` event handler
  - Calculates optimal maxmemory as 80% of available RAM
  - Handles both flexible and fixed cloudlet configurations
  - Persists changes with `CONFIG REWRITE`
  - Instant scaling response without manual intervention

### Changed
- Updated README.md with version information and Redis scaling documentation
- Enhanced manifest.yml with version and date metadata

## [1.0.0] - 2024-XX-XX

### Added
- Initial release of WordPress Multi-Node LEMP Stack
- Three-node architecture (Nginx+PHP, MariaDB, Redis)
- Bedrock WordPress boilerplate integration
- Trellis Nginx configuration
- PHP 8.2, 8.3, 8.4 support
- Let's Encrypt SSL with auto-renewal
- WordPress Multisite support
- WooCommerce integration
- Premium CDN support
- Object caching with Redis
- Composer dependency management
- Environment-based configuration (.env files)
- Automated deployment and setup
- Security hardening and best practices
