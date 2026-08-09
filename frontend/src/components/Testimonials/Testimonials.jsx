import "./Testimonials.css";

const Testimonials = () => {
  return (
    <section className="testimonials-section">

      {/* Section Header */}

      <div className="testimonials-header">

        <span className="testimonials-label">
          TESTIMONIALS
        </span>

        <h2>
          Loved by people who get things done
        </h2>

        <p>
          See how MITES helps people stay organized,
          focused, and productive every day.
        </p>

      </div>


      {/* Testimonials */}

      <div className="testimonials-container">

        {/* Testimonial 1 */}

        <div className="testimonial-card">

          <div className="testimonial-stars">
            ★★★★★
          </div>

          <p className="testimonial-text">
            "MITES completely changed the way I organize
            my college work. I can keep my notes and daily
            tasks together without switching between apps."
          </p>

          <div className="testimonial-user">

            <div className="testimonial-avatar purple-avatar">
              AS
            </div>

            <div className="testimonial-user-info">
              <strong>Aryan Sharma</strong>
              <span>Computer Science Student</span>
            </div>

          </div>

        </div>


        {/* Testimonial 2 */}

        <div className="testimonial-card featured-testimonial">

          <div className="testimonial-stars">
            ★★★★★
          </div>

          <p className="testimonial-text">
            "The daily task management is simple but powerful.
            I especially love being able to organize my notes
            by date and export everything as a PDF."
          </p>

          <div className="testimonial-user">

            <div className="testimonial-avatar green-avatar">
              PR
            </div>

            <div className="testimonial-user-info">
              <strong>Priya Roy</strong>
              <span>Software Developer</span>
            </div>

          </div>

        </div>


        {/* Testimonial 3 */}

        <div className="testimonial-card">

          <div className="testimonial-stars">
            ★★★★★
          </div>

          <p className="testimonial-text">
            "I wanted something lightweight for planning my
            day and storing project notes. MITES gives me
            everything I need in one clean workspace."
          </p>

          <div className="testimonial-user">

            <div className="testimonial-avatar blue-avatar">
              RK
            </div>

            <div className="testimonial-user-info">
              <strong>Rahul Kumar</strong>
              <span>Product Designer</span>
            </div>

          </div>

        </div>

      </div>


      {/* Bottom Trust Text */}

      <div className="testimonial-trust">

        <span className="trust-check">
          ✓
        </span>

        <span>
          Join 2,000+ students and professionals using MITES
        </span>

      </div>

    </section>
  );
};

export default Testimonials;