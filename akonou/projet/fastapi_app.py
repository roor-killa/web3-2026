"""
API FastAPI pour le Scraper Kiprix - Backend de scraping

Expose des endpoints pour :
- Lancer un scraping
- Récupérer les données
- Gérer les tâches en cours
- Consulter les logs
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
import json
from datetime import datetime
from pathlib import Path
import os
import sys

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# S'assurer que le dossier de logs existe avant configuration logging
os.makedirs("logs", exist_ok=True)

from src.scrapers.kiprix_scraper import KiprixScraper

# ========== CONFIGURATION ==========
app = FastAPI(
    title="Kiprix Scraper API",
    description="API pour scraper et analyser les prix Kiprix",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("logs/fastapi.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Variables globales pour tracker les tâches
scraping_tasks = {}

# ========== MODÈLES PYDANTIC ==========

class ScrapeRequest(BaseModel):
    """Requête de scraping"""
    territory: str = "gp"  # gp, mq, re, gf
    max_pages: int = 10
    min_delay: float = 1.5

class ScrapingStatus(BaseModel):
    """Statut d'une tâche de scraping"""
    task_id: str
    status: str  # pending, running, completed, failed
    territory: str
    pages_scraped: int
    total_products: int
    started_at: str
    completed_at: Optional[str] = None
    error: Optional[str] = None

class ScrapingStats(BaseModel):
    """Statistiques de scraping"""
    territory: str
    total_products: int
    last_scraped: Optional[str]
    avg_price_france: float
    avg_price_dom: float
    categories: List[str]

# ========== ROUTES ==========

@app.get("/")
async def root():
    """Endpoint de santé"""
    return {
        "status": "ok",
        "service": "Kiprix Scraper API",
        "version": "1.0.0"
    }

@app.get("/territories")
async def get_territories():
    """Liste des territoires disponibles"""
    return {
        "territories": {
            "gp": "Guadeloupe",
            "mq": "Martinique",
            "re": "La Réunion",
            "gf": "Guyane"
        }
    }

@app.post("/scrape")
async def start_scraping(request: ScrapeRequest, background_tasks: BackgroundTasks):
    """
    Lance un scraping en arrière-plan
    
    Args:
        request: Configuration du scraping (territoire, nb pages, délai)
    
    Returns:
        task_id pour tracker la progression
    """
    task_id = f"{request.territory}_{datetime.now().timestamp()}"
    
    try:
        # Créer le scraper
        scraper = KiprixScraper(territory=request.territory, delay=request.min_delay)
        
        # Initialiser le statut
        scraping_tasks[task_id] = {
            "status": "running",
            "territory": request.territory,
            "pages_scraped": 0,
            "total_products": 0,
            "started_at": datetime.now().isoformat(),
            "completed_at": None,
            "error": None
        }
        
        # Ajouter au background
        background_tasks.add_task(
            _run_scraping,
            task_id=task_id,
            scraper=scraper,
            max_pages=request.max_pages
        )
        
        logger.info(f"Scraping lancé : {task_id}")
        return {
            "task_id": task_id,
            "status": "pending",
            "message": f"Scraping de {request.territory} lancé en arrière-plan"
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Erreur au lancement du scraping : {e}")
        raise HTTPException(status_code=500, detail="Erreur interne du serveur")

@app.get("/scrape/status/{task_id}")
async def get_scraping_status(task_id: str):
    """Récupère le statut d'une tâche de scraping"""
    if task_id not in scraping_tasks:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    
    return scraping_tasks[task_id]

@app.get("/data/{territory}")
async def get_territory_data(territory: str, limit: int = 100):
    """Récupère les données scrapées pour un territoire depuis les fichiers JSON"""
    try:
        # Charger depuis les fichiers JSON générés
        json_file = f"data/raw/kiprix_{territory}.json"
        
        if not os.path.exists(json_file):
            return {
                "territory": territory,
                "total_products": 0,
                "products": []
            }
        
        with open(json_file, "r") as f:
            products = json.load(f)
        
        # Limiter le nombre de résultats
        limited_products = products[:limit] if isinstance(products, list) else []
        
        return {
            "territory": territory,
            "total_products": len(products) if isinstance(products, list) else 0,
            "products": limited_products
        }
            
    except Exception as e:
        logger.error(f"Erreur lecture données : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats/{territory}")
async def get_territory_stats(territory: str):
    """Récupère les statistiques d'un territoire depuis les fichiers JSON"""
    try:
        json_file = f"data/raw/kiprix_{territory}.json"

        if not os.path.exists(json_file):
            return {
                "territory": territory,
                "total_products": 0,
                "avg_price": 0,
                "last_updated": datetime.now().isoformat()
            }

        with open(json_file, "r") as f:
            products = json.load(f)

        total = len(products) if isinstance(products, list) else 0
        prices = [
            p.get("price", 0)
            for p in products
            if isinstance(p, dict) and isinstance(p.get("price"), (int, float))
        ]
        avg_price = sum(prices) / len(prices) if prices else 0

        return {
            "territory": territory,
            "total_products": total,
            "avg_price": round(avg_price, 2),
            "last_updated": datetime.now().isoformat()
        }

    except Exception as e:
        logger.error(f"Erreur stats : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/logs")
async def get_logs(lines: int = 100):
    """Récupère les derniers logs"""
    log_file = Path("logs/fastapi.log")
    
    if not log_file.exists():
        return {"logs": [], "total_lines": 0}
    
    try:
        with open(log_file, "r") as f:
            all_lines = f.readlines()
        
        # Dernières N lignes
        recent_lines = all_lines[-lines:]
        return {
            "logs": recent_lines,
            "total_lines": len(all_lines)
        }
    except Exception as e:
        logger.error(f"Erreur lecture logs : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== FONCTION DE SCRAPING EN ARRIÈRE-PLAN ==========

async def _run_scraping(task_id: str, scraper: KiprixScraper, max_pages: int):
    """Exécute le scraping en arrière-plan"""
    try:
        logger.info(f"Démarrage du scraping : {task_id}")
        
        # Lancer le scraper
        data = scraper.scrape(max_pages=max_pages)
        
        # Sauvegarder en JSON
        output_file = f"data/raw/kiprix_{scraper.territory}.json"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        with open(output_file, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        # Note: Sauvegarder en BDD PostgreSQL se fait via l'API Laravel
        # L'API FastAPI envoie les données à Laravel qui gère l'insertion
        
        # Mettre à jour le statut
        scraping_tasks[task_id].update({
            "status": "completed",
            "total_products": len(data),
            "completed_at": datetime.now().isoformat()
        })
        
        logger.info(f"Scraping complété : {task_id} ({len(data)} produits)")
        
    except Exception as e:
        logger.error(f"Erreur scraping {task_id} : {e}")
        scraping_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })

# ========== DÉMARRAGE ==========

if __name__ == "__main__":
    import uvicorn
    
    # Créer répertoire logs
    os.makedirs("logs", exist_ok=True)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
