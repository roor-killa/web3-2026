# Configuration Docker pour Laravel

## Architecture

Cette configuration Docker met en place un environnement de développement Laravel complet avec :

- **PHP 8.3-FPM** : Serveur d'application avec toutes les extensions nécessaires
- **Nginx** : Serveur web pour gérer les requêtes HTTP
- **PostgreSQL 16** : Base de données relationnelle
- **PgAdmin** : Interface web pour gérer PostgreSQL (optionnel)

## Structure des fichiers

```
.
├── docker/
│   ├── nginx/
│   │   └── conf.d/
│   │       └── laravel.conf       # Configuration Nginx
│   └── php/
│       └── local.ini               # Configuration PHP personnalisée
├── Dockerfile                      # Image PHP-FPM personnalisée
├── docker-compose.yml             # Orchestration des services
└── .env                           # Variables d'environnement
```

## Installation

### 1. Cloner le projet Laravel

Si vous n'avez pas encore de projet Laravel :

```bash
composer create-project laravel/laravel mon-projet
cd mon-projet
```

### 2. Copier les fichiers Docker

Placez tous les fichiers de configuration Docker dans votre projet Laravel.

### 3. Configurer les variables d'environnement

```bash
cp env.example .env
```

Ajustez les valeurs dans `.env` selon vos besoins.

### 4. Construire et démarrer les conteneurs

```bash
docker-compose up -d --build
```

### 5. Installer les dépendances Laravel

```bash
docker-compose exec app composer install
```

### 6. Générer la clé d'application

```bash
docker-compose exec app php artisan key:generate
```

### 7. Exécuter les migrations

```bash
docker-compose exec app php artisan migrate
```

## Commandes utiles

### Gestion des conteneurs

```bash
# Démarrer les conteneurs
docker-compose up -d

# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f

# Voir les logs d'un service spécifique
docker-compose logs -f app
```

### Commandes Laravel

```bash
# Accéder au conteneur PHP
docker-compose exec app bash

# Exécuter Artisan
docker-compose exec app php artisan <commande>

# Installer des packages Composer
docker-compose exec app composer require <package>

# Exécuter les migrations
docker-compose exec app php artisan migrate

# Créer un contrôleur
docker-compose exec app php artisan make:controller NomController

# Lancer les seeders
docker-compose exec app php artisan db:seed
```

### Commandes de base de données

```bash
# Accéder à PostgreSQL
docker-compose exec db psql -U laravel -d laravel

# Créer un dump de la base
docker-compose exec db pg_dump -U laravel laravel > dump.sql

# Restaurer un dump
docker-compose exec -T db psql -U laravel laravel < dump.sql
```

## Accès aux services

- **Application Laravel** : http://localhost:8000
- **PgAdmin** : http://localhost:5050
  - Email : admin@admin.com
  - Mot de passe : admin

### Connexion PgAdmin à PostgreSQL

Pour connecter PgAdmin à votre base de données :
1. Ouvrez http://localhost:5050
2. Créez un nouveau serveur
3. Utilisez ces paramètres :
   - Host : `db`
   - Port : `5432`
   - Database : `laravel`
   - Username : `laravel`
   - Password : `secret`

## Workflow Git pour les groupes

Pour travailler en groupe avec Git :

```bash
# Chaque groupe crée sa branche
git checkout -b groupe-1

# Travaillez sur votre branche
git add .
git commit -m "Description des modifications"
git push origin groupe-1

# Fusionner avec main (après validation)
git checkout main
git merge groupe-1
```

## Troubleshooting

### Erreur de permissions

```bash
docker-compose exec app chown -R laravel:www-data /var/www/storage
docker-compose exec app chmod -R 775 /var/www/storage
```

### Reconstruire les conteneurs

```bash
docker-compose down
docker-compose up -d --build --force-recreate
```

### Nettoyer les volumes

⚠️ **Attention : Cela supprime toutes les données de la base !**

```bash
docker-compose down -v
docker-compose up -d
```

## Notes pour les étudiants

- Tous les fichiers du projet sont synchronisés avec le conteneur
- Les modifications dans le code sont immédiatement prises en compte
- La base de données persiste même si vous redémarrez les conteneurs
- N'oubliez pas de documenter votre code et d'utiliser Git régulièrement
- Utilisez des branches pour organiser votre travail en équipe

## Bonnes pratiques

1. **Commits réguliers** : Faites des commits fréquents avec des messages clairs
2. **Branches** : Une branche par fonctionnalité ou par groupe
3. **Tests** : Testez votre code avant de pusher
4. **Documentation** : Commentez votre code et mettez à jour le README
5. **Sécurité** : Ne commitez jamais le fichier `.env`
