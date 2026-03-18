# 🕷️ Architecture Scraper Kiprix avec Admin Dashboard

## 📋 Vue d'ensemble

Cette architecture est composée de **trois parties principales** :

```
┌─────────────────────────────────────────────────────────────────┐
│                    WEB SCRAPING SYSTEM                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1️⃣  BACKEND SCRAPING (FastAPI)                                │
│      ├─ Scrape Kiprix (données brutes)                         │
│      ├─ API REST pour lancer/tracker les tâches               │
│      └─ Sauvegarde en PostgreSQL + JSON                        │
│                                                                  │
│  2️⃣  APPLICATION WEB (Laravel + Next.js)                       │
│      ├─ API REST pour gérer les URLs & configs                │
│      ├─ Gestion des tâches Cron (planification)               │
│      └─ Authentification & autorisations admin                │
│                                                                  │
│  3️⃣  INTERFACE ADMIN (Next.js)                                 │
│      ├─ Dashboard de visualisation                             │
│      ├─ Ajouter/lister/gérer URLs à scraper                  │
│      ├─ Contrôler les tâches planifiées (Cron)               │
│      ├─ Voir statistiques en temps réel                       │
│      └─ Visualiser les logs                                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
         ║                          ║                  ║
         ║                          ║                  ║
    PostgreSQL              PostgreSQL             MongoDB
```

---

## 🚀 Installation & Démarrage

### 1. **Préalable**
```bash
cd akonou
```

### 2. **Backend FastAPI (Python)**

```bash
cd projet

# Installer les dépendances
pip install -r requirements.txt

# Lancer l'API FastAPI
python -m uvicorn fastapi_app:app --reload --port 8000
```

API disponible: `http://localhost:8000`
Docs interactifs: `http://localhost:8000/docs`

### 3. **Backend Laravel**

```bash
cd back-laravel

# Installer les dépendances
composer install
npm install

# Configurer l'env
cp .env.example .env
php artisan key:generate

# Créer les tables
php artisan migrate

# Lancer le serveur Laravel
php artisan serve
```

API disponible: `http://localhost:8000`

### 4. **Frontend Next.js**

```bash
cd front-next

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Frontend: `http://localhost:3000`
Dashboard: `http://localhost:3000/scraper`

---

## 📡 API Endpoints

### **FastAPI** (Python)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Santé de l'API |
| GET | `/territories` | Liste des territoires disponibles |
| POST | `/scrape` | Lance un scraping en arrière-plan |
| GET | `/scrape/status/{task_id}` | Statut d'une tâche |
| GET | `/data/{territory}` | Récupère les données d'un territoire |
| GET | `/stats/{territory}` | Statistiques d'un territoire |
| GET | `/logs` | Récupère les logs |

### **Laravel API**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/scraper/urls` | Liste toutes les URLs |
| POST | `/api/scraper/urls` | Ajoute une nouvelle URL |
| PUT | `/api/scraper/urls/{id}` | Modifie une URL |
| DELETE | `/api/scraper/urls/{id}` | Supprime une URL |
| POST | `/api/scraper/urls/{id}/toggle` | Active/Désactive une URL |
| GET | `/api/scraper/urls/{id}/stats` | Statistiques d'une URL |
| POST | `/api/scraper/launch` | Lance un scraping immédiat |
| GET | `/api/scraper/stats` | Statistiques globales |
| GET | `/api/scraper/logs` | Logs du scraper |

---

## ⏱️ Système de Cron (Planification)

### Configuration

Chaque URL à scraper peut avoir une **expression Cron** personnalisée :

```
Expression Cron: minute heure jour mois jour_semaine

Exemples:
- "0 2 * * *"     → 2h du matin, chaque jour
- "0 */6 * * *"   → Toutes les 6 heures
- "0 0 * * 0"     → Chaque dimanche à minuit
- "*/30 * * * *"  → Toutes les 30 minutes
```

### Activation

Sur le serveur Laravel, lancez le scheduler :

```bash
# En développement
php artisan schedule:work

# En production (ajouter à crontab)
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

Le scheduler exécutera `php artisan scraper:execute` toutes les minutes,
et chaque URL se _comparera_ à son Cron pour savoir si elle doit s'exécuter.

---

## 📊 Dashboard Admin (Next.js)

### Fonctionnalités

#### 1️⃣ **Gestion des URLs** (`/scraper`)
- 👁️ Voir toutes les URLs configurées
- ✅ Active/Désactiver une URL
- 🚀 Lancer un scraping immédiat
- 📊 Voir le dernier scraping & statistiques

#### 2️⃣ **Ajouter une URL** (`/scraper?tab=add`)
```json
{
  "url": "https://kiprix.com",
  "territory": "gp",          // gp, mq, re, gf
  "custom_name": "Kiprix GP",
  "max_pages": 10,
  "cron_expression": "0 2 * * *"
}
```

#### 3️⃣ **Logs en temps réel** (`/scraper?tab=logs`)
- 📋 Affiche les 50 derniers logs
- 🔄 Rafraîchissement auto toutes les 5 secondes

#### 4️⃣ **Statistiques globales**
- Total URLs actives
- Nb scrapings réussis / échoués
- Nb total produits
- Derniers scrapings

---

## 🔄 Flux d'exécution

### 1. **L'admin ajoute une URL**
```
Dashboard (Next.js) 
  ↓ POST /api/scraper/urls
Laravel API
  ↓ INSERT into scraper_urls
PostgreSQL
```

### 2. **Le scheduler exécute la tâche Cron**
```
Laravel Scheduler (minute)
  ↓ php artisan scraper:execute
Vérifie chaque URL Cron
  ↓ Si due → HTTP POST
FastAPI
  ↓ Lance le scraper en arrière-plan
Kiprix Scraper (Python)
  ↓ Scrape & sauvegarde
PostgreSQL + JSON files
```

### 3. **L'admin visualise les résultats**
```
Dashboard (Next.js)
  ↓ GET /api/scraper/stats
Laravel API
  ↓ SELECT FROM scraper_urls, scraping_results
PostgreSQL
  ↓ Affiche les données en temps réel
```

---

## 📁 Structure des fichiers

```
akonou/
├── projet/                          # Backend FastAPI
│   ├── fastapi_app.py              # Point d'entrée API
│   ├── requirements.txt              # Dépendances Python
│   ├── src/
│   │   ├── scrapers/kiprix_scraper.py
│   │   ├── base_scraper.py
│   │   ├── db_manager.py
│   │   └── manager.py
│   └── logs/                         # Logs FastAPI
│
├── back-laravel/                    # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── ScraperURLController.php
│   │   │   └── ScrapingController.php
│   │   └── Models/
│   │       ├── ScraperURL.php
│   │       └── ScrapingResult.php
│   ├── database/migrations/
│   │   ├── *_create_scraper_urls_table.php
│   │   └── *_create_scraping_results_table.php
│   ├── routes/api.php
│   └── app/Console/
│       ├── Commands/ExecuteScrapingTasks.php
│       └── Kernel.php
│
└── front-next/                      # Frontend Next.js
    └── app/
        └── scraper/page.tsx         # Dashboard Admin
```

---

## 🔐 Authentification

Toutes les routes admin requièrent :
1. Authentification (token Sanctum Laravel)
2. Rôle `admin`

```typescript
// Dans Next.js, avant d'appeler l'API
const token = localStorage.getItem('auth_token');
const headers = { 'Authorization': `Bearer ${token}` };
```

---

## 🐛 Dépannage

### FastAPI ne démarre pas
```bash
# Vérifier les dépendances
pip install fastapi uvicorn pydantic

# Spécifier le port
python -m uvicorn fastapi_app:app --host 0.0.0.0 --port 8000
```

### Le scheduler ne lance pas les tâches
```bash
# Vérifier que laravel est en cours d'exécution
php artisan schedule:work

# Vérifier les logs
tail -f storage/logs/laravel.log
```

### Pas de connexion entre Laravel et FastAPI
```bash
# Vérifier que FastAPI écoute sur :8000
curl http://localhost:8000/

# Vérifier les logs Laravel
php artisan tinker
# > \Log::channel('scraper')->get();
```

---

## 📈 Améliorations futures

- [ ] Authentification 2FA pour admin
- [ ] Webhooks pour notifier les résultats
- [ ] Support de multiples scrapers (pas juste Kiprix)
- [ ] Base de données d'archive des scrapings
- [ ] Alertes en temps réel (Slack, Discord)
- [ ] Dashboard de performance (graphiques temps/page)
- [ ] Retry automatique s'il y a erreur

---

## 📞 Support

**Ton email:** Pour questions ou bugs, contacte-moi ! 😉

**Code responsabilités:**
- **FastAPI + Scraper:** `akonou/projet/`
- **API Laravel & Scheduler:** `akonou/back-laravel/`
- **Dashboard Next.js:** `akonou/front-next/app/scraper/`
