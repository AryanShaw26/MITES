from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import Base, engine
from app.models.user import User
from app.routers.auth import router as auth_router
from app.models.task import Task
from app.routers.tasks import router as task_router
app = FastAPI(
    title="MITES API",
    description="Backend API for MITES productivity application",
    version="1.0.0"
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database tables
Base.metadata.create_all(bind=engine)


# Authentication routes
app.include_router(auth_router)
app.include_router(task_router)

@app.get("/")
def home():
    return {
        "message": "MITES backend is running"
    }