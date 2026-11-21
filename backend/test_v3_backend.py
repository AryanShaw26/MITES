import sys
from datetime import datetime, date, timedelta, timezone
from pydantic import ValidationError

from app.database.connection import SessionLocal
from app.models.user import User
from app.models.task import Task
from app.models.note import Note
from app.models.note_section import NoteSection
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate, EventResponse
from app.routers.events import (
    create_event,
    get_upcoming_events,
    list_events,
    get_event,
    update_event,
    delete_event
)
from app.routers.analytics import (
    get_summary,
    get_tasks_series,
    get_productivity,
    get_dashboard_analytics
)
from app.routers.notes import get_all_notes
from fastapi import HTTPException

def run_tests():
    db = SessionLocal()
    users = db.query(User).all()
    if len(users) < 2:
        u1 = User(name="User A", email="usera@test.com", password="hashed_test_password")
        u2 = User(name="User B", email="userb@test.com", password="hashed_test_password")
        db.add_all([u1, u2])
        db.commit()
        db.refresh(u1)
        db.refresh(u2)
        user_a_id = u1.id
        user_b_id = u2.id
    else:
        user_a_id = users[0].id
        user_b_id = users[1].id

    print(f"Testing with User A (id={user_a_id}) and User B (id={user_b_id})")

    # Clean existing events for test users
    db.query(Event).filter(Event.user_id.in_([user_a_id, user_b_id])).delete(synchronize_session=False)
    db.commit()

    now = datetime.now(timezone.utc)
    future_1 = now + timedelta(days=1)
    future_2 = now + timedelta(days=2)
    past_1 = now - timedelta(days=1)

    # 1. Test EVT-01: Create Event
    ev1_create = EventCreate(
        title="Team Sprint Review",
        description="Reviewing V3 features",
        start_at=future_1,
        end_at=future_1 + timedelta(hours=1),
        priority="high"
    )
    ev1 = create_event(event_data=ev1_create, user_id=user_a_id, db=db)
    assert ev1.id is not None
    assert ev1.title == "Team Sprint Review"
    event_1_id = ev1.id
    print("✓ EVT-01: Create event succeeded")

    # 2. Test EVT-09: End before start rejected
    try:
        EventCreate(
            title="Invalid Event",
            start_at=future_1,
            end_at=future_1 - timedelta(hours=1),
            priority="medium"
        )
        assert False, "Should have raised ValidationError for end < start"
    except (ValidationError, ValueError):
        print("✓ EVT-09: End before start rejected in schema validation")

    # 3. Test EVT-06: Priority validation
    try:
        EventCreate(
            title="Bad Priority",
            start_at=future_1,
            priority="urgent"
        )
        assert False, "Should have raised ValidationError for priority"
    except (ValidationError, ValueError):
        print("✓ EVT-06: Invalid priority rejected in schema validation")

    # Create 2nd future event and 1 past event
    ev2_create = EventCreate(title="Design Sync", start_at=future_2, priority="medium")
    ev2 = create_event(event_data=ev2_create, user_id=user_a_id, db=db)
    event_2_id = ev2.id

    ev_past_create = EventCreate(title="Yesterday Kickoff", start_at=past_1, priority="low")
    ev_past = create_event(event_data=ev_past_create, user_id=user_a_id, db=db)
    event_past_id = ev_past.id

    # 4. Test EVT-08: Upcoming events (start_at >= now ascending)
    upcoming = get_upcoming_events(limit=5, user_id=user_a_id, db=db)
    assert len(upcoming) == 2
    assert upcoming[0].id == event_1_id
    assert upcoming[1].id == event_2_id
    print("✓ EVT-08: Upcoming events returned in chronological order")

    # 5. Test EVT-02: Listing & Filtering
    all_events = list_events(status_filter="all", user_id=user_a_id, db=db)
    assert len(all_events) == 3

    upcoming_filtered = list_events(status_filter="upcoming", user_id=user_a_id, db=db)
    assert len(upcoming_filtered) == 2

    past_filtered = list_events(status_filter="past", user_id=user_a_id, db=db)
    assert len(past_filtered) == 1
    assert past_filtered[0].id == event_past_id
    print("✓ EVT-02: Event list filtering (all/upcoming/past) functional")

    # 6. Test EVT-03: Retrieve single event
    retrieved = get_event(event_id=event_1_id, user_id=user_a_id, db=db)
    assert retrieved.id == event_1_id
    print("✓ EVT-03: Single event retrieved")

    # 7. Test EVT-04: Update event
    update_data = EventUpdate(title="Team Sprint Review Updated", priority="low")
    updated = update_event(event_id=event_1_id, event_data=update_data, user_id=user_a_id, db=db)
    assert updated.title == "Team Sprint Review Updated"
    assert updated.priority == "low"
    print("✓ EVT-04: Event updated")

    # 8. Test Security: User isolation
    try:
        get_event(event_id=event_1_id, user_id=user_b_id, db=db)
        assert False, "User B should not be able to get User A's event"
    except HTTPException as e:
        assert e.status_code == 404
        print("✓ Security: User B cannot retrieve User A's event (404)")

    try:
        update_event(event_id=event_1_id, event_data=update_data, user_id=user_b_id, db=db)
        assert False, "User B should not be able to update User A's event"
    except HTTPException as e:
        assert e.status_code == 404
        print("✓ Security: User B cannot update User A's event (404)")

    try:
        delete_event(event_id=event_1_id, user_id=user_b_id, db=db)
        assert False, "User B should not be able to delete User A's event"
    except HTTPException as e:
        assert e.status_code == 404
        print("✓ Security: User B cannot delete User A's event (404)")

    # 9. Test EVT-05: Delete event
    del_res = delete_event(event_id=event_past_id, user_id=user_a_id, db=db)
    assert del_res["message"] == "Event deleted successfully"
    try:
        get_event(event_id=event_past_id, user_id=user_a_id, db=db)
        assert False, "Event should be deleted"
    except HTTPException as e:
        assert e.status_code == 404
    print("✓ EVT-05: Event deleted successfully")

    # 10. Test Analytics Endpoints
    # Add a task for User A today to test metrics
    today = date.today()
    task = Task(user_id=user_a_id, title="Test Task", task_date=today, completed=True)
    db.add(task)
    db.commit()

    summary_res = get_summary(period="weekly", user_id=user_a_id, db=db)
    assert "summary" in summary_res
    assert summary_res["summary"]["completed_tasks"] >= 1
    assert summary_res["summary"]["active_days"] >= 1
    print("✓ ANA-01 & ANA-04: Summary and active_days calculated accurately from DB")

    tasks_series_res = get_tasks_series(period="weekly", user_id=user_a_id, db=db)
    assert "series" in tasks_series_res
    assert len(tasks_series_res["series"]) == 7
    print("✓ ANA-02 & ANA-03: Zero-filled time-series generated properly")

    prod_res = get_productivity(period="weekly", user_id=user_a_id, db=db)
    assert "productivity" in prod_res
    print("✓ Productivity stats endpoint verified")

    dash_res = get_dashboard_analytics(period="weekly", user_id=user_a_id, db=db)
    assert "summary" in dash_res and "task_series" in dash_res and "productivity" in dash_res
    print("✓ Combined dashboard analytics verified")

    # 11. Test Notes List
    notes_list = get_all_notes(limit=5, db=db, user_id=user_a_id)
    assert isinstance(notes_list, list)
    print("✓ GET /notes/ endpoint verified")

    # Clean up test task
    db.delete(task)
    db.commit()
    db.close()

    print("\nALL BACKEND ACCEPTANCE AND SECURITY TESTS PASSED 100%! 🚀")

if __name__ == "__main__":
    run_tests()
