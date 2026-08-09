import "./HowItWorks.css";

const HowItWorks = () => {
  return (
    <section className="how-it-works-section">

      {/* Section Heading */}

      <div className="how-it-works-header">

        <span className="how-it-works-label">
          HOW IT WORKS
        </span>

        <h2>
          Simple steps to organize your life
        </h2>

        <p>
          Get started in minutes and take control of your tasks, notes,
          <br />
          and schedule effortlessly.
        </p>

      </div>


      {/* Steps */}

      <div className="steps-container">

        {/* Step 1 */}

        <div className="work-step">

          <div className="step-number">
            1
          </div>

          <div className="step-icon purple-step-icon">
            ♙
          </div>

          <div className="step-info">

            <h3>
              Sign Up
            </h3>

            <p>
              Create your account
              <br />
              in seconds.
            </p>

          </div>

        </div>


        {/* Arrow */}

        <div className="work-arrow">
          →
        </div>


        {/* Step 2 */}

        <div className="work-step">

          <div className="step-number green-number">
            2
          </div>

          <div className="step-icon green-step-icon">
            ▤
          </div>

          <div className="step-info">

            <h3>
              Add Notes & Tasks
            </h3>

            <p>
              Capture your ideas
              <br />
              and plan your day.
            </p>

          </div>

        </div>


        {/* Arrow */}

        <div className="work-arrow">
          →
        </div>


        {/* Step 3 */}

        <div className="work-step">

          <div className="step-number orange-number">
            3
          </div>

          <div className="step-icon orange-step-icon">
            ▣
          </div>

          <div className="step-info">

            <h3>
              Stay Organized
            </h3>

            <p>
              View everything in
              <br />
              calendar or lists.
            </p>

          </div>

        </div>


        {/* Arrow */}

        <div className="work-arrow">
          →
        </div>


        {/* Step 4 */}

        <div className="work-step">

          <div className="step-number blue-number">
            4
          </div>

          <div className="step-icon blue-step-icon">
            ↑
          </div>

          <div className="step-info">

            <h3>
              Export & Share
            </h3>

            <p>
              Download as PDF
              <br />
              whenever you need.
            </p>

          </div>

        </div>

      </div>


      {/* Bottom Productivity Banner */}

      <div className="productivity-banner">

        {/* Left */}

        <div className="productivity-content">

          <div className="productivity-icon">
            ✦
          </div>

          <div>

            <h3>
              Built for productivity
            </h3>

            <p>
              MITES is designed to help students, professionals, and teams
              <br />
              stay focused and achieve more every day.
            </p>

          </div>

        </div>


        {/* Divider */}

        <div className="productivity-divider"></div>


        {/* Right */}

        <div className="trusted-productivity">

          <div className="productivity-avatars">

            <div className="productivity-avatar">
              A
            </div>

            <div className="productivity-avatar">
              R
            </div>

            <div className="productivity-avatar">
              S
            </div>

            <div className="productivity-users">
              2K+
            </div>

          </div>

          <div className="trusted-text">

            <strong>
              Trusted by 2,000+ users
            </strong>

            <span>
              from around the world
            </span>

          </div>

        </div>

      </div>

    </section>
  );
};

export default HowItWorks;