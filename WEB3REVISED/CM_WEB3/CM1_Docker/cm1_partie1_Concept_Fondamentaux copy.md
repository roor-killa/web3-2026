# Séance 1 : Docker - Introduction (60 min)

## 🎯 Objectifs de la session
- Comprendre les concepts fondamentaux de Docker
- Installer et configurer Docker Desktop
- Créer un environnement Laravel avec docker-compose
- Maîtriser les commandes Docker de base

---

## 📚 Partie 1 : Concepts fondamentaux (15 min)

### Pourquoi Docker ?

**Problème classique :**
- "Ça marche sur ma machine !" 😅
- Configurations différentes entre développeurs
- Difficultés d'installation (PHP, MySQL, extensions...)
- Conflits de versions

**Solution Docker :**
- Environnement identique pour tous
- Installation simple et rapide
- Isolation complète des projets
- Portabilité totale

### Les 3 concepts clés

#### 1️⃣ **Image Docker**
```
📦 IMAGE = Modèle / Recette de cuisine
```
- Template en lecture seule
- Contient tout le nécessaire : OS, PHP, extensions, configurations
- Exemples : `php:8.2-fpm`, `mysql:8.0`, `nginx:alpine`

**Analogie :** Une image est comme un **moule à gâteau** 🍰

#### 2️⃣ **Conteneur Docker**
```
🏃 CONTENEUR = Instance en exécution d'une image
```
- Version "vivante" d'une image
- Isolé des autres conteneurs
- Peut être démarré, arrêté, supprimé
- Léger et rapide

**Analogie :** Un conteneur est comme le **gâteau** que vous faites avec le moule

#### 3️⃣ **Volume Docker**
```
💾 VOLUME = Espace de stockage persistant
```
- Permet de conserver les données entre redémarrages
- Partage de fichiers entre hôte et conteneur
- Exemples : code source, base de données

**Analogie :** Un volume est comme un **placard** qui reste même quand vous nettoyez la cuisine

### Architecture Docker pour Laravel

```
┌─────────────────────────────────────┐
│   DOCKER COMPOSE                    │
│                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────┐│
│  │   PHP   │  │  MySQL  │  │ PMA ││
│  │  8.2    │←→│   8.0   │←→│     ││
│  └────┬────┘  └─────────┘  └─────┘│
│       ↓                             │
│  ┌─────────┐                       │
│  │  Code   │ (Volume partagé)      │
│  │ Laravel │                       │
│  └─────────┘                       │
└─────────────────────────────────────┘
```

---
