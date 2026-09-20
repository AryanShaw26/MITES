import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/", { replace: true });
  };

  return (
    <aside className="dashboard-sidebar">

      <div className="dashboard-logo">
        MITES
      </div>

      <nav className="dashboard-nav">

        <Link
          to="/dashboard"
          className={`nav-item ${
            location.pathname === "/dashboard"
              ? "active"
              : ""
          }`}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/tasks"
          className={`nav-item ${
            location.pathname === "/tasks"
              ? "active"
              : ""
          }`}
        >
          ✅ Tasks
        </Link>

        <Link
          to="/notes"
          className="nav-item"
        >
          📝 Notes
        </Link>

        <Link
          to="/calendar"
          className={`nav-item ${
            location.pathname === "/calendar"
              ? "active"
              : ""
          }`}
        >
          📅 Calendar
        </Link>

      </nav>

      <div className="sidebar-bottom">

        <button
          type="button"
          className="nav-item"
        >
          ⚙️ Settings
        </button>

        <button
          type="button"
          className="nav-item logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;