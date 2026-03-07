# Frontend Next.js - Web3 2026

Application frontend React/Next.js 15.5 pour la plateforme de gestion de produits **Web3 2026**.

Une interface moderne et intuitive avec authentification Sanctum, gestion complète des produits (CRUD), et design système cohérent.

## 🚀 Démarrage Rapide

### Avec Docker (recommandé)

```bash
cd guindo/projet/infra
docker compose up -d
# Application disponible sur http://localhost:3000
```

### Développement local

```bash
cd guindo/projet/frontend-nextjs
npm install
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 🌍 Variables d'Environnement

### `.env.local` (client-side)

```env
# URL de l'API Backend
NEXT_PUBLIC_API_URL=http://laravel_nginx/api

# En développement local (sans Docker)
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Environnement
NEXT_ENV=development
```

**Notes importantes :**
- `NEXT_PUBLIC_*` : Variables exposées au client (visibles dans le navigateur)
- En Docker : Utilisez le nom du service (`laravel_nginx`) et le port interne (80)
- Localement : Utilisez `localhost:8080`

## 🏗️ Architecture

### Structure des Fichiers

```
frontend-nextjs/
├── app/                              # Pages Next.js (App Router)
│   ├── layout.tsx                   # Layout racine + AuthProvider
│   ├── page.tsx                     # Accueil avec infos services
│   ├── login/
│   │   └── page.tsx                # Page de connexion
│   ├── register/
│   │   └── page.tsx                # Page d'enregistrement
│   ├── products/
│   │   ├── page.tsx                # Liste des produits
│   │   ├── create/
│   │   │   └── page.tsx           # Créer un produit
│   │   ├── [id]/
│   │   │   └── page.tsx           # Détails d'un produit
│   │   └── edit/[id]/
│   │       └── page.tsx           # Éditer un produit
│   ├── welcome/
│   │   └── page.tsx                # Page d'accueil post-connexion
│   ├── globals.css                 # Styles globaux
│
├── components/                       # Composants réutilisables
│   ├── navbar.tsx                  # Navigation principale (sticky)
│   ├── LoginForm.tsx               # Formulaire de connexion
│   ├── RegisterForm.tsx            # Formulaire d'enregistrement
│   ├── ProtectedRoute.tsx          # Wrapper pour routes protégées
│
├── context/                          # Context API
│   └── AuthContext.tsx             # Gestion de l'authentification globale
│
├── lib/                              # Utilitaires & helpers
│   ├── api.ts                      # Fonctions API (fetch wrapper)
│   ├── auth.ts                     # Fonctions d'authentification
│
├── Dockerfile                        # Configuration Docker
├── package.json                      # Dépendances npm
├── tsconfig.json                     # Configuration TypeScript
├── next.config.mjs                   # Configuration Next.js
└── README.md                         # Ce fichier
```

### Flux d'Authentification

```
Utilisateur
    ↓
[Form] Login/Register
    ↓
[API Call] → /auth/login | /auth/register
    ↓
[Backend] Valide + Retourne Token
    ↓
[localStorage] Stocke le token
    ↓
[AuthContext] Met à jour l'état global
    ↓
[Routes] Redirige vers /products
```

## 🔐 Authentification Sanctum

### Endpoints Disponibles

#### Publiques (sans token)
- `POST /auth/login` - Connexion utilisateur
- `POST /auth/register` - Enregistrement utilisateur
- `GET /products` - Lister tous les produits (public)

#### Protégés (nécessitent un token)
- `POST /auth/logout` - Déconnexion
- `GET /auth/user` - Récupérer l'utilisateur courant
- `POST /products` - Créer un produit
- `PUT /products/{id}` - Éditer un produit
- `DELETE /products/{id}` - Supprimer un produit

### Utilisation des Helpers API

Les fonctions `api.ts` gèrent automatiquement les headers et le token d'authentification :

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/lib/api';

// GET
const products = await apiGet<ApiResponse<Product[]>>('/products');

// POST avec données
const newProduct = await apiPost<ApiResponse>('/products', {
  name: 'Mon Produit',
  price: 99.99,
  description: 'Description'
});

// PUT pour mettre à jour
const updated = await apiPut<ApiResponse>(`/products/${id}`, updatedData);

// DELETE
await apiDelete<ApiResponse>(`/products/${id}`);
```

## 🎨 Design Système

### Palette de Couleurs

- **Primaire** (Violet) : `#667eea`
- **Secondaire** (Violet-foncé) : `#764ba2`
- **Gradient principal** : `linear-gradient(to right, #667eea 0%, #764ba2 100%)`

### Texte
- **Titre** : `#1f2937` (gris très foncé)
- **Texte normal** : `#374151` (gris foncé)
- **Texte secondaire** : `#6b7280` (gris moyen)
- **Blanc** : `#ffffff`

### Erreurs & Validation
- **Erreur** : `#dc2626` (rouge)
- **Erreur background** : `#fee2e2` (rouge clair)
- **Border inputs** : `#d1d5db` (gris clair)

### Composants
- **Border radius** : `0.5rem` - `1rem`
- **Shadow** : `0 4px 12px rgba(102, 126, 234, 0.15)`
- **Padding input** : `0.75rem`
- **Hauteur navbar** : `70px` minimum

## 📦 Composants Principaux

### `<Navbar />`
Navigation persistante en haut avec :
- Logo "WebStore" avec icône 📦
- Lien "Produits" 
- Bouton "Ajouter un produit"
- Bouton "Déconnexion"

Position : sticky (reste visible en haut pendant le scroll)

### `<LoginForm />`
Formulaire de connexion avec :
- Input email
- Input password
- Gestion d'erreurs
- Redirection automatique vers `/products` après succès

### `<RegisterForm />`
Formulaire d'enregistrement avec :
- Input nom complet
- Input email
- Input password (min 8 caractères)
- Confirmation password
- Validation côté client

### `<AuthContext />`
Fournit globalement :
- État d'authentification (`isAuthenticated`)
- Utilisateur courant (`user`)
- Fonctions (`login`, `register`, `logout`)
- État de chargement (`isLoading`)

## 🔄 État de l'Application

### Context API (AuthContext)

```typescript
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}
```

### LocalStorage

- **Token** : Stocké dans `localStorage.access_token`
- **Récupéré** : À chaque rechargement de page
- **Automatique** : Ajouté à tous les headers API via `apiCall()`

## 📄 Pages & Fonctionnalités

### `/` (Accueil)
- Vue d'ensemble du projet
- Liens vers services disponibles
- Liens vers pages principales

### `/login`
- Formulaire de connexion
- Validation des identifiants
- Lien vers `/register`
- Redirection automatique vers `/products` après succès

### `/register`
- Formulaire d'enregistrement
- Validation password matching
- Lien vers `/login`
- Redirection vers login après succès

### `/products`
- Liste de tous les produits
- Design en cartes avec gradient
- Actions : Voir détails, Éditer, Supprimer
- Bouton "Ajouter un produit"
- État vide : "Aucun produit disponible"

### `/products/create`
- Formulaire pour ajouter un produit
- Champs : Nom, Prix, Description
- Validation côté client
- Redirection vers `/products` après succès

### `/products/[id]`
- Affichage complet d'un produit
- Boutons : Éditer, Supprimer, Retour
- Informations détaillées
- Design élégant

### `/products/edit/[id]`
- Formulaire pré-rempli avec données du produit
- Modification des champs
- Redirection vers `/products` après succès

## 🛠️ Commandes Utiles

```bash
# Installation des dépendances
npm install

# Développement (hot reload)
npm run dev

# Build production
npm run build

# Lancer la build production
npm start

# Linting TypeScript
npm run lint

# Format code (si configuré)
npm run format
```

## 🐳 Docker

### Build localement
```bash
docker build -t web3-frontend .
docker run -p 3000:3000 web3-frontend
```

### Via Docker Compose
```bash
cd infra
docker compose up -d nextjs
```

L'application sera disponible sur `http://localhost:3000`

## 🔧 Configuration

### `next.config.mjs`
- Optimisation des images
- Rewrites API (si nécessaire)

### `tsconfig.json`
- Chemins d'alias : `@/*` → `./` (racine du projet)
- Stricte type checking

### `package.json`
- Next.js 15.5
- React 19
- TypeScript pour la sécurité des types

## 📋 Checklist de Déploiement

- [ ] Vérifier `.env.local` avec les bonnes URLs
- [ ] Tester authentification locale
- [ ] Tester CRUD produits
- [ ] Vérifier design sur mobile
- [ ] Tester déconnexion
- [ ] Vérifier les redirections
- [ ] Nettoyer les console.log() en prod

## 🐛 Troubleshooting

### "Failed to fetch"
- Vérifier `NEXT_PUBLIC_API_URL` dans `.env.local`
- Vérifier que le backend Laravel est en cours d'exécution
- Vérifier la connexion réseau/Docker

### "Unauthorized" sur routes protégées
- Vérifier que le token est sauvegardé dans localStorage
- Vérifier que le token est valide (pas expiré)
- Réessayer de se connecter

### Problèmes de style
- Nettoyer le cache : `rm -rf .next/`
- Redémarrer le serveur dev

## 📚 Ressources

- [Documentation Next.js 15](https://nextjs.org/docs)
- [API Rest: Endpoints Backend](../backend-laravel/SANCTUM_ENDPOINTS.md)
- [Architecture Sanctum](../SANCTUM_NEXTJS_COMPLET.md)
