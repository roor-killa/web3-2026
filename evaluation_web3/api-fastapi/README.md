# CertiChain — API FastAPI + base de données

API REST pour la table **`certificates`** : création, liste, détail. La **base de données** est soit **PostgreSQL** (Docker ou installation locale), soit **SQLite** (fichier `data/certichain.db`, sans serveur).

## Stack base de données

| Mode | `DATABASE_URL` | Détails |
|------|----------------|--------|
| **PostgreSQL + Docker** | `...@db:5432/...` dans Compose ; `...@localhost:15432/...` sur l’hôte | Volume persistant + scripts SQL dans `infra/init-db/` (schéma + lignes d’exemple au **premier** démarrage du volume). |
| **SQLite** | `sqlite:///./data/certichain.db` | Aucun conteneur requis ; le dossier `data/` est créé au démarrage de l’API. |

## Prérequis

- **Recommandé :** `infra/docker-compose.yml` lance **PostgreSQL** (port **15432** sur l’hôte) + l’API (**8002**).
- **Sans Docker :** uniquement Python 3.12+ et une URL SQLite dans `.env`.

## Variables d’environnement

Copier `.env.example` vers `.env`.

- **API dans Docker :** `DATABASE_URL=postgresql://certichain:certichain_secret@db:5432/certichain`
- **API sur l’hôte, PostgreSQL dans Docker :** `...@localhost:15432/certichain`
- **Sans PostgreSQL :** `DATABASE_URL=sqlite:///./data/certichain.db`

## Lancer avec Docker (PostgreSQL inclus)

Depuis `evaluation_web3/infra/` :

```bash
docker compose up -d --build
```

L’API : **http://localhost:8002** — documentation : **http://localhost:8002/docs**  
Vérifier la base : **http://localhost:8002/health/db** (`database: connected`).

## Lancer en local (Python)

```bash
cd api-fastapi
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8002
```

## Exemples

```bash
curl -s http://localhost:8002/health
curl -s http://localhost:8002/health/db

curl -s -X POST http://localhost:8002/api/certificates ^
  -H "Content-Type: application/json" ^
  -d "{\"student_name\":\"Dupont\",\"certification_title\":\"Web3\",\"issued_at\":\"2026-04-01\",\"blockchain_hash\":\"0xabc123\"}"

curl -s http://localhost:8002/api/certificates
```

(Sous PowerShell, préférez `Invoke-RestMethod` ou des guillemets simples pour le JSON.)

## Endpoints

| Méthode | URL | Description |
|--------|-----|-------------|
| GET | `/health` | Santé du service |
| GET | `/health/db` | Test de connexion à la base |
| POST | `/api/certificates` | Créer un certificat |
| GET | `/api/certificates` | Liste (pagination `skip`, `limit`) |
| GET | `/api/certificates/{id}` | Détail |

La table est créée automatiquement au démarrage si elle n’existe pas (`SQLAlchemy.metadata.create_all`). Avec Docker, `infra/init-db/01-certificates.sql` peut aussi créer la table et insérer des exemples **lors de la création du volume** PostgreSQL.
