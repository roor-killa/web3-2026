FROM php:8.4-fpm

# Arguments de build
ARG user=laravel
ARG uid=1000

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-client \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installation des extensions PHP
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    exif \
    pcntl \
    bcmath \
    gd \
    zip

# Installation de Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Création de l'utilisateur système
RUN useradd -G www-data,root -u $uid -d /home/$user $user
RUN mkdir -p /home/$user/.composer && \
    chown -R $user:$user /home/$user

# Configuration du répertoire de travail
WORKDIR /var/www

# Copie des fichiers de l'application
COPY --chown=$user:$user . /var/www

# Changement vers l'utilisateur non-root
USER $user

# Exposition du port PHP-FPM
EXPOSE 9000

CMD ["php-fpm"]
