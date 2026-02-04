# Séance 1 : Docker - Introduction (60 min)

## 🎯 Objectifs de la session
- Comprendre les concepts fondamentaux de Docker
- Installer et configurer Docker Desktop
- Créer un environnement Laravel avec docker-compose
- Maîtriser les commandes Docker de base

---

## 🛠️ Partie 3 : Création du docker-compose.yml (25 min)

### Structure du projet
```
mon-blog-api/
├── docker-compose.yml    ← Fichier de configuration Docker
├── .env                   ← Variables d'environnement
└── src/                   ← Code Laravel (sera créé)
```

### Fichier docker-compose.yml complet

Créer `docker-compose.yml` à la racine du projet :

```yaml
version: '3.8'

services:
  # Service PHP pour Laravel
  app:
    image: php:8.2-fpm
    container_name: laravel_app
    restart: unless-stopped
    working_dir: /var/www
    volumes:
      - ./src:/var/www
    networks:
      - laravel
    depends_on:
      - db

  # Service Nginx (serveur web)
  nginx:
    image: nginx:alpine
    container_name: laravel_nginx
    restart: unless-stopped
    ports:
      - "8000:80"
    volumes:
      - ./src:/var/www
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    networks:
      - laravel
    depends_on:
      - app

  # Service MySQL
  db:
    image: mysql:8.0
    container_name: laravel_db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: laravel_db
      MYSQL_ROOT_PASSWORD: root
      MYSQL_USER: laravel_user
      MYSQL_PASSWORD: laravel_pass
    ports:
      - "3306:3306"
    volumes:
      - dbdata:/var/lib/mysql
    networks:
      - laravel

  # Service phpMyAdmin
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: laravel_pma
    restart: unless-stopped
    environment:
      PMA_HOST: db
      PMA_PORT: 3306
      PMA_USER: laravel_user
      PMA_PASSWORD: laravel_pass
    ports:
      - "8080:80"
    networks:
      - laravel
    depends_on:
      - db

# Réseau pour la communication entre conteneurs
networks:
  laravel:
    driver: bridge

# Volume pour persister les données MySQL
volumes:
  dbdata:
    driver: local
```

### 📝 Explications détaillées

#### Service `app` (PHP)
```yaml
app:
  image: php:8.4-fpm          # Image PHP 8.4 avec FastCGI
  container_name: laravel_app # Nom du conteneur
  working_dir: /var/www       # Répertoire de travail
  volumes:
    - ./src:/var/www          # Lien code local ↔ conteneur
```

**Points clés :**
- `php:8.2-fpm` : Version PHP avec FastCGI Process Manager
- Volume `./src:/var/www` : Votre code local est accessible dans le conteneur
- `working_dir` : Où s'exécutent les commandes

#### Service `nginx` (Serveur web)
```yaml
nginx:
  ports:
    - "8000:80"               # Port 8000 (local) → 80 (conteneur)
  volumes:
    - ./src:/var/www          # Même code que PHP
    - ./docker/nginx/...      # Configuration Nginx
```

**Points clés :**
- Accessible sur `http://localhost:8000`
- Sert les fichiers statiques et transmet les requêtes PHP à `app`

#### Service `db` (MySQL)
```yaml
db:
  environment:
    MYSQL_DATABASE: laravel_db     # Nom de la BDD
    MYSQL_USER: laravel_user       # Utilisateur
    MYSQL_PASSWORD: laravel_pass   # Mot de passe
  volumes:
    - dbdata:/var/lib/mysql        # Persistance des données
```

**Points clés :**
- Données persistées dans le volume `dbdata`
- Accessible depuis l'hôte sur le port 3306
- Accessible depuis les conteneurs via le nom `db`

#### Service `phpmyadmin`
```yaml
phpmyadmin:
  environment:
    PMA_HOST: db              # Se connecte au service "db"
  ports:
    - "8080:80"               # Accessible sur localhost:8080
```

**Points clés :**
- Interface web sur `http://localhost:8080`
- Se connecte automatiquement à MySQL

#### Réseau et Volumes
```yaml
networks:
  laravel:                    # Réseau privé pour les services

volumes:
  dbdata:                     # Volume pour MySQL
```

---
