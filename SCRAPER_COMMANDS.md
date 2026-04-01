# 🚀 Commandes Essentielles - Gestion du Scraper

## Démarrage et Arrêt

### Démarrer tous les services
```bash
cd akonou/infra
docker compose up -d
```

### Arrêter tous les services
```bash
cd akonou/infra
docker compose down
```

### Voir l'état des services
```bash
cd akonou/infra
docker compose ps
```

### Afficher les logs d'un service
```bash
# FastAPI
docker logs kiprix_fastapi -f

# Laravel
docker logs kiprix_backend -f

# Next.js
docker logs nextjs_frontend -f

# PostgreSQL
docker logs postgresql_db -f
```

---

## Migration et Seeding - Laravel

### Exécuter les migrations
```bash
docker exec kiprix_backend php artisan migrate
```

### Exécuter les seeders
```bash
docker exec kiprix_backend php artisan db:seed
```

### Rollback migrations
```bash
docker exec kiprix_backend php artisan migrate:rollback
```

### Voir le statut des migrations
```bash
docker exec kiprix_backend php artisan migrate:status
```

---

## FastAPI - Gestion du Scheduler

### Démarrer le scheduler
```bash
curl -X POST http://localhost:8002/scheduler/start
```

### Arrêter le scheduler
```bash
curl -X POST http://localhost:8002/scheduler/stop
```

### Voir le statut du scheduler
```bash
curl http://localhost:8002/scheduler/status
```

### Lancer un scraping manuel
```bash
curl -X POST http://localhost:8002/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "territory": "gp",
    "max_pages": 10,
    "min_delay": 1.5
  }'
```

### Récupérer le statut d'une tâche
```bash
curl http://localhost:8002/task/{task_id}
```

### Lister tous les jobs planifiés
```bash
curl http://localhost:8002/jobs
```

### Ajouter un job planifié
```bash
curl -X POST http://localhost:8002/jobs/add \
  -H "Content-Type: application/json" \
  -d '{
    "cron_expression": "0 2 * * *",
    "name": "Scraping quotidien Guadeloupe",
    "territories": ["gp"],
    "max_pages": 10,
    "enabled": true
  }'
```

### Supprimer un job
```bash
curl -X DELETE http://localhost:8002/jobs/{job_id}
```

---

## Base de Données - PostgreSQL

### Accéder à PostgreSQL
```bash
docker exec -it postgresql_db psql -U kiprix -d kiprix_db
```

### Consulter les configurations
```sql
SELECT key, value, type FROM scraper_configurations;
```

### Consult les horaires
```sql
SELECT * FROM scraper_schedules;
```

### Voir l'historique des exécutions
```sql
SELECT * FROM scraper_execution_logs ORDER BY created_at DESC LIMIT 10;
```

### Voir les statistiques par territoire
```sql
SELECT 
  territory,
  COUNT(*) as total_executions,
  COUNT(CASE WHEN status='completed' THEN 1 END) as successfulexecutions,
  AVG(total_products) as avg_products,
  MAX(created_at) as last_execution
FROM scraper_execution_logs
GROUP BY territory;
```

### Supprimer les anciens logs (plus vieux que 30 jours)
```sql
DELETE FROM scraper_execution_logs 
WHERE created_at < NOW() - INTERVAL '30 days';
```

---

## Frontend Next.js

### Linter et formater
```bash
cd akonou/front-next
npm run lint
npm run lint -- --fix
```

### Construire l'image Docker
```bash
cd akonou/front-next
docker build -t kiprix_frontend:latest .
```

### Reconstruire depuis zéro
```bash
docker compose up --build nextjs_frontend
```

---

## Troubleshooting

### Port déjà utilisé
```bash
# Trouver quel processus utilise le port 8002
lsof -i :8002

# Ou sur Windows PowerShell
Get-Process | Where-Object {$_.Handles -match "8002"}
```

### Docker container ne démarre pas
```bash
# Afficher l'erreur
docker logs <container_name>

# Reconstruire l'image
docker compose up --build <service_name>
```

### Base de données non accessible
```bash
# Vérifier que PostgreSQL est en cours d'exécution
docker ps | grep postgresql

# Redémarrer PostgreSQL
docker restart postgresql_db
```

### Scheduler pas actif
```bash
# Vérifier les logs FastAPI
docker logs kiprix_fastapi | grep -i scheduler

# Redémarrer le conteneur FastAPI
docker restart kiprix_fastapi
```

---

## Tests API

### Santé du système
```bash
curl http://localhost:8002/health
```

### Info système
```bash
curl http://localhost:8002/system/status
```

### Récupérer les logs (50 dernières lignes)
```bash
curl "http://localhost:8002/logs?lines=50"
```

### Récupérer les données scrapées
```bash
curl "http://localhost:8002/data/{territory}?limit=100"
```

### Récupérer les statistiques
```bash
curl http://localhost:8002/stats/{territory}
```

---

## Documentation Interactive

- **Swagger UI** : http://localhost:8002/docs
- **ReDoc** : http://localhost:8002/redoc
- **API test** : http://localhost:8000/api/test

---

## Exemple : Configuration Complète avec Cron

```bash
# 1. Configurer les paramètres par défaut
curl -X POST http://localhost:8002/config \
  -H "Content-Type: application/json" \
  -d '{
    "key": "default_max_pages",
    "value": "15",
    "type": "integer"
  }'

# 2. Ajouter 3 tâches planifiées
curl -X POST http://localhost:8002/jobs/add \
  -H "Content-Type: application/json" \
  -d '{
    "cron_expression": "0 2 * * *",
    "name": "Scraping quotidien",
    "territories": ["gp", "mq"],
    "max_pages": 10,
    "enabled": true
  }'

curl -X POST http://localhost:8002/jobs/add \
  -H "Content-Type: application/json" \
  -d '{
    "cron_expression": "0 6 * * *",
    "name": "Scraping matin",
    "territories": ["re", "gf"],
    "max_pages": 5,
    "enabled": true
  }'

curl -X POST http://localhost:8002/jobs/add \
  -H "Content-Type: application/json" \
  -d '{
    "cron_expression": "*/6 * * * *",
    "name": "Scraping rapide (toutes les 6h)",
    "territories": ["gp"],
    "max_pages": 3,
    "enabled": false
  }'

# 3. Démarrer le scheduler
curl -X POST http://localhost:8002/scheduler/start

# 4. Vérifier
curl http://localhost:8002/scheduler/status
```

---

**💾 Sauvegarde** : Pensez à sauvegarder régulièrement votre base de données PostgreSQL
```bash
docker exec postgresql_db pg_dump -U kiprix kiprix_db > backup.sql
```

**📤 Restauration**
```bash
docker exec -i postgresql_db psql -U kiprix kiprix_db < backup.sql
```
