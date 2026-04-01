import time
from typing import Any
import httpx

_cache: dict[str, Any] = {}
_fetched_at: float = 0.0
_TTL = 86400  # 24 hours

FIELDS = "name,cca3,cca2,flags,capital,region,subregion,population,area,languages,currencies,latlng"
API_URL = f"https://restcountries.com/v3.1/all?fields={FIELDS}"


async def _load():
    global _cache, _fetched_at
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.get(API_URL)
        resp.raise_for_status()
        data = resp.json()
    _cache = {c["cca3"]: c for c in data if c.get("cca3")}
    _fetched_at = time.time()


async def _ensure_loaded():
    if not _cache or (time.time() - _fetched_at) > _TTL:
        await _load()


async def get_all(search: str = "", region: str = "") -> list[dict]:
    await _ensure_loaded()
    countries = list(_cache.values())
    if region:
        countries = [c for c in countries if c.get("region", "").lower() == region.lower()]
    if search:
        countries = [c for c in countries if search.lower() in c["name"]["common"].lower()]
    return sorted(countries, key=lambda c: c["name"]["common"])


async def get_by_code(cca3: str) -> dict | None:
    await _ensure_loaded()
    return _cache.get(cca3.upper())


async def get_regions() -> list[str]:
    await _ensure_loaded()
    return sorted({c["region"] for c in _cache.values() if c.get("region")})


async def get_by_region(region: str) -> list[dict]:
    await _ensure_loaded()
    return sorted(
        [c for c in _cache.values() if c.get("region", "").lower() == region.lower()],
        key=lambda c: c["name"]["common"],
    )
