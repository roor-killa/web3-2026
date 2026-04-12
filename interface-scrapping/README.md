## Interface Scrapping

Frontend Next.js connecte a l'API KaribDocs.

### 1) Configurer l'URL API

Creer un fichier `.env.local` a la racine du projet:

```env
NEXT_PUBLIC_KARIBDOCS_API_URL=http://localhost:8000
```

### 2) Lancer le frontend

```bash
npm install
npm run dev
```

### 3) Pages principales

- `/login`: connexion sur `POST /auth/login`
- `/register`: inscription sur `POST /auth/register`
- `/dashboard`: scraping RCI via `POST /scraping/rci`
- `/dashboard/data`: liste des documents via `GET /documents`, upload, suppression et réindexation
- `/dashboard/drive`: connexion Google Drive via `/drive/connect`, `/drive/files` et `/drive/sync/{file_id}`
- `/dashboard/chatbot`: chatbot RAG via `/chat/ask` avec historique des sessions `/chat/sessions`


