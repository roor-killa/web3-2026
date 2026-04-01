# Séance 1 : Docker - Introduction (60 min)

## 🎯 Objectifs de la session
- Comprendre les concepts fondamentaux de Docker
- Installer et configurer Docker Desktop
- Créer un environnement Laravel avec docker-compose
- Maîtriser les commandes Docker de base

---

## 💻 Partie 2 : Installation Docker Desktop (10 min)

### Prérequis système
- **Windows** : Windows 10/11 Pro, Enterprise ou Education (WSL2)
- **Mac** : macOS 11+
- **Linux** : Kernel 3.10+

### Étapes d'installation

#### Windows
1. Télécharger : https://www.docker.com/products/docker-desktop
2. Installer Docker Desktop
3. Activer WSL2 si demandé
4. Redémarrer l'ordinateur
5. Vérifier l'installation :
```bash
docker --version
docker-compose --version
```

#### Mac
1. Télécharger Docker Desktop pour Mac
2. Glisser dans Applications
3. Lancer Docker Desktop
4. Vérifier :
```bash
docker --version
docker-compose --version
```

#### Linux (Ubuntu/Debian)
```bash
# Installation Docker
sudo apt update
sudo apt install docker.io docker-compose

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Redémarrer la session
newgrp docker

# Vérifier
docker --version
docker-compose --version
```

### ✅ Test d'installation
```bash
docker run hello-world
```

Si vous voyez "Hello from Docker!", c'est bon ! ✨

---