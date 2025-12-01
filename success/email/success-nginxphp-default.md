**WordPress Multi-Node Environment**: [${globals.PROTOCOL}://${env.domain}/](${globals.PROTOCOL}://${env.domain}/)

Use the following credentials to access the admin panel:

**Admin Panel**: [${globals.PROTOCOL}://${env.domain}/wp-admin/](${globals.PROTOCOL}://${env.domain}/wp-admin/)
**Login**: ${user.email}
**Password**: ${globals.WP_ADMIN_PASS}

**Database Credentials**:
**Username**: ${globals.DB_USER}
**Password**: ${globals.DB_PASS}
**Host**: ${globals.DB_HOST}

**Redis Cache**:
**Host**: ${globals.REDIS_HOST}
**Port**: ${globals.REDIS_PORT}
**Password**: ${globals.REDIS_PASS}

**Architecture**: Multi-node LEMP stack (Nginx + PHP-FPM, MariaDB, Redis)
