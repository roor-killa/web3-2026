# 🤖 Guide d'Utilisation du Chatbot Kiprix

## 🎯 Accés au Chatbot

1. **URL**: http://localhost:3000/admin/scraper
2. **Onglet**: Cliquez sur **🤖 Chatbot** dans la barre de navigation
3. **Prêt**: L'interface de chat s'affiche

## 💬 Comment Poser des Questions

### Méthode 1: Écrire Directement
```
1. Cliquez dans la zone de texte
2. Tapez votre question en français ou anglais
3. Appuyez sur "Entrée" OU cliquez sur "📤 Envoyer"
4. Le chatbot répond en quelques secondes
```

### Méthode 2: Utiliser les Suggestions
```
Cliquez directement sur une question pré-écrite dans la section 
"💡 Suggestions de Questions" pour l'envoyer automatiquement
```

## 📝 Exemples de Questions Fonctionnelles

### 🏥 Santé du Système
```
✓ "Comment va le système?"
✓ "Quel est le statut?"
✓ "La santé du scraper c'est bon?"
✓ "How is the system?" (anglais)
✓ "Is it healthy?"
```

Réponse: État général, taux de succès, nombre d'exécutions

### ⚙️ Configurations
```
✓ "Quelles sont les configurations?"
✓ "Montre-moi la config"
✓ "Configuration actuelle"
✓ "What are the settings?"
✓ "Show me config"
```

Réponse: Liste complète des paramètres avec descriptions

### ⏰ Horaires Planifiés
```
✓ "Quels horaires sont planifiés?"
✓ "Montre-moi les crons"
✓ "Horaires de scraping"
✓ "When are scrapings scheduled?"
✓ "Show me schedules"
```

Réponse: Crons, territoires associés, pages max

### 📝 Historique d'Exécutions
```
✓ "Montre-moi l'historique"
✓ "Dernières exécutions"
✓ "Quand c'était la dernière fois?"
✓ "Show me the history"
✓ "Last executions"
```

Réponse: Dernières 5 exécutions avec statuts, durées, erreurs

### 🗺️ Territoires
```
✓ "Quel est le statut des territoires?"
✓ "Comment vont les territoires?"
✓ "Montre-moi GP, MQ, RE, GF"
✓ "Territory status"
✓ "How are the territories?"
```

Réponse: Statut par territoire (Guadeloupe, Martinique, Réunion, Guyane)

### ❓ Aide du Chatbot
```
✓ "Aide"
✓ "Qu'est-ce que tu peux faire?"
✓ "Comment ça marche?"
✓ "Help"
✓ "What can you do?"
```

Réponse: Liste des capacités du chatbot

## 🎮 Contrôles Clavier

| Touche | Action |
|--------|--------|
| **Entrée** | Envoyer le message |
| **Maj + Entrée** | Nouvelle ligne dans la zone de texte |
| **(Clic bouton)** | Envoyer manuellement |

## 🛠️ Fonctionnalités

### ✨ Fonctionnalités Disponibles
- ✅ Chat en temps réel avec réponses instantanées
- ✅ Support français ET anglais
- ✅ Indicateur de frappe (points animés)
- ✅ Auto-scroll vers les nouveaux messages
- ✅ Timestamps sur chaque message
- ✅ Boutons de suggestions pré-remplies
- ✅ Bouton "Effacer Chat" pour réinitialiser
- ✅ Interface responsive (marche sur mobile)

### 🔄 Échange de Messages
```
┌─────────────────────────────┐
│  🤖 Chatbot - Réponse        │
│  [avec données en temps réel]│
│                             │
│           Votre question 👤 │
│  [texte dans votre couleur]  │
│                             │
│  🤖 Chatbot - Réponse        │
└─────────────────────────────┘
```

## 📊 Données Accédées par le Chatbot

Le chatbot peut accéder à **toutes les données du scraper**:
- Configurations stockées
- Horaires planifiés (crons)
- Historique des exécutions (10 dernières)
- Statistiques de santé
- Informations par territoire
- Logs d'erreurs

## ⚡ Conseils d'Utilisation

### ✅ À Faire
```
✓ Poser des questions naturelles
✓ Mélanger français et anglais
✓ Être précis ("Montre-moi le statut du GP")
✓ Utiliser les suggestions si vous ne savez pas quoi demander
✓ Rafraîchir si vous trouvez que les données ne sont pas à jour
```

### ❌ À Éviter
```
✗ Questions très compliquées (ex: "Peux-tu modifier X ET lancer Y?")
✗ Formulations trop obscures
✗ Questions sur des sujets non-scrapeur
✗ Attendre une action (acheter, télécharger) - infos seulement
```

## 🔧 Troubleshooting

### Q: "Le chatbot ne répond pas"
**R**: 
1. Vérifiez la connexion Internet (localhost:8000)
2. Vérifiez les logs: `docker logs laravel_backend`
3. Redémarrez: `docker restart laravel_backend`

### Q: "Les données ne sont pas à jour"
**R**:
1. Les données sont chargées **au moment** de poser la question
2. Pour les plus récentes données: Actualiser la page
3. Le chatbot accède au BD directo → données toujours actuelles

### Q: "Impossible de charger l'onglet Chatbot"
**R**:
1. Vérifiez que vous êtes sur: http://localhost:3000/admin/scraper
2. Attendez que le Next.js rebuild (vercheck les logs frontend)
3. Forcer update: Clique droit → "Actualiser" ou Ctrl+F5

### Q: "Message d'erreur en réponse"
**R**:
1. Vérifiez que Laravel est running: `docker ps`
2. Consultez les logs: `docker exec laravel_backend tail -50 storage/logs/laravel.log`
3. Assurez-vous que les migrations ont tournées: `docker exec laravel_backend php artisan migrate:status`

## 💡 Cas d'Usage Réels

### Exemple 1: Vérifier Rapidement la Santé
```
User: "Ça va?"
Bot: "Status: ✅ Sain, 10 récentes executions, taux: 100%"
→ Vous savez immédiatement si tout fonctionne
```

### Exemple 2: Trouver les Problèmes
```
User: "Historique"
Bot: "Montre 5 dernières exécutions avec erreurs"
→ Identification rapide des soucis
```

### Exemple 3: Vérifier une Configuration
```
User: "Config"
Bot: "Montre toutes les settings actuelles"
→ Pas besoin d'aller dans l'onglet Configuration
```

### Exemple 4: Planifier du Scraping
```
User: "Quand lance-t-on le scraping?"
Bot: "Montre tous les horaires planifiés"
→ Vérification rapide avant modifications

---

**Version**: 1.0  
**Dernière mise à jour**: 25 Mars 2026  
**Support**: Posez n'importe quelle question au chatbot dans le dashboard!