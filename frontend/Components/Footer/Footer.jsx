import "./Footer.css";

function Footer() {
  return (
    <footer className="modern-footer">
      <div className="footer-container">
        <div className="footer-logo-section">
          <h2 className="footer-logo">Sports Zaga</h2>
          <p className="footer-description">
            Your daily dose of Cricket, Football, Badminton, and Basketball
            updates.
          </p>
          <div className="footer-social-icons">
            <a href="#">
              <i className="bx bxl-facebook"></i>
            </a>
            <a href="#">
              <i className="bx bxl-instagram"></i>
            </a>
            <a href="#">
              <i className="bx bxl-twitter"></i>
            </a>
            <a href="#">
              <i className="bx bxl-youtube"></i>
            </a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Cricket</h4>
            <ul>
              <li>
                <a href="#">Latest Matches</a>
              </li>
              <li>
                <a href="#">Tournaments</a>
              </li>
              <li>
                <a href="#">Teams</a>
              </li>
              <li>
                <a href="#">Rankings</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Football</h4>
            <ul>
              <li>
                <a href="#">Live Scores</a>
              </li>
              <li>
                <a href="#">Leagues</a>
              </li>
              <li>
                <a href="#">Clubs</a>
              </li>
              <li>
                <a href="#">Transfers</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Badminton</h4>
            <ul>
              <li>
                <a href="#">Tournaments</a>
              </li>
              <li>
                <a href="#">Players</a>
              </li>
              <li>
                <a href="#">News</a>
              </li>
              <li>
                <a href="#">Schedule</a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Basketball</h4>
            <ul>
              <li>
                <a href="#">NBA</a>
              </li>
              <li>
                <a href="#">Teams</a>
              </li>
              <li>
                <a href="#">Matches</a>
              </li>
              <li>
                <a href="#">Highlights</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
