from datetime import datetime, timezone
from sqlalchemy import Integer, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class QuizScore(Base):
    __tablename__ = "quiz_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    player_name: Mapped[str] = mapped_column(String(100))
    score: Mapped[int] = mapped_column(Integer)
    total: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )


class ChallengeScore(Base):
    __tablename__ = "challenge_scores"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    player_name: Mapped[str] = mapped_column(String(100))
    region: Mapped[str] = mapped_column(String(100))
    found_count: Mapped[int] = mapped_column(Integer)
    total_count: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
