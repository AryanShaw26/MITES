from datetime import date, time, datetime

from pydantic import BaseModel, ConfigDict
from typing import Optional


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    task_date: date
    task_time: Optional[time] = None
    priority: str = "medium"


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    task_date: Optional[date] = None
    task_time: Optional[time] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    task_date: date
    task_time: Optional[time]
    priority: str
    completed: bool
    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)