from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.core.security import get_current_user_id

router = APIRouter(
    prefix="/events",
    tags=["Events"],
)


# CREATE EVENT
@router.post("/", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(
    event_data: EventCreate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    try:
        event = Event(
            user_id=user_id,
            title=event_data.title,
            description=event_data.description,
            start_at=event_data.start_at,
            end_at=event_data.end_at,
            priority=event_data.priority,
            reminder_at=event_data.reminder_at,
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create event"
        )


# GET UPCOMING EVENTS (Defined before /{event_id} to prevent route shadowing)
@router.get("/upcoming", response_model=List[EventResponse])
def get_upcoming_events(
    limit: int = Query(5, ge=1, le=50),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    eff_limit = limit if isinstance(limit, int) else 5
    now = datetime.now(timezone.utc)
    events = (
        db.query(Event)
        .filter(
            Event.user_id == user_id,
            Event.start_at >= now
        )
        .order_by(Event.start_at.asc())
        .limit(eff_limit)
        .all()
    )
    return events


# LIST EVENTS (Supports filtering by status: upcoming, past, all; date ranges, and limit)
@router.get("/", response_model=List[EventResponse])
def list_events(
    status_filter: Optional[str] = Query("all", alias="status"),
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
    limit: Optional[int] = Query(None, ge=1, le=500),
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    query = db.query(Event).filter(Event.user_id == user_id)
    now = datetime.now(timezone.utc)

    status_val = status_filter if isinstance(status_filter, str) else "all"

    if status_val == "upcoming":
        query = query.filter(Event.start_at >= now).order_by(Event.start_at.asc())
    elif status_val == "past":
        query = query.filter(Event.start_at < now).order_by(Event.start_at.desc())
    else:
        # Default sort by start_at ascending
        query = query.order_by(Event.start_at.asc())

    if isinstance(from_date, datetime):
        query = query.filter(Event.start_at >= from_date)
    if isinstance(to_date, datetime):
        query = query.filter(Event.start_at <= to_date)

    if isinstance(limit, int):
        query = query.limit(limit)

    return query.all()


# GET SINGLE EVENT
@router.get("/{event_id}", response_model=EventResponse)
def get_event(
    event_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    event = (
        db.query(Event)
        .filter(
            Event.id == event_id,
            Event.user_id == user_id
        )
        .first()
    )
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )
    return event


# UPDATE EVENT (PUT/PATCH)
@router.put("/{event_id}", response_model=EventResponse)
@router.patch("/{event_id}", response_model=EventResponse)
def update_event(
    event_id: int,
    event_data: EventUpdate,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    event = (
        db.query(Event)
        .filter(
            Event.id == event_id,
            Event.user_id == user_id
        )
        .first()
    )
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    # Check date consistency with proposed or existing values
    proposed_start = event_data.start_at if event_data.start_at is not None else event.start_at
    proposed_end = event_data.end_at if event_data.end_at is not None else event.end_at

    if proposed_end is not None and proposed_start is not None and proposed_end < proposed_start:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End time cannot be earlier than start time"
        )

    try:
        if event_data.title is not None:
            event.title = event_data.title
        if event_data.description is not None:
            event.description = event_data.description
        if event_data.start_at is not None:
            event.start_at = event_data.start_at
        if event_data.end_at is not None:
            event.end_at = event_data.end_at
        if event_data.priority is not None:
            event.priority = event_data.priority
        if event_data.reminder_at is not None:
            event.reminder_at = event_data.reminder_at

        db.commit()
        db.refresh(event)
        return event
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update event"
        )


# DELETE EVENT
@router.delete("/{event_id}")
def delete_event(
    event_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    event = (
        db.query(Event)
        .filter(
            Event.id == event_id,
            Event.user_id == user_id
        )
        .first()
    )
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found"
        )

    try:
        db.delete(event)
        db.commit()
        return {"message": "Event deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete event"
        )
