import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import Base, engine
from app.models.user import User
from app.routers.auth import router as auth_router
from app.models.task import Task
from app.routers.tasks import router as task_router
from app.models.note_section import NoteSection
from app.routers.note_sections import router as note_section_router
from app.models.note import Note
from app.routers.notes import router as note_router
from app.models.note_file import NoteFile
from app.routers.note_files import router as note_file_router
from app.models.event import Event
from app.routers.events import router as event_router
from app.routers.analytics import router as analytics_router

app = FastAPI(
    title="MITES API",
    description="Backend API for MITES productivity application",
    version="3.0.0"
)

import os

from fastapi.middleware.cors import CORSMiddleware

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://mites-steel.vercel.app",
        frontend_url,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Create database tables
Base.metadata.create_all(bind=engine)

# Routers
app.include_router(auth_router)
app.include_router(task_router)
app.include_router(note_section_router)
app.include_router(note_router)
app.include_router(note_file_router)
app.include_router(event_router)
app.include_router(analytics_router)


@app.get("/")
def home():
    return {
        "message": "MITES backend is running"
    }