from datetime import date, datetime, timedelta, time
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct, and_

from app.models.task import Task
from app.models.note import Note


def calculate_date_range(
    period: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> tuple[date, date, str]:
    today = date.today()

    if period == "daily":
        start = today
        end = today
        group_by = "hour"
    elif period == "weekly":
        # Current week Monday to Sunday
        start = today - timedelta(days=today.weekday())
        end = start + timedelta(days=6)
        group_by = "day"
    elif period == "monthly":
        # Current month
        start = date(today.year, today.month, 1)
        if today.month == 12:
            next_month = date(today.year + 1, 1, 1)
        else:
            next_month = date(today.year, today.month + 1, 1)
        end = next_month - timedelta(days=1)
        group_by = "day"
    elif period == "custom" and start_date and end_date:
        if end_date < start_date:
            start_date, end_date = end_date, start_date
        start = start_date
        end = end_date
        group_by = "day"
    else:
        # Default fallback to current week
        start = today - timedelta(days=today.weekday())
        end = start + timedelta(days=6)
        group_by = "day"

    return start, end, group_by


def get_analytics_summary(
    db: Session,
    user_id: int,
    start: date,
    end: date
) -> Dict[str, Any]:
    # Tasks in date range
    task_stats = (
        db.query(
            func.count(Task.id).label("total"),
            func.count().filter(Task.completed == True).label("completed"),
            func.count().filter(Task.completed == False).label("pending"),
        )
        .filter(
            Task.user_id == user_id,
            Task.task_date >= start,
            Task.task_date <= end
        )
        .first()
    )

    total_tasks = task_stats.total if task_stats and task_stats.total else 0
    completed_tasks = task_stats.completed if task_stats and task_stats.completed else 0
    pending_tasks = task_stats.pending if task_stats and task_stats.pending else 0

    completion_rate = (
        round((completed_tasks / total_tasks * 100), 1)
        if total_tasks > 0
        else 0.0
    )

    # Active days: distinct task_dates with at least one completed task in range
    active_days_result = (
        db.query(func.count(distinct(Task.task_date)))
        .filter(
            Task.user_id == user_id,
            Task.completed == True,
            Task.task_date >= start,
            Task.task_date <= end
        )
        .scalar()
    )
    active_days = active_days_result if active_days_result is not None else 0

    # Notes created in range
    start_dt = datetime.combine(start, time.min)
    end_dt = datetime.combine(end, time.max)
    notes_count = (
        db.query(func.count(Note.id))
        .filter(
            Note.user_id == user_id,
            Note.created_at >= start_dt,
            Note.created_at <= end_dt
        )
        .scalar()
    )
    notes_created = notes_count if notes_count is not None else 0

    # Total notes all-time for this user
    all_time_notes = (
        db.query(func.count(Note.id))
        .filter(Note.user_id == user_id)
        .scalar()
    ) or 0

    # Total tasks all-time for this user
    all_time_tasks = (
        db.query(func.count(Task.id))
        .filter(Task.user_id == user_id)
        .scalar()
    ) or 0

    all_time_completed = (
        db.query(func.count(Task.id))
        .filter(Task.user_id == user_id, Task.completed == True)
        .scalar()
    ) or 0

    all_time_pending = all_time_tasks - all_time_completed

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "completion_rate": completion_rate,
        "active_days": active_days,
        "notes_created": notes_created,
        "all_time_tasks": all_time_tasks,
        "all_time_completed": all_time_completed,
        "all_time_pending": all_time_pending,
        "all_time_notes": all_time_notes,
    }


def get_task_time_series(
    db: Session,
    user_id: int,
    start: date,
    end: date
) -> List[Dict[str, Any]]:
    # Query grouped by task_date
    rows = (
        db.query(
            Task.task_date,
            func.count().filter(Task.completed == True).label("completed"),
            func.count().filter(Task.completed == False).label("pending"),
            func.count(Task.id).label("total")
        )
        .filter(
            Task.user_id == user_id,
            Task.task_date >= start,
            Task.task_date <= end
        )
        .group_by(Task.task_date)
        .all()
    )

    data_by_date = {
        row.task_date: {
            "completed": row.completed,
            "pending": row.pending,
            "total": row.total
        }
        for row in rows
    }

    # Generate complete series zero-filled
    series = []
    current = start
    delta = timedelta(days=1)
    weekday_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    while current <= end:
        stats = data_by_date.get(current, {"completed": 0, "pending": 0, "total": 0})
        series.append({
            "date": current.isoformat(),
            "day": weekday_names[current.weekday()],
            "display_date": current.strftime("%b %d"),
            "completed": stats["completed"],
            "pending": stats["pending"],
            "total": stats["total"],
        })
        current += delta

    return series
