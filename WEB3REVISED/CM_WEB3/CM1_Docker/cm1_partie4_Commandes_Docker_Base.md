# Séance 1 : Docker - Introduction (60 min)

## 🎯 Objectifs de la session
- Comprendre les concepts fondamentaux de Docker
- Installer et configurer Docker Desktop
- Créer un environnement Laravel avec docker-compose
- Maîtriser les commandes Docker de base

---

## 🚀 Partie 4 : Commandes Docker de base (10 min)

### Commandes essentielles

#### 1. Démarrer les conteneurs
```bash
# Démarrer tous les services
docker-compose up -d

# -d = mode détaché (en arrière-plan)
# Sans -d = voir les logs en direct
```

#### 2. Arrêter les conteneurs
```bash
# Arrêter tous les services
docker-compose down

# Arrêter ET supprimer les volumes
docker-compose down -v
```

#### 3. Voir l'état des conteneurs
```bash
# Lister les conteneurs actifs
docker-compose ps

# Lister TOUS les conteneurs (même arrêtés)
docker ps -a
```

#### 4. Voir les logs
```bash
# Logs de tous les services
docker-compose logs

# Logs d'un service spécifique
docker-compose logs app

# Suivre les logs en temps réel
docker-compose logs -f app
```

#### 5. Exécuter des commandes dans un conteneur
```bash
# Entrer dans le conteneur PHP
docker-compose exec app bash

# Exécuter une commande sans entrer
docker-compose exec app php artisan --version
```

#### 6. Redémarrer un service
```bash
# Redémarrer un service spécifique
docker-compose restart app

# Redémarrer tous les services
docker-compose restart
```

#### 7. Voir les images
```bash
# Lister toutes les images
docker images

# Supprimer une image
docker rmi nom_image
```

#### 8. Nettoyer Docker
```bash
# Supprimer tous les conteneurs arrêtés
docker container prune

# Supprimer toutes les images non utilisées
docker image prune

# Nettoyage complet
docker system prune -a
```

### 📊 Tableau récapitulatif

| Commande | Action |
|----------|--------|
| `docker-compose up -d` | Démarrer les services |
| `docker-compose down` | Arrêter les services |
| `docker-compose ps` | État des conteneurs |
| `docker-compose logs -f [service]` | Voir les logs |
| `docker-compose exec [service] bash` | Entrer dans un conteneur |
| `docker-compose restart [service]` | Redémarrer un service |
| `docker-compose build` | Reconstruire les images |

---

## 🎯 Exercices pratiques

### Exercice 1 : Premier lancement (5 min)
```bash
# 1. Créer le fichier docker-compose.yml
# 2. Démarrer les services
docker-compose up -d

# 3. Vérifier que tout fonctionne
docker-compose ps

# 4. Accéder à phpMyAdmin
# Ouvrir http://localhost:8080
```

**Résultat attendu :**
```
NAME            STATUS    PORTS
laravel_app     Up        9000/tcp
laravel_nginx   Up        0.0.0.0:8000->80/tcp
laravel_db      Up        0.0.0.0:3306->3306/tcp
laravel_pma     Up        0.0.0.0:8080->80/tcp
```

### Exercice 2 : Explorer les conteneurs (5 min)
```bash
# 1. Entrer dans le conteneur PHP
docker-compose exec app bash

# 2. Vérifier la version de PHP
php -v

# 3. Lister le contenu
ls -la

# 4. Sortir
exit

# 5. Voir les logs MySQL
docker-compose logs db
```

### Exercice 3 : Test de la base de données (5 min)
1. Ouvrir phpMyAdmin : `http://localhost:8080`
2. Se connecter avec :
   - Utilisateur : `laravel_user`
   - Mot de passe : `laravel_pass`
3. Vérifier que la base `laravel_db` existe
4. Créer une table test manuellement

---

## 🔧 Configuration Nginx (bonus)

Créer `docker/nginx/default.conf` :

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

---

## ❓ Questions fréquentes

**Q : Pourquoi utiliser docker-compose et pas juste docker ?**
> docker-compose permet de gérer plusieurs conteneurs liés en un seul fichier. C'est plus simple pour des applications multi-services comme Laravel.

**Q : Les données MySQL sont-elles perdues quand j'arrête Docker ?**
> Non ! Le volume `dbdata` persiste les données. Elles sont conservées même après `docker-compose down`.

**Q : Puis-je avoir plusieurs projets Laravel avec Docker ?**
> Oui ! Mais changez les ports dans chaque `docker-compose.yml` pour éviter les conflits (ex: 8001, 8002, etc.)

**Q : Comment mettre à jour une image ?**
```bash
docker-compose pull
docker-compose up -d --force-recreate
```

---

## 📚 Ressources complémentaires

- 📖 Documentation Docker : https://docs.docker.com
- 🎓 Laravel & Docker : https://laravel.com/docs/sail
- 🐳 Docker Hub : https://hub.docker.com
- 📺 Tutoriel vidéo : [chercher "Docker Laravel tutorial"]

---