# CertiChain — Backend Laravel

API REST de l'application **CertiChain**, gérant la logique métier et la persistance des certificats numériques.

## Stack

- **Laravel 12** (PHP 8.4)
- **Laravel Sanctum** (authentification API)
- **PostgreSQL 16** (via Docker)
- **Nginx** (reverse proxy)

## Endpoints API

| Méthode | URL | Description |
|---|---|---|
| `GET` | `/api/certificates` | Liste tous les certificats |
| `GET` | `/api/certificates/{id}` | Détail d'un certificat |
| `POST` | `/api/certificates` | Créer un certificat |
| `DELETE` | `/api/certificates/{id}` | Supprimer un certificat |

### Exemple de body POST

```json
{
  "student_name": "Marie Dupont",
  "title": "Licence en Développement Web",
  "issued_at": "2026-04-01",
  "blockchain_hash": "0xabc123..."
}
```

## Structure

```
app/
├── Http/Controllers/CertificateController.php
├── Models/Certificate.php
database/migrations/
└── 2026_04_01_..._create_certificates_table.php
routes/api.php
```

## Lancer via Docker

```bash
docker compose up --build
docker compose exec laravel_app php artisan migrate
```

API accessible sur : **http://localhost:8080/api**
