from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database import get_db
from app.models import ChallengeScore
from app.schemas import ChallengeCountry, ChallengeScoreCreate, ChallengeScoreOut
from app.services import countries_service

router = APIRouter(prefix="/api/challenge", tags=["challenge"])


@router.get("/regions")
async def get_regions():
    return await countries_service.get_regions()


# /score must be declared before /{region} to avoid path conflict
@router.post("/score", response_model=ChallengeScoreOut)
def submit_score(body: ChallengeScoreCreate, db: Session = Depends(get_db)):
    entry = ChallengeScore(**body.model_dump())
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.get("/{region}", response_model=list[ChallengeCountry])
async def get_challenge_countries(region: str):
    countries = await countries_service.get_by_region(region)
    return [
        ChallengeCountry(
            name=c["name"]["common"],
            flag_url=c["flags"]["svg"],
        )
        for c in countries
    ]


@router.get("/{region}/leaderboard", response_model=list[ChallengeScoreOut])
def leaderboard(region: str, db: Session = Depends(get_db)):
    return (
        db.query(ChallengeScore)
        .filter(ChallengeScore.region == region)
        .order_by(desc(ChallengeScore.found_count), desc(ChallengeScore.created_at))
        .limit(10)
        .all()
    )
