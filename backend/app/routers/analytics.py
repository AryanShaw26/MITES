from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.core.security import get_current_user_id
from app.services.analytics import (
    calculate_date_range,
    get_analytics_summary,
    get_task_time_series,
)

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/summary")
def get_summary(
    period: str = Query("weekly", pattern="^(daily|weekly|monthly|custom)$"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    start, end, group_by = calculate_date_range(period, start_date, end_date)
    summary = get_analytics_summary(db, user_id, start, end)
    return {
        "period": {
            "name": period,
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
            "group_by": group_by,
        },
        "summary": summary,
    }


@router.get("/tasks")
def get_tasks_series(
    period: str = Query("weekly", pattern="^(daily|weekly|monthly|custom)$"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    start, end, group_by = calculate_date_range(period, start_date, end_date)
    series = get_task_time_series(db, user_id, start, end)
    return {
        "period": {
            "name": period,
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
            "group_by": group_by,
        },
        "series": series,
    }


@router.get("/productivity")
def get_productivity(
    period: str = Query("weekly", pattern="^(daily|weekly|monthly|custom)$"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    start, end, group_by = calculate_date_range(period, start_date, end_date)
    summary = get_analytics_summary(db, user_id, start, end)
    return {
        "period": {
            "name": period,
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
            "group_by": group_by,
        },
        "productivity": {
            "completion_rate": summary["completion_rate"],
            "tasks_completed": summary["completed_tasks"],
            "notes_created": summary["notes_created"],
            "active_days": summary["active_days"],
            "total_tasks": summary["total_tasks"],
            "pending_tasks": summary["pending_tasks"],
        },
    }


@router.get("/dashboard")
def get_dashboard_analytics(
    period: str = Query("weekly", pattern="^(daily|weekly|monthly|custom)$"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    start, end, group_by = calculate_date_range(period, start_date, end_date)
    summary = get_analytics_summary(db, user_id, start, end)
    series = get_task_time_series(db, user_id, start, end)

    return {
        "period": {
            "name": period,
            "start_date": start.isoformat(),
            "end_date": end.isoformat(),
            "group_by": group_by,
        },
        "summary": summary,
        "task_series": series,
        "productivity": {
            "completion_rate": summary["completion_rate"],
            "tasks_completed": summary["completed_tasks"],
            "notes_created": summary["notes_created"],
            "active_days": summary["active_days"],
        },
    }
