# CertiChain — Frontend (Next.js)

Interface pour **créer un certificat** et afficher la liste, en appelant l’API (`POST` / `GET` `/api/certificates`).

## Sans Docker

1. Lancer la base + API : depuis `../infra/`, `docker compose up -d db api` (ou toute la stack).
2. Copier l’exemple d’environnement :  
   `copy .env.local.example .env.local` (Windows) ou `cp .env.local.example .env.local`
3. Installer et démarrer :

```bash
npm install
npm run dev
```

Ouvrir **http://localhost:3000**.

## Avec Docker (front inclus)

Depuis `../infra/` :

```bash
docker compose up -d --build
```

Puis **http://localhost:3000** (API sur **http://localhost:8002**).

## Variable d’environnement

| Variable | Exemple | Rôle |
|----------|---------|------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8002` | URL de base de l’API vue **par le navigateur** (machine hôte). |
