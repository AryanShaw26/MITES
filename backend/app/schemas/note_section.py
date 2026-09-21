from datetime import datetime

from pydantic import BaseModel, ConfigDict


class NoteSectionCreate(BaseModel):
    name: str


class NoteSectionUpdate(BaseModel):
    name: str


class NoteSectionResponse(BaseModel):
    id: int
    name: str
    created_at: datetime | None

    model_config = ConfigDict(
        from_attributes=True
    )