<p align="center">
<img src="images/wp-standalone.png" alt="WordPress Multi-Node LEMP Stack">
</p>

# WordPress Multi-Node LEMP Stack with Bedrock

**Version 1.2.2** | Last Updated: December 1, 2025

An automated WordPress deployment package for **Virtuozzo Application Platform** that creates a high-performance, scalable WordPress environment using **Roots.io Bedrock** and **Trellis** architecture across multiple nodes.

## What This Package Does

This JPS (Jelastic Packaging Standard) manifest automatically provisions and configures a complete WordPress hosting environment across three separate nodes, providing:

- **Bedrock WordPress**: Modern WordPress boilerplate with Composer dependency management
- **Trellis Nginx Configuration**: Security-hardened Nginx configs following Roots.io best practices
- **Automated Deployment**: One-click installation of a fully configured Bedrock environment
- **Multi-Node Architecture**: Separates web, database, and cache layers for optimal performance
- **Environment-Based Configuration**: Uses `.env` files for secure configuration management
- **Flexible PHP Versions**: Choose between PHP 8.2, 8.3, or 8.4 during installation
- **Production-Ready**: Includes Let's Encrypt SSL, optional CDN, WooCommerce, and WordPress Multisite support
- **Enhanced Security**: Protected sensitive files, proper directory structure, and security headers

## Architecture Overview

The package deploys **three independent nodes** that work together:

### Node 1: Application Server (Nginx + PHP-FPM)
- **Purpose**: Serves WordPress site and processes PHP code
- **Technology**: Nginx web server with PHP-FPM
- **Features**:
  - Selectable PHP versions (8.2, 8.3, 8.4)
  - WordPress-optimized configuration
  - Automatic connection to database and cache nodes

### Node 2: Database Server (MariaDB)
- **Purpose**: Stores WordPress data (posts, users, settings)
- **Technology**: MariaDB 11.4.4
- **Features**:
  - Dedicated database resources
  - WordPress-optimized MySQL configuration
  - Automatic user and database creation
  - Secure network-only access

### Node 3: Cache Server (Redis)
- **Purpose**: Accelerates WordPress with object caching
- **Technology**: Redis 7.2.4
- **Features**:
  - Automatic memory scaling (80% of node RAM)
  - Dynamic maxmemory adjustment when node is scaled
  - LRU eviction policy for optimal cache performance
  - Pre-configured for WordPress object caching
  - Network-accessible from application node

## Why Multi-Node Architecture?

**Resource Isolation**: Each service has dedicated CPU, RAM, and disk—database queries don't slow down web requests.

**Independent Scaling**: Scale application, database, or cache nodes separately based on your traffic patterns.

**Better Performance**: No resource contention between services means faster response times.

**Easier Maintenance**: Update or restart individual services without affecting the entire site.

**Production Best Practice**: Follows industry standards used by professional WordPress hosts and agencies.


## How to Deploy

### Option 1: Deploy to Cloud Button

Click the "**Deploy to Cloud**" button below to launch the installation wizard:

[![Deploy to Cloud](https://raw.githubusercontent.com/jelastic-jps/common/main/images/deploy-to-cloud.png)](https://www.virtuozzo.com/install/?manifest=https://raw.githubusercontent.com/shaundma/wordpress-multi-node-v2/main/manifest.yml)

1. Enter your email address
2. Choose a [Virtuozzo Public Cloud Provider](https://www.virtuozzo.com/application-platform-partners/)
3. Click **Install**

### Option 2: From Your VAP Account

If you already have a Virtuozzo Application Platform account:

- **From Marketplace**: Find "WordPress Multi-Node LEMP Stack" in the [Marketplace](https://www.virtuozzo.com/application-platform-docs/marketplace/)
- **Import Manifest**: [Import](https://www.virtuozzo.com/application-platform-docs/environment-import/) the `manifest.yml` file from this repository


## Installation Options

During installation, you can customize your WordPress environment:

### Core Settings

**PHP Version** (Required)
- Choose PHP 8.2, 8.3, or 8.4
- Applied to the application server node
- Can be changed later if needed

### Optional Features

**Let's Encrypt SSL with Auto-Renewal**
- Automatically obtains and installs free SSL certificates
- Enables HTTPS for your domain
- Auto-renews before expiration
- [Learn more](https://www.virtuozzo.com/company/blog/free-ssl-certificates-with-lets-encrypt/)

**WordPress Multisite Network**
- Enables WordPress Multisite functionality
- Run multiple WordPress sites from one installation
- Shared user database and plugin management
- Ideal for agencies or site networks
- [Learn more](https://wordpress.org/support/article/glossary/#multisite)

**WooCommerce**
- Automatically installs WooCommerce plugin
- Complete e-commerce platform for WordPress
- Sell physical and digital products
- Integrated payment gateways
- [Learn more](https://wordpress.org/plugins/woocommerce/)

**Premium CDN** (if available)
- Lightning-fast global content delivery
- 160+ edge locations worldwide
- HTTP/3 support for maximum speed
- Reduces server load

## What Happens During Installation

The package automatically performs these steps:

1. **Provision Infrastructure**
   - Creates three separate nodes (Application, Database, Cache)
   - Allocates resources for each node
   - Configures internal networking

2. **Install Software**
   - Nginx + PHP-FPM on application node
   - MariaDB 11.4.4 on database node
   - Redis 7.2.4 on cache node

3. **Configure Services**
   - Optimizes MySQL for WordPress workloads
   - Configures Redis with automatic memory scaling and LRU eviction
   - Sets up PHP-FPM with WordPress-specific settings
   - Creates database and user with proper permissions
   - Applies Trellis Nginx configuration for Bedrock

4. **Install Bedrock WordPress**
   - Installs Composer for dependency management
   - Creates Bedrock project via Composer
   - Generates `.env` file with database and Redis configuration
   - Installs WordPress core via WP-CLI
   - Installs and enables Redis Object Cache plugin
   - Sets up admin account with secure directory structure

5. **Apply Optional Features**
   - Installs SSL certificates if selected
   - Enables Multisite if selected
   - Installs WooCommerce if selected
   - Configures CDN if selected

The entire process takes **3-5 minutes**. You'll receive an email with access credentials when complete.

## After Installation

Once deployed, you'll receive:

- **WordPress Admin URL**: `https://your-domain.com/wp-admin/`
- **Admin Credentials**: Sent via email
- **Database Credentials**: Username, password, and host sent via email

### What's Pre-Configured

✅ **Bedrock WordPress**: Modern boilerplate with improved directory structure (`web/`, `config/`)
✅ **Composer**: Dependency management for plugins and WordPress core
✅ **Environment Configuration**: `.env` file with database, Redis, and security keys
✅ **Database Connection**: Automatically connected to MariaDB node via environment variables
✅ **Object Caching**: Redis Object Cache plugin installed and activated
✅ **Trellis Nginx**: Security-hardened configuration with proper Bedrock document root
✅ **PHP Settings**: Optimized for WordPress performance
✅ **MySQL Settings**: Configured for WordPress database patterns
✅ **Security**: Protected `.env`, `composer.json`, and vendor files; proper security headers

## Use Cases

This package is ideal for:

- **Professional WordPress Sites**: Blogs, corporate sites, portfolios
- **E-commerce Stores**: WooCommerce shops that need performance
- **WordPress Development**: Agencies building client sites
- **WordPress Multisite Networks**: Multiple sites under one roof
- **High-Traffic Sites**: Need resource isolation and scaling
- **Performance-Critical Applications**: Require caching and optimization

## Technical Details

### Bedrock & Trellis Architecture

This package implements [Roots.io Bedrock](https://github.com/roots/bedrock) and [Trellis](https://github.com/roots/trellis) architecture:

- **Bedrock WordPress**: Modern WordPress boilerplate with Composer
- **Improved Directory Structure**: `web/` for public files, `config/` for WordPress configuration
- **Environment Configuration**: `.env` files for secure configuration management
- **Trellis Nginx**: Security-hardened Nginx configuration with Bedrock-specific settings
- **LEMP Stack**: Linux, Nginx, MariaDB, PHP-FPM
- **Modern PHP**: Support for latest PHP versions (8.2, 8.3, 8.4)
- **Service Separation**: Web, database, and cache on separate nodes
- **Network-Based Communication**: Services communicate via internal hostnames
- **Production Best Practices**: Optimized configurations for each service

### Network Configuration

**Internal Hostnames:**
- Application node connects to database at `sqldb`
- Application node connects to Redis at `nosqldb:6379`
- No external IPs needed for inter-node communication

**Security:**
- Each node isolated with dedicated resources
- Database accepts connections from internal network only
- Firewall rules managed automatically
- Redis protected by internal network

## Customization

After deployment, you can:

- **Scale individual nodes** (more CPU/RAM/disk)
  - Redis cache automatically adjusts maxmemory when scaled (80% of available RAM)
  - Instant scaling without manual configuration
- **Change PHP version** on application node
- **Add more application nodes** for load balancing
- **Tune MySQL** performance settings
- **Install additional WordPress plugins** via Composer or WP-CLI

### Automatic Redis Scaling

When you scale the Redis node (increase or decrease cloudlets), the system automatically:
1. Detects the scaling event
2. Calculates optimal maxmemory (80% of new RAM allocation)
3. Updates Redis configuration immediately
4. Persists the change to redis.conf

**Example**: Scale Redis from 2 cloudlets (256 MB) to 4 cloudlets (512 MB), and maxmemory automatically updates from 204 MB to 409 MB.

See `ARCHITECTURE.md` for detailed technical documentation.

## Support & Documentation

- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/shaundma/wordpress-multi-node-v2/issues)
- **Virtuozzo Docs**: [Platform Documentation](https://www.virtuozzo.com/application-platform-docs/)
- **Roots.io Trellis**: [Trellis Documentation](https://github.com/roots/trellis)

## License

This project is licensed under the terms included in `LICENSE.md`.
