from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import Base, engine, get_db
from app.models import Certificate  # noqa: F401 — enregistre le modèle pour create_all
from app.schemas import CertificateCreate, CertificateRead


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="CertiChain API",
    description="API FastAPI — certificats numériques (PostgreSQL)",
    version="1.0.0",
    lifespan=lifespan,
)

origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", include_in_schema=False)
def root():
    """Raccourci navigateur : la doc interactive est sur /docs."""
    return RedirectResponse(url="/docs")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    """Vérifie que la connexion à la base (PostgreSQL ou SQLite) fonctionne."""
    db.execute(text("SELECT 1"))
    return {"status": "ok", "database": "connected"}


@app.post(
    "/api/certificates",
    response_model=CertificateRead,
    status_code=status.HTTP_201_CREATED,
)
def create_certificate(payload: CertificateCreate, db: Session = Depends(get_db)):
    row = Certificate(
        student_name=payload.student_name,
        certification_title=payload.certification_title,
        issued_at=payload.issued_at,
        blockchain_hash=payload.blockchain_hash,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


@app.get("/api/certificates", response_model=list[CertificateRead])
def list_certificates(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    rows = (
        db.query(Certificate)
        .order_by(Certificate.id.desc())
        .offset(skip)
        .limit(min(limit, 500))
        .all()
    )
    return rows


@app.get("/api/certificates/{certificate_id}", response_model=CertificateRead)
def get_certificate(certificate_id: int, db: Session = Depends(get_db)):
    row = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Certificat introuvable")
    return row
