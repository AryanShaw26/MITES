import "./Workspace.css";
import logo from "../../assets/logo.png";

const Workspace = () => {
  return (
    <section id="about" className="workspace-section">

      <div className="workspace-container">

        {/* ================= LEFT CONTENT ================= */}

        <div className="workspace-content">

          <span className="workspace-label">
            YOUR WORKSPACE
          </span>

          <h2>
            All your productivity
            <br />
            in one place.
          </h2>

          <p>
            A clean, intuitive dashboard that helps
            you focus, plan, and achieve more
            every day.
          </p>

          <button className="workspace-button">
            Explore Dashboard →
          </button>

        </div>


        {/* ================= DASHBOARD PREVIEW ================= */}

        <div className="workspace-dashboard">

          {/* Sidebar */}

          <aside className="workspace-sidebar">

            <div className="workspace-logo">
              <img src={logo} alt="MITES" />
              <span>MITES</span>
            </div>

            <nav className="workspace-menu">

              <div className="workspace-menu-item active">
                <span>⌂</span>
                Dashboard
              </div>

              <div className="workspace-menu-item">
                <span>✓</span>
                Tasks
              </div>

              <div className="workspace-menu-item">
                <span>▤</span>
                Notes
              </div>

              <div className="workspace-menu-item">
                <span>▣</span>
                Calendar
              </div>

              <div className="workspace-menu-item">
                <span>◇</span>
                Tags
              </div>

              <div className="workspace-menu-item">
                <span>♧</span>
                Reminders
              </div>

            </nav>

          </aside>


          {/* Main Dashboard */}

          <div className="workspace-main">

            {/* Topbar */}

            <div className="workspace-topbar">

              <div>
                <span>◷</span>
                <span>May 16, 2025</span>
                <span>→</span>
              </div>

              <div className="workspace-actions">
                <span>☾</span>
                <span>♧</span>
                <div className="workspace-avatar">
                  AS
                </div>
              </div>

            </div>


            {/* Overview */}

            <h3 className="overview-title">
              Overview
            </h3>


            {/* Statistics */}

            <div className="workspace-stats">

              <div className="stat-card">

                <span>Tasks Today</span>

                <strong>12</strong>

                <small>
                  +20% from yesterday
                </small>

              </div>


              <div className="stat-card">

                <span>Completed</span>

                <strong>7</strong>

                <small>
                  +40% from yesterday
                </small>

              </div>


              <div className="stat-card">

                <span>Notes</span>

                <strong>8</strong>

                <small>
                  +15% from yesterday
                </small>

              </div>


              <div className="stat-card">

                <span>Streak</span>

                <strong>5 days</strong>

                <small>
                  Keep it up! 🔥
                </small>

              </div>

            </div>


            {/* Bottom Cards */}

            <div className="workspace-bottom">


              {/* Upcoming Tasks */}

              <div className="workspace-card">

                <h4>
                  Upcoming Tasks
                </h4>

                <div className="workspace-task">

                  <span className="task-circle"></span>

                  <div>
                    <strong>
                      Project Submission
                    </strong>

                    <small>
                      May 17, 10:00 AM
                    </small>
                  </div>

                  <span className="priority high">
                    High
                  </span>

                </div>


                <div className="workspace-task">

                  <span className="task-circle"></span>

                  <div>
                    <strong>
                      Learn Next.js
                    </strong>

                    <small>
                      May 17, 02:00 PM
                    </small>
                  </div>

                  <span className="priority medium">
                    Medium
                  </span>

                </div>

              </div>


              {/* Recent Notes */}

              <div className="workspace-card">

                <h4>
                  Recent Notes
                </h4>

                <div className="workspace-note">

                  <span className="note-circle"></span>

                  <div>
                    <strong>
                      System Design Notes
                    </strong>

                    <small>
                      May 16, 09:20 AM
                    </small>
                  </div>

                </div>


                <div className="workspace-note">

                  <span className="note-circle"></span>

                  <div>
                    <strong>
                      JavaScript Concepts
                    </strong>

                    <small>
                      May 15, 08:20 PM
                    </small>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Workspace;