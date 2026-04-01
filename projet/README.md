
Etapes pour lancer le projet PRODUIT

1. Prerequis
- Installer Docker Desktop (ou Docker Engine + Docker Compose).
- Verifier que Docker est bien demarre.

2. Se placer a la racine du projet
- Ouvrir un terminal dans le dossier `projet/`.

3. Construire et lancer les services
- Depuis la racine, executer :

```bash
docker compose -f infra/docker-compose.yml up --build -d
```

4. Verifier que les conteneurs tournent
- Executer :

```bash
docker compose -f infra/docker-compose.yml ps
```

5. Acceder a l'application
- Frontend Produit : http://localhost
- Dashboard scraping : http://localhost/scrap/dashboard

6. Arreter le projet
- Executer :

```bash
docker compose -f infra/docker-compose.yml down
```




Etapes pour lancer le projet SCRAPING 

UNIQUEMENT LANCER LE FRONTEND DONC LE NEXTJS ET NGINX 