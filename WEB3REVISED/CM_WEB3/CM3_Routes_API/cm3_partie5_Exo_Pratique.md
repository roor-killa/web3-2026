### 🎯 Partie 5 : Exercice pratique (10 min)

**Créer une API complète pour un système de blog**

```php
// À faire en live-coding avec les étudiants:

// 1. Créer le modèle
php artisan make:model Article -m

// 2. Définir la migration
Schema::create('articles', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->text('content');
    $table->string('author');
    $table->boolean('published')->default(false);
    $table->timestamps();
});

// 3. Créer le contrôleur
php artisan make:controller ArticleController --api

// 4. Définir les routes
Route::prefix('v1')->group(function () {
    Route::apiResource('articles', ArticleController::class);
    
    // Route custom pour articles publiés
    Route::get('articles/published', [ArticleController::class, 'published']);
});

// 5. Implémenter les méthodes dans le contrôleur
// Les étudiants codent:
// - index() avec filtres (published, author)
// - store() avec validation
// - show()
// - update()
// - destroy()
// - published() méthode custom
```

---

### ✅ Récapitulatif & Best Practices (5 min)

#### Checklist pour créer une API

- [ ] Utiliser `routes/api.php`
- [ ] Suivre la convention RESTful
- [ ] Utiliser `apiResource` pour les CRUD standards
- [ ] Valider toutes les entrées utilisateur
- [ ] Retourner les bons codes HTTP
- [ ] Grouper les routes logiquement
- [ ] Protéger les routes sensibles avec middleware
- [ ] Documenter vos endpoints (postman/swagger)

#### Pattern de réponse standardisée

```php
// Succès
return response()->json([
    'success' => true,
    'data' => $products,
    'message' => 'Produits récupérés avec succès'
], 200);

// Erreur
return response()->json([
    'success' => false,
    'message' => 'Produit non trouvé',
    'errors' => []
], 404);
```

#### Pour le projet de semestre

```markdown
Votre API devra:
1. Gérer au moins 3 ressources (ex: produits, catégories, commandes)
2. Implémenter l'authentification (Laravel Sanctum)
3. Avoir des routes protégées et publiques
4. Valider toutes les données entrantes
5. Retourner des erreurs cohérentes
6. Être testée avec Postman
7. Être documentée
```

---

## 📚 Ressources complémentaires

**Documentation officielle:**
- Structure Laravel: https://laravel.com/docs/structure
- Routing: https://laravel.com/docs/routing
- Controllers: https://laravel.com/docs/controllers
- Validation: https://laravel.com/docs/validation

**Exercices pour la semaine:**
1. Créer une API complète pour gérer une bibliothèque (livres, auteurs, emprunts)
2. Implémenter des filtres et recherche
3. Ajouter des validations personnalisées
4. Tester avec Postman et documenter

**Prochaine session:** 
- Eloquent ORM et relations entre modèles
- Authentication avec Laravel Sanctum

---

*Bokaynou ! Des questions ?* 🚀