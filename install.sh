#!/bin/bash

# =====================================================
# Installation & Démarrage Automatique
# =====================================================

set -e

echo "🕷️ Initialisation du système Kiprix Scraper..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Vérifier les prérequis
echo -e "${BLUE}[1/5]${NC} Vérification des prérequis..."

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 n'est pas installé${NC}"
    exit 1
fi

if ! command -v php &> /dev/null; then
    echo -e "${RED}❌ PHP n'est pas installé${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prérequis validés${NC}"
echo ""

# Installation FastAPI
echo -e "${BLUE}[2/5]${NC} Installation des dépendances Python (FastAPI)..."
cd akonou/projet
pip install -r requirements.txt > /dev/null 2>&1
echo -e "${GREEN}✅ FastAPI prêt${NC}"
echo ""

# Installation Laravel
echo -e "${BLUE}[3/5]${NC} Installation des dépendances Laravel..."
cd ../back-laravel
composer install > /dev/null 2>&1
npm install > /dev/null 2>&1
cp .env.example .env
php artisan key:generate --force > /dev/null 2>&1
echo -e "${GREEN}✅ Laravel prêt${NC}"
echo ""

# Installation Next.js
echo -e "${BLUE}[4/5]${NC} Installation des dépendances Next.js..."
cd ../front-next
npm install > /dev/null 2>&1
echo -e "${GREEN}✅ Next.js prêt${NC}"
echo ""

# Configuration
echo -e "${BLUE}[5/5]${NC} Configuration..."
cd ../..
cp akonou/.env.example .env 2>/dev/null || true
echo -e "${GREEN}✅ Configuration complète${NC}"
echo ""

echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Installation terminée avec succès !${NC}"
echo -e "${GREEN}═══════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}📋 Prochaines étapes:${NC}"
echo ""
echo "1️⃣  Démarrer les services (4 terminaux):"
echo ""
echo "   Terminal 1 (FastAPI):"
echo "   cd akonou/projet"
echo "   python -m uvicorn fastapi_app:app --reload"
echo ""
echo "   Terminal 2 (Laravel API):"
echo "   cd akonou/back-laravel"
echo "   php artisan migrate"
echo "   php artisan serve"
echo ""
echo "   Terminal 3 (Laravel Scheduler):"
echo "   cd akonou/back-laravel"
echo "   php artisan schedule:work"
echo ""
echo "   Terminal 4 (Next.js Frontend):"
echo "   cd akonou/front-next"
echo "   npm run dev"
echo ""
echo "2️⃣  Accéder à:"
echo "   - Dashboard: ${BLUE}http://localhost:3000/scraper${NC}"
echo "   - API Docs: ${BLUE}http://localhost:8000/docs${NC}"
echo ""

echo -e "${YELLOW}📖 Documentation:${NC}"
echo "   - Architecture: ARCHITECTURE.md dans akonou/projet/"
echo "   - QuickStart: QUICKSTART.md à la racine"
echo ""
