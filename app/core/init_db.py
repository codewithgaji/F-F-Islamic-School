from contextlib import asynccontextmanager
from fastapi import FastAPI
from db.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\nInitializing database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables Successfully Created")
    yield
