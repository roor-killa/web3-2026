# Infrastructure CertiChain (Docker)

## Services prévus

| Service | Rôle |
|---------|------|
| **db** | **PostgreSQL** — persistance des certificats ; initialisation optionnelle via `init-db/*.sql` (schéma + données d’exemple au premier lancement du volume). |
| **api** | API **FastAPI** — certificats (CRUD) connectée à PostgreSQL, port hôte **8002**. |
| **backend** | API Laravel — logique métier, validation, exposition REST. |
| **frontend** | Next.js — interface utilisateur, appels à l’API. |
| **nginx** *(optionnel)* | Point d’entrée unique : `/api` → Laravel, `/` → Next.js. |

## Utilisation

Depuis ce dossier `infra/` :

```bash
docker compose up -d
```

Les services **db**, **api** (FastAPI) et **frontend** (Next.js) sont actifs par défaut. Quand les dossiers `../backend` et `../frontend` contiennent des projets Laravel et Next.js avec leurs `Dockerfile`, vous pouvez décommenter les services `backend`, `frontend` et `nginx` dans `docker-compose.yml` et adapter les chemins si nécessaire.

## Ports (évitent le chevauchement avec `bokaynou`)

- PostgreSQL : **15432** (hôte) → 5432 (conteneur) *(évite souvent les plages 54xx réservées sous Windows)*
- API FastAPI : **8002** (hôte) → 8000 (conteneur) — Swagger : http://localhost:8002/docs
- Front Next.js : **3000** (hôte) — interface CertiChain (création + liste)
