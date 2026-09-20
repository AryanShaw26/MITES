import "./CTA.css";
import { useNavigate } from "react-router-dom";
const CTA = () => {
  const navigate = useNavigate();
  return (
    <section className="cta-section">
      <div className="cta-container">
        {/* ================= LEFT CONTENT ================= */}

        <div className="cta-content">
          <span className="cta-badge">READY TO GET STARTED?</span>

          <h2>
            Start your productivity
            <br />
            journey with <span>MITES</span>
          </h2>

          <p>
            Join thousands of students and professionals
            <br />
            who are already getting more done with MITES.
          </p>

          {/* Buttons */}

          <div className="cta-buttons">
            <button
              className="cta-primary"
              onClick={() => navigate("/register")}
            >
              Get Started for Free
              <span>→</span>
            </button>

            <button className="cta-secondary">
              <span className="play-icon">▶</span>
              Watch Demo
            </button>
          </div>

          {/* Benefits */}

          <div className="cta-benefits">
            <span>✓ Free forever</span>

            <span className="benefit-divider"></span>

            <span>✓ No credit card required</span>

            <span className="benefit-divider"></span>

            <span>✓ Easy setup</span>
          </div>
        </div>

        {/* ================= RIGHT DASHBOARD ================= */}

        <div className="cta-visual">
          {/* Decorative Check */}

          <div className="floating-check">✓</div>

          {/* Dashboard Card */}

          <div className="cta-dashboard">
            {/* Dashboard Sidebar */}

            <div className="cta-dashboard-sidebar">
              <div className="cta-dashboard-logo">
                <span className="mini-logo">M</span>
                <strong>MITES</strong>
              </div>

              <div className="cta-sidebar-item active">⌂</div>

              <div className="cta-sidebar-item">✓</div>

              <div className="cta-sidebar-item">▤</div>

              <div className="cta-sidebar-item">▣</div>

              <div className="cta-sidebar-item">◇</div>

              <div className="cta-sidebar-item">♧</div>
            </div>

            {/* Dashboard Main */}

            <div className="cta-dashboard-main">
              <div className="cta-dashboard-header">
                <strong>Today</strong>
                <span>•••</span>
              </div>

              {/* Tasks */}

              <div className="cta-task-list">
                <div className="cta-task completed">
                  <span className="cta-task-checkbox">✓</span>

                  <span>Finish project proposal</span>

                  <small>Today</small>
                </div>

                <div className="cta-task">
                  <span className="cta-task-checkbox"></span>

                  <span>Review lecture notes</span>

                  <small>Tomorrow</small>
                </div>

                <div className="cta-task">
                  <span className="cta-task-checkbox"></span>

                  <span>Prepare for presentation</span>

                  <small>May 18</small>
                </div>
              </div>

              {/* Upcoming */}

              <div className="cta-upcoming">
                <h4>Upcoming</h4>

                <div className="cta-calendar">
                  <div>
                    <small>Mon</small>
                    <strong>12</strong>
                  </div>

                  <div>
                    <small>Tue</small>
                    <strong>13</strong>
                  </div>

                  <div className="calendar-active">
                    <small>Wed</small>
                    <strong>14</strong>
                  </div>

                  <div>
                    <small>Thu</small>
                    <strong>15</strong>
                  </div>

                  <div>
                    <small>Fri</small>
                    <strong>16</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Calendar */}

          <div className="floating-calendar">▣</div>
        </div>

        {/* ================= TRUST ================= */}

        <div className="cta-trust">
          <p>Trusted by 2,000+ users worldwide</p>

          <div className="cta-trust-logos">
            <span>Google</span>
            <span>Microsoft</span>
            <span>Notion</span>
            <span>Slack</span>
            <span>GitHub</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
