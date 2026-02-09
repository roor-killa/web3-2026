# Projet Web3 2026 - Architecture Multi-Services

Une application full-stack complète combinant un frontend **Next.js**, un backend **Laravel**, et un service Python **FastAPI** orchestrés avec Docker Compose.

## 📋 Vue d'ensemble

Ce projet démontre une architecture moderne avec trois composants principaux:

- **Frontend Next.js** : Interface utilisateur moderne avec React
- **Backend Laravel** : API REST robuste pour la gestion métier
- **Service FastAPI** : API spécialisée pour la programmation orientée objets (POO)
- **PostgreSQL** : Base de données centralisée

### Technos Principales

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Frontend | Next.js 14+ | TypeScript |
| Backend API | Laravel 11+ | PHP 8.2+ |
| Service POO | FastAPI | Python 3.11+ |
| Base de données | PostgreSQL | 15+ |
| Conteneurisation | Docker & Docker Compose | - |
| Reverse Proxy | Nginx | - |

## 🏗️ Structure du Projet

```
guindo/projet/
├── backend-laravel/           # API REST Laravel
│   ├── docker/
│   │   └── nginx/            # Configuration Nginx
│   ├── laravel/
│   │   ├── app/              # Logique applicative
│   │   ├── routes/           # Routes API
│   │   ├── config/           # Configuration
│   │   ├── database/         # Migrations & Seeders
│   │   ├── resources/        # Vues & fichiers statiques
│   │   ├── storage/          # Fichiers téléchargés
│   │   └── tests/            # Tests PHPUnit
│   ├── Dockerfile
│   ├── composer.json
│   └── README.md
│
├── frontend-nextjs/           # Application Frontend
│   ├── app/                  # Pages et layout (App Router)
│   │   ├── login/            # Page de connexion
│   │   ├── products/         # Page produits
│   │   ├── welcome/          # Page d'accueil
│   │   └── layout.tsx        # Layout principal
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── fastapi-poo/               # Service Python spécialisé
│   ├── main.py               # Point d'entrée FastAPI
│   ├── Dockerfile
│   ├── requirements.txt       # Dépendances Python
│   └── README.md
│
├── infra/                     # Infrastructure
│   └── docker-compose.yml     # Orchestration des services
│
└── README.md                  # Ce fichier

```

## 🚀 Démarrage Rapide

### Prérequis

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git**

### Installation et Lancement

1. **Cloner le projet**
```bash
git clone <your-repo-url>
cd web3-2026/guindo/projet
```

2. **Démarrer les services**
```bash
cd infra
docker compose up -d
```

3. **Accéder à l'application**

| Service | URL |
|---------|-----|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend Laravel | [http://localhost:8080](http://localhost:8080) |
| FastAPI | [http://localhost:8001](http://localhost:8001) |
| Documentation FastAPI | [http://localhost:8001/docs](http://localhost:8001/docs) |
| pgAdmin | [http://localhost:8081](http://localhost:8081) |

### Arrêter les services

```bash
docker compose down
```

## 🛠️ Configuration Services

### 📦 Frontend Next.js (Port 3000)

Application React moderne utilisant l'App Router de Next.js.

**Variables d'environnement** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_FASTAPI_URL=http://localhost:8001
```

**Commandes développement** (sans Docker):
```bash
cd frontend-nextjs
npm install
npm run dev
```

### 🔧 Backend Laravel (Port 8080)

API REST Laravel avec Nginx comme reverse proxy.

**Variables d'environnement** (`.env`):
```env
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=web3_db
DB_USERNAME=postgres
DB_PASSWORD=your-password
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

**Commandes migrations**:
```bash
docker compose exec laravel_app php artisan migrate
docker compose exec laravel_app php artisan db:seed
```

**Créer un modèle avec contrôleur**:
```bash
docker compose exec laravel_app php artisan make:model Models/Product -mcr
```

### 🐍 Service FastAPI (Port 8001)

Service Python pour la programmation orientée objets.

**Documentation interactive**: [Swagger UI](http://localhost:8001/docs)

**Commandes utiles**:
```bash
# Voir les logs en temps réel
docker compose logs -f fastapi

# Accéder au shell Python
docker compose exec fastapi python
```

### 🗄️ Base de Données PostgreSQL (Port 5433)

Base de données centralisée pour tous les services.

**pgAdmin** - Interface web pour gérer PostgreSQL:
- URL: [http://localhost:8081](http://localhost:8081)
- Email: `admin@admin.com`
- Mot de passe: `admin`

## 📝 Commandes Docker Utiles

```bash
# Voir les logs de tous les services
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f frontend
docker compose logs -f laravel_app
docker compose logs -f fastapi

# Arrêter un service spécifique
docker compose stop laravel_app

# Redémarrer tous les services
docker compose restart

# Supprimer tous les conteneurs et volumes
docker compose down -v

# Reconstruire les images
docker compose build --no-cache
```

## 🔌 Ports et Services

| Service | Port | URL |
|---------|------|-----|
| Next.js Frontend | 3000 | http://localhost:3000 |
| Laravel Backend | 8080 | http://localhost:8080 |
| FastAPI | 8001 | http://localhost:8001 |
| PostgreSQL | 5433 | localhost:5433 |
| pgAdmin | 8081 | http://localhost:8081 |

## 🧪 Tests

### Laravel - PHPUnit
```bash
docker compose exec laravel_app php artisan test
```

### Next.js
```bash
cd frontend-nextjs
npm test
```

### FastAPI
```bash
docker compose exec fastapi pytest
```

## 🔐 Variables d'Environnement

Chaque service a son propre fichier `.env`. Vous pouvez les personnaliser dans:

- `backend-laravel/laravel/.env`
- `frontend-nextjs/.env.local`
- `fastapi-poo/.env` (si applicable)

## 📚 Documentation Détaillée

Pour plus de détails sur chaque service:

- [Frontend Next.js](./frontend-nextjs/README.md)
- [Backend Laravel](./backend-laravel/README.md)
- [Service FastAPI](./fastapi-poo/README.md)

## 🐛 Debugging

### Problèmes courants

**Les conteneurs ne démarrent pas?**
```bash
# Vérifier l'état des conteneurs
docker compose ps

# Voir les erreurs
docker compose logs
```

**Les migrations Laravel échouent?**
```bash
# Vérifier que PostgreSQL est prêt
docker compose logs postgres

# Recommencer les migrations
docker compose exec laravel_app php artisan migrate:refresh
```

**Le frontend ne se connecte pas au backend?**
- Vérifier la variable `NEXT_PUBLIC_API_URL`
- Vérifier les logs du backend: `docker compose logs laravel_app`
- S'assurer que CORS est bien configuré

## 👥 Contributeurs

- Ibrahim O Guindo

## 📄 Licence

Ce projet est sous licence [À définir].

## 🤝 Support

Pour les questions ou les bugs, veuillez créer une issue dans le repository.

---

**Dernière mise à jour**: Février 2026
