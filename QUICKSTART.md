# 🚀 QuickStart - Scraper Kiprix avec Dashboard Admin

## Option 1️⃣ : Démarrage rapide (Sans Docker)

### Étape 1 : Installation des dépendances

```bash
# FastAPI (Python)
cd projet
pip install -r requirements.txt

# Laravel
cd ../back-laravel
composer install
npm install

# Next.js
cd ../front-next
npm install
```

### Étape 2 : Configuration

```bash
# Copier les fichiers de config
cd ../back-laravel
cp .env.example .env
php artisan key:generate

# Configurer la BD PostgreSQL dans .env
# DB_HOST=localhost
# DB_DATABASE=kiprix_db
# DB_USERNAME=kiprix
# DB_PASSWORD=password
```

### Étape 3 : Démarrage en parallèle

**Terminal 1 - FastAPI:**
```bash
cd projet
python -m uvicorn fastapi_app:app --reload
# ✅ http://localhost:8000
```

**Terminal 2 - Laravel:**
```bash
cd back-laravel
php artisan migrate
php artisan serve
# ✅ http://localhost:8000/api
```

**Terminal 3 - Laravel Scheduler:**
```bash
cd back-laravel
php artisan schedule:work
# Exécute les tâches Cron
```

**Terminal 4 - Next.js:**
```bash
cd front-next
npm run dev
# ✅ http://localhost:3000
```

### Résultat

- **Dashboard:** http://localhost:3000/scraper
- **API FastAPI:** http://localhost:8000/docs
- **API Laravel:** http://localhost:8000/api

---

## Option 2️⃣ : Démarrage avec Docker (Recommandé)

### Préalable

- Docker & Docker Compose installés
- Fichier `.env` configuré avec les identifiants BD

### Lancer

```bash
cd akonou/infra

# Construire et démarrer
docker compose up --build

# En arrière-plan
docker compose up -d --build
```

**Services accessibles:**
- Frontend: http://localhost:3000
- Laravel API (via Nginx): http://localhost:8000/api
- FastAPI Docs: http://localhost:8002/docs
- PostgreSQL: localhost:15432

### Arrêter

```bash
docker compose down
```

### Logs

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f fastapi
```

---

## 📝 Premiers pas sur le Dashboard

### 1. **Se connecter**

Aller à `http://localhost:3000/login`

Créer un compte ou utiliser les identifiants admin par défaut.

### 2. **Ajouter une URL**

1. Aller à `http://localhost:3000/scraper`
2. Cliquer sur "+ Ajouter une URL"
3. Remplir:
   - **URL:** `https://www.kiprix.com/fr-gp` (Guadeloupe)
   - **Territoire:** `gp`
   - **Nom:** `Kiprix Guadeloupe`
   - **Max pages:** `5`
   - **Cron:** `0 2 * * *` (2h du matin)
4. Cliquer "Ajouter"

### 3. **Lancer un scraping immédiat**

1. Sur la page des URLs
2. Cliquer 🚀 **Lancer** sur l'URL
3. Attendre la réponse (quelques secondes à minutes)

### 4. **Voir les logs en temps réel**

Aller dans l'onglet **Logs** pour voir:
- Les étapes du scraping
- Les erreurs éventuelles
- Les statistiques de récupération

### 5. **Configurer le Cron automatique**

Sur le serveur Laravel, lancer:

```bash
# En développement
php artisan schedule:work

# En production (crontab)
* * * * * cd /chemin/projet && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔧 Configuration Cron avancée

Expressions Cron disponibles:

| Expression | Signification |
|-----------|--------------|
| `0 2 * * *` | 2h du matin, chaque jour |
| `0 */6 * * *` | Toutes les 6 heures |
| `0 0 * * 0` | Chaque dimanche |
| `0 12 * * 1-5` | Midi, lundi à vendredi |
| `*/30 * * * *` | Toutes les 30 minutes |

Générer des Cron: https://crontab.guru

---

## 📊 Comprendre le Dashboard

### **Statistiques globales** (en haut)
- 🔵 URLs actives
- 🟢 Scrapings réussis
- 🔴 Scrapings échoués
- 🟣 Produits total

### **Tableau des URLs**
- ✅ **Status:** Actif/Inactif
- 🕐 **Dernier scraping**
- 🚀 **Bouton Lancer:** Exécute immédiatement
- 🔄 **Activer/Désactiver:** Change le statut

### **Logs en temps réel**
- Affiche les 50 derniers logs
- Rafraîchit automatiquement toutes les 5s
- Montre les erreurs en rouge

---

## ❌ Troubleshooting

### "FastAPI n'est pas connectable"
```bash
# Vérifier que FastAPI écoute
curl http://localhost:8000/

# ou relancer
python -m uvicorn fastapi_app:app --reload --host 0.0.0.0
```

### "Erreur de connexion à PostgreSQL"
```bash
# Vérifier la BD
psql -h localhost -U kiprix -d kiprix_db

# Si elle n'existe pas
createdb -U kiprix kiprix_db
```

### "Le Cron ne lance pas les tâches"
```bash
# Vérifier que le scheduler tourne
php artisan schedule:work

# Vérifier les logs
tail -f storage/logs/laravel.log
```

### "Le Dashboard affiche une page blanche"
```bash
# Vérifier la console du navigateur (F12)
# Vérifier que l'API Laravel est accessible
curl http://localhost:8000/api/test

# Redémarrer Next.js
npm run dev
```

---

## 📚 Ressources

- **Cron:** https://crontab.guru
- **FastAPI:** https://fastapi.tiangolo.com
- **Laravel:** https://laravel.com/docs
- **Next.js:** https://nextjs.org/docs

---

Bon scraping ! 🕷️✨
