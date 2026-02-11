# 🚀 E-Shop - Guide de Démarrage

## 📋 Prérequis
- ✅ PHP 8.3+
- ✅ Node.js 18+
- ✅ Composer
- ✅ npm

## 🎯 Démarrage Rapide

### Option 1: Fichiers Batch (Windows - Recommandé)

#### 1️⃣ Démarrer le Backend (API Laravel)
Double-cliquez sur: `mon-projet/START_BACKEND.bat`

Vous devez voir:
```
INFO  Server running on [http://127.0.0.1:8000].
```

#### 2️⃣ Démarrer le Frontend (Next.js)
Double-cliquez sur: `START_FRONTEND.bat`

Vous devez voir:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

#### 3️⃣ Accédez au site
Ouvrez votre navigateur: **http://localhost:3000**

---

### Option 2: Ligne de Commande

#### Terminal 1 - Backend
```bash
cd "c:\L2 INFORMATIQUE _MARTINIQUE\TP web3\Laravel\mon-projet"
php artisan serve --port=8000
```

#### Terminal 2 - Frontend
```bash
cd "c:\L2 INFORMATIQUE _MARTINIQUE\TP web3\Laravel\frontend"
npm run dev
```

---

## 🔍 Test de l'API

Une fois que Laravel est en cours d'exécution, testez l'API:

```bash
curl http://localhost:8000/api/products
```

Vous devez voir une liste de produits en JSON.

---

## 📍 URLs Principales

| What | URL |
|------|-----|
| 🏠 **Accueil** | http://localhost:3000 |
| 📦 **Catalogue** | http://localhost:3000/products |
| 🔌 **API Produits** | http://localhost:8000/api/products |
| 🌐 **Accueil Backend** | http://localhost:8000/ |

---

## ❌ Dépannage

### Frontend ne démarre pas (ERR_CONNECTION_REFUSED)
```bash
# Vérifier que Node/npm sont installés
node --version
npm --version

# Réinstaller les dépendances
cd frontend
npm install
npm run build
npm run dev
```

### Backend ne démarre pas (404 Not Found)
```bash
# Vérifier que PHP est installé
php --version

# Vérifier les clés Laravel
cd mon-projet
php artisan key:generate
php artisan serve --port=8000
```

### L'API retourne une erreur de connexion
1. ✅ Laravel doit être lancé sur le port 8000
2. ✅ CORS est configuré pour accepter localhost:3000
3. ✅ La base de données SQLite existe

---

## 📊 Structure du Projet

```
Laravel/
├── mon-projet/              # Backend (API Laravel)
│   ├── app/
│   ├── routes/api.php       # Routes API
│   ├── START_BACKEND.bat    # Lancer le backend
│   └── database.sqlite      # Base de données
│
├── frontend/                # Frontend (Next.js)
│   ├── app/
│   ├── app/products/        # Page produits  
│   └── START_FRONTEND.bat   # Lancer le frontend
```

---

**Problème? Dites-moi le message exact que vous voyez dans la console!** ✨
