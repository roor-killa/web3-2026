# 🔐 Sanctum - Guide Pratique des Endpoints

## ✅ Installation Complétée

Les éléments suivants ont été mis en place:

- ✅ Package `laravel/sanctum` installé
- ✅ Table `personal_access_tokens` créée (migrations exécutées)
- ✅ Trait `HasApiTokens` ajouté au modèle `User`
- ✅ Contrôleur `AuthController` configuré
- ✅ Routes d'authentification configurées

---

## 🔗 Endpoints Disponibles

### 🔓 **Routes Publiques (sans authentification)**

#### 1. Enregistrement (Register)
```
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
}
```

**Réponse (201 Created)**:
```json
{
    "message": "Utilisateur créé avec succès",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2026-03-04T14:30:00Z",
        "updated_at": "2026-03-04T14:30:00Z"
    }
}
```

---

#### 2. Connexion (Login)
```
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

**Réponse (200 OK)**:
```json
{
    "message": "Connexion réussie",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2026-03-04T14:30:00Z",
        "updated_at": "2026-03-04T14:30:00Z"
    }
}
```

**⚠️ IMPORTANT**: Sauvegardez le token `access_token` !

---

### 🔒 **Routes Protégées (nécessitent authentification)**

Pour toutes les routes protégées, ajoutez le header:
```
Authorization: Bearer <access_token>
```

#### 3. Récupérer l'utilisateur courant
```
GET /api/auth/user
Authorization: Bearer <access_token>
```

**Réponse**:
```json
{
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "created_at": "2026-03-04T14:30:00Z",
        "updated_at": "2026-03-04T14:30:00Z"
    }
}
```

---

#### 4. Lister tous les tokens de l'utilisateur
```
GET /api/auth/tokens
Authorization: Bearer <access_token>
```

**Réponse**:
```json
{
    "tokens": [
        {
            "id": 1,
            "name": "auth_token",
            "created_at": "2026-03-04T14:30:00Z",
            "last_used_at": "2026-03-04T14:35:00Z"
        }
    ]
}
```

---

#### 5. Déconnexion (révoquer le token courant)
```
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Réponse**:
```json
{
    "message": "Déconnecté avec succès"
}
```

**Après cette commande, le token ne fonctionne plus!**

---

#### 6. Révoquer un token spécifique
```
DELETE /api/auth/tokens/{tokenId}
Authorization: Bearer <access_token>
```

**Obtenir l'ID du token**: Utilisez `GET /api/auth/tokens`

**Réponse**:
```json
{
    "message": "Token révoqué avec succès"
}
```

---

#### 7. Révoquer TOUS les tokens
```
POST /api/auth/logout-all
Authorization: Bearer <access_token>
```

**Réponse**:
```json
{
    "message": "Tous les tokens ont été révoqués"
}
```

**⚠️ ATTENTION**: Cela déconnecte de tous les appareils!

---

## 🧪 Tester avec cURL

### 1️⃣ Enregistrement
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### 2️⃣ Connexion
```bash
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }' | jq -r '.access_token')

echo "Token: $TOKEN"
```

### 3️⃣ Utiliser le token
```bash
curl -X GET http://localhost:8080/api/auth/user \
  -H "Authorization: Bearer $TOKEN"
```

### 4️⃣ Déconnexion
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Tester avec Postman

### Étape 1: Créer une nouvelle collection

1. Ouvrir Postman
2. Cliquer sur "New" → "Collection"
3. Nommer: "Web3 API - Sanctum"

### Étape 2: Ajouter une variable d'environnement

1. Cliquer sur l'engrenage (Settings)
2. Ajouter une variable: `api_token` = (vide pour l'instant)

### Étape 3: Créer les requêtes

#### Request 1: Register
- **Nom**: Register
- **Méthode**: POST
- **URL**: `http://localhost:8080/api/auth/register`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "name": "Bob",
    "email": "bob@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```

#### Request 2: Login
- **Nom**: Login
- **Méthode**: POST
- **URL**: `http://localhost:8080/api/auth/login`
- **Headers**: 
  - `Content-Type: application/json`
- **Body** (raw JSON):
  ```json
  {
    "email": "bob@example.com",
    "password": "password123"
  }
  ```
- **Script (Tests tab)**:
  ```javascript
  var jsonData = pm.response.json();
  pm.environment.set("api_token", jsonData.access_token);
  ```

#### Request 3: Get Current User
- **Nom**: Get User
- **Méthode**: GET
- **URL**: `http://localhost:8080/api/auth/user`
- **Headers**: 
  - `Authorization: Bearer {{api_token}}`

#### Request 4: Logout
- **Nom**: Logout
- **Méthode**: POST
- **URL**: `http://localhost:8080/api/auth/logout`
- **Headers**: 
  - `Authorization: Bearer {{api_token}}`

---

## 🛡️ Erreurs Courantes

### Erreur 422: Validation Failed
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": ["The email field is required."]
    }
}
```

**Solution**: Vérifier que tous les champs requis sont présents.

---

### Erreur 401: Unauthenticated
```json
{
    "message": "Unauthenticated."
}
```

**Causes**:
- Token absent ou incorrect
- Header `Authorization` mal formaté
- Token expiré/révoqué

**Solution**:
```bash
# Vérifier le header
Authorization: Bearer eyJhbGciOiJI... # Vérifier que c'est "Bearer", pas "Token"

# Obtenir un nouveau token avec /api/auth/login
```

---

### Erreur 419: Token Mismatch
```json
{
    "message": "CSRF token mismatch."
}
```

**Solution**: Ajouter le header CSRF (généralement géré par les clients modernes)

---

## 📊 Flux Complet d'Authentification

```
┌─────────────────────────────────────────────────────────┐
│ CLIENT (Next.js/React)                                  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ 1️⃣ POST /api/auth/register
                  ├─────────────────────────────────────────>
                  │
┌─────────────────┴───────────────────────────────────────┐
│ SERVEUR (Laravel)                                       │
│ - Valider l'input                                       │
│ - Hasher le mot de passe                               │
│ - Créer l'utilisateur dans 'users' table               │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Réponse (201): Utilisateur créé
                  │<─────────────────────────────────────────
                  │
                  │ 2️⃣ POST /api/auth/login
                  ├─────────────────────────────────────────>
                  │
┌─────────────────┴───────────────────────────────────────┐
│ SERVEUR (Laravel)                                       │
│ - Trouver l'utilisateur par email                      │
│ - Vérifier le mot de passe (Hash::check)              │
│ - Créer un token (createToken)                         │
│ - Insérer dans 'personal_access_tokens' table         │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Réponse (200): Bearer Token
                  │<─────────────────────────────────────────
                  │  Sauvegarde: localStorage.setItem('token')
                  │
                  │ 3️⃣ GET /api/auth/user
                  │ Header: Authorization: Bearer <token>
                  ├─────────────────────────────────────────>
                  │
┌─────────────────┴───────────────────────────────────────┐
│ SERVEUR (Laravel)                                       │
│ - Middleware 'auth:sanctum' valide le token           │
│ - Cherche dans 'personal_access_tokens'               │
│ - Vérifie la signature                                 │
│ - Récupère l'utilisateur associé                      │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Réponse (200): Données utilisateur
                  │<─────────────────────────────────────────
                  │
                  │ 4️⃣ POST /api/auth/logout
                  │ Header: Authorization: Bearer <token>
                  ├─────────────────────────────────────────>
                  │
┌─────────────────┴───────────────────────────────────────┐
│ SERVEUR (Laravel)                                       │
│ - Supprimer le token de 'personal_access_tokens'      │
└─────────────────┬───────────────────────────────────────┘
                  │
                  │ Réponse (200): Déconnecté
                  │<─────────────────────────────────────────
                  │  Supprimer: localStorage.removeItem('token')
```

---

## 🚀 Prochaines Étapes

1. ✅ **Tester les endpoints** avec cURL ou Postman
2. ✅ **Connecter Next.js** frontend au backend
3. ✅ **Ajouter les scopes** (permissions par token)
4. ✅ **Implémenter refresh tokens**
5. ✅ **Configurer CORS** pour le frontend

---

## 📚 Ressources

- [Laravel Sanctum Documentation](https://laravel.com/docs/11.x/sanctum)
- [API Token Generation](https://laravel.com/docs/11.x/sanctum#token-generation)

---

**Configuration Sanctum Complétée** ✅  
**Testez les endpoints maintenant!** 🚀
