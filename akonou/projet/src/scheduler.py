"""
Scheduler - Gestion automatique des scraping planifiés avec APScheduler
"""

import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
from pathlib import Path
import json
import os
import sys

# Ajouter le répertoire src au path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.scrapers.kiprix_scraper import KiprixScraper

logger = logging.getLogger(__name__)

class ScrapingScheduler:
    """Gestionnaire de planification des tâches de scraping"""

    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.active_jobs = {}

    def start(self):
        """Démarre le scheduler"""
        if not self.scheduler.running:
            self.scheduler.start()
            logger.info("Scheduler démarré")
            print("✓ Scheduler démarré")

    def stop(self):
        """Arrête le scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Scheduler arrêté")

    def add_scraping_job(self, cron_expression: str, territories: list, max_pages: int, job_id: str = None):
        """
        Ajoute une tâche de scraping planifiée

        Args:
            cron_expression: Expression cron (ex: "0 2 * * *" pour 2h du matin)
            territories: Liste des territoires (gp, mq, re, gf)
            max_pages: Nombre de pages à scraper
            job_id: ID unique du job (généré si non fourni)
        """
        if not job_id:
            job_id = f"scraping_{cron_expression.replace(' ', '_')}"

        try:
            # Supprimer le job s'il existe déjà
            if job_id in self.active_jobs:
                self.scheduler.remove_job(job_id)
                logger.info(f"Job existant supprimé : {job_id}")

            # Créer un wrapper pour la fonction de scraping
            def scraping_task():
                logger.info(f"Exécution de la tâche planifiée : {job_id}")
                self._execute_scraping(territories, max_pages)

            # Ajouter la tâche au scheduler
            cron_trigger = CronTrigger.from_crontab(cron_expression)
            job = self.scheduler.add_job(
                scraping_task,
                trigger=cron_trigger,
                id=job_id,
                name=f"Scraping {territories} - {cron_expression}",
                misfire_grace_time=60,  # Tolérance de 60s
                replace_existing=True
            )

            self.active_jobs[job_id] = {
                "cron": cron_expression,
                "territories": territories,
                "max_pages": max_pages,
                "created_at": datetime.now().isoformat(),
                "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
            }

            logger.info(f"Job ajouté : {job_id} - Prochaine exécution : {job.next_run_time}")
            print(f"✓ Job ajouté : {job_id}")
            print(f"  Prochaine exécution : {job.next_run_time}")

            return {
                "success": True,
                "job_id": job_id,
                "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
            }

        except Exception as e:
            logger.error(f"Erreur lors de l'ajout du job : {e}")
            print(f"✗ Erreur : {e}")
            return {
                "success": False,
                "error": str(e),
            }

    def remove_scraping_job(self, job_id: str):
        """Supprime une tâche planifiée"""
        try:
            if job_id in self.active_jobs:
                self.scheduler.remove_job(job_id)
                del self.active_jobs[job_id]
                logger.info(f"Job supprimé : {job_id}")
                return {"success": True, "message": f"Job {job_id} supprimé"}
            else:
                return {"success": False, "error": "Job non trouvé"}
        except Exception as e:
            logger.error(f"Erreur suppression job : {e}")
            return {"success": False, "error": str(e)}

    def list_jobs(self):
        """Liste tous les jobs actifs"""
        jobs = []
        for job in self.scheduler.get_jobs():
            jobs.append({
                "id": job.id,
                "name": job.name,
                "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
                "trigger": str(job.trigger),
            })
        return jobs

    def _execute_scraping(self, territories: list, max_pages: int):
        """Exécute le scraping pour une liste de territoires"""
        for territory in territories:
            try:
                logger.info(f"Scraping planifié lancé : {territory} - {max_pages} pages")

                scraper = KiprixScraper(territory=territory, delay=1.5)
                data = scraper.scrape(max_pages=max_pages)

                # Sauvegarder en JSON
                output_file = f"data/raw/kiprix_{territory}.json"
                os.makedirs(os.path.dirname(output_file), exist_ok=True)

                with open(output_file, "w") as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)

                logger.info(f"Scraping planifié complété : {territory} ({len(data)} produits)")

            except Exception as e:
                logger.error(f"Erreur scraping planifié {territory} : {e}")

# Instance globale du scheduler
scheduler_instance = ScrapingScheduler()

def get_scheduler():
    """Récupère l'instance du scheduler"""
    return scheduler_instance
