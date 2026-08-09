import "./Features.css";

const Features = () => {
  return (
    <>
      {/* ================= FEATURES SECTION ================= */}

      <section className="features-section">

        <div className="section-label">
          FEATURES
        </div>

        <h2>
          Everything you need to stay organized
        </h2>

        <p className="section-description">
          MITES combines notes, tasks, and calendar to help you focus
          <br />
          on what matters most.
        </p>


        {/* Feature Cards */}

        <div className="features-container">

          {/* Smart Tasks */}
          <div className="feature-card">

            <div className="feature-icon purple-icon">
              ✓
            </div>

            <h3>Smart Tasks</h3>

            <p>
              Plan your day with ease. Set priorities,
              reminders, and track your progress.
            </p>

          </div>


          {/* Rich Notes */}
          <div className="feature-card">

            <div className="feature-icon green-icon">
              ▤
            </div>

            <h3>Rich Notes</h3>

            <p>
              Write beautiful notes with formatting,
              tags, and search that actually works.
            </p>

          </div>


          {/* Calendar */}
          <div className="feature-card">

            <div className="feature-icon orange-icon">
              ▣
            </div>

            <h3>Calendar View</h3>

            <p>
              See your tasks and notes by day, week,
              or month in a clean calendar.
            </p>

          </div>


          {/* PDF Export */}
          <div className="feature-card">

            <div className="feature-icon blue-icon">
              ▤
            </div>

            <h3>PDF Export</h3>

            <p>
              Download your tasks or notes as PDF
              for sharing or offline use.
            </p>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section className="how-it-works">

        <div className="section-label">
          HOW IT WORKS
        </div>

        <h2>
          Simple steps to organize your life
        </h2>


        <div className="steps-container">


          {/* Step 1 */}

          <div className="step">

            <div className="step-icon purple-step">
              ♙
            </div>

            <div className="step-content">

              <div className="step-title">
                <span className="step-number purple-number">
                  1
                </span>

                <h3>Sign Up</h3>
              </div>

              <p>
                Create your account
                <br />
                in seconds.
              </p>

            </div>

          </div>


          {/* Arrow */}

          <div className="step-arrow">
            →
          </div>


          {/* Step 2 */}

          <div className="step">

            <div className="step-icon green-step">
              ▤
            </div>

            <div className="step-content">

              <div className="step-title">

                <span className="step-number blue-number">
                  2
                </span>

                <h3>Add Notes & Tasks</h3>

              </div>

              <p>
                Capture your ideas
                <br />
                and plan your day.
              </p>

            </div>

          </div>


          {/* Arrow */}

          <div className="step-arrow">
            →
          </div>


          {/* Step 3 */}

          <div className="step">

            <div className="step-icon orange-step">
              ▣
            </div>

            <div className="step-content">

              <div className="step-title">

                <span className="step-number purple-number">
                  3
                </span>

                <h3>Stay Organized</h3>

              </div>

              <p>
                View everything in
                <br />
                calendar or lists.
              </p>

            </div>

          </div>


          {/* Arrow */}

          <div className="step-arrow">
            →
          </div>


          {/* Step 4 */}

          <div className="step">

            <div className="step-icon blue-step">
              ↓
            </div>

            <div className="step-content">

              <div className="step-title">

                <span className="step-number blue-number">
                  4
                </span>

                <h3>Export & Share</h3>

              </div>

              <p>
                Download as PDF
                <br />
                whenever you need.
              </p>

            </div>

          </div>

        </div>

      </section>

    </>
  );
};

export default Features;