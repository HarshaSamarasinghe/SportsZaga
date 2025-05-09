import "./Banner.css";
import { useNavigate } from "react-router-dom";

function Banner() {
  const navigate = useNavigate();
  return (
    <div className="modern-banner-container">
      <div className="modern-banner-content">
        <h1 className="modern-banner-title">Welcome to Sports Zaga</h1>
        <p className="modern-banner-subtitle">
          Discover the latest news, updates, and everything you love about
          Cricket, Football, Badminton, and Basketball.
        </p>
        <button
          className="modern-banner-button"
          onClick={() => navigate("/shop")}
        >
          Shop Now
        </button>
      </div>
    </div>
  );
}

export default Banner;
