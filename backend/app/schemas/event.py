from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator, model_validator


class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_at: datetime
    end_at: Optional[datetime] = None
    priority: str = "medium"
    reminder_at: Optional[datetime] = None


class EventCreate(EventBase):
    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Title cannot be blank")
        if len(trimmed) > 255:
            raise ValueError("Title must be 255 characters or fewer")
        return trimmed

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: str) -> str:
        v_lower = v.lower()
        if v_lower not in ("low", "medium", "high"):
            raise ValueError("Priority must be one of: low, medium, high")
        return v_lower

    @model_validator(mode="after")
    def validate_end_after_start(self):
        if self.end_at and self.start_at:
            if self.end_at < self.start_at:
                raise ValueError("end_at cannot be earlier than start_at")
        return self


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_at: Optional[datetime] = None
    end_at: Optional[datetime] = None
    priority: Optional[str] = None
    reminder_at: Optional[datetime] = None

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            trimmed = v.strip()
            if not trimmed:
                raise ValueError("Title cannot be blank")
            if len(trimmed) > 255:
                raise ValueError("Title must be 255 characters or fewer")
            return trimmed
        return v

    @field_validator("priority")
    @classmethod
    def validate_priority(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v_lower = v.lower()
            if v_lower not in ("low", "medium", "high"):
                raise ValueError("Priority must be one of: low, medium, high")
            return v_lower
        return v

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_at and self.start_at:
            if self.end_at < self.start_at:
                raise ValueError("end_at cannot be earlier than start_at")
        return self


class EventResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    start_at: datetime
    end_at: Optional[datetime] = None
    priority: str
    reminder_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
