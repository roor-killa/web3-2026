# CertiChain — Frontend Next.js

Interface utilisateur de l'application **CertiChain**, permettant à une école de publier et consulter des certificats numériques avec preuve blockchain.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS**
- Appels API via `fetch` vers le backend Laravel

## Pages

| Route | Description |
|---|---|
| `/certificates` | Liste de tous les certificats |
| `/certificates/create` | Formulaire de création d'un certificat |
| `/certificates/[id]` | Détail d'un certificat |

## Lancer en développement (Docker)

```bash
# Depuis la racine du projet
docker compose up --build

# Migrations (première fois)
docker compose exec laravel_app php artisan migrate
```

Frontend accessible sur : **http://localhost:3000**

## Variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
