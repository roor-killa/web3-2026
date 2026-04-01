- installer docker
- installer composer "getcomposer.org"
- lancer "docker-compose.yml" avec $docker compose up
- $composer create-project laravel/laravel
- php artisan create table

- pour next.js:
    - Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    - npx create-next-app@latest next-products
    - cd next-products
    - npm run dev

- pour se connecter à la base de données (postgres) depuis laravel, modifier le fichier .env:
    DB_CONNECTION=pgsql
    DB_HOST=postgres
    DB_PORT=5432
    DB_DATABASE=laravel
    DB_USERNAME=laravel
    DB_PASSWORD=secret
    DB_SCHEMA=public

- pour se connecter à la base de données (sqlite) depuis laravel, modifier le fichier .env:
    DB_CONNECTION=sqlite
    # DB_HOST=127.0.0.1
    # DB_PORT=3306
    # DB_DATABASE=laravel
    # DB_USERNAME=root
    # DB_PASSWORD=