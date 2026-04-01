# Scripts d’initialisation PostgreSQL

Les fichiers `*.sql` placés ici sont exécutés **une seule fois** lors de la **création du volume** de données (premier `docker compose up`).

Si vous avez déjà un volume existant sans ces tables, soit :

- recréez le volume : `docker compose down -v` puis `docker compose up -d` (**perte des données**),
- soit créez les tables à la main ou laissez l’API FastAPI les créer au démarrage (`create_all`).

L’application reste utilisable même sans ces scripts : SQLAlchemy crée la table `certificates` automatiquement.
