# Frontend Next.js

Application frontend Next.js pour le projet Web3 2026.

## Développement local (sans Docker)

```bash
npm install
npm run dev
```

## Variables d'environnement

- `NEXT_PUBLIC_API_URL`: URL du backend Laravel (défaut: http://laravel_nginx:80)

## Structure

```
frontend-nextjs/
├── app/              # Pages Next.js (App Router)
├── Dockerfile        # Configuration Docker
└── package.json      # Dépendances
```
