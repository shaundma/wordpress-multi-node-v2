<p align="center">
<img src="images/wp-standalone.png" alt="WordPress Multi-Node">
</p>

# WordPress Multi-Node LEMP Stack

Out-of-the-box automated **WordPress Multi-Node** application solution following the **Roots.io Trellis** architecture for optimal performance, scalability, and resource isolation.


## WordPress Multi-Node Topology

This package creates a distributed WordPress environment with separate nodes for each service, following modern LEMP stack best practices inspired by Roots.io Trellis. The multi-node architecture provides:

**Node 1: Application Server (Nginx + PHP-FPM)**
- Nginx web server for high-performance HTTP processing
- PHP-FPM for efficient PHP execution
- Selectable PHP versions: 8.2, 8.3, 8.4
- Optimized for WordPress workloads

**Node 2: Database Server (MariaDB)**
- Dedicated MariaDB 11.4 database server
- Isolated database resources for consistent performance
- Network-accessible from application node
- Optimized MySQL configuration for WordPress

**Node 3: Cache Server (Redis)**
- Dedicated Redis 7.2 in-memory cache
- Object caching for WordPress (via Redis Object Cache plugin)
- Configurable memory allocation
- LRU eviction policy for optimal cache management

This architecture provides better resource isolation, easier scaling, and improved performance compared to single-container solutions.


## Deployment to Cloud

To get your WordPress Standalone solution, click the "**Deploy to Cloud**" button below, specify your email address within the widget, choose one of the [Virtuozzo Public Cloud Providers](https://www.virtuozzo.com/application-platform-partners/), and confirm by clicking **Install**.

[![Deploy to Cloud](https://raw.githubusercontent.com/jelastic-jps/common/main/images/deploy-to-cloud.png)](https://www.virtuozzo.com/install/?manifest=https://raw.githubusercontent.com/jelastic-jps/wordpress/refs/heads/v2.2.0/manifest.yml)

> If you already have a Virtuozzo Application Platform (VAP) account, you can deploy this solution from the [Marketplace](https://www.virtuozzo.com/application-platform-docs/marketplace/) or [import](https://www.virtuozzo.com/application-platform-docs/environment-import/) a manifest file from this repository.


## Installation Process

In the opened installation window at the VAP dashboard, customize your WordPress multi-node application by selecting the necessary options:

- **PHP version** selector allows choosing the required PHP version (8.2, 8.3, or 8.4) for your WordPress application server.
- **[Let's Encrypt SSL with Auto-Renewal](https://www.virtuozzo.com/company/blog/free-ssl-certificates-with-lets-encrypt/)** add-on issues and uses a trusted, free certificate for a custom domain. The built-in functionality employs periodical renewal to prevent certificate expiration. The appropriate notifications are sent by email.
- **[WordPress Multisite Network](https://wordpress.org/support/article/glossary/#multisite)** enables/disables the same-named feature. It allows the application to act as a WordPress network hub, where the network can comprise several websites. With this built-in feature and platform automation, you can create an independent network of websites and invite others to develop their sites on the same network, even for commercial usage.
- **[WooCommerce](https://wordpress.org/plugins/woocommerce/)** is a free, open-source WordPress plugin that adds e-commerce functionality to your WordPress website. Enable this option to automatically install this outstanding platform for a store of any size hosted on your WordPress multi-node application.

## Architecture Benefits

The multi-node architecture provides several advantages:

1. **Resource Isolation**: Each service runs on its own node with dedicated resources
2. **Scalability**: Individual nodes can be scaled independently based on workload
3. **Performance**: Separate nodes prevent resource contention between services
4. **Maintainability**: Updates and maintenance can be performed on individual nodes
5. **Trellis Compatibility**: Follows Roots.io Trellis LEMP stack best practices

Lastly, specify **Environment** name, **Display Name**, choose availability **Region** (if available), and click **Install**. The WordPress Multi-Node environment will be automatically created and configured according to the selected options in a few minutes.

## Technical Details

The multi-node setup follows these Trellis-inspired practices:

- **Application Node**: Nginx + PHP-FPM stack optimized for WordPress
- **Database Node**: MariaDB with WordPress-specific optimizations
- **Cache Node**: Redis configured for WordPress object caching with LRU eviction
- **Network Communication**: Nodes communicate over internal network using service names
- **Security**: Each node is isolated with dedicated resources and firewall rules
