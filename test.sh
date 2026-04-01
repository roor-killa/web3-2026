#!/usr/bin/env bash

# Script de vérification de l'installation - Teste chaque composant

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║       🧪 TEST COMPLET - Kiprix Scraper System                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

PASSED=0
FAILED=0

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

test_command() {
    local description=$1
    local command=$2
    
    echo -ne "${BLUE}[TEST]${NC} $description ... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC}"
        ((FAILED++))
    fi
}

test_file_exists() {
    local description=$1
    local file=$2
    
    echo -ne "${BLUE}[TEST]${NC} Fichier: $file ... "
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC}"
        ((FAILED++))
    fi
}

# ============================================================
# Tests Prérequis
# ============================================================

echo -e "${YELLOW}1️⃣  Vérification des Prérequis${NC}"
echo ""

test_command "Python3 installé" "python3 --version"
test_command "PHP installé" "php --version"
test_command "Node.js/npm installé" "npm --version"
test_command "Git installé" "git --version"

echo ""

# ============================================================
# Tests Fichiers Créés
# ============================================================

echo -e "${YELLOW}2️⃣  Vérification des Fichiers Créés${NC}"
echo ""

test_file_exists "FastAPI app" "akonou/projet/fastapi_app.py"
test_file_exists "Laravel ScraperURL Model" "akonou/back-laravel/app/Models/ScraperURL.php"
test_file_exists "Laravel ScrapingResult Model" "akonou/back-laravel/app/Models/ScrapingResult.php"
test_file_exists "ScraperURLController" "akonou/back-laravel/app/Http/Controllers/ScraperURLController.php"
test_file_exists "ScrapingController" "akonou/back-laravel/app/Http/Controllers/ScrapingController.php"
test_file_exists "ExecuteScrapingTasks Command" "akonou/back-laravel/app/Console/Commands/ExecuteScrapingTasks.php"
test_file_exists "Console Kernel" "akonou/back-laravel/app/Console/Kernel.php"
test_file_exists "Dashboard React" "akonou/front-next/app/scraper/page.tsx"
test_file_exists "Architecture Docs" "akonou/projet/ARCHITECTURE.md"
test_file_exists "QuickStart Docs" "QUICKSTART.md"
test_file_exists "Docker Compose" "akonou/docker-compose-scraper.yml"
test_file_exists ".env Example" "akonou/.env.example"

echo ""

# ============================================================
# Tests Dépendances Python
# ============================================================

echo -e "${YELLOW}3️⃣  Vérification des Dépendances Python${NC}"
echo ""

test_command "FastAPI disponible" "python3 -c 'import fastapi'"
test_command "Uvicorn disponible" "python3 -c 'import uvicorn'"
test_command "Pydantic disponible" "python3 -c 'import pydantic'"
test_command "BeautifulSoup4 disponible" "python3 -c 'import bs4'"
test_command "PostgreSQL driver disponible" "python3 -c 'import psycopg2'"

echo ""

# ============================================================
# Tests Configuration Larvel
# ============================================================

echo -e "${YELLOW}4️⃣  Vérification Configuration Laravel${NC}"
echo ""

if [ -f "akonou/back-laravel/.env" ]; then
    echo -ne "${BLUE}[TEST]${NC} Laravel .env existe ... "
    echo -e "${GREEN}✅${NC}"
    ((PASSED++))
else
    echo -ne "${BLUE}[TEST]${NC} Laravel .env existe ... "
    echo -e "${RED}❌${NC} (Créez-le: cp .env.example .env)"
    ((FAILED++))
fi

test_command "Laravel key généré" "grep 'APP_KEY=' akonou/back-laravel/.env | grep -v '^#'"

echo ""

# ============================================================
# Tests Contenu Fichiers
# ============================================================

echo -e "${YELLOW}5️⃣  Vérification du Contenu Clé${NC}"
echo ""

test_command "FastAPI /scrape endpoint" "grep '@app.post(\"/scrape\")' akonou/projet/fastapi_app.py"
test_command "Laravel routes /api/scraper" "grep 'scraper' akonou/back-laravel/routes/api.php"
test_command "React Dashboard exists" "grep 'ScraperDashboard' akonou/front-next/app/scraper/page.tsx"
test_command "Cron Command exists" "grep 'class ExecuteScrapingTasks' akonou/back-laravel/app/Console/Commands/ExecuteScrapingTasks.php"

echo ""

# ============================================================
# Résumé
# ============================================================

echo -e "${YELLOW}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Tous les tests sont passés !${NC}"
    echo ""
    echo "La structure du système est correcte."
    echo ""
    echo "Prochaines étapes:"
    echo ""
    echo "  1️⃣  Configurez .env pour la Base de Données"
    echo ""
    echo "  2️⃣  Démarrez les services (voir start.sh)"
    echo ""
    echo "  3️⃣  Accédez au Dashboard"
    echo "     http://localhost:3000/scraper"
    echo ""
else
    echo -e "${RED}⚠️  Certains tests ont échoué${NC}"
    echo ""
    echo "Points à vérifier:"
    echo "  - Installez les dépendances manquantes"
    echo "  - Vérifiez que tous les fichiers sont créés"
    echo "  - Lisez QUICKSTART.md et ARCHITECTURE.md"
    echo ""
fi

echo ""
