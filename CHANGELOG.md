# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
