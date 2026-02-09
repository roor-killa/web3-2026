# Backend FastAPI (POO)

Backend FastAPI pour le cours de POO.

## Développement local (sans Docker)

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

## Documentation API

Une fois le serveur démarré, accédez à:
- Swagger UI: http://localhost:8001/docs
- ReDoc: http://localhost:8001/redoc

## Variables d'environnement

- `DATABASE_URL`: URL de connexion PostgreSQL

## Structure

```
fastapi-poo/
├── main.py              # Point d'entrée de l'application
├── requirements.txt     # Dépendances Python
└── Dockerfile          # Configuration Docker
```
