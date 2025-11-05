<p align="center">
<img src="images/wp-standalone.png" alt="WordPress Multi-Node LEMP Stack">
</p>

# WordPress Multi-Node LEMP Stack

An automated WordPress deployment package for **Virtuozzo Application Platform** that creates a high-performance, scalable WordPress environment using a multi-node architecture inspired by **Roots.io Trellis** best practices.

## What This Package Does

This JPS (Jelastic Packaging Standard) manifest automatically provisions and configures a complete WordPress hosting environment across three separate nodes, providing:

- **Automated Deployment**: One-click installation of a fully configured WordPress environment
- **Multi-Node Architecture**: Separates web, database, and cache layers for optimal performance
- **Pre-Configured Services**: Nginx, PHP-FPM, MariaDB, and Redis configured specifically for WordPress
- **Flexible PHP Versions**: Choose between PHP 8.2, 8.3, or 8.4 during installation
- **Production-Ready**: Includes Let's Encrypt SSL, optional CDN, WooCommerce, and WordPress Multisite support
- **Network Optimized**: Nodes communicate securely over internal network for low latency

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
  - phpMyAdmin access on port 8443
  - Automatic user and database creation

### Node 3: Cache Server (Redis)
- **Purpose**: Accelerates WordPress with object caching
- **Technology**: Redis 7.2.4
- **Features**:
  - 256MB memory allocation with LRU eviction
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
   - Configures Redis with 256MB cache and LRU eviction
   - Sets up PHP-FPM with WordPress-specific settings
   - Creates database and user with proper permissions

4. **Install WordPress**
   - Downloads latest WordPress
   - Configures database connection to MariaDB node
   - Configures Redis object caching
   - Sets up admin account

5. **Apply Optional Features**
   - Installs SSL certificates if selected
   - Enables Multisite if selected
   - Installs WooCommerce if selected
   - Configures CDN if selected

The entire process takes **3-5 minutes**. You'll receive an email with access credentials when complete.

## After Installation

Once deployed, you'll receive:

- **WordPress Admin URL**: `https://your-domain.com/wp-admin/`
- **Database Access**: phpMyAdmin on port 8443
- **Admin Credentials**: Sent via email
- **Database Credentials**: For advanced configuration

### What's Pre-Configured

✅ **WordPress Core**: Latest version installed and configured
✅ **Database Connection**: Automatically connected to MariaDB node
✅ **Object Caching**: Redis configured and ready (install Redis Object Cache plugin)
✅ **PHP Settings**: Optimized for WordPress performance
✅ **MySQL Settings**: Configured for WordPress database patterns
✅ **Security**: Firewall rules and isolated network communication

## Use Cases

This package is ideal for:

- **Professional WordPress Sites**: Blogs, corporate sites, portfolios
- **E-commerce Stores**: WooCommerce shops that need performance
- **WordPress Development**: Agencies building client sites
- **WordPress Multisite Networks**: Multiple sites under one roof
- **High-Traffic Sites**: Need resource isolation and scaling
- **Performance-Critical Applications**: Require caching and optimization

## Technical Details

### Trellis-Inspired Architecture

This package follows [Roots.io Trellis](https://github.com/roots/trellis) principles:

- **LEMP Stack**: Linux, Nginx, MariaDB, PHP-FPM
- **Modern PHP**: Support for latest PHP versions
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

- Scale individual nodes (more CPU/RAM/disk)
- Change PHP version on application node
- Add more application nodes for load balancing
- Configure Redis memory limits
- Tune MySQL performance settings
- Install additional WordPress plugins

See `ARCHITECTURE.md` for detailed technical documentation.

## Support & Documentation

- **Issues**: Report bugs or request features on [GitHub Issues](https://github.com/shaundma/wordpress-multi-node-v2/issues)
- **Virtuozzo Docs**: [Platform Documentation](https://www.virtuozzo.com/application-platform-docs/)
- **Roots.io Trellis**: [Trellis Documentation](https://github.com/roots/trellis)

## License

This project is licensed under the terms included in `LICENSE.md`.
