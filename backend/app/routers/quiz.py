from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import QuizScore
from app.schemas import QuizQuestion, QuizScoreCreate, QuizScoreOut
from app.services import quiz_service

router = APIRouter(prefix="/api/quiz", tags=["quiz"])


@router.get("/questions", response_model=list[QuizQuestion])
async def get_questions(count: int = 10):
    count = max(1, min(count, 50))
    return await quiz_service.generate_questions(count)


@router.post("/score", response_model=QuizScoreOut)
def submit_score(body: QuizScoreCreate, db: Session = Depends(get_db)):
    entry = QuizScore(**body.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/leaderboard", response_model=list[QuizScoreOut])
def leaderboard(db: Session = Depends(get_db)):
    return (
        db.query(QuizScore)
        .order_by(desc(QuizScore.score), desc(QuizScore.created_at))
        .limit(10)
        .all()
    )
