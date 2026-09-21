from datetime import datetime
from pydantic import BaseModel, ConfigDict

class NoteFileResponse(BaseModel):
    id: int
    section_id: int
    original_name: str
    file_type: str
    file_size: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
