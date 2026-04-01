from fastapi import APIRouter, HTTPException
from app.services import countries_service

router = APIRouter(prefix="/api/countries", tags=["countries"])


@router.get("")
async def list_countries(search: str = "", region: str = ""):
    return await countries_service.get_all(search=search, region=region)


@router.get("/{cca3}")
async def get_country(cca3: str):
    country = await countries_service.get_by_code(cca3)
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country
