# 🚀 Sanctum + Next.js - Guide Complet de Démarrage

## ✅ Installation Terminée!

Vous avez maintenant une **authentification complète** avec:
- ✅ Laravel Sanctum (backend)
- ✅ Next.js intégré (frontend)
- ✅ Contexte d'authentification
- ✅ Composants prêts à l'emploi
- ✅ Routes protégées

---

## 🎯 Démarrage Rapide (5 minutes)

### 1️⃣ Démarrer l'infrastructure Docker

```bash
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/infra

# Démarrer les services
docker compose up -d

# Attendre 10 secondes
sleep 10

# Vérifier les services
docker compose ps
```

### 2️⃣ Démarrer Next.js

```bash
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/frontend-nextjs

# (Optionnel) Installer les dépendances
npm install

# Démarrer le dev server
npm run dev
```

### 3️⃣ Tester l'Authentification

#### Créer un compte
1. Aller à http://localhost:3000/register
2. Remplir le formulaire
3. Cliquer sur "S'enregistrer"

#### Se connecter
1. Aller à http://localhost:3000/login
2. Utiliser les identifiants du compte créé
3. Êtes sur la page `/products` (protégée)

---

## 📊 Architecture Globale

```
┌──────────────────────────────────────────────────────────────┐
│                    UTILISATEUR                                │
└────────────────────┬─────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
   ┌──────────┐          ┌──────────────┐
   │ Browser  │          │ localStorage │
   │ Next.js  │◄────────►│ access_token │
   │ Port 3000│          └──────────────┘
   └────┬─────┘
        │
        │ HTTP + Bearer Token
        │
        ▼
   ┌──────────────────┐
   │ Docker Compose   │
   │ (infra/)         │
   └────┬─────────────┘
        │
        ├─► PostgreSQL (port 5433)
        ├─► Laravel App (port 8080)
        │   - /api/auth/register
        │   - /api/auth/login
        │   - /api/auth/logout (protected)
        │   - /api/products (protected)
        │
        └─► Nginx (reverse proxy)
            - Reçoit les requêtes
            - Transmet à Laravel
            - Retourne les réponses
```

---

## 🔐 Endpoints Disponibles

### 🔓 Publics (pas d'authentification)

| Méthode | URL | Description |
|---------|-----|-------------|
| POST | `/api/auth/register` | Créer un compte |
| POST | `/api/auth/login` | Se connecter + obtenir token |

**Exemple Login**:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

**Réponse**:
```json
{
  "message": "Connexion réussie",
  "access_token": "eyJhbGciOiJI...",
  "token_type": "Bearer",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 🔒 Protégés (token requis)

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/auth/user` | Récupérer l'utilisateur |
| GET | `/api/auth/tokens` | Lister ses tokens |
| POST | `/api/auth/logout` | Déconnexion |
| DELETE | `/api/auth/tokens/{id}` | Révoquer un token |
| POST | `/api/auth/logout-all` | Révoquer tous les tokens |
| GET | `/api/products` | Lister les produits |
| POST | `/api/products` | Créer un produit |
| GET | `/api/products/{id}` | Afficher un produit |
| PUT | `/api/products/{id}` | Modifier un produit |
| DELETE | `/api/products/{id}` | Supprimer un produit |

**Exemple Requête Protégée**:
```bash
curl -X GET http://localhost:8080/api/auth/user \
  -H "Authorization: Bearer eyJhbGciOiJI..."
```

---

## 💻 Code Examples

### Exemple 1: Utiliser `useAuth` dans un composant

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  if (isLoading) return <div>Chargement...</div>;
  
  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>
        Déconnexion
      </button>
    </div>
  );
}
```

### Exemple 2: Appeler une API protégée

```typescript
'use client';

import { apiGet, apiPost } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ products: any[] }>('/products')
      .then(data => setProducts(data.products))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1>Produits</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {products.map(p => (
            <li key={p.id}>{p.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### Exemple 3: Protéger une route

```typescript
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import MyPrivatePage from '@/components/MyPrivatePage';

export default function Page() {
  return (
    <ProtectedRoute>
      <MyPrivatePage />
    </ProtectedRoute>
  );
}
```

---

## 🧪 Tester avec Postman

### 1️⃣ Collection Setup

Créer une nouvelle collection "Web3 API"

### 2️⃣ Ajouter l'environnement

Variables:
- `base_url` = `http://localhost:8080/api`
- `access_token` = (vide pour l'instant)

### 3️⃣ Requests

#### Request: Register
```
POST {{base_url}}/auth/register

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

#### Request: Login
```
POST {{base_url}}/auth/login

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Script (Tests)**:
```javascript
var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.access_token);
```

#### Request: Get User
```
GET {{base_url}}/auth/user

Headers:
Authorization: Bearer {{access_token}}
```

#### Request: Get Products
```
GET {{base_url}}/products

Headers:
Authorization: Bearer {{access_token}}
```

---

## 📁 Fichiers Créés

| Fichier | Description |
|---------|-------------|
| `.env.local` | Config URLs |
| `lib/api.ts` | Utilitaires API |
| `lib/auth.ts` | Fonctions auth |
| `context/AuthContext.tsx` | Contexte + Provider |
| `components/LoginForm.tsx` | Formulaire login |
| `components/RegisterForm.tsx` | Formulaire register |
| `components/ProtectedRoute.tsx` | Protection routes |
| `app/globals.css` | Styles globaux |
| `app/layout.tsx` | Layout + AuthProvider |
| `app/login/page.tsx` | Page login |
| `app/register/page.tsx` | Page register |

---

## 🐛 Troubleshooting

### Problème: "Cannot POST /api/auth/login"

**Cause**: Docker non démarré ou Laravel inaccessible

**Solution**:
```bash
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/infra
docker compose up -d
docker compose ps  # Vérifier que tout est UP
```

### Problème: "401 Unauthorized"

**Cause**: Token manquant ou expiré

**Solution**: Vous reconnecter via `/login`

### Problème: "Module not found"

**Cause**: Chemins d'import incorrects

**Solution**: Vérifier que les fichiers existent dans:
- `lib/`
- `context/`
- `components/`

### Problème: "CORS error"

**Cause**: Origine non autorisée

**Solution**: Vérifier que `.env.local` a la bonne URL:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

## 🎯 Étapes Suivantes

### Phase 1: Fonctionnalités de Base ✅
- ✅ Login/Register
- ✅ Routes protégées
- ✅ useAuth hook
- ✅ API calls

### Phase 2: Améliorations (À Faire)
- ⬜ Afficher les produits
- ⬜ Créer/éditer/supprimer produits
- ⬜ Toast notifications
- ⬜ Loading states

### Phase 3: Production (À Faire)
- ⬜ Refresh tokens
- ⬜ CORS configuration
- ⬜ Error handling avancé
- ⬜ Rate limiting
- ⬜ Tests unitaires

---

## 📚 Documentation Complète

### Backend (Laravel/Sanctum)
- [SANCTUM_GUIDE.md](../backend-laravel/SANCTUM_GUIDE.md) - Guide complet de Sanctum
- [SANCTUM_ENDPOINTS.md](../backend-laravel/SANCTUM_ENDPOINTS.md) - Détail des endpoints

### Frontend (Next.js)
- [NEXTJS_INTEGRATION.md](./NEXTJS_INTEGRATION.md) - Détail intégration Next.js
- `lib/api.ts` - Documentation code
- `lib/auth.ts` - Documentation code

---

## ✨ Résumé

Vous avez maintenant:
1. ✅ Backend Laravel avec Sanctum
2. ✅ Frontend Next.js avec authentification
3. ✅ Contexte React avec useAuth
4. ✅ Formulaires login/register
5. ✅ Protections de routes
6. ✅ API client configuré

**Prêt à tester!** 🚀

```bash
# Terminal 1: Docker
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/infra
docker compose up -d

# Terminal 2: Next.js
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/frontend-nextjs
npm run dev

# Ouvrir http://localhost:3000/login
```

🎉 **Bonne chance!**
