FROM php:8.4-apache

# PHP extensions
RUN apt-get update && apt-get install -y git unzip libpq-dev zip && rm -rf /var/lib/apt/lists/*
RUN docker-php-ext-install pdo pdo_pgsql

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . /var/www/html

RUN composer install --no-interaction --optimize-autoloader --no-scripts
RUN cp .env.example .env || true
RUN php artisan key:generate --ansi
RUN php artisan migrate --force || true

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
