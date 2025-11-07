# WordPress Multi-Node LEMP Stack Architecture

## Overview

This repository implements a multi-node WordPress deployment using **Roots.io Bedrock** and **Trellis** architecture. It deploys WordPress using the modern Bedrock boilerplate with Composer dependency management and Trellis-style Nginx configuration across three separate nodes.

## Architecture Changes

### Previous Architecture (Single Container)
- **Single Node**: LEMP or LLSMP container
  - Nginx or LiteSpeed web server
  - PHP-FPM
  - MariaDB database
  - Redis cache
  - All services in one container

### New Architecture (Multi-Node)

**Node 1: Application Server (nginxphp)**
- **Service**: Nginx + PHP-FPM
- **Node Group**: `cp`
- **Display Name**: Application
- **PHP Versions**: 8.2, 8.3, 8.4 (selectable)
- **Purpose**: Handles HTTP requests and PHP processing
- **Resources**: Configurable cloudlets and disk space

**Node 2: Database Server (mariadb)**
- **Service**: MariaDB 11.4.4
- **Node Group**: `sqldb`
- **Display Name**: Database
- **Purpose**: Dedicated database server for WordPress
- **Connection**: Accessible via hostname `sqldb` from application node
- **Resources**: Separate cloudlets and disk allocation

**Node 3: Cache Server (redis)**
- **Service**: Redis 7.2.4
- **Node Group**: `nosqldb`
- **Display Name**: Cache
- **Purpose**: Object caching for WordPress
- **Connection**: Accessible via hostname `nosqldb:6379` from application node
- **Configuration**: 256MB max memory with LRU eviction policy

## Key Technical Changes

### 1. Node Configuration (`scripts/beforeInstall.js`)
- Removed LiteSpeed/LLSMP option
- Created three separate node definitions
- Each node has dedicated resource allocation
- Network-based communication between nodes

### 2. Manifest Configuration (`manifest.yml`)
- Updated package name to "WordPress Multi-Node LEMP Stack"
- Removed LiteSpeed-specific settings and features
- Updated global variables:
  - `DB_HOST`: Changed from `127.0.0.1` to `sqldb`
  - `REDIS_HOST`: Added as `nosqldb`
  - `REDIS_PORT`: Set to `6379`
- Modified installation flow:
  - Added `setupNodes` action for multi-node configuration
  - Added `configureRedis` action
  - Updated `createUserDB` to target `sqldb` node
  - Updated `installWordpress` to use network-based connections

### 3. Database Configuration
- Database runs on separate node (`sqldb`)
- User creation and privileges granted for remote access (`'user'@'%'`)
- WordPress connects via network hostname instead of localhost
- Custom MySQL configuration applied via `wordpress.cnf`

### 4. Redis Configuration
- Redis runs on separate node (`nosqldb`)
- Configured with:
  - Max memory: 256MB
  - Eviction policy: allkeys-lru
- WordPress connects via TCP (host:port) instead of Unix socket
- Cluster mode enabled in WordPress installation

### 5. Settings Simplification
- Removed LiteSpeed High-Performance Web Server option
- Removed WordPress Brute Force Attack Protection (LiteSpeed-specific)
- Removed Web Application Firewall (LiteSpeed-specific)
- Kept essential features:
  - PHP version selector
  - Let's Encrypt SSL
  - CDN support
  - WordPress Multisite
  - WooCommerce

### 6. Success Notifications
- Created new success email templates for `nginxphp` node type:
  - `success/email/success-nginxphp-default.md`
  - `success/email/success-nginxphp-cdn.md`
- Updated to reflect multi-node architecture in messages

### 7. Documentation Updates (`README.md`)
- Updated description to highlight multi-node architecture
- Added detailed node descriptions
- Listed architecture benefits:
  - Resource isolation
  - Independent scalability
  - Better performance
  - Improved maintainability
  - Trellis compatibility
- Added technical details section

## Network Communication

### Internal Hostnames
- Application node connects to database via `sqldb` hostname
- Application node connects to Redis via `nosqldb` hostname
- Nodes communicate over internal platform network
- No external IP requirements for inter-node communication

### Security
- Each node is isolated with dedicated resources
- Database accepts connections from internal network only
- Firewall rules managed by the platform
- Redis protected by internal network

## Bedrock & Trellis Implementation

This architecture fully implements Roots.io Bedrock and Trellis:

### Bedrock Features
1. **Composer Dependency Management**: WordPress core and plugins managed via Composer
2. **Improved Directory Structure**:
   - `web/` - Public document root (replaces traditional WordPress root)
   - `web/app/` - WordPress content directory
   - `config/` - WordPress configuration files
   - `.env` - Environment-specific configuration
3. **Environment Variables**: Database, Redis, and WordPress settings via `.env`
4. **Enhanced Security**: Protected sensitive files, proper permissions
5. **Modern Development Workflow**: Version control friendly structure

### Trellis Features
1. **Separation of Concerns**: Each service runs independently
2. **LEMP Stack**: Nginx + PHP-FPM + MariaDB
3. **Security-Hardened Nginx**:
   - Protected `.env` and `composer.json` files
   - Prevented PHP execution in uploads
   - Security headers (X-Frame-Options, CSP, etc.)
   - Optimized static file caching
4. **Modern PHP**: Support for PHP 8.2, 8.3, 8.4
5. **Redis Caching**: Object cache for improved performance
6. **Best Practices**: Optimized configurations for each service

## Benefits

1. **Resource Isolation**: Database and cache workloads don't compete with web server
2. **Scalability**: Each node can be scaled independently
3. **Performance**: Dedicated resources improve response times
4. **Maintainability**: Updates and maintenance per service
5. **Reliability**: Failure isolation between services
6. **Flexibility**: Easy to adjust resources per workload type

## Migration Notes

For users migrating from single-container to multi-node:

1. **Connection Strings**: Database and Redis use network hostnames
2. **PHP Configuration**: Applied to application node only
3. **Database Access**: Via network hostname from application node
4. **Resource Allocation**: Distributed across three nodes
5. **Backup Strategy**: Should cover all three nodes

## Future Enhancements

Potential improvements to consider:

1. **Horizontal Scaling**: Add load balancer for multiple application nodes
2. **Database Replication**: Primary-replica setup for high availability
3. **Redis Clustering**: For larger cache requirements
4. **Monitoring**: Add dedicated monitoring stack
5. **CDN Integration**: Enhanced with edge caching
