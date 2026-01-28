# Cours Laravel L2 - Détails des Sessions

## 2. Structure Laravel (40 min)

### 📋 Objectifs d'apprentissage
À la fin de cette session, les étudiants seront capables de :
- Naviguer efficacement dans l'arborescence d'un projet Laravel
- Comprendre le rôle de chaque dossier principal
- Expliquer le pattern MVC et son implémentation dans Laravel
- Identifier où placer leur code selon sa fonction

---

### 🎯 Partie 1 : Exploration des dossiers (15 min)

#### Introduction (3 min)
*"Laravel suit une structure organisée qui peut sembler complexe au début, mais chaque dossier a un rôle précis. Pensez à Laravel comme une ville bien organisée : chaque quartier a sa fonction."*

#### Les dossiers essentiels (12 min)

**1. `/app` - Le cœur de votre application**
```
app/
├── Http/
│   ├── Controllers/     → Vos contrôleurs (logique métier)
│   ├── Middleware/      → Filtres de requêtes
│   └── Requests/        → Validation des données
├── Models/              → Vos modèles (interaction BDD)
└── Providers/           → Configuration des services
```

**Exemple concret :**
```php
// app/Models/Product.php
class Product extends Model
{
    // Représente une table 'products' dans la base
}

// app/Http/Controllers/ProductController.php
class ProductController extends Controller
{
    // Gère les requêtes liées aux produits
}
```

**2. `/routes` - Les portes d'entrée**
```
routes/
├── web.php      → Routes pour pages web (sessions, cookies)
├── api.php      → Routes pour API (JSON, stateless)
└── console.php  → Commandes artisan personnalisées
```

**Analogie :** *"C'est comme le standard téléphonique de votre application : il dirige chaque demande vers le bon service."*

**3. `/database` - Tout ce qui concerne la BDD**
```
database/
├── migrations/  → Scripts de création/modification de tables
├── seeders/     → Données de test/démonstration
└── factories/   → Générateurs de fausses données
```

**4. `/config` - La configuration**
```
config/
├── database.php → Connexion base de données
├── app.php      → Paramètres généraux
└── cors.php     → Configuration CORS pour API
```

**5. Autres dossiers importants**
- `/public` → Point d'entrée (index.php) et fichiers publics (CSS, JS, images)
- `/resources/views` → Templates Blade (si vous faites du rendu côté serveur)
- `/storage` → Fichiers générés, logs, uploads
- `/vendor` → Dépendances Composer (NE JAMAIS MODIFIER)

#### 🔨 Exercice pratique (temps inclus)
```bash
# Dans votre terminal
php artisan list  # Découvrir les commandes disponibles
php artisan route:list  # Voir toutes les routes
php artisan make:model Product  # Créer un modèle
```
*Observer où chaque fichier est créé dans l'arborescence*
