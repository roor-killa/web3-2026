# 🔐 Intégration Next.js + Laravel Sanctum

## ✅ Configuration Complétée

L'authentification Sanctum est maintenant intégrée dans le projet Next.js.

---

## 📁 Nouvelle Structure

```
frontend-nextjs/
├── app/
│   ├── layout.tsx              ← Enveloppe avec AuthProvider
│   ├── globals.css             ← Styles globaux
│   ├── login/
│   │   └── page.tsx            ← Page de connexion
│   ├── register/               ← Nouvelle page d'enregistrement
│   │   └── page.tsx
│   └── products/
│       └── page.tsx            ← Route protégée
│
├── lib/
│   ├── api.ts                  ← Configuration API
│   └── auth.ts                 ← Fonctions d'authentification
│
├── context/
│   └── AuthContext.tsx         ← Contexte d'authentification
│
├── components/
│   ├── LoginForm.tsx           ← Formulaire de connexion
│   ├── RegisterForm.tsx        ← Formulaire d'enregistrement
│   └── ProtectedRoute.tsx      ← Protection des routes
│
└── .env.local                  ← Variables d'environnement
```

---

## 🔧 Fichiers Clés

### 1️⃣ `.env.local` - Configuration

```env
# URL de l'API (côté client)
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# URL de l'API (côté serveur - Docker)
API_BASE_URL=http://laravel_nginx/api
```

### 2️⃣ `lib/api.ts` - Utilitaire API

Fournit des fonctions pour:
- `apiGet()` - GET request
- `apiPost()` - POST request  
- `apiPut()` - PUT request
- `apiDelete()` - DELETE request
- Gestion automatique du token
- Gestion des erreurs

### 3️⃣ `lib/auth.ts` - Fonctions d'authentification

```typescript
await register(payload)      // Créer un compte
await login(payload)         // Se connecter
await logout()              // Se déconnecter
await getCurrentUser()      // Récupérer l'utilisateur
await listTokens()         // Lister les tokens
await revokeToken(id)      // Révoquer un token
```

### 4️⃣ `context/AuthContext.tsx` - Gestion d'état

```typescript
const { user, isAuthenticated, isLoading, error, login, logout, register } = useAuth();
```

**Fonctionnalités**:
- Fournit l'état utilisateur global
- Gère le cycle de vie de l'authentification
- Sauvegarde automatique du token en localStorage

### 5️⃣ `components/LoginForm.tsx` & `components/RegisterForm.tsx`

Formulaires prêts à l'emploi avec:
- Validation côté client
- Gestion des erreurs
- Styling Tailwind CSS
- Redirection après succès

### 6️⃣ `components/ProtectedRoute.tsx`

Protège les routes privées:
```typescript
<ProtectedRoute>
    <Dashboard />
</ProtectedRoute>
```

---

## 🚀 Utilisation

### 1️⃣ Initialiser le Projet

```bash
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/frontend-nextjs

# Installer les dépendances (si nécessaire)
npm install

# Démarrer le serveur de développement
npm run dev
```

Accès: `http://localhost:3000`

---

### 2️⃣ Utiliser l'authentification

#### Page Login
```
http://localhost:3000/login
```

Utilise `<LoginForm />` qui:
- Appelle `login()` depuis le contexte
- Sauvegarde le token en localStorage
- Redirige vers `/products` après succès

#### Page Register  
```
http://localhost:3000/register
```

Utilise `<RegisterForm />` qui:
- Appelle `register()` depuis le contexte
- Redirige vers `/login` après succès

---

### 3️⃣ Protéger les Routes

#### Avant (sans protection)
```tsx
export default function ProductsPage() {
  return <Products />;
}
```

#### Après (avec protection)
```tsx
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Products from '@/components/Products';

export default function ProductsPage() {
  return (
    <ProtectedRoute>
      <Products />
    </ProtectedRoute>
  );
}
```

Si l'utilisateur n'est pas authentifié:
- Redirect automatique vers `/login`
- Loading spinner pendant la vérification

---

### 4️⃣ Utiliser le Hook `useAuth`

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <h1>Bienvenue, {user?.name}!</h1>
      <button onClick={logout}>Déconnexion</button>
    </div>
  );
}
```

---

### 5️⃣ Appeler l'API Protégée

```typescript
'use client';

import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function Products() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      apiGet<{ products: any[] }>('/products')
        .then(data => setProducts(data.products))
        .catch(err => console.error(err));
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h1>Produits</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🔄 Flux d'Authentification

```
┌─────────────────────────────────────────┐
│ Utilisateur visite /login              │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌─────────────────┐
        │ LoginForm       │
        └────────┬────────┘
                 │
        1️⃣ Saisit email + password
                 │
               ▼
        ┌──────────────────────┐
        │ useAuth().login()    │ ← apiPost('/auth/login')
        └────────┬─────────────┘
                 │
               ▼
        POST /api/auth/login (Laravel)
                 │
               ▼
        ┌──────────────────────────────┐
        │ Réponse: {                   │
        │   access_token: "eyJ...",    │
        │   user: {...}                │
        │ }                            │
        └────────┬─────────────────────┘
                 │
        2️⃣ setToken(access_token)   ← localStorage
        3️⃣ setUser(user)             ← Context state
                 │
               ▼
        Redirection vers /products
                 │
               ▼
        ┌──────────────────────────────┐
        │ ProtectedRoute vérife        │
        │ isAuthenticated === true     │
        │ → Affiche le contenu        │
        └──────────────────────────────┘
```

---

## 🔐 Sécurité

### ✅ Implémenté

- ✅ Token stocké en localStorage
- ✅ Token envoyé en header Authorization
- ✅ Token supprimé au logout
- ✅ Routes protégées côté client
- ✅ Gestion des erreurs 401

### ⚠️ À Faire (Production)

- ⚠️ Utiliser httpOnly cookies (au lieu de localStorage)
- ⚠️ Implémenter CSRF protection côté serveur
- ⚠️ Ajouter CORS configuration
- ⚠️ Implémenter refresh tokens
- ⚠️ Rate limiting sur les endpoints login/register

---

## 🧪 Test Rapide

### 1️⃣ Démarrer l'infrastructure Docker

```bash
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/infra
docker compose up -d
```

### 2️⃣ Démarrer Next.js

```bash
cd /Users/user/Documents/ProjetWeb3/web3-2026/guindo/projet/frontend-nextjs
npm run dev
```

### 3️⃣ Accéder à l'application

- **Register**: http://localhost:3000/register
- **Login**: http://localhost:3000/login
- **Products** (protégé): http://localhost:3000/products

---

## 📊 État de l'Application

| Composant | Statut |
|-----------|--------|
| API Configuration | ✅ |
| Auth Functions | ✅ |
| Auth Context | ✅ |
| Login Form | ✅ |
| Register Form | ✅ |
| Protected Routes | ✅ |
| useAuth Hook | ✅ |
| Environment Config | ✅ |

---

## 🐛 Dépannage

### Erreur: "CORS error"

**Solution**: Ajouter CORS config dans Laravel
```php
// config/cors.php
'allowed_origins' => ['http://localhost:3000'],
```

### Erreur: "401 Unauthorized"

**Cause**: Token invalide ou expiré
**Solution**: Se reconnecter via `/login`

### Erreur: "Cannot find module"

**Cause**: Dossiers lib/ ou context/ non créés
**Solution**: Créer les dossiers

```bash
mkdir -p lib context components
```

---

## 🚀 Prochaines Étapes

1. ✅ **Afficher les produits** depuis l'API protégée
2. ✅ **Créer un header** avec logout
3. ✅ **Ajouter des notifications** (toast)
4. ✅ **Implémenter le refresh token**
5. ✅ **Ajouter des validations côté serveur** (POO, Zod)

---

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Context API](https://react.dev/reference/react/useContext)
- [Laravel Sanctum + Next.js](https://laravel.com/docs/11.x/sanctum)

---

**Intégration Completed** ✅  
**Vous pouvez maintenant tester l'authentification!** 🚀
