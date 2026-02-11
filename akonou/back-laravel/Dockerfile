FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    libpq-dev \
    postgresql-client \
    git \
    curl \
    zip \
    unzip \
    libxml2-dev \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    bcmath \
    mbstring \
    xml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy composer files first
COPY composer.json composer.lock ./

# Install PHP dependencies (NO scripts during build)
RUN composer install --no-interaction --no-dev --no-scripts --optimize-autoloader

# Copy application files
COPY . .

# Create necessary directories with proper permissions (Laravel)
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php-fpm"]
