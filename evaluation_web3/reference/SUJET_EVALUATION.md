# SUJET D’ÉVALUATION — WEB3

**Application CertiChain – Certificats numériques**

- Durée : 1 heure  
- Niveau : Licence 2e année  
- Documents : notes de cours autorisées — travail individuel  
- **Technologies :** Next.js · Laravel · Docker · PostgreSQL — **Total 100 points**

## Contexte du projet

Vous devez concevoir la base d’une application Web3 appelée **CertiChain**, destinée à permettre à une école de **publier et consulter** des certificats numériques. L’application est composée d’un **frontend en Next.js**, d’une **API backend en Laravel**, d’une **base de données PostgreSQL** et d’un **environnement conteneurisé avec Docker**.

L’objectif n’est pas de coder toute l’application, mais de montrer votre compréhension de **l’architecture**, du **rôle de chaque technologie**, et des **principes Web3**.

---

## Partie 1 — Compréhension de l’architecture / 20 pts

### Question 1 – Rôle des technologies (10 pts)

Expliquez brièvement le rôle de chacune des technologies suivantes dans le projet :

- Next.js  
- Laravel  
- PostgreSQL  
- Docker  

**Attendu :** 2 à 4 lignes par technologie.

### Question 2 – Architecture de l’application (10 pts)

Proposez une architecture simple de l’application en précisant :

- quel composant gère l’interface utilisateur,  
- quel composant gère la logique métier,  
- quel composant stocke les données,  
- comment les composants communiquent entre eux.  

Vous pouvez répondre sous forme de texte ou de schéma simple.

---

## Partie 2 — Modélisation fonctionnelle / 20 pts

L’application doit permettre d’**ajouter un certificat**, de **consulter la liste** des certificats et de **consulter le détail** d’un certificat.

Un certificat contient :

- un identifiant  
- le nom de l’étudiant  
- l’intitulé de la certification  
- la date d’émission  
- un hash blockchain ou identifiant de preuve  

### Question 3 – Table PostgreSQL (10 pts)

Proposez une structure de table PostgreSQL nommée **`certificates`**.  
Vous préciserez : le nom des colonnes, leur type, la clé primaire.

### Question 4 – Routes API Laravel (10 pts)

Donnez **deux routes API Laravel** adaptées à ce besoin :

- une route pour **créer** un certificat,  
- une route pour **récupérer la liste** des certificats.  

Pour chaque route : **méthode HTTP**, **URL**, **rôle**.

---

## Partie 3 — Approche Web3 / 20 pts

### Question 5 – Apport de la logique Web3 (10 pts)

Dans ce projet, expliquez ce qu’apporte la logique Web3 par rapport à une application web classique.  
Votre réponse devra mentionner au moins :

- la notion de **preuve** ou de **traçabilité**,  
- le rôle possible de la **blockchain**,  
- la différence entre une donnée stockée **en base** et une donnée **vérifiable publiquement**.

### Question 6 – Hash vs données complètes sur blockchain (10 pts)

On ne stocke pas toujours le certificat complet sur la blockchain. Expliquez **pourquoi** il peut être préférable de stocker seulement un **hash** ou une **preuve** sur la blockchain, plutôt que **toutes les données** du certificat.

---

## Partie 4 — Docker et déploiement local / 20 pts

### Question 7 – Intérêt de Docker (10 pts)

Expliquez l’intérêt d’utiliser Docker dans ce projet.  
Votre réponse doit mentionner au moins **deux avantages concrets**.

### Question 8 – Services Docker du projet (10 pts)

Dans un environnement Docker, citez les **conteneurs ou services** que vous mettriez en place pour ce projet. Précisez **en une phrase** le rôle de chaque service.  
*Exemple attendu :* frontend, backend, base de données, etc.

---

## Partie 5 — Exercice pratique / Réflexion technique / 20 pts

### Question 9 – Affichage des certificats Next.js ↔ Laravel (10 pts)

On souhaite afficher dans **Next.js** la **liste des certificats** récupérés depuis **Laravel**.  
Décrivez les grandes étapes :

- côté Laravel,  
- côté Next.js,  
- côté affichage.  

Aucun code complet n’est demandé, mais votre réponse doit être **structurée**.

### Question 10 – PostgreSQL vs Blockchain – analyse critique (10 pts)

*« PostgreSQL suffit, la blockchain ne sert à rien dans CertiChain. »*  
Êtes-vous d’accord avec cet étudiant ? Justifiez votre réponse en **5 à 8 lignes**.

---

## Barème (rappel)

| Partie | Thème | Points |
|--------|--------|--------|
| 1 | Compréhension de l’architecture | 20 |
| 2 | Modélisation fonctionnelle | 20 |
| 3 | Approche Web3 | 20 |
| 4 | Docker et déploiement local | 20 |
| 5 | Exercice pratique / Réflexion technique | 20 |
| **TOTAL** | | **100** |

**Aucun code complet n’est attendu** — les réponses doivent démontrer la compréhension des concepts et de l’architecture.

## Consignes de rendu

Remettre un fichier **README.md** contenant l’ensemble de vos réponses (selon les modalités de votre enseignant). Nom de fichier type : **`NOM_Prénom_web3.md`**. Chaque réponse doit être clairement associée à sa question.
