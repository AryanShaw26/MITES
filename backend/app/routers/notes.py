from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.security import get_current_user_id
from app.database.connection import get_db
from app.models.note import Note
from app.models.note_section import NoteSection
from app.schemas.note import NoteCreate, NoteUpdate, NoteResponse


router = APIRouter(
    prefix="/notes",
    tags=["Notes"],
)


@router.get(
    "/section/{section_id}",
    response_model=list[NoteResponse]
)
def get_notes(
    section_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    section = (
        db.query(NoteSection)
        .filter(
            NoteSection.id == section_id,
            NoteSection.user_id == user_id
        )
        .first()
    )

    if not section:
        raise HTTPException(
            status_code=404,
            detail="Section not found"
        )

    return (
        db.query(Note)
        .filter(
            Note.section_id == section_id,
            Note.user_id == user_id
        )
        .order_by(Note.created_at.desc())
        .all()
    )


@router.get(
    "/{note_id}",
    response_model=NoteResponse
)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    note = (
        db.query(Note)
        .filter(
            Note.id == note_id,
            Note.user_id == user_id
        )
        .first()
    )

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    return note


@router.post(
    "/section/{section_id}",
    response_model=NoteResponse,
    status_code=201
)
def create_note(
    section_id: int,
    note: NoteCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    section = (
        db.query(NoteSection)
        .filter(
            NoteSection.id == section_id,
            NoteSection.user_id == user_id
        )
        .first()
    )

    if not section:
        raise HTTPException(
            status_code=404,
            detail="Section not found"
        )

    title = note.title.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Note title cannot be empty"
        )

    new_note = Note(
        user_id=user_id,
        section_id=section_id,
        title=title,
        content=note.content,
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note


@router.put(
    "/{note_id}",
    response_model=NoteResponse
)
def update_note(
    note_id: int,
    note: NoteUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    existing = (
        db.query(Note)
        .filter(
            Note.id == note_id,
            Note.user_id == user_id
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    title = note.title.strip()

    if not title:
        raise HTTPException(
            status_code=400,
            detail="Note title cannot be empty"
        )

    existing.title = title
    existing.content = note.content

    db.commit()
    db.refresh(existing)

    return existing


@router.delete(
    "/{note_id}"
)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    existing = (
        db.query(Note)
        .filter(
            Note.id == note_id,
            Note.user_id == user_id
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Note not found"
        )

    db.delete(existing)
    db.commit()

    return {
        "message": "Note deleted successfully"
    }
