FROM php:8.3-apache

RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-install pdo_mysql \
    && a2enmod rewrite headers expires

COPY . /var/www/html/
COPY apache-vhost.conf /etc/apache2/sites-available/000-default.conf

RUN chown -R www-data:www-data /var/www/html \
    && printf '%s\n' 'DirectoryIndex login_register.html' > /etc/apache2/mods-enabled/dir.conf

HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD curl -fsS http://127.0.0.1/api/health.php || exit 1

EXPOSE 80
CMD ["apache2-foreground"]
