FROM php:8.2-cli

# Install PHP extensions (Added libpq-dev and pdo_pgsql)
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev curl zip libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring zip bcmath

WORKDIR /var/www

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy composer files first
COPY composer.json composer.lock ./
RUN composer install --no-interaction --optimize-autoloader --prefer-dist --no-progress --no-scripts

# Copy the rest of the app
COPY . .

EXPOSE 8000

# Run Laravel built-in server
# CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
