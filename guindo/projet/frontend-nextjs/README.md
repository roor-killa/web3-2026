# Frontend Next.js — KaribMarket & Dashboard Kiprix 🌐

Application web full-stack connectée à deux backends : **Laravel** (Produit) et **KaribMarket FastAPI** (prix Kiprix + dashboard scraping).

---

## 🏗️ Architecture

```
frontend-nextjs/
├── app/
│   ├── layout.tsx                     # Root layout + AuthProvider
│   ├── page.tsx                       # Accueil
│   ├── login/page.tsx                 # Connexion Laravel
│   ├── register/page.tsx              # Inscription Laravel
│   ├── welcome/page.tsx               # Page post-connexion
│   ├── products/
│   │   ├── page.tsx                   # Liste produits Laravel
│   │   ├── create/page.tsx            # Créer produit
│   │   ├── [id]/page.tsx              # Détail produit
│   │   └── edit/[id]/page.tsx         # Éditer produit
│   └── dashboard/                     # ← Dashboard FastAPI (Kiprix)
│       ├── layout.tsx                 # Navbar admin + protection JWT
│       ├── page.tsx                   # Stats + gestion URLs scraping
│       ├── login/page.tsx             # Connexion FastAPI
│       ├── prix/page.tsx              # Tableau comparateur prix DOM/France
│       └── scrape/page.tsx            # Lancer scraping + historique
├── components/
│   ├── Navbar.tsx                     # Navigation principale
│   ├── LoginForm.tsx                  # Formulaire connexion Laravel
│   ├── RegisterForm.tsx               # Formulaire inscription
│   └── ProtectedRoute.tsx             # Wrapper routes protégées Laravel
├── context/
│   └── AuthContext.tsx                # Context auth global (Laravel)
├── lib/
│   ├── api.ts                         # Client HTTP Laravel (localhost:8080)
│   ├── auth.ts                        # Fonctions auth Laravel (Sanctum)
│   └── fastapi.ts                     # Client HTTP FastAPI (localhost:8000)
├── .env.local                         # Variables d'environnement
├── next.config.mjs
├── package.json
└── tsconfig.json
```

---

## 🚀 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Laravel backend lancé (port 8080)
- KaribMarket FastAPI lancé (port 8000)

### 1. Installer les dépendances

```bash
cd frontend-nextjs
npm install
```

### 2. Configurer les variables d'environnement

Créer `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://laravel_app:9000
```

### 3. Lancer le serveur de développement

```bash
npm run dev
```

L'application est disponible sur **http://localhost:3000**

---

## 📄 Pages

### Partie Laravel (annonces)
| Route | Description |
|-------|-------------|
| `/` | Page d'accueil |
| `/login` | Connexion |
| `/register` | Inscription |
| `/welcome` | Dashboard post-connexion |
| `/products` | Liste des annonces |
| `/products/create` | Créer une annonce |
| `/products/[id]` | Détail annonce |
| `/products/edit/[id]` | Modifier annonce |

### Partie FastAPI — Dashboard Kiprix
| Route | Description | Auth |
|-------|-------------|------|
| `/dashboard/login` | Connexion FastAPI JWT | Non |
| `/dashboard` | Stats + gestion URLs scraping | Oui |
| `/dashboard/prix` | Comparateur prix France vs DOM | Oui |
| `/dashboard/scrape` | Lancer scraping + historique | Oui |

---

## 🔐 Double authentification

Le projet gère **deux systèmes d'auth indépendants** :

| Système | Token | Stockage | Usage |
|---------|-------|----------|-------|
| Laravel Sanctum | Bearer token | `localStorage["access_token"]` | Annonces / produits |
| FastAPI JWT | Bearer token | `localStorage["fastapi_token"]` | Dashboard Kiprix |

Les deux tokens coexistent sans interférence.

---

## 🔗 Connexion aux APIs

### Client Laravel (`lib/api.ts`)
```ts
// Pointe vers localhost:8080 (nginx → Laravel)
const PUBLIC_API_URL = "http://localhost:8080/api";
```

### Client FastAPI (`lib/fastapi.ts`)
```ts
// Pointe vers localhost:8000 (FastAPI direct)
const FASTAPI_URL = "http://localhost:8000/api/v1";
```

---

## 🖥️ Dashboard Kiprix — Fonctionnalités

### `/dashboard` — Gestion des URLs
- Statistiques : total URLs, URLs actives, nombre de données scrapées
- Ajouter une URL Kiprix à scraper (ex: `https://www.kiprix.com/fr-mq`)
- Activer / désactiver / supprimer des URLs
- Mise à jour automatique après chaque scraping

### `/dashboard/prix` — Comparateur
- Tableau des produits scrapés avec pagination
- Filtre par nom de produit (recherche en temps réel)
- Filtre par territoire (mq, gp, re, gf)
- Affichage prix France, prix DOM, écart %

### `/dashboard/scrape` — Runner
- Sélection territoire + nombre de pages
- Lancement scraping en arrière-plan
- Polling automatique toutes les 3 secondes
- Historique des 50 derniers scraping avec statut

---

## 🐳 Docker

```bash
docker build -t frontend-nextjs .
docker run -p 3000:3000 frontend-nextjs
```

---

## 📦 Stack technique

| Technologie | Usage |
|-------------|-------|
| Next.js 15 (App Router) | Framework React SSR |
| TypeScript | Typage statique |
| Tailwind CSS | Styles |
| React Context | Gestion état auth |
| localStorage | Persistance tokens JWT |
