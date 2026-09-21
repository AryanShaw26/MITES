from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NoteCreate(BaseModel):
    title: str
    content: str | None = None


class NoteUpdate(BaseModel):
    title: str
    content: str | None = None


class NoteResponse(BaseModel):
    id: int
    section_id: int
    title: str
    content: str | None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)