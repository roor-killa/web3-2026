from datetime import date
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CertificateBase(BaseModel):
    student_name: str = Field(..., min_length=1, max_length=255)
    certification_title: str = Field(..., min_length=1, max_length=500)
    issued_at: date
    blockchain_hash: Optional[str] = None


class CertificateCreate(CertificateBase):
    pass


class CertificateRead(CertificateBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
