FROM php:8.4-fpm-alpine

WORKDIR /var/www/html

# Installer les dépendances système
RUN apk add --no-cache \
    build-base \
    libpq \
    postgresql-dev \
    postgresql-client \
    git \
    curl \
    zip \
    unzip \
    libxml2-dev \
    oniguruma-dev

# Installer les extensions PHP nécessaires
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    bcmath \
    mbstring \
    xml

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier les fichiers composer pour installer les dépendances
COPY composer.json composer.lock ./

RUN composer install --no-interaction --no-dev --no-scripts --optimize-autoloader

# Copier le reste de l'application Laravel
COPY . .

# Créer les dossiers nécessaires et régler les permissions
RUN mkdir -p storage/logs storage/framework/cache storage/framework/sessions storage/framework/views bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Démarrer PHP-FPM
EXPOSE 9000
CMD ["php-fpm"]
