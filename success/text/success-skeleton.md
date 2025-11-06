# LEMP Environment Ready

Your multi-node LEMP stack has been successfully configured!

## What's Installed

- ✅ Nginx web server
- ✅ PHP-FPM ${settings.php_engine}
- ✅ MariaDB database
- ✅ Redis object cache

## Next Steps

1. **Deploy your application** to `/var/www/webroot/ROOT/current/web`
2. **Use credentials** from `/var/www/webroot/ROOT/shared/.env`
3. **Access your site** at: ${globals.PROTOCOL}://${env.domain}/

## Directory Structure

```
/var/www/webroot/ROOT/
├── current/ (symlink to releases/1)
│   ├── web/ (document root)
│   └── .env (symlink to shared/.env)
├── shared/
│   ├── .env (credentials)
│   └── uploads/
└── releases/
    └── 1/ (current release)
```

## Database Access

- **phpMyAdmin**: https://${env.domain}:8443/
- **Credentials**: See `/var/www/webroot/ROOT/shared/.env`

The environment follows Bedrock directory structure and is ready for your WordPress deployment!
