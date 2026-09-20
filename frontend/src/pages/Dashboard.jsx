import { Link } from "react-router-dom";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const navigate = useNavigate();
    const handleLogOut=()=>{
        localStorage.removeItem("access_token");
        navigate("/",{replace:true});
    }
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="dashboard-sidebar">

        <div className="dashboard-logo">
          MITES
        </div>

        <nav className="dashboard-nav">

          <Link to="/dashboard" className="nav-item active">
            🏠 Dashboard
          </Link>

          <Link to="/tasks" className="nav-item">
            ✅ Tasks
          </Link>

          <Link to="/notes" className="nav-item">
            📝 Notes
          </Link>

          <Link to="/calendar" className="nav-item">
            📅 Calendar
          </Link>

        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            ⚙️ Settings
          </button>

          <button className="nav-item logout"
          onClick={handleLogOut}>
            🚪 Logout
          </button>

        </div>

      </aside>


      {/* Main Content */}
      <main className="dashboard-main">

        {/* Header */}
        <header className="dashboard-header">

          <div>
            <h1>Good morning, Aryan 👋</h1>

            <p>
              Here's what's happening with your productivity today.
            </p>
          </div>

          <div className="profile-circle">
            A
          </div>

        </header>


        {/* Stats */}
        <section className="dashboard-stats">

          <div className="stat-card">
            <span className="stat-icon">📋</span>

            <div>
              <p>Total Tasks</p>
              <h2>12</h2>
            </div>
          </div>


          <div className="stat-card">
            <span className="stat-icon">✅</span>

            <div>
              <p>Completed</p>
              <h2>7</h2>
            </div>
          </div>


          <div className="stat-card">
            <span className="stat-icon">⏳</span>

            <div>
              <p>Pending</p>
              <h2>5</h2>
            </div>
          </div>


          <div className="stat-card">
            <span className="stat-icon">📝</span>

            <div>
              <p>Notes</p>
              <h2>8</h2>
            </div>
          </div>

        </section>


        {/* Dashboard Grid */}
        <section className="dashboard-grid">

          {/* Today's Tasks */}
          <div className="dashboard-card tasks-card">

            <div className="card-header">

              <div>
                <h2>Today's Tasks</h2>
                <p>Stay focused on what matters.</p>
              </div>

              <button className="add-button">
                + Add Task
              </button>

            </div>


            <div className="task-list">

              <div className="task-item">
                <input type="checkbox" />
                <span>Complete DSA practice</span>
              </div>

              <div className="task-item">
                <input type="checkbox" />
                <span>Work on MITES project</span>
              </div>

              <div className="task-item completed">
                <input type="checkbox" checked readOnly />
                <span>Complete SQL practice</span>
              </div>

              <div className="task-item">
                <input type="checkbox" />
                <span>Study Data Analytics</span>
              </div>

            </div>

          </div>


          {/* Recent Notes */}
          <div className="dashboard-card notes-card">

            <div className="card-header">

              <div>
                <h2>Recent Notes</h2>
                <p>Your latest thoughts.</p>
              </div>

              <button className="add-button">
                + Add Note
              </button>

            </div>


            <div className="notes-list">

              <div className="note-item">
                <h3>DSA Revision</h3>
                <p>
                  Important algorithms to revise before placement...
                </p>
                <span>Today</span>
              </div>

              <div className="note-item">
                <h3>MITES Development</h3>
                <p>
                  Complete authentication and dashboard...
                </p>
                <span>Yesterday</span>
              </div>

              <div className="note-item">
                <h3>Data Analytics</h3>
                <p>
                  Practice Power BI dashboards and SQL queries...
                </p>
                <span>18 Sep</span>
              </div>

            </div>

          </div>

        </section>


        {/* Upcoming Tasks */}
        <section className="dashboard-card upcoming-card">

          <div className="card-header">

            <div>
              <h2>Upcoming Tasks</h2>
              <p>What's coming next.</p>
            </div>

            <Link to="/tasks">
              View All
            </Link>

          </div>


          <div className="upcoming-list">

            <div className="upcoming-item">
              <div>
                <strong>Complete Capgemini preparation</strong>
                <p>Tomorrow</p>
              </div>

              <span className="priority high">
                High
              </span>
            </div>


            <div className="upcoming-item">
              <div>
                <strong>Build Power BI dashboard</strong>
                <p>22 September</p>
              </div>

              <span className="priority medium">
                Medium
              </span>
            </div>


            <div className="upcoming-item">
              <div>
                <strong>LeetCode practice</strong>
                <p>23 September</p>
              </div>

              <span className="priority low">
                Low
              </span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;