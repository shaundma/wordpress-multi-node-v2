# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
