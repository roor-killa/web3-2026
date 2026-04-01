# ✅ Checklist de Démarrage - Scraper Admin Dashboard

## 🔴 Avant de Commencer

Assurez-vous que Docker et Docker Compose sont installés sur votre machine.

```bash
docker --version
docker compose --version
```

---

## 🟡 Phase 1 : Démarrage des Services (5-10 min)

### Étape 1 : Lancer Docker Compose
```bash
cd akonou/infra
docker compose up -d
```

### Étape 2 : Vérifier que tous les services sont actifs
```bash
docker compose ps
```

**Attendu** :
```
NAME                 STATUS
postgresql_db        Up (healthy)
kiprix_fastapi       Up
kiprix_backend       Up
nextjs_frontend      Up
nginx                Up
```

### Étape 3 : Vérifier la connectivité
```bash
# FastAPI
curl http://localhost:8002/health

# Laravel
curl http://localhost:8000/api/test

# Next.js
curl http://localhost:3000
```

---

## 🟢 Phase 2 : Initialisation Base de Données (2-3 min)

### Étape 1 : Exécuter les migrations
```bash
docker exec kiprix_backend php artisan migrate
```

**Output attendu** :
```
Migrating: 2026_03_25_create_scraper_configurations_table
Migrated: 2026_03_25_create_scraper_configurations_table (xxx ms)
```

### Étape 2 : Remplir les configurations initiales
```bash
docker exec kiprix_backend php artisan db:seed --class=ScraperConfigurationSeeder
```

**Output attendu** :
```
✓ Configurations du scraper initialisées
```

### Étape 3 : Vérifier les tables (optionnel)
```bash
docker exec -it postgresql_db psql -U kiprix -d kiprix_db
```

```sql
SELECT COUNT(*) FROM scraper_configurations;
SELECT COUNT(*) FROM scraper_schedules;
\dt scraper*
```

---

## 🟣 Phase 3 : Préparation de l'Utilisateur Admin (2-3 min)

### Créer un compte administrateur

#### Option A : Via l'interface
1. Allez sur http://localhost:3000
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire
4. Vous êtes créé en tant qu'utilisateur normal

#### Option B : Promouvoir via DB (plus rapide)
```bash
docker exec -it postgresql_db psql -U kiprix -d kiprix_db

UPDATE users SET is_admin = TRUE WHERE email = 'votre@email.com';
\q
```

#### Option C : Utiliser le compte test
Généralement fourni dans la configuration existante

---

## 🔵 Phase 4 : Accéder au Dashboard (1 min)

### Ouvrir le dashboard
```
URL: http://localhost:3000/admin/scraper
```

### Se connecter
- Email : votre email d'admin
- Password : votre mot de passe

### Si erreur 401 (Unauthorized)
- Vous n'êtes pas admin
- Exécutez la mise à jour DB (Option B ci-dessus)

---

## 📊 Phase 5 : Test Fonctionnel (5-10 min)

### Onglet 🚀 Lancer Scraping
1. Onglet **"Lancer Scraping"**
2. Remplir :
   - Territoire : **Guadeloupe (gp)**
   - Pages : **3** (test rapide)
   - Délai : **1.5**
3. Cliquer **"Lancer le Scraping"**
4. Suivre l'exécution (actualise automat.)

### Vérifier le statut
- **Status** → "completed" ou "failed"
- **Produits trouvés** → Devrait être > 0
- Parcourez les **📋 Logs** si erreur

### Onglet ⏰ Horaires
1. Aller à l'onglet **"Horaires"**
2. Nouveau horaire :
   - Expression Cron : `0 2 * * *` (2h du matin)
   - Nom : "Scraping nocturne"
   - Territoires : Guadeloupe
   - Pages : 10
   - Actif : ✅
3. Cliquer **"Ajouter l'horaire"**
4. Vérifier qu'il apparaît dans la liste

### Vérifier APScheduler
```bash
curl http://localhost:8002/scheduler/status
```

**Attendu** :
```json
{
  "running": true,
  "jobs_count": 1,
  "jobs": [
    {
      "id": "scraping_0_2_*_*_*",
      "name": "Scraping 0 2 * * *"
    }
  ]
}
```

---

## ⚙️ Phase 6 : Configuration (2-3 min)

### Onglet ⚙️ Configuration
1. Cliquez sur le créyon à côté d'une config
2. Modifier la valeur
3. Cliquer la coche ✓
4. Vérifier que c'est sauvegardé ✅

### Configurations disponibles
- `default_territory` → Territoire par défaut
- `default_max_pages` → Pages par défaut
- `default_delay` → Délai par défaut
- `retry_attempts` → Tentatives en erreur
- `timeout_seconds` → Timeout requête

---

## 📊 Phase 7 : Monitoring (Continu)

### Chaque jour
1. Dashboard → **📊 Aperçu**
2. Vérifier la santé (% succès)
3. Consulter les tâches récentes

### Chaque semaine
1. **📝 Historique** → Tendances
2. **🔗 FastAPI** → Vérifier logs
3. **⏰ Horaires** → Ajuster si besoin

### En cas de problème
1. **📋 Logs** → Chercher l'erreur
2. Redémarrer FastAPI :
   ```bash
   docker restart kiprix_fastapi
   ```
3. Ou redémarrer tout :
   ```bash
   cd akonou/infra
   docker compose restart
   ```

---

## ✅ Checklist Sommaire

### Avant de démarrer
- [ ] Docker installé et actif
- [ ] Port 8002, 8000, 3000, 15432 disponibles

### Phase 1
- [ ] `docker compose up -d` exécuté
- [ ] `docker compose ps` affiche 5 services Up
- [ ] Services répondent aux curls

### Phase 2
- [ ] Migration exécutée avec succès
- [ ] Seeder exécuté
- [ ] Tables créées dans PostgreSQL

### Phase 3
- [ ] Utilisateur admin créé ou promu
- [ ] Email et mot de passe connus

### Phase 4
- [ ] Dashboard accessible
- [ ] Connexion réussie
- [ ] Aucune erreur 401

### Phase 5
- [ ] Scraping test lancé
- [ ] Produits trouvés
- [ ] Horaire Cron ajouté
- [ ] APScheduler actif

### Phase 6
- [ ] Configuration modifiée (au moins une)
- [ ] Modifications persistées

### Phase 7
- [ ] Monitoring configuré
- [ ] Plan de maintenance établi

---

## 🆘 Troubleshooting Rapide

### "404 - Page not found" sur /admin/scraper
→ Vérifiez que vous êtes connecté ET admin

### "Connexion refusée" sur FastAPI
→ `docker logs kiprix_fastapi`

### Scheduler ne démarre pas
→ `curl -X POST http://localhost:8002/scheduler/start`

### Base de données corruptée
→ `docker compose down && docker volume rm infra_postgresql_data && docker compose up -d`

### Migrations en erreur (déjà appliquées)
→ C'est normal, elles sont idempotentes

### Seeder en erreur (déjà exécuté)
→ C'est normal, utilise `updateOrCreate`

---

## 📞 Support

Si vous rencontrez un problème :

1. **Consultez les logs** :
   ```bash
   docker logs <container_name> -f
   ```

2. **Testez l'API directement** :
   ```bash
   curl -X GET http://localhost:8002/system/status
   ```

3. **Vérifiez la DB** :
   ```bash
   docker exec -it postgresql_db psql -U kiprix -d kiprix_db
   SELECT * FROM scraper_configurations LIMIT 1;
   ```

4. **Lisez la documentation** :
   - `SCRAPER_ADMIN_GUIDE.md` - Complet
   - `SCRAPER_COMMANDS.md` - Commandes rapides

---

## ⏱️ Temps Estimé Total

| Phase | Temps |
|-------|-------|
| Services | 5-10 min |
| DB Init | 2-3 min |
| User Setup | 2-3 min |
| Dashboard | 1 min |
| Test | 5-10 min |
| Config | 2-3 min |
| **Total** | **20 min** |

---

**🎉 Vous êtes prêt à administrer le scraper Kiprix !**
