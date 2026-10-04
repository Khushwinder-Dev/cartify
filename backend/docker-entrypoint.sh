#!/bin/bash
set -e

# Render injects the listening port into the $PORT environment variable (defaults to 10000)
PORT="${PORT:-10000}"

# Dynamically configure Apache to listen on Render's assigned port
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/*.conf

# Ensure storage directories exist and are writable
mkdir -p /var/www/html/storage/framework/{sessions,views,cache}
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# If SQLite is selected and the file does not exist, initialize it
if [ "$DB_CONNECTION" = "sqlite" ]; then
    touch /var/www/html/database/database.sqlite
    chown www-data:www-data /var/www/html/database/database.sqlite
fi

# Run database migrations if RUN_MIGRATIONS=true
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || echo "Migration skipped or database not ready yet."
fi

# Cache configurations and routes for optimal production performance
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "Cartify backend starting Apache on port ${PORT}..."
exec apache2-foreground
