from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.note_section import NoteSection
from app.schemas.note_section import (
    NoteSectionCreate,
    NoteSectionUpdate,
    NoteSectionResponse
)
from app.core.security import get_current_user_id


router = APIRouter(
    prefix="/note-sections",
    tags=["Note Sections"]
)


# GET ALL SECTIONS
@router.get(
    "/",
    response_model=list[NoteSectionResponse]
)
def get_sections(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    sections = (
        db.query(NoteSection)
        .filter(NoteSection.user_id == user_id)
        .order_by(NoteSection.created_at.asc())
        .all()
    )

    return sections


# CREATE SECTION
@router.post(
    "/",
    response_model=NoteSectionResponse
)
def create_section(
    section: NoteSectionCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    existing_section = (
        db.query(NoteSection)
        .filter(
            NoteSection.user_id == user_id,
            NoteSection.name == section.name
        )
        .first()
    )

    if existing_section:
        raise HTTPException(
            status_code=400,
            detail="Section already exists"
        )

    new_section = NoteSection(
        user_id=user_id,
        name=section.name
    )

    db.add(new_section)
    db.commit()
    db.refresh(new_section)

    return new_section


# UPDATE SECTION
@router.put(
    "/{section_id}",
    response_model=NoteSectionResponse
)
def update_section(
    section_id: int,
    section: NoteSectionUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):
    existing_section = (
        db.query(NoteSection)
        .filter(
            NoteSection.id == section_id,
            NoteSection.user_id == user_id
        )
        .first()
    )

    if not existing_section:
        raise HTTPException(
            status_code=404,
            detail="Section not found"
        )

    duplicate = (
        db.query(NoteSection)
        .filter(
            NoteSection.user_id == user_id,
            NoteSection.name == section.name,
            NoteSection.id != section_id
        )
        .first()
    )

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Section already exists"
        )

    existing_section.name = section.name

    db.commit()
    db.refresh(existing_section)

    return existing_section


# DELETE SECTION
@router.delete(
    "/{section_id}"
)
def delete_section(
    section_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
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

    db.delete(section)
    db.commit()

    return {
        "message": "Section deleted successfully"
    }