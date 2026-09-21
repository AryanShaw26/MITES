import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import "./SectionNotes.css";

const API_BASE_URL = "http://127.0.0.1:8000";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".jpg", ".jpeg", ".png", ".xls", ".xlsx"];

function SectionNotes() {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [notes, setNotes] = useState([]);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);

  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const token = localStorage.getItem("access_token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchSection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/note-sections/`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to load section (${response.status})`
        );
      }

      const currentSection = data.find(
        (item) => String(item.id) === String(sectionId)
      );

      if (!currentSection) {
        throw new Error("Section not found");
      }

      setSection(currentSection);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load section");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      setNotesLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/notes/section/${sectionId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to load notes (${response.status})`
        );
      }

      setNotes(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load notes");
    } finally {
      setNotesLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      setFilesLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/note-files/section/${sectionId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to load documents (${response.status})`
        );
      }

      setFiles(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load documents");
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    fetchSection();
    fetchNotes();
    fetchFiles();
  }, [sectionId]);

  const handleCreateNote = async (event) => {
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
        `${API_BASE_URL}/notes/section/${sectionId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            title: cleanTitle,
            content,
          }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create note");
      }

      setNotes((previous) => [data, ...previous]);
      setTitle("");
      setContent("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create note");
    } finally {
      setSaving(false);
    }
  };

  const handleUploadFile = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, XLS or XLSX file first.");
      return;
    }

    const extension = `.${selectedFile.name.split(".").pop().toLowerCase()}`;

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setError("Only PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, XLS and XLSX files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File must be 10 MB or smaller.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_BASE_URL}/note-files/section/${sectionId}`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: formData,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Failed to upload file");
      }

      setFiles((previous) => [data, ...previous]);
      setSelectedFile(null);

      const input = document.getElementById("file-upload");
      if (input) {
        input.value = "";
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleOpenFile = (fileId) => {
    // Opening the protected API URL directly does not send the Bearer token.
    // Fetch the protected file with auth, then open a temporary blob URL.
    const openPdf = async () => {
      try {
        setError("");

        const response = await fetch(
          `${API_BASE_URL}/note-files/${fileId}/open`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.detail || "Failed to open file");
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl, "_blank");

        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
        }, 60000);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to open file");
      }
    };

    openPdf();
  };

  const handleDeleteFile = async (fileId) => {
    const confirmed = window.confirm("Delete this document?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/note-files/${fileId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete document");
      }

      setFiles((previous) =>
        previous.filter((file) => file.id !== fileId)
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete document");
    }
  };

  const handleDeleteNote = async (noteId) => {
    const confirmed = window.confirm("Delete this note?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete note");
      }

      setNotes((previous) =>
        previous.filter((note) => note.id !== noteId)
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete note");
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="dashboard-main">
          <div className="section-notes-page">
            <div className="section-notes-state">
              Loading section...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">
        <div className="section-notes-page">
          <div className="section-notes-topbar">
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/notes")}
            >
              ← Back to Notes
            </button>
          </div>

          {error && <div className="section-notes-error">{error}</div>}

          {!section ? (
            <div className="section-notes-state">
              Section could not be found.
            </div>
          ) : (
            <>
              <header className="section-notes-header">
                <div>
                  <span className="section-notes-label">
                    Notes Workspace
                  </span>
                  <h1>{section.name}</h1>
                  <p>
                    Create notes and keep your study documents inside this section.
                  </p>
                </div>

                <button
                  type="button"
                  className="add-note-button"
                  onClick={() => {
                    setShowForm((previous) => !previous);
                    setError("");
                  }}
                >
                  {showForm ? "Close" : "+ Add Note"}
                </button>
              </header>

              {showForm && (
                <section className="note-form-card">
                  <div className="note-form-heading">
                    <h2>Create a note</h2>
                    <p>Save your study material in this section.</p>
                  </div>

                  <form onSubmit={handleCreateNote}>
                    <label htmlFor="note-title">Title</label>
                    <input
                      id="note-title"
                      type="text"
                      placeholder="e.g. Percentage Formulas"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      maxLength={255}
                      autoFocus
                    />

                    <label htmlFor="note-content">Content</label>
                    <textarea
                      id="note-content"
                      placeholder="Write your notes here..."
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                      rows={8}
                    />

                    <div className="note-form-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => {
                          setShowForm(false);
                          setTitle("");
                          setContent("");
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="save-note-button"
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save Note"}
                      </button>
                    </div>
                  </form>
                </section>
              )}

              <section className="notes-list-section">
                <div className="notes-list-heading">
                  <div>
                    <h2>Your Notes</h2>
                    <p>
                      {notes.length} note
                      {notes.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {notesLoading ? (
                  <div className="section-notes-state">
                    Loading notes...
                  </div>
                ) : notes.length === 0 ? (
                  <div className="section-notes-empty">
                    <div className="empty-note-icon">📝</div>
                    <h3>No notes yet</h3>
                    <p>
                      Start building your {section.name} workspace by
                      creating your first note.
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowForm(true)}
                    >
                      + Create First Note
                    </button>
                  </div>
                ) : (
                  <div className="notes-list">
                    {notes.map((note) => (
                      <article className="note-card" key={note.id}>
                        <button
                          type="button"
                          className="note-card-open"
                          onClick={() =>
                            navigate(`/notes/note/${note.id}`)
                          }
                        >
                          <div className="note-card-content">
                            <div className="note-icon">📝</div>

                            <div className="note-card-main">
                              <h3>{note.title}</h3>

                              {note.content ? (
                                <p>{note.content}</p>
                              ) : (
                                <p className="no-content">
                                  No content added.
                                </p>
                              )}

                              {note.created_at && (
                                <small>
                                  Created{" "}
                                  {new Date(
                                    note.created_at
                                  ).toLocaleDateString()}
                                </small>
                              )}
                            </div>
                          </div>
                        </button>

                        <div className="note-card-actions">
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              <section className="documents-section">
                <div className="notes-list-heading">
                  <div>
                    <h2>Documents</h2>
                    <p>
                      Upload PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, XLS and XLSX study materials for this section.
                    </p>
                  </div>
                </div>

                <div className="document-upload-card">
                  <form onSubmit={handleUploadFile}>
                    <label htmlFor="file-upload">
                      Select Document
                    </label>

                    <input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/jpeg,image/png,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      onChange={(event) =>
                        setSelectedFile(
                          event.target.files?.[0] || null
                        )
                      }
                    />

                    <p className="upload-help">
                      PDF, DOC, DOCX, PPT, PPTX, JPG, JPEG, PNG, XLS or XLSX · Maximum size: 10 MB
                    </p>

                    <button
                      type="submit"
                      className="save-note-button"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload Document"}
                    </button>
                  </form>
                </div>

                {filesLoading ? (
                  <div className="section-notes-state">
                    Loading documents...
                  </div>
                ) : files.length === 0 ? (
                  <div className="section-notes-empty">
                    <div className="empty-note-icon">📄</div>
                    <h3>No documents yet</h3>
                    <p>
                      Upload your first document to keep study material inside{" "}
                      {section.name}.
                    </p>
                  </div>
                ) : (
                  <div className="documents-list">
                    {files.map((file) => (
                      <article className="document-card" key={file.id}>
                        <div className="document-info">
                          <div className="document-icon">{file.file_type === "pdf" ? "📄" : file.file_type === "ppt" || file.file_type === "pptx" ? "📊" : file.file_type === "jpg" || file.file_type === "jpeg" || file.file_type === "png" ? "🖼️" : file.file_type === "xls" || file.file_type === "xlsx" ? "📗" : "📝"}</div>

                          <div>
                            <h3>{file.original_name}</h3>
                            <p>
                              {file.file_type?.toUpperCase()} ·{" "}
                              {(file.file_size / (1024 * 1024)).toFixed(
                                2
                              )}{" "}
                              MB
                            </p>
                          </div>
                        </div>

                        <div className="document-actions">
                          <button
                            type="button"
                            className="edit-note-button"
                            onClick={() => handleOpenFile(file.id)}
                          >
                            Open
                          </button>

                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default SectionNotes;
