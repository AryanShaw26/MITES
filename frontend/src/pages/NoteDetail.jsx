import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./NoteDetail.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function NoteDetail() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const [note, setNote] = useState(null);
  const [section, setSection] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchNoteAndSection = async () => {
      try {
        setLoading(true);
        setError("");

        const noteResponse = await fetch(
          `${API_BASE_URL}/notes/${noteId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const noteData = await noteResponse.json().catch(() => ({}));

        if (!noteResponse.ok) {
          throw new Error(
            noteData.detail ||
              `Failed to load note (${noteResponse.status})`
          );
        }

        setNote(noteData);
        setTitle(noteData.title);
        setContent(noteData.content || "");

        const sectionsResponse = await fetch(
          `${API_BASE_URL}/note-sections/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sectionsData = await sectionsResponse.json().catch(() => ({}));

        if (sectionsResponse.ok) {
          const currentSection = sectionsData.find(
            (item) => item.id === noteData.section_id
          );
          setSection(currentSection || null);
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load note");
      } finally {
        setLoading(false);
      }
    };

    fetchNoteAndSection();
  }, [noteId, token]);

  const handleSave = async (event) => {
    event.preventDefault();

    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError("Note title cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: cleanTitle,
            content,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update note");
      }

      setNote(data);
      setTitle(data.title);
      setContent(data.content || "");
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this note permanently?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete note");
      }

      if (note?.section_id) {
        navigate(`/notes/${note.section_id}`);
      } else {
        navigate("/notes");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete note");
    }
  };

  const handleCancelEdit = () => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="dashboard-main">
          <div className="note-detail-page">
            <div className="note-detail-state">Loading note...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="dashboard-main">
          <div className="note-detail-page">
            <div className="note-detail-error">
              {error || "Note not found."}
            </div>

            <button
              type="button"
              className="detail-back-button"
              onClick={() => navigate("/notes")}
            >
              ← Back to Notes
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">
        <div className="note-detail-page">
          <div className="note-detail-topbar">
            <button
              type="button"
              className="detail-back-button"
              onClick={() =>
                navigate(`/notes/${note.section_id}`)
              }
            >
              ← Back to {section?.name || "Section"}
            </button>
          </div>

          {error && (
            <div className="note-detail-error">
              {error}
            </div>
          )}

          <article className="note-detail-card">
            <div className="note-detail-header">
              <div>
                <span className="note-detail-label">
                  {section?.name || "Notes"}
                </span>

                {!editing ? (
                  <h1>{note.title}</h1>
                ) : (
                  <input
                    className="note-detail-title-input"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={255}
                  />
                )}

                {note.created_at && (
                  <p>
                    Created{" "}
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>

              {!editing && (
                <div className="note-detail-actions">
                  <button
                    type="button"
                    className="edit-note-button"
                    onClick={() => {
                      setEditing(true);
                      setError("");
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-note-button"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave}>
                <label htmlFor="detail-content">
                  Note Content
                </label>

                <textarea
                  id="detail-content"
                  className="note-detail-textarea"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={18}
                />

                <div className="detail-edit-actions">
                  <button
                    type="button"
                    className="detail-cancel-button"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="detail-save-button"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="note-detail-content">
                {note.content ? (
                  note.content
                ) : (
                  <span className="empty-detail-content">
                    This note has no content yet.
                  </span>
                )}
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}

export default NoteDetail;
