import "./HomeCategory.css";

function HomeCategory() {
  return (
    <div className="unique-home-category-wrapper">
      <div className="unique-category-box">
        <div className="unique-category-bg cricket-bg">
          <span className="unique-category-title">Cricket</span>
        </div>
      </div>

      <div className="unique-category-box">
        <div className="unique-category-bg football-bg">
          <span className="unique-category-title">Football</span>
        </div>
      </div>

      <div className="unique-category-box">
        <div className="unique-category-bg badminton-bg">
          <span className="unique-category-title">Badminton</span>
        </div>
      </div>

      <div className="unique-category-box">
        <div className="unique-category-bg basketball-bg">
          <span className="unique-category-title">Basketball</span>
        </div>
      </div>
    </div>
  );
}

export default HomeCategory;
