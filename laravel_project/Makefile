.PHONY: help build up down restart logs shell composer artisan migrate fresh seed test clear

help: ## Afficher cette aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Construire les conteneurs Docker
	docker-compose build

up: ## Démarrer les conteneurs
	docker-compose up -d

down: ## Arrêter les conteneurs
	docker-compose down

restart: down up ## Redémarrer les conteneurs

logs: ## Afficher les logs
	docker-compose logs -f

shell: ## Accéder au shell du conteneur app
	docker-compose exec app bash

composer: ## Installer les dépendances Composer
	docker-compose exec app composer install

artisan: ## Exécuter une commande Artisan (make artisan cmd="make:controller Test")
	docker-compose exec app php artisan $(cmd)

migrate: ## Exécuter les migrations
	docker-compose exec app php artisan migrate

fresh: ## Réinitialiser la base de données et migrer
	docker-compose exec app php artisan migrate:fresh

seed: ## Exécuter les seeders
	docker-compose exec app php artisan db:seed

test: ## Lancer les tests
	docker-compose exec app php artisan test

clear: ## Nettoyer le cache
	docker-compose exec app php artisan cache:clear
	docker-compose exec app php artisan config:clear
	docker-compose exec app php artisan route:clear
	docker-compose exec app php artisan view:clear

install: build up composer ## Installation complète du projet
	docker-compose exec app php artisan key:generate
	docker-compose exec app php artisan migrate
	@echo "\n✅ Installation terminée ! Application disponible sur http://localhost:8000"

setup-permissions: ## Configurer les permissions des dossiers
	docker-compose exec app chown -R laravel:www-data /var/www/storage
	docker-compose exec app chmod -R 775 /var/www/storage
	docker-compose exec app chmod -R 775 /var/www/bootstrap/cache
