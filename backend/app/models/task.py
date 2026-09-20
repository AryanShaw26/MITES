from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Date,
    Time,
    Boolean,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.database.connection import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    title = Column(String(255), nullable=False)

    description = Column(Text, nullable=True)

    task_date = Column(Date, nullable=False, index=True)

    task_time = Column(Time, nullable=True)

    priority = Column(
        String(20),
        nullable=False,
        default="medium"
    )

    completed = Column(
        Boolean,
        nullable=False,
        default=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )