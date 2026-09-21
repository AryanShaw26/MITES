import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import "./Notes.css";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        throw new Error("You are not logged in. Please log in again.");
      }

      const response = await fetch(
        "http://127.0.0.1:8000/note-sections/",
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to load note sections (${response.status})`
        );
      }

      setSections(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch sections error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const createSectionRequest = async (name) => {
    if (!token) {
      throw new Error("You are not logged in. Please log in again.");
    }

    const response = await fetch(
      "http://127.0.0.1:8000/note-sections/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ name }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.detail || `Failed to create section (${response.status})`
      );
    }

    return data;
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleCreateSection = async (event) => {
    event.preventDefault();

    const name = newSectionName.trim();

    if (!name) {
      setError("Please enter a section name.");
      return;
    }

    try {
      setCreating(true);
      setError("");

      const created = await createSectionRequest(name);

      setSections((previous) => [...previous, created]);
      setNewSectionName("");
    } catch (err) {
      console.error("Create section error:", err);
      setError(err.message || "Failed to create section");
    } finally {
      setCreating(false);
    }
  };

  const handleStartEdit = (section) => {
    setEditingId(section.id);
    setEditingName(section.name);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleUpdateSection = async (sectionId) => {
    const name = editingName.trim();

    if (!name) {
      setError("Section name cannot be empty.");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/note-sections/${sectionId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ name }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to update section (${response.status})`
        );
      }

      setSections((previous) =>
        previous.map((section) =>
          section.id === sectionId ? data : section
        )
      );

      handleCancelEdit();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to update section");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    const confirmed = window.confirm("Delete this section?");

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/note-sections/${sectionId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.detail || `Failed to delete section (${response.status})`
        );
      }

      setSections((previous) =>
        previous.filter((section) => section.id !== sectionId)
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete section");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="dashboard-main">
        <div className="notes-page">
          <div className="notes-header">
            <div>
              <h1>Notes</h1>
              <p>Organize your study materials by subject.</p>
            </div>
          </div>

          <section className="notes-create-card">
            <div>
              <h2>Create a section</h2>
              <p>Add your own subject or workspace.</p>
            </div>

            <form
              className="notes-create-form"
              onSubmit={handleCreateSection}
            >
              <input
                type="text"
                placeholder="e.g. Machine Learning"
                value={newSectionName}
                onChange={(event) => {
                  setNewSectionName(event.target.value);
                  if (error) {
                    setError("");
                  }
                }}
                maxLength={100}
              />

              <button
                type="submit"
                disabled={creating}
              >
                {creating ? "Creating..." : "+ Add Section"}
              </button>
            </form>
          </section>

          {error && <div className="notes-error">{error}</div>}

          <section className="notes-sections">
            <div className="notes-section-heading">
              <div>
                <h2>Your Sections</h2>
                <p>
                  {sections.length} section
                  {sections.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="notes-empty-state">
                Loading sections...
              </div>
            ) : sections.length === 0 ? (
              <div className="notes-empty-state">
                No sections yet. Create your first section above.
              </div>
            ) : (
              <div className="notes-section-grid">
                {sections.map((section) => (
                  <article
                    className="notes-section-card"
                    key={section.id}
                    onClick={() => navigate(`/notes/${section.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        navigate(`/notes/${section.id}`);
                      }
                    }}
                  >
                    <div className="notes-section-icon">📝</div>

                    {editingId === section.id ? (
                      <div
                        className="notes-edit-area"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editingName}
                          onChange={(event) =>
                            setEditingName(event.target.value)
                          }
                          maxLength={100}
                          autoFocus
                        />

                        <div className="notes-actions">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateSection(section.id)
                            }
                          >
                            Save
                          </button>

                          <button
                            type="button"
                            className="secondary"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3>{section.name}</h3>

                        <p>
                          Open this section to manage your notes and
                          documents.
                        </p>

                        <div
                          className="notes-actions"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => handleStartEdit(section)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="danger"
                            onClick={() =>
                              handleDeleteSection(section.id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Notes;
