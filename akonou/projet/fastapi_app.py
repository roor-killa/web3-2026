"""
API FastAPI pour le Scraper Kiprix - Backend de scraping

Expose des endpoints pour :
- Lancer un scraping
- Récupérer les données
- Gérer les tâches en cours
- Consulter les logs
- Configurer le scraper
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
from threading import Thread
import threading

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# S'assurer que le dossier de logs existe avant configuration logging
os.makedirs("logs", exist_ok=True)
os.makedirs("config", exist_ok=True)

from src.scrapers.kiprix_scraper import KiprixScraper
from src.scheduler import get_scheduler

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
running_task_ids = set()  # IDs des tâches actuellement en cours
task_cancel_flags = {}  # Flags pour annuler les tâches

# ========== MODÈLES PYDANTIC ==========

class ScrapeRequest(BaseModel):
    """Requête de scraping"""
    territory: str = "gp"  # gp, mq, re, gf
    max_pages: int = 10
    min_delay: float = 1.5

class ScrapingStatus(BaseModel):
    """Statut d'une tâche de scraping"""
    task_id: str
    status: str  # pending, running, completed, failed, cancelled
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

class ScraperConfig(BaseModel):
    """Configuration du scraper"""
    enabled: bool = True
    default_territory: str = "gp"
    default_max_pages: int = 10
    default_delay: float = 1.5
    retry_attempts: int = 3
    timeout_seconds: int = 30
    notify_on_complete: bool = True
    notification_email: Optional[str] = None

class ScrapingSchedule(BaseModel):
    """Horaire de scraping"""
    cron_expression: str  # Ex: "*/30 * * * *" pour tous les 30 minutes
    enabled: bool = True
    territories: List[str] = ["gp"]
    max_pages: int = 10

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

# ========== NOUVEAUX ENDPOINTS DE GESTION ==========

@app.get("/tasks")
async def list_tasks(status: Optional[str] = None):
    """Liste toutes les tâches ou filtrées par statut"""
    if status:
        filtered = {k: v for k, v in scraping_tasks.items() if v.get("status") == status}
    else:
        filtered = scraping_tasks
    
    return {
        "total": len(filtered),
        "tasks": filtered
    }

@app.get("/task/{task_id}")
async def get_task(task_id: str):
    """Récupère le détail d'une tâche spécifique"""
    if task_id not in scraping_tasks:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    return scraping_tasks[task_id]

@app.post("/task/{task_id}/cancel")
async def cancel_task(task_id: str):
    """Annule une tâche en cours"""
    if task_id not in scraping_tasks:
        raise HTTPException(status_code=404, detail="Tâche non trouvée")
    
    task = scraping_tasks[task_id]
    if task["status"] not in ["running", "pending"]:
        raise HTTPException(status_code=400, detail=f"Impossible d'annuler une tâche {task['status']}")
    
    # Marquer pour annulation
    task_cancel_flags[task_id] = True
    task["status"] = "cancelled"
    task["completed_at"] = datetime.now().isoformat()
    
    logger.info(f"Tâche annulée : {task_id}")
    return {"message": "Tâche annulée", "task_id": task_id}

@app.get("/config")
async def get_config():
    """Récupère la configuration actuelle"""
    try:
        config_file = Path("config/scraper_config.json")
        
        if config_file.exists():
            with open(config_file, "r") as f:
                return json.load(f)
        
        # Configuration par défaut
        default_config = {
            "enabled": True,
            "default_territory": "gp",
            "default_max_pages": 10,
            "default_delay": 1.5,
            "retry_attempts": 3,
            "timeout_seconds": 30,
            "notify_on_complete": False,
            "notification_email": None
        }
        return default_config
        
    except Exception as e:
        logger.error(f"Erreur lecture config : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/config")
async def save_config(config: ScraperConfig):
    """Sauvegarde la configuration"""
    try:
        config_file = Path("config/scraper_config.json")
        config_file.parent.mkdir(exist_ok=True)
        
        with open(config_file, "w") as f:
            json.dump(config.dict(), f, indent=2)
        
        logger.info("Configuration sauvegardée")
        return {"message": "Configuration sauvegardée", "config": config.dict()}
        
    except Exception as e:
        logger.error(f"Erreur sauvegarde config : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/schedule")
async def get_schedule():
    """Récupère l'horaire de scraping"""
    try:
        schedule_file = Path("config/scraping_schedule.json")
        
        if schedule_file.exists():
            with open(schedule_file, "r") as f:
                return json.load(f)
        
        # Horaire par défaut
        default_schedule = {
            "cron_expression": "0 2 * * *",  # 2h du matin chaque jour
            "enabled": False,
            "territories": ["gp"],
            "max_pages": 10
        }
        return default_schedule
        
    except Exception as e:
        logger.error(f"Erreur lecture horaire : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/schedule")
async def save_schedule(schedule: ScrapingSchedule):
    """Sauvegarde l'horaire de scraping"""
    try:
        schedule_file = Path("config/scraping_schedule.json")
        schedule_file.parent.mkdir(exist_ok=True)
        
        with open(schedule_file, "w") as f:
            json.dump(schedule.dict(), f, indent=2)
        
        logger.info(f"Horaire sauvegardé : {schedule.cron_expression}")
        return {"message": "Horaire sauvegardé", "schedule": schedule.dict()}
        
    except Exception as e:
        logger.error(f"Erreur sauvegarde horaire : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/system/status")
async def system_status():
    """Récupère l'état générale du système"""
    return {
        "service": "Kiprix Scraper API",
        "status": "healthy",
        "version": "2.0.0",
        "uptime": datetime.now().isoformat(),
        "running_tasks": len([t for t in scraping_tasks.values() if t["status"] == "running"]),
        "total_tasks": len(scraping_tasks),
        "log_file": "logs/fastapi.log"
    }

@app.get("/health")
async def health_check():
    """Endpoint de santé simple"""
    return {"status": "ok"}

# ========== ENDPOINTS DE GESTION DES JOBS CRON ==========

@app.post("/jobs/add")
async def add_scheduled_job(schedule: ScrapingSchedule):
    """Ajoute une tâche de scraping planifiée"""
    try:
        scheduler = get_scheduler()
        
        # Générer un ID unique pour le job
        job_id = f"scraping_{schedule.cron_expression.replace(' ', '_')}"
        
        result = scheduler.add_scraping_job(
            cron_expression=schedule.cron_expression,
            territories=schedule.territories,
            max_pages=schedule.max_pages,
            job_id=job_id
        )
        
        if result["success"]:
            logger.info(f"Job ajouté via API : {job_id}")
            return result
        else:
            raise HTTPException(status_code=400, detail=result.get("error", "Erreur inconnue"))
            
    except Exception as e:
        logger.error(f"Erreur ajout job : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs")
async def list_scheduled_jobs():
    """Liste tous les jobs programmés"""
    try:
        scheduler = get_scheduler()
        jobs = scheduler.list_jobs()
        
        return {
            "total": len(jobs),
            "jobs": jobs,
        }
    except Exception as e:
        logger.error(f"Erreur listing jobs : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/jobs/{job_id}")
async def delete_scheduled_job(job_id: str):
    """Supprime une tâche planifiée"""
    try:
        scheduler = get_scheduler()
        result = scheduler.remove_scraping_job(job_id)
        
        if result["success"]:
            logger.info(f"Job supprimé via API : {job_id}")
            return result
        else:
            raise HTTPException(status_code=404, detail=result.get("error", "Job non trouvé"))
            
    except Exception as e:
        logger.error(f"Erreur suppression job : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scheduler/start")
async def start_scheduler():
    """Démarre le scheduler"""
    try:
        scheduler = get_scheduler()
        scheduler.start()
        
        logger.info("Scheduler démarré via API")
        return {
            "success": True,
            "message": "Scheduler démarré",
            "running": scheduler.scheduler.running,
        }
    except Exception as e:
        logger.error(f"Erreur démarrage scheduler : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/scheduler/stop")
async def stop_scheduler():
    """Arrête le scheduler"""
    try:
        scheduler = get_scheduler()
        scheduler.stop()
        
        logger.info("Scheduler arrêté via API")
        return {
            "success": True,
            "message": "Scheduler arrêté",
            "running": False,
        }
    except Exception as e:
        logger.error(f"Erreur arrêt scheduler : {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scheduler/status")
async def scheduler_status():
    """Récupère le statut du scheduler"""
    try:
        scheduler = get_scheduler()
        
        return {
            "running": scheduler.scheduler.running,
            "jobs_count": len(scheduler.scheduler.get_jobs()),
            "jobs": scheduler.list_jobs(),
        }
    except Exception as e:
        logger.error(f"Erreur statut scheduler : {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ========== FONCTION DE SCRAPING EN ARRIÈRE-PLAN ==========

async def _run_scraping(task_id: str, scraper: KiprixScraper, max_pages: int):
    """Exécute le scraping en arrière-plan avec support d'annulation"""
    try:
        running_task_ids.add(task_id)
        logger.info(f"Démarrage du scraping : {task_id}")
        
        # Lancer le scraper
        data = scraper.scrape(max_pages=max_pages)
        
        # Vérifier si l'annulation a été demandée
        if task_cancel_flags.get(task_id):
            scraping_tasks[task_id]["status"] = "cancelled"
            scraping_tasks[task_id]["completed_at"] = datetime.now().isoformat()
            logger.info(f"Scraping annulé : {task_id}")
            return
        
        # Sauvegarder en JSON
        output_file = f"data/raw/kiprix_{scraper.territory}.json"
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        with open(output_file, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        
        # Mettre à jour le statut
        scraping_tasks[task_id].update({
            "status": "completed",
            "total_products": len(data),
            "completed_at": datetime.now().isoformat(),
            "error": None
        })
        
        logger.info(f"Scraping complété : {task_id} ({len(data)} produits)")
        
    except Exception as e:
        logger.error(f"Erreur scraping {task_id} : {e}")
        scraping_tasks[task_id].update({
            "status": "failed",
            "error": str(e),
            "completed_at": datetime.now().isoformat()
        })
    finally:
        running_task_ids.discard(task_id)
        task_cancel_flags.pop(task_id, None)

# ========== DÉMARRAGE ==========

@app.on_event("startup")
async def startup_event():
    """Event déclenché au démarrage de FastAPI"""
    try:
        # Démarrer le scheduler
        scheduler = get_scheduler()
        scheduler.start()
        logger.info("Application démarrée avec scheduler actif")
        print("✅ FastAPI Kiprix Scraper démarré")
        print("✅ Scheduler activé")
    except Exception as e:
        logger.error(f"Erreur au démarrage : {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Event déclenché à l'arrêt de FastAPI"""
    try:
        scheduler = get_scheduler()
        scheduler.stop()
        logger.info("Application arrêtée")
        print("⛔ FastAPI Kiprix Scraper arrêté")
    except Exception as e:
        logger.error(f"Erreur à l'arrêt : {e}")

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
