import logo from "../../assets/logo.png";
import "./Hero.css";
const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-left">
        {/* Badge */}
        <div className="hero-badge">✦ Your Notes, Your Tasks, Your Way.</div>

        {/* Main Heading */}
        <h1>
          Organize Your Life.
          <br />
          One Task at a Time.
        </h1>

        {/* Description */}
        <p>
          MITES helps you manage your daily tasks and notes in one beautiful,
          secure, and intelligent workspace.
        </p>

        {/* Buttons */}
        <div className="get-started-live-demo-container">
          <button className="get-started-free">Get Started Free →</button>

          <button className="live-demo">Live Demo ◉</button>
        </div>

        {/* Trust Section */}
        <div className="hero-trust-section">
          {/* Features */}
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-icon">♢</span>
              <span>Secure & Private</span>
            </div>

            <div className="hero-feature">
              <span className="feature-icon">☁</span>
              <span>Cloud Sync</span>
            </div>

            <div className="hero-feature">
              <span className="feature-icon">▣</span>
              <span>PDF Export</span>
            </div>
          </div>

          {/* Users */}
          <div className="trusted-users">
            <p className="trusted-title">Trusted by students & professionals</p>

            <div className="users-content">
              <div className="user-avatars">
                <div className="user-avatar-image">A</div>
                <div className="user-avatar-image">R</div>
                <div className="user-avatar-image">S</div>
                <div className="user-avatar-image">K</div>

                <div className="more-users">2K+</div>
              </div>

              <div className="user-count">
                <strong>2K+</strong>
                <span>Happy Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-right">
        <div className="dashboard-preview">
          {/* ================= SIDEBAR ================= */}

          <aside className="dashboard-sidebar">
            {/* Sidebar Logo */}
            <div className="dashboard-logo">
              <img src={logo} alt="MITES" />
              <span>MITES</span>
            </div>

            {/* Sidebar Menu */}
            <nav className="sidebar-menu">
              <div className="sidebar-item active">
                <span>⌂</span>
                <span>Dashboard</span>
              </div>

              <div className="sidebar-item">
                <span>✓</span>
                <span>Tasks</span>
              </div>

              <div className="sidebar-item">
                <span>▤</span>
                <span>Notes</span>
              </div>

              <div className="sidebar-item">
                <span>▣</span>
                <span>Calendar</span>
              </div>

              <div className="sidebar-item">
                <span>◇</span>
                <span>Tags</span>
              </div>

              <div className="sidebar-item">
                <span>♧</span>
                <span>Reminders</span>
              </div>

              <div className="sidebar-item">
                <span>⚙</span>
                <span>Settings</span>
              </div>
            </nav>

            {/* User Profile */}
            <div className="dashboard-user">
              <div className="user-avatar">AS</div>

              <div className="user-info">
                <strong>Aryan Shaw</strong>
                <span>aryan@example.com</span>
              </div>
            </div>
          </aside>

          {/* ================= MAIN DASHBOARD ================= */}

          <main className="dashboard-main">
            {/* Top Bar */}

            <div className="dashboard-topbar">
              <div className="dashboard-search">
                🔍
                <span>Search anything...</span>
              </div>

              <div className="dashboard-actions">
                <span>♧</span>
                <span>☾</span>
                <div className="small-avatar">AS</div>
              </div>
            </div>

            {/* Greeting */}

            <div className="dashboard-greeting">
              <h2>Good morning, Aryan! 👋</h2>

              <p>Let's stay productive today.</p>
            </div>

            {/* Dashboard Cards */}

            <div className="dashboard-content">
              {/* ================= TASKS ================= */}

              <div className="dashboard-card tasks-card">
                <div className="card-header">
                  <h3>Today's Tasks</h3>
                  <span className="card-count">5</span>
                </div>

                <div className="task-list">
                  <div className="task-item completed">
                    <span className="task-check">✓</span>

                    <div>
                      <strong>Complete React Project</strong>
                      <small>10:00 AM</small>
                    </div>
                  </div>

                  <div className="task-item completed">
                    <span className="task-check">✓</span>

                    <div>
                      <strong>DBMS Revision</strong>
                      <small>11:30 AM</small>
                    </div>
                  </div>

                  <div className="task-item">
                    <span className="task-check empty"></span>

                    <div>
                      <strong>Gym Workout</strong>
                      <small>6:00 PM</small>
                    </div>
                  </div>

                  <div className="task-item completed">
                    <span className="task-check">✓</span>

                    <div>
                      <strong>Team Meeting</strong>
                      <small>7:30 PM</small>
                    </div>
                  </div>

                  <div className="task-item">
                    <span className="task-check empty"></span>

                    <div>
                      <strong>Read a Book</strong>
                      <small>9:30 PM</small>
                    </div>
                  </div>
                </div>

                <div className="card-footer">View All Tasks →</div>
              </div>

              {/* ================= RECENT NOTES ================= */}

              <div className="dashboard-card notes-card">
                <div className="card-header">
                  <h3>Recent Notes</h3>
                  <span className="card-count">3</span>
                </div>

                <div className="notes-list">
                  <div className="note-item">
                    <span className="note-icon">▤</span>

                    <div>
                      <strong>React Hooks Notes</strong>
                      <small>10:15 AM</small>
                    </div>
                  </div>

                  <div className="note-item">
                    <span className="note-icon">▤</span>

                    <div>
                      <strong>DBMS Normalization</strong>
                      <small>11:45 AM</small>
                    </div>
                  </div>

                  <div className="note-item">
                    <span className="note-icon">▤</span>

                    <div>
                      <strong>Interview Questions</strong>
                      <small>12:30 PM</small>
                    </div>
                  </div>
                </div>

                <div className="card-footer">View All Notes →</div>
              </div>

              {/* ================= UPCOMING EVENTS ================= */}

              <div className="dashboard-card upcoming-card">
                <div className="card-header">
                  <h3>Upcoming Events</h3>
                </div>

                <div className="event-item">
                  <span className="event-icon">▣</span>

                  <div>
                    <strong>Team Meeting</strong>
                    <small>Tomorrow, 7:30 PM</small>
                  </div>
                </div>
              </div>

              {/* ================= CALENDAR ================= */}

              <div className="dashboard-card calendar-card">
                <div className="calendar-header">
                  <strong>May 2025</strong>

                  <span>→</span>
                </div>

                <div className="calendar-weekdays">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>

                <div className="calendar-days">
                  <span>11</span>
                  <span>12</span>
                  <span>13</span>
                  <span>14</span>
                  <span>15</span>
                  <span className="today">16</span>
                  <span>17</span>

                  <span>18</span>
                  <span>19</span>
                  <span>20</span>
                  <span>21</span>
                  <span>22</span>
                  <span>23</span>
                  <span>24</span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Hero;
