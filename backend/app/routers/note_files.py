import os
import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.security import get_current_user_id
from app.database.connection import get_db
from app.models.note_file import NoteFile
from app.models.note_section import NoteSection
from app.schemas.note_file import NoteFileResponse


router = APIRouter(
    prefix="/note-files",
    tags=["Note Files"]
)


UPLOAD_DIR = Path("uploads/note_files")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


ALLOWED_EXTENSIONS = {
    ".pdf": {
        "type": "pdf",
        "media_type": "application/pdf"
    },
    ".doc": {
        "type": "doc",
        "media_type": "application/msword"
    },
    ".docx": {
        "type": "docx",
        "media_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    },
    ".ppt": {
        "type": "ppt",
        "media_type": "application/vnd.ms-powerpoint"
    },
    ".pptx": {
        "type": "pptx",
        "media_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    },
    ".jpg": {
        "type": "jpg",
        "media_type": "image/jpeg"
    },
    ".jpeg": {
        "type": "jpeg",
        "media_type": "image/jpeg"
    },
    ".png": {
        "type": "png",
        "media_type": "image/png"
    },
    ".xls": {
        "type": "xls",
        "media_type": "application/vnd.ms-excel"
    },
    ".xlsx": {
        "type": "xlsx",
        "media_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }
}


# ============================================================
# GET ALL FILES IN A SECTION
# ============================================================

@router.get(
    "/section/{section_id}",
    response_model=list[NoteFileResponse]
)
def get_section_files(
    section_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    section = db.query(NoteSection).filter(
        NoteSection.id == section_id,
        NoteSection.user_id == user_id
    ).first()

    if not section:
        raise HTTPException(
            status_code=404,
            detail="Section not found"
        )

    return (
        db.query(NoteFile)
        .filter(
            NoteFile.section_id == section_id,
            NoteFile.user_id == user_id
        )
        .order_by(
            NoteFile.created_at.desc(),
            NoteFile.id.desc()
        )
        .all()
    )


# ============================================================
# UPLOAD PDF / DOC / DOCX / PPT / PPTX / JPG / JPEG / PNG /
# XLS / XLSX
# ============================================================

@router.post(
    "/section/{section_id}",
    response_model=NoteFileResponse,
    status_code=201
)
async def upload_file(
    section_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    section = db.query(NoteSection).filter(
        NoteSection.id == section_id,
        NoteSection.user_id == user_id
    ).first()

    if not section:
        raise HTTPException(
            status_code=404,
            detail="Section not found"
        )

    original_name = file.filename or ""
    extension = Path(original_name).suffix.lower()

    if not original_name or extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, XLS and XLSX files are allowed"
        )

    file_info = ALLOWED_EXTENSIONS[extension]

    content = await file.read()

    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File must be 10 MB or smaller"
        )

    stored_name = f"{uuid.uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / stored_name

    try:
        file_path.write_bytes(content)

        new_file = NoteFile(
            user_id=user_id,
            section_id=section_id,
            original_name=original_name,
            stored_name=stored_name,
            file_path=str(file_path),
            file_type=file_info["type"],
            file_size=len(content),
        )

        db.add(new_file)
        db.commit()
        db.refresh(new_file)

        return new_file

    except Exception:
        db.rollback()

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail="Failed to save file"
        )


# ============================================================
# OPEN / VIEW FILE
# ============================================================

@router.get("/{file_id}/open")
def open_file(
    file_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    note_file = db.query(NoteFile).filter(
        NoteFile.id == file_id,
        NoteFile.user_id == user_id
    ).first()

    if not note_file or not os.path.exists(note_file.file_path):
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    extension = Path(note_file.original_name).suffix.lower()
    file_info = ALLOWED_EXTENSIONS.get(extension)

    if not file_info:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    return FileResponse(
        note_file.file_path,
        media_type=file_info["media_type"],
        filename=note_file.original_name,
        content_disposition_type="inline"
    )


# ============================================================
# DELETE FILE
# ============================================================

@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id)
):

    note_file = db.query(NoteFile).filter(
        NoteFile.id == file_id,
        NoteFile.user_id == user_id
    ).first()

    if not note_file:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )

    try:
        if os.path.exists(note_file.file_path):
            os.remove(note_file.file_path)

        db.delete(note_file)
        db.commit()

        return {
            "message": "File deleted successfully"
        }

    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete file"
        )
