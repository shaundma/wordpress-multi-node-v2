**LEMP Environment Ready**: [${globals.PROTOCOL}://${env.domain}/](${globals.PROTOCOL}://${env.domain}/)

Your multi-node LEMP stack is configured and ready for deployment.

**Environment Details**:
- **Document Root**: /var/www/webroot/ROOT/current/web
- **Credentials File**: /var/www/webroot/ROOT/shared/.env
- **Architecture**: Multi-node LEMP stack (Nginx + PHP-FPM, MariaDB, Redis)

**Database Credentials**:
**Username**: ${globals.DB_USER}
**Password**: ${globals.DB_PASS}
**Host**: ${globals.DB_HOST}

**Redis**:
**Host**: ${globals.REDIS_HOST}
**Port**: ${globals.REDIS_PORT}
**Password**: ${globals.REDIS_PASS}

All credentials are also available in `/var/www/webroot/ROOT/shared/.env`

Deploy your WordPress application to get started!
