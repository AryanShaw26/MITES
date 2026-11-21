import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/", { replace: true });
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/tasks", label: "Tasks", icon: "✅" },
    { path: "/notes", label: "Notes", icon: "📝" },
    { path: "/calendar", label: "Calendar", icon: "📅" },
    { path: "/events", label: "Events", icon: "🎯" },
    { path: "/analytics", label: "Analytics", icon: "📊" },
  ];

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <Link to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
          MITES
        </Link>
      </div>

      <nav className="dashboard-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname.startsWith(item.path) ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button
          type="button"
          className="nav-item settings-btn"
          onClick={() => alert("Settings are configured with default user preferences.")}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Settings</span>
        </button>

        <button
          type="button"
          className="nav-item logout"
          onClick={handleLogout}
        >
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
