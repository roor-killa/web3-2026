# 🎛️ Guide d'Administration - Scraper Kiprix

Ce document décrit la nouvelle infrastructure d'administration complète pour gérer le scraper Kiprix de manière autonome.

## 📋 Vue d'ensemble

L'infrastructure du scraper se divise en 3 couches :

### 1. **FastAPI Backend** (Port 8002)
- **Service**: Kiprix Scraper API
- **Responsabilités**:
  - Lancer des tâches de scraping
  - Gérer les exécutions en arrière-plan
  - Planifier les tâches (Cron/APScheduler)
  - Fournir les statistiques et logs
  - Configurer les paramètres

### 2. **Laravel Backend** (Port 8000/9000)
- **Service**: API REST
- **Responsabilités**:
  - Stocker les configurations persistantes
  - Gérer l'historique des exécutions
  - Fournir les permissions d'administration
  - Intégrer avec la base de données PostgreSQL

### 3. **Next.js Frontend** (Port 3000)
- **Route**: `/admin/scraper`
- **Responsabilités**:
  - Interface utilisateur pour administrer le scraper
  - Lancer les tâches manuelles
  - Configurer les horaires Cron
  - Consulter les logs et l'historique

---

## 🚀 Démarrage Rapide

### Démarrer tous les services

```bash
cd akonou/infra
docker compose up -d
```

**Vérifiez que tous les services sont actifs** :
```bash
docker compose ps
```

Pour voir les logs FastAPI :
```bash
docker logs kiprix_fastapi -f
```

### Accéder au Dashboard

1. Allez sur `http://localhost:3000`
2. Se connecter (ou vous créer un compte admin)
3. Cliquez sur **"🎛️ Admin Scraper"**

---

## 📊 Dashboard - Onglets Disponibles

### 1. **📊 Aperçu**
- **État du système**: Santé générale (% de succès, nombre de tâches, etc.)
- **Tâches récentes**: Historique des 10 dernières exécutions
- **Statut du service**: Info sur FastAPI

### 2. **🚀 Lancer Scraping**
Formulaire pour lancer un scraping manuel :
- **Territoire** : Choisir parmi gp (Guadeloupe), mq (Martinique), re (Réunion), gf (Guyane)
- **Nombre de pages** : 1 à 100
- **Délai minimum** : 0.5 à 10 secondes (anti-blocking)
- **Suivi en temps réel** : Voir l'avancement

### 3. **⚙️ Configuration**
Paramètres modifiables :
- `default_territory` : Territoire par défaut
- `default_max_pages` : Pages par défaut
- `default_delay` : Délai minimum entre requêtes
- `retry_attempts` : Tentatives en cas d'erreur
- `timeout_seconds` : Timeout des requêtes

### 4. **⏰ Horaires**
Gestion des tâches planifiées (Cron) :
- **Expression Cron** : Ex: `0 2 * * *` (chaque jour à 2h du matin)
- **Nom** : Description optionnelle
- **Territoires** : Sélectionner plusieurs territoires
- **Pages** : Nombre de pages à scraper
- **Actif** : Cocher pour activer

**Exemples d'expressions Cron** :
```
0 2 * * *     → Tous les jours à 2h
*/30 * * * *  → Tous les 30 minutes
0 */4 * * *   → Toutes les 4 heures
0 0 * * 0     → Chaque dimanche à minuit
0 18 * * 1-5  → Lundi-vendredi à 18h
```

### 5. **📝 Historique**
Consulter les exécutions passées :
- Filtrer par territoire ou statut
- Voir le nombre de produits scrapés
- Voir la durée d'exécution
- Voir les erreurs

### 6. **📋 Logs**
Logs en temps réel du système :
- Actualisé automatiquement chaque 3 secondes
- Les 200 dernières lignes affichées
- Fond noir avec texte vert (style terminal)

### 7. **🔗 FastAPI**
Informations sur l'API :
- Liens vers Swagger UI (`/docs`)
- Liens vers ReDoc (`/redoc`)
- Statut du service
- Nombre de tâches en cours

---

## 🔌 API FastAPI - Endpoints

### Endpoints de Scraping

#### Lancer un scraping
```bash
POST /scrape
Content-Type: application/json

{
  "territory": "gp",
  "max_pages": 10,
  "min_delay": 1.5
}

Response:
{
  "task_id": "gp_1711270123.456",
  "status": "pending",
  "message": "Scraping lancé..."
}
```

#### Récupérer le statut d'une tâche
```bash
GET /task/{task_id}
```

#### Lister toutes les tâches
```bash
GET /tasks
GET /tasks?status=completed
```

#### Annuler une tâche
```bash
POST /task/{task_id}/cancel
```

---

### Endpoints de Configuration

#### Récupérer les configurations
```bash
GET /config
```

#### Sauvegarder une configuration
```bash
POST /config
Content-Type: application/json

{
  "key": "default_max_pages",
  "value": "15",
  "type": "integer"
}
```

---

### Endpoints de Planification

#### Récupérer les horaires
```bash
GET /schedule
```

#### Ajouter/Modifier un horaire
```bash
POST /schedule
Content-Type: application/json

{
  "cron_expression": "0 2 * * *",
  "enabled": true,
  "territories": ["gp", "mq"],
  "max_pages": 10
}
```

---

### Endpoints de Gestion des Jobs Cron

#### Lister les jobs planifiés
```bash
GET /jobs
```

#### Ajouter une tâche planifiée
```bash
POST /jobs/add
Content-Type: application/json

{
  "cron_expression": "0 2 * * *",
  "name": "Scraping quotidien Guadeloupe",
  "territories": ["gp"],
  "max_pages": 10,
  "enabled": true
}
```

#### Supprimer un job
```bash
DELETE /jobs/{job_id}
```

#### Démarrer le scheduler
```bash
POST /scheduler/start
```

#### Arrêter le scheduler
```bash
POST /scheduler/stop
```

#### État du scheduler
```bash
GET /scheduler/status
```

---

### Endpoints de Statistiques

#### Statistiques d'un territoire
```bash
GET /stats/{territory}

Response:
{
  "territory": "gp",
  "total_products": 1245,
  "avg_price": 25.50,
  "last_updated": "2024-03-25T12:30:00"
}
```

#### Récupérer les logs
```bash
GET /logs?lines=100
```

#### État du système
```bash
GET /system/status

Response:
{
  "service": "Kiprix Scraper API",
  "status": "ok",
  "version": "2.0.0",
  "running_tasks": 2,
  "total_tasks": 145
}
```

---

## 🗄️ Tables Laravel - Données Persistantes

### 1. `scraper_configurations`
Stocke les paramètres globaux du scraper

```sql
SELECT * FROM scraper_configurations;
```

**Colonnes** :
- `key` : Identifiant du paramètre
- `value` : Valeur (texte)
- `type` : Type (string, integer, boolean, json)
- `description` : Documentation

### 2. `scraper_schedules`
Gère les horaires de scraping planifiés

```sql
SELECT * FROM scraper_schedules;
```

**Colonnes** :
- `cron_expression` : Expression cron
- `territories` : Array JSON des territoires
- `max_pages` : Pages à scraper
- `enabled` : Actif ou non
- `last_executed_at` : Dernière exécution
- `next_execution_at` : Prochaine exécution

### 3. `scraper_execution_logs`
Historique complète de chaque exécution

```sql
SELECT * FROM scraper_execution_logs 
WHERE status = 'completed' 
ORDER BY created_at DESC;
```

**Colonnes** :
- `task_id` : ID unique de la tâche
- `status` : pending, running, completed, failed, cancelled
- `territory` : Territoire scrapé
- `total_products` : Produits trouvés
- `error_message` : Message d'erreur
- `duration_seconds` : Temps d'exécution
- `started_at`, `completed_at` : Timestamps

---

## 📈 Workflow Recommandé

### 1. **Configuration Initiale**
1. Accédez au Dashboard
2. Onglet **⚙️ Configuration** : Vérifiez les paramètres
3. Adaptez si nécessaire (délai, nombre de pages, etc.)

### 2. **Test Manuel**
1. Onglet **🚀 Lancer Scraping**
2. Choisissez un territoire et testez
3. Consultez les **📋 Logs** en temps réel
4. Vérifiez que les données sont correctement scrapées

### 3. **Configurer les Horaires**
1. Onglet **⏰ Horaires**
2. Ajoutez un nouvel horaire
3. Par exemple : Tous les jours à 2h du matin
4. Sélectionnez les territoires
5. Cliquez sur "Ajouter l'horaire"

### 4. **Surveillance Régulière**
1. Onglet **📊 Aperçu** : Vérifiez la santé du système
2. Onglet **📝 Historique** : Consultez les exécutions
3. Onglet **📋 Logs** : Regardez les logs en direct

---

## 🔧 Configuration Avancée

### Modifier les horaires Cron

La syntaxe Cron est : `minute heure jour mois jour-semaine`

```
# Tous les jours à 2h du matin
0 2 * * *

# Lundi à mercredi à 10h
0 10 * * 1-3

# Tous les lundis et vendredis à 18h
0 18 * * 1,5

# Chaque 6 heures
0 */6 * * *

# Les 5 premiers jours du mois à minuit
0 0 1-5 * *
```

### Arrêter le scheduler temporairement

```bash
# Via le dashboard ou l'API
POST /scheduler/stop

# Les tâches en cours se termineront, mais aucune nouvelle ne sera lancée
```

---

## ⚠️ Dépannage

### Le scraper ne démarre pas

1. Vérifiez que FastAPI est en cours d'exécution :
   ```bash
   docker logs kiprix_fastapi
   ```

2. Vérifiez les permissions réseau :
   ```bash
   curl http://localhost:8002/health
   ```

### Les tâches planifiées ne s'exécutent pas

1. Vérifiez que le scheduler est actif :
   ```bash
   curl http://localhost:8002/scheduler/status
   ```

2. Vérifiez l'expression Cron dans les logs
3. Assurez-vous que le serveur n'a pas redémarré (le scheduler se rédémarre automatiquement)

### Les données ne s'importent pas en base de données

1. Assurez-vous que PostgreSQL est en cours d'exécution
2. Vérifiez la connexion Laravel-PostgreSQL
3. Consultez les logs Laravel :
   ```bash
   docker logs kiprix_backend
   ```

---

## 📚 Ressources

- **Swagger UI** : http://localhost:8002/docs
- **ReDoc** : http://localhost:8002/redoc
- **APScheduler Docs** : https://apscheduler.readthedocs.io/
- **Cron Expression Generator** : https://crontab.guru/

---

## 🎯 Cas d'Usage

### Cas 1 : Scraper chaque nuit

1. Dashboard → **⏰ Horaires**
2. Nouvelle expression : `0 2 * * *` (2h du matin)
3. Territoires : Tous (gp, mq, re, gf)
4. Pages : 20
5. Ajouter et activer

### Cas 2 : Scraper toutes les heures

1. Dashboard → **⏰ Horaires**
2. Nouvelle expression : `0 * * * *` (toutes les heures)
3. Territoires : gp
4. Pages : 5 (moins de pages pour être plus rapide)
5. Ajouter

### Cas 3 : Lancer un scraping d'urgence

1. Dashboard → **🚀 Lancer Scraping**
2. Sélectionner le territoire
3. Augmenter les pages si nécessaire
4. Cliquer sur "🚀 Lancer le Scraping"
5. Suivre en temps réel

---

## ✅ Checklist d'Installation

- [ ] Docker Compose lancé (`docker compose up -d`)
- [ ] FastAPI accessible (http://localhost:8002/docs)
- [ ] Laravel accessible (http://localhost:8000/api/test)
- [ ] Next.js accessible (http://localhost:3000)
- [ ] Migration exécutée
- [ ] Seeder exécuté
- [ ] Utilisateur admin créé
- [ ] Dashboard accessible (/admin/scraper)
- [ ] Première tâche de scraping lancée
- [ ] Horaire Cron configuré

---

**Dernière mise à jour** : March 25, 2024
