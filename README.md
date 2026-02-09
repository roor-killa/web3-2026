# Projet Web3 2026

Architecture multi-services avec Docker Compose.

## Structure du Projet

```
web3-2026/guindo/projet/
├── frontend-nextjs/      # Frontend Next.js (Web 3)
├── backend-laravel/      # Backend Laravel (Web 3)
├── fastapi-poo/          # Backend FastAPI (POO)
└── infra/                # Infrastructure Docker
    └── docker-compose.yml
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| **Next.js** | 3000 | Frontend React/Next.js |
| **Laravel** | 8080 | Backend API Laravel |
| **FastAPI** | 8001 | Backend API FastAPI (POO) |
| **PostgreSQL** | 5433 | Base de données |
| **pgAdmin** | 8081 | Interface web PostgreSQL |

## Démarrage

```bash
cd guindo/projet/infra
docker compose up -d
```

## Arrêt

```bash
cd guindo/projet/infra
docker compose down
```

## Accès aux services

- Frontend: http://localhost:3000
- Backend Laravel: http://localhost:8080
- Backend FastAPI: http://localhost:8001
- Documentation FastAPI: http://localhost:8001/docs
- pgAdmin: http://localhost:8081 (admin@admin.com / admin)

## 📦 Documentation Spécifique

Pour comprendre l'organisation de la **fonctionnalité produit** (exercice exo_product), consultez le document dédié :
👉 **[README_PRODUITS.md](guindo/projet/README_PRODUITS.md)**

Ce document détaille :
- L'emplacement de tous les fichiers liés aux produits
- L'architecture MVC utilisée
- Les endpoints API disponibles
- La structure de la base de données
- Le guide d'utilisation complet

## Commandes utiles

### Laravel
```bash
# Exécuter des migrations
docker compose exec laravel_app php artisan migrate

# Créer un modèle
docker compose exec laravel_app php artisan make:model NomModele
```

### FastAPI
```bash
# Voir les logs
docker compose logs -f fastapi
```

### Next.js
```bash
# Voir les logs
docker compose logs -f nextjs
```
