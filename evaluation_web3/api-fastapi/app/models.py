from datetime import date
from typing import Optional

from sqlalchemy import Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    student_name: Mapped[str] = mapped_column(String(255), nullable=False)
    certification_title: Mapped[str] = mapped_column(String(500), nullable=False)
    issued_at: Mapped[date] = mapped_column(Date, nullable=False)
    blockchain_hash: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
