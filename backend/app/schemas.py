from datetime import datetime
from pydantic import BaseModel


# --- Country ---

class CountryName(BaseModel):
    common: str
    official: str


class CountryFlags(BaseModel):
    svg: str
    png: str


class Country(BaseModel):
    cca3: str
    name: CountryName
    flags: CountryFlags
    capital: list[str]
    region: str
    subregion: str
    population: int
    area: float
    languages: dict[str, str]
    currencies: dict[str, dict]


# --- Quiz ---

class QuizQuestion(BaseModel):
    country_code: str
    flag_url: str
    options: list[str]
    answer: str


class QuizScoreCreate(BaseModel):
    player_name: str
    score: int
    total: int


class QuizScoreOut(BaseModel):
    id: int
    player_name: str
    score: int
    total: int
    created_at: datetime

    model_config = {"from_attributes": True}


# --- Challenge ---

class ChallengeCountry(BaseModel):
    name: str
    flag_url: str


class ChallengeScoreCreate(BaseModel):
    player_name: str
    region: str
    found_count: int
    total_count: int


class ChallengeScoreOut(BaseModel):
    id: int
    player_name: str
    region: str
    found_count: int
    total_count: int
    created_at: datetime

    model_config = {"from_attributes": True}
