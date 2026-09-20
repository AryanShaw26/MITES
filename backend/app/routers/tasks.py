from datetime import date

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)

from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.task import Task
from app.schemas.task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse
)
from app.core.security import get_current_user_id


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# CREATE TASK
@router.post("/", response_model=TaskResponse)
def create_task(
    task_data: TaskCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    task = Task(
        user_id=user_id,
        title=task_data.title,
        description=task_data.description,
        task_date=task_data.task_date,
        task_time=task_data.task_time,
        priority=task_data.priority
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


# GET TASKS FOR A DATE
@router.get("/", response_model=list[TaskResponse])
def get_tasks(
    task_date: date = Query(...),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    tasks = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.task_date == task_date
        )
        .order_by(Task.task_time.asc())
        .all()
    )

    return tasks


# GET SINGLE TASK
@router.get("/{task_id}", response_model=TaskResponse)
def get_task(
    task_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    return task


# UPDATE TASK
@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    update_data = task_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)

    return task


# DELETE TASK
@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }


# COMPLETE / UNCOMPLETE TASK
@router.patch(
    "/{task_id}/complete",
    response_model=TaskResponse
)
def toggle_task_completion(
    task_id: int,
    completed: bool,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db)
):
    task = (
        db.query(Task)
        .filter(
            Task.id == task_id,
            Task.user_id == user_id
        )
        .first()
    )

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    task.completed = completed

    db.commit()
    db.refresh(task)

    return task