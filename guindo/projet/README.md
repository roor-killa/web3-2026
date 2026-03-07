# Projet Web3 2026 - Architecture Multi-Services

Une application full-stack complète combinant un frontend **Next.js 15.5**, un backend **Laravel 11**, et un service Python **FastAPI** orchestrés avec Docker Compose.

## 📋 Vue d'ensemble

Ce projet démontre une architecture moderne avec trois composants principaux :

- **🎨 Frontend Next.js** : Interface utilisateur moderne avec React, authentification Sanctum, gestion CRUD produits
- **🔧 Backend Laravel** : API REST robuste avec authentification par token, gestion des produits
- **🐍 Service FastAPI** : API spécialisée pour la programmation orientée objets (POO)
- **🗄️ PostgreSQL** : Base de données centralisée
- **📦 Docker & Nginx** : Orchestration complète des services

### 🚀 Fonctionnalités Implémentées

#### ✅ Authentification & Sécurité
- Système d'authentification Sanctum (Token-based)
- Endpoints protégés et publics
- CORS configuré
- JWT tokens automatiquement gérés côté client

#### 📦 Gestion des Produits (CRUD Complet)
- **List** : Affichage dynamique avec pagination
- **Create** : Formulaire intuitif pour ajouter des produits
- **Read** : Page de détails avec toutes les informations
- **Update** : Édition complète des données
- **Delete** : Suppression sécurisée avec confirmation

#### 🎨 Design & UX
- **Thème cohérent** : Gradient violet (#667eea → #764ba2)
- **Composants stylisés** : Formulaires, cartes, buttons avec effects
- **Navigation persistante** : Navbar sticky avec actions rapides
- **Responsive** : Design adapté mobile/desktop

### Technos Principales

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Frontend | Next.js | 15.5.10 |
| Framework UI | React | 19 |
| Langage | TypeScript | Latest |
| Backend API | Laravel | 11+ |
| Langage Backend | PHP | 8.2+ |
| Service POO | FastAPI | Python 3.11+ |
| Base de données | PostgreSQL | 15+ |
| Conteneurisation | Docker & Compose | v2.0+ |
| Reverse Proxy | Nginx | Alpine |

## 🏗️ Structure du Projet

```
guindo/projet/
├── backend-laravel/                    # API REST Laravel + Nginx
│   ├── docker/
│   │   └── nginx/
│   │       └── default.conf           # Configuration Nginx
│   ├── laravel/
│   │   ├── app/
│   │   │   ├── Http/Controllers/      # Controllers (Auth, Products)
│   │   │   └── Models/                # Eloquent Models
│   │   ├── routes/
│   │   │   └── api.php               # Routes API (public + protected)
│   │   ├── config/
│   │   │   ├── cors.php              # Configuration CORS
│   │   │   ├── sanctum.php           # Configuration Sanctum
│   │   │   └── ...
│   │   ├── database/
│   │   │   ├── migrations/           # Migrations DB
│   │   │   └── seeders/              # Seeders dev
│   │   ├── tests/                    # Tests PHPUnit
│   │   └── ...
│   ├── Dockerfile                     # Image Docker
│   ├── composer.json                  # Dépendances PHP
│   └── README.md
│
├── frontend-nextjs/                    # Application React/Next.js
│   ├── app/
│   │   ├── layout.tsx                 # Root layout + AuthProvider
│   │   ├── page.tsx                   # Accueil
│   │   ├── login/page.tsx             # Page connexion
│   │   ├── register/page.tsx          # Page enregistrement
│   │   ├── products/
│   │   │   ├── page.tsx              # Liste produits
│   │   │   ├── create/page.tsx       # Créer produit
│   │   │   ├── [id]/page.tsx         # Détails produit
│   │   │   └── edit/[id]/page.tsx    # Éditer produit
│   │   ├── welcome/page.tsx           # Page post-connexion
│   │   ├── globals.css                # Styles globaux
│   │   └── layout.tsx
│   ├── components/
│   │   ├── navbar.tsx                 # Navigation principale
│   │   ├── LoginForm.tsx              # Formulaire connexion
│   │   ├── RegisterForm.tsx           # Formulaire enregistrement
│   │   └── ProtectedRoute.tsx         # Wrapper routes protégées
│   ├── context/
│   │   └── AuthContext.tsx            # Context authentification globale
│   ├── lib/
│   │   ├── api.ts                    # Wrapper fetch + token management
│   │   └── auth.ts                   # Fonctions authentification
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   └── README.md
│
├── fastapi-poo/                        # Service Python
│   ├── main.py                         # Point d'entrée FastAPI
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md
│
├── infra/
│   └── docker-compose.yml              # Orchestration complète
│
├── SANCTUM_NEXTJS_COMPLET.md          # Doc techique Sanctum
├── README_PRODUITS.md                  # Spécifications produits
└── README.md                           # Ce fichier
```

## 🚀 Démarrage Rapide

### Prérequis

- **Docker** (v20.10+)
- **Docker Compose** (v2.0+)
- **Git**
- Terminal/CLI

### Installation et Lancement

1. **Cloner le projet**
```bash
git clone <repository-url>
cd web3-2026/guindo/projet
```

2. **Démarrer les services**
```bash
cd infra
docker compose up -d
```

3. **Vérifier que tous les services sont en cours d'exécution**
```bash
docker compose ps
```

4. **Accéder à l'application**

| Service | URL | Description |
|---------|-----|-------------|
| 🎨 Frontend | [localhost:3000](http://localhost:3000) | Application Next.js |
| 🔧 Backend | [localhost:8080](http://localhost:8080) | API Laravel |
| 🐍 FastAPI | [localhost:8001](http://localhost:8001) | Service POO |
| 📚 FastAPI Docs | [localhost:8001/docs](http://localhost:8001/docs) | Swagger UI |
| 🗄️ pgAdmin | [localhost:8081](http://localhost:8081) | Gestion PostgreSQL |

### Arrêter les services

```bash
docker compose down
```

### Supprimer volumes (⚠️ données perdues)

```bash
docker compose down -v
```

## 🔐 Authentification (Sanctum)

## 🔐 Authentification (Sanctum)

L'application utilise **Laravel Sanctum** pour l'authentification basée sur les tokens.

### Routes Disponibles

#### 🔓 Routes Publiques (sans authentification)
```
POST /api/auth/register          # Enregistrer un nouvel utilisateur
POST /api/auth/login             # Connexion utilisateur
GET  /api/products               # Lister tous les produits
```

#### 🔒 Routes Protégées (nécessitent un token valide)
```
POST   /api/auth/logout          # Déconnexion
GET    /api/auth/user            # Récupérer l'utilisateur courant
POST   /api/products             # Créer un produit
GET    /api/products/{id}        # Afficher un produit spécifique
PUT    /api/products/{id}        # Modifier un produit
DELETE /api/products/{id}        # Supprimer un produit
```

### Flux d'Authentification

```
┌─────────────┐
│  Utilisateur │
└──────┬──────┘
       │
       ▼
┌───────────────────────────┐
│ Page Login/Register        │
│ (frontend-nextjs)         │
└──────┬────────────────────┘
       │
       ├─ POST /auth/login
       │  {email, password}
       │
       ▼
┌────────────────────────────┐
│ Backend Laravel            │
│ Valide & Retourne Token    │
└──────┬─────────────────────┘
       │
       ├─ Response: {access_token, user}
       │
       ▼
┌────────────────────────────┐
│ localStorage.access_token  │
│ AuthContext (global state) │
└──────┬─────────────────────┘
       │
       ├─ Token auto-ajouté aux headers
       │  Authorization: Bearer {token}
       │
       ▼
┌────────────────────────────┐
│ Routes Protégées OK        │
│ Utilisateur Authentifié    │
└────────────────────────────┘
```

### Commandes d'Authentification (Frontend)

```typescript
import { login, register, logout } from '@/lib/auth';

// Connexion
const response = await login({ email: 'user@email.com', password: 'password' });
// Response: { access_token, token_type, user }

// Enregistrement
const user = await register({
  name: 'Jean Dupont',
  email: 'jean@email.com',
  password: 'password123',
  password_confirmation: 'password123'
});

// Déconnexion
await logout();
```

## 🛠️ Configuration Services

### 📦 Frontend Next.js (Port 3000)

Application React moderne utilisant l'App Router de Next.js avec authentification Sanctum intégrée.

**Variables d'environnement** (`.env.local`):
```env
# API Backend
NEXT_PUBLIC_API_URL=http://laravel_nginx/api

# Alternative en développement local (sans Docker)
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Environnement
NEXT_ENV=development
```

**Démarrage local** (sans Docker):
```bash
cd frontend-nextjs
npm install
npm run dev
# Application disponible sur http://localhost:3000
```

**Build production** :
```bash
npm run build
npm start
```

📖 **Documentation complète** : [frontend-nextjs/README.md](./frontend-nextjs/README.md)

### 🔧 Backend Laravel (Port 8080)

API REST Laravel avec Nginx comme reverse proxy. Authentification Sanctum, gestion des produits, CORS configuré.

**Variables d'environnement** (`.env`):
```env
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=laravel_db
DB_USERNAME=laravel
DB_PASSWORD=secret

# CORS pour le frontend
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://laravel_nginx

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost
```

**Commandes utiles**:
```bash
# Migrations
docker compose exec laravel_app php artisan migrate

# Seeders
docker compose exec laravel_app php artisan db:seed

# Créer un modèle avec contrôleur
docker compose exec laravel_app php artisan make:model Models/Product -mcr

# Tests PHPUnit
docker compose exec laravel_app php artisan test

# Tinker (REPL PHP)
docker compose exec laravel_app php artisan tinker
```

**Points d'accès**:
- API: `http://localhost:8080/api/`
- Documentation : Voir [backend-laravel/SANCTUM_ENDPOINTS.md](./backend-laravel/SANCTUM_ENDPOINTS.md)

### 🐍 Service FastAPI (Port 8001)

Service Python pour la programmation orientée objets avec Swagger UI auto-généré.

**Documentation interactive** : [Swagger UI](http://localhost:8001/docs)

**Commandes utiles**:
```bash
# Voir les logs en temps réel
docker compose logs -f fastapi

# Accéder au shell Python
docker compose exec fastapi python

# Tests pytest
docker compose exec fastapi pytest
```

### 🗄️ Base de Données PostgreSQL (Port 5433)

Base de données centralisée pour tous les services.

**Credentials** (voir `docker-compose.yml`):
- Utilisateur: `laravel`
- Mot de passe: `secret`
- Base: `laravel_db`

**pgAdmin** - Interface web:
- 🌐 [localhost:8081](http://localhost:8081)
- 📧 Email: `admin@admin.com`
- 🔑 Mot de passe: `admin`

**Connexion à la DB directement**:
```bash
docker compose exec postgres psql -U laravel -d laravel_db
```

## ✨ Nouveautés & Améliorations

### 🎨 Design Harmonisé
- Palette de couleurs cohérente (gradient violet: #667eea → #764ba2)
- Tous les formulaires stylisés avec le même design
- Navbar sticky avec navigation principale
- Responsive design sur tous les appareils

### 🔧 API Fixes
- ✅ Correction de l'erreur "Failed to fetch"
- ✅ URLs d'API basées sur les variables d'environnement
- ✅ Utilisation centralisée des helpers API (apiGet, apiPost, etc.)
- ✅ Routes `/products` publique (GET) et protégées (POST/PUT/DELETE)

### 🔐 Authentification Complète
- ✅ Sanctum tokens avec stockage localStorage
- ✅ AuthContext pour gestion globale
- ✅ Redirections automatiques post-connexion
- ✅ Logout intégré dans la Navbar

### 📦 Composants Réutilisables
- Navbar avec navigation et déconnexion
- Formulaires de connexion/enregistrement
- Helpers API centralisés
- Context d'authentification globale

## 📋 Commandes Docker Utiles

```bash
# Lancer tous les services
docker compose up -d

# Voir le statut des services
docker compose ps

# Voir les logs de tous les services
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f nextjs
docker compose logs -f laravel_app
docker compose logs -f fastapi
docker compose logs -f postgres

# Accéder au shell du conteneur
docker compose exec laravel_app bash
docker compose exec nextjs sh

# Arrêter un service spécifique
docker compose stop laravel_app

# Redémarrer tous les services
docker compose restart

# Reconstruire les images (après changement de dépendances)
docker compose build --no-cache

# Supprimer les conteneurs et volumes
docker compose down -v
```

## 🔌 Ports et Services

| Service | Port | URL / Accès |
|---------|------|------------|
| 🎨 Next.js Frontend | 3000 | http://localhost:3000 |
| 🔧 Laravel Backend | 8080 | http://localhost:8080/api |
| 🐍 FastAPI | 8001 | http://localhost:8001 |
| 📚 FastAPI Docs | 8001 | http://localhost:8001/docs (Swagger) |
| 🗄️ PostgreSQL | 5433 | localhost:5433 (CLI) |
| 🖥️ pgAdmin | 8081 | http://localhost:8081 |

## 🧪 Tests

### Backend Laravel - PHPUnit
```bash
# Tous les tests
docker compose exec laravel_app php artisan test

# Tests d'une classe spécifique
docker compose exec laravel_app php artisan test tests/Feature/LoginTest.php

# Avec verbosité
docker compose exec laravel_app php artisan test --verbose
```

### Frontend Next.js
```bash
cd frontend-nextjs

# Tests
npm test

# Lint TypeScript
npm run lint
```

### Service FastAPI - pytest
```bash
docker compose exec fastapi pytest

# Avec couverture
docker compose exec fastapi pytest --cov
```

## 📖 Documentation Complète

Pour une documentation détaillée sur chaque service:

- 📘 **[Frontend Next.js](./frontend-nextjs/README.md)** - Architecture, composants, authentification
- 🔗 **[Backend Laravel](./backend-laravel/README.md)** - Routes API, migrations
- 🐍 **[Service FastAPI](./fastapi-poo/README.md)** - POO et APIs
- 📚 **[Sanctum Documentation](./SANCTUM_NEXTJS_COMPLET.md)** - Détails techniques complets
- 📦 **[Spécifications Produits](./README_PRODUITS.md)** - Modèle de données

## 🔐 Variables d'Environnement

Chaque service disposent de son propre fichier `.env`. Les fichiers clés:

```
backend-laravel/laravel/.env          # Configuration Laravel & DB
frontend-nextjs/.env.local            # Configuration Frontend
```

### Frontend - Variables clés

```env
NEXT_PUBLIC_API_URL              # URL de l'API (exposée au client)
NEXT_ENV                          # Environnement (development/production)
```

### Backend - Variables clés

```env
APP_NAME=WebStore                 # Nom de l'application
APP_ENV=local                     # Environnement
APP_DEBUG=true                    # Debug mode

DB_CONNECTION=pgsql              # Type de DB
DB_HOST=postgres                 # Host DB (dans Docker)
DB_DATABASE=laravel_db           # Nom de la DB
DB_USERNAME=laravel              # User DB
DB_PASSWORD=secret               # Mot de passe DB

CORS_ALLOWED_ORIGINS             # Origines autorisées (frontend URL)
SANCTUM_STATEFUL_DOMAINS         # Domaines stateful pour Sanctum
```

## 🐛 Debugging & Troubleshooting

### Problème : "Failed to fetch" sur le frontend

**Causes possibles:**
1. Backend Laravel non en cours d'exécution
2. URL incorrecte dans `NEXT_PUBLIC_API_URL`
3. Problème de CORS

**Solutions:**
```bash
# Vérifier que tous les services tournent
docker compose ps

# Vérifier les logs du backend
docker compose logs laravel_app |

# Tester l'API directement
curl http://localhost:8080/api/products
```

### Problème : Migrations Laravel échouent

```bash
# Vérifier que PostgreSQL est prêt
docker compose logs postgres

# Voir les erreurs détaillées
docker compose exec laravel_app php artisan migrate --verbose

# Recommencer les migrations (⚠️ réinitialise la DB)
docker compose exec laravel_app php artisan migrate:refresh --seed
```

### Problème : Frontend ne se connecte pas au backend

**Étapes de debug:**
```bash
# 1. Vérifier la configuration
cat frontend-nextjs/.env.local | grep NEXT_PUBLIC_API_URL

# 2. Vérifier les logs du backend
docker compose logs laravel_app

# 3. Tester manuellement l'API
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password"}'

# 4. Vérifier les logs du frontend
docker compose logs nextjs
```

### Problème : Conteneurs qui ne démarrent pas

```bash
# Voir l'état des conteneurs
docker compose ps

# Voir les erreurs complètes
docker compose logs

# Nettoyer et redémarrer
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Problème : CORS errors

**Vérifier la configuration** dans `backend-laravel/laravel/config/cors.php`:
```php
'allowed_origins' => ['http://localhost:3000', 'http://laravel_nginx'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

## 📊 Workflow de Développement

### Ajouter une nouvelle page frontend

```bash
cd frontend-nextjs/app

# Créer le dossier
mkdir -p ma-page

# Créer la page
cat > ma-page/page.tsx << 'EOF'
'use client';

import { useEffect } from 'react';
import Navbar from '@/components/navbar';

export default function MaPage() {
  return (
    <>
      <Navbar />
      <div>Contenu de ma page</div>
    </>
  );
}
EOF
```

### Ajouter une nouvelle route API

```bash
cd backend-laravel/laravel

# Créer le contrôleur
docker compose exec laravel_app php artisan make:controller Api/MonControllerController

# Ajouter la route dans routes/api.php
echo "Route::post('/mon-endpoint', [MonControllerController::class, 'index']);" >> routes/api.php
```

## ✅ Checklist Avant Production

- [ ] Vérifier les variables d'environnement (pas de valeurs hardcodées)
- [ ] Tester l'authentification complète
- [ ] Tester CRUD produits
- [ ] Vérifier CORS configuré correctement
- [ ] Tests passent (`npm test`, `artisan test`)
- [ ] Design responsive testé
- [ ] Logs sensibles nettoyés (console.log)
- [ ] Erreurs capturées et gérées
- [ ] Build production OK (`npm run build`)
- [ ] Base de données prête (migrations appliquées)

## 👥 Contributeurs

- Ibrahim O Guindo

## 📄 Licence

Ce projet est sous licence [À définir].

## 🤝 Support

Pour les questions ou les bugs :
- Créer une issue dans le repository
- Consulter la documentation : [Wiki](./wiki) | [Docs](./docs)
- Contacter l'équipe de développement

---

**🚀 Dernière mise à jour** : Mars 2026
**📌 Statut** : ✅ Production Ready
**🔄 Version** : 1.0.0
