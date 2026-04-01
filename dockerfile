FROM php:8.4-fpm

# Extensions requises par Laravel
RUN docker-php-ext-install fileinfo pdo pdo_mysql