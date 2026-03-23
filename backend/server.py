from fastapi import FastAPI, APIRouter, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, String, DateTime, func
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# PostgreSQL connection
DATABASE_URL = os.environ.get('DATABASE_URL', 'postgresql+asyncpg://user:password@localhost:5432/status200')

engine = create_async_engine(DATABASE_URL, echo=True)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with async_session_maker() as session:
        yield session

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# Define Database Model
class StatusCheckDB(Base):
    __tablename__ = "status_checks"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    client_name = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

# Pydantic Models for API
class StatusCheckResponse(BaseModel):
    id: str
    client_name: str
    timestamp: datetime
    
    model_config = ConfigDict(from_attributes=True)

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheckResponse)
async def create_status_check(input: StatusCheckCreate, db: AsyncSession = Depends(get_db)):
    status_check = StatusCheckDB(
        id=str(uuid.uuid4()),
        client_name=input.client_name
    )
    
    db.add(status_check)
    await db.commit()
    await db.refresh(status_check)
    
    return status_check

@api_router.get("/status", response_model=List[StatusCheckResponse])
async def get_status_checks(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    result = await db.execute(select(StatusCheckDB))
    status_checks = result.scalars().all()
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_engine():
    await engine.dispose()