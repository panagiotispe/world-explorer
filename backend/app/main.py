from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import countries, quiz, challenge
from app.services import countries_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    try:
        await countries_service._load()
    except Exception as exc:
        print(f"Warning: country cache pre-warm failed ({exc}). Will retry on first request.")
    yield


app = FastAPI(title="World Explorer API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://panagiotispe.github.io",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(countries.router)
app.include_router(quiz.router)
app.include_router(challenge.router)


@app.get("/")
def root():
    return {"message": "World Explorer API — visit /docs"}
