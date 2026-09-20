import "./Footer.css";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="footer">

      <div className="footer-container">

        {/* ================= BRAND ================= */}

        <div className="footer-brand">

          <div className="footer-logo">
            <img src={logo} alt="MITES" />
            <span>MITES</span>
          </div>

          <p>
            Your simple and intelligent workspace
            for managing tasks, notes, and your
            everyday productivity.
          </p>

          <div className="footer-socials">
            <a href="#" aria-label="GitHub">
              GitHub
            </a>

            <a href="#" aria-label="LinkedIn">
              LinkedIn
            </a>

            <a href="#" aria-label="Twitter">
              Twitter
            </a>
          </div>

        </div>


        {/* ================= PRODUCT ================= */}

        <div className="footer-column">

          <h3>
            Product
          </h3>

          <a href="#features">
            Features
          </a>

          <a href="#workspace">
            Dashboard
          </a>

          <a href="#how-it-works">
            How It Works
          </a>

          <a href="#tasks">
            Tasks
          </a>

          <a href="#notes">
            Notes
          </a>

        </div>


        {/* ================= COMPANY ================= */}

        <div className="footer-column">

          <h3>
            Company
          </h3>

          <a href="#about">
            About
          </a>

          <a href="#contact">
            Contact
          </a>

          <a href="#careers">
            Careers
          </a>

          <a href="#blog">
            Blog
          </a>

        </div>


        {/* ================= SUPPORT ================= */}

        <div className="footer-column">

          <h3>
            Support
          </h3>

          <a href="#help">
            Help Center
          </a>

          <a href="#faq">
            FAQ
          </a>

          <a href="#privacy">
            Privacy Policy
          </a>

          <a href="#terms">
            Terms & Conditions
          </a>

        </div>


        {/* ================= NEWSLETTER ================= */}

        <div className="footer-newsletter">

          <h3>
            Stay productive
          </h3>

          <p>
            Get productivity tips and MITES updates
            straight to your inbox.
          </p>

          <div className="newsletter-form">

            <input
              type="email"
              placeholder="Your email address"
            />

            <button>
              →
            </button>

          </div>

        </div>

      </div>


      {/* ================= BOTTOM ================= */}

      <div className="footer-bottom">

        <p>
          © 2026 MITES. All rights reserved.
        </p>

        <div className="footer-bottom-links">

          <a href="#privacy">
            Privacy
          </a>

          <a href="#terms">
            Terms
          </a>

          <a href="#contact">
            Contact
          </a>

        </div>

        <span className="made-with">
          Made with ♥ for better productivity
        </span>

      </div>

    </footer>
  );
};

export default Footer;