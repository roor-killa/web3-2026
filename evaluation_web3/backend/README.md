# CertiChain — Backend (Laravel API)

Rôle dans le projet : logique métier, validation des certificats, routes REST (`certificates`), accès PostgreSQL.

## Démarrage suggéré (hors Docker)

Créer un projet Laravel dans ce dossier ou y copier une base depuis les cours, puis :

- migration table `certificates` (voir consigne d’évaluation) ;
- modèle + contrôleur API + routes `api.php` ;
- `DB_*` pointant vers la base (locale ou conteneur `db` du compose).

## Intégration Docker

Ajouter un `Dockerfile` (voir `bokaynou/back-laravel`), puis décommenter le service `backend` dans `../infra/docker-compose.yml`.
