# Frontend Next.js — KaribMarket & Dashboard Kiprix 🌐

Application web full-stack connectée à deux backends : **Laravel** (annonces) et **KaribMarket FastAPI** (prix Kiprix + dashboard scraping + chatbot RAG).

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
│   ├── products/                      # CRUD produits Laravel
│   │   ├── page.tsx
│   │   ├── create/page.tsx
│   │   ├── [id]/page.tsx
│   │   └── edit/[id]/page.tsx
│   └── dashboard/                     # Dashboard FastAPI (thème sombre)
│       ├── layout.tsx                 # Navbar admin + protection JWT auto
│       ├── page.tsx                   # Stats + gestion URLs scraping
│       ├── login/page.tsx             # Connexion FastAPI JWT
│       ├── prix/page.tsx              # Comparateur prix France vs DOM
│       ├── scrape/page.tsx            # Runner scraping + historique temps réel
│       └── chatbot/page.tsx           # Chatbot RAG Kiprix
├── components/
│   ├── Navbar.tsx                     # Navigation principale
│   ├── LoginForm.tsx                  # Formulaire connexion Laravel
│   ├── RegisterForm.tsx               # Formulaire inscription
│   ├── ProtectedRoute.tsx             # Wrapper routes protégées Laravel
│   └── ChatBot.tsx                    # 🆕 Composant chatbot RAG
├── context/
│   └── AuthContext.tsx                # Context auth global (Laravel)
├── lib/
│   ├── api.ts                         # Client HTTP Laravel (localhost:8080)
│   ├── auth.ts                        # Fonctions auth Laravel (Sanctum)
│   └── fastapi.ts                     # Client HTTP FastAPI (localhost:8000)
├── .env.local
├── next.config.mjs
└── package.json
```

---

## 🚀 Installation

```bash
npm install
npm run dev
```

L'application est disponible sur **http://localhost:3000**

### Variables d'environnement (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://laravel_nginx:80
```

---

## 📄 Pages

### Partie Laravel
| Route | Description |
|-------|-------------|
| `/` | Accueil |
| `/login` | Connexion |
| `/register` | Inscription |
| `/products` | Liste annonces |
| `/products/create` | Créer annonce |
| `/products/[id]` | Détail annonce |

### Dashboard FastAPI (thème sombre glassmorphism)
| Route | Description | Auth |
|-------|-------------|------|
| `/dashboard/login` | Connexion FastAPI JWT | Non |
| `/dashboard` | Stats + gestion URLs scraping | Oui |
| `/dashboard/prix` | Tableau comparateur prix DOM/France | Oui |
| `/dashboard/scrape` | Lancer scraping + suivi temps réel | Oui |
| `/dashboard/chatbot` | 🆕 Chatbot RAG Kiprix | Oui |

---

## 🎨 Design System

Thème sombre cohérent sur toutes les pages dashboard :

```css
--bg: #0b1220
--surface: rgba(15, 23, 42, 0.75)
--accent: #7c3aed
--accent-soft: #a78bfa
```

Composants : cartes glassmorphism, tableaux dark, badges colorés, gradients violet/indigo.

---

## 🤖 Chatbot RAG

Le composant `ChatBot.tsx` se connecte à `/api/v1/chatbot` (FastAPI) qui utilise le `HybridRAGEngine` :

**Fonctionnalités :**
- Filtre par territoire (MQ, GP, RE, GF)
- Suggestions de questions prédéfinies
- Badge `🔍 SQL` quand le mode analytique est utilisé
- Affichage du provider LLM (Ollama/OpenAI)
- Scroll automatique vers le dernier message

**Exemples de questions :**
- "Où trouver les produits les moins chers en Martinique ?"
- "Quels produits ont le plus grand écart de prix ?"
- "Compare les prix de l'huile"

---

## 🔐 Double authentification

| Système | Token | Stockage | Usage |
|---------|-------|----------|-------|
| Laravel Sanctum | Bearer token | `localStorage["access_token"]` | Annonces / produits |
| FastAPI JWT | Bearer token | `localStorage["fastapi_token"]` | Dashboard Kiprix |

---

## 📦 Stack technique

| Technologie | Usage |
|-------------|-------|
| Next.js 15 (App Router) | Framework React SSR |
| TypeScript | Typage statique |
| Tailwind CSS | Styles utilitaires |
| CSS Variables | Thème sombre cohérent |
| React Context | Auth Laravel |
| localStorage | Tokens JWT |