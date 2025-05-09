// import React from "react";
// import "./Home.css";
// import Footer from "../../../Components/Footer/Footer";
// import { useNavigate } from "react-router-dom";

// const HomePage = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="homepage">
//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="logo">Sports Zaga</div>
//         <ul className="nav-links">
//           <li>
//             <a href="#">Home</a>
//           </li>
//           <li>
//             <a href="#" onClick={() => navigate("/shop")}>
//               Shop
//             </a>
//           </li>
//           <li>
//             <a href="#">About</a>
//           </li>
//           <li>
//             <a href="#" onClick={() => navigate("/profile")}>
//               Profile
//             </a>
//           </li>
//           <li>
//             <a href="#" onClick={() => navigate("/rentingStore")}>
//               Renting
//             </a>
//           </li>
//         </ul>
//         <div className="nav-icons">
//           <span>📞 075 4556780</span>
//           <span>🔍</span>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <header className="hero-section">
//         <div className="hero-content">
//           <h1>
//             CHOICE <span>YOURSELF</span>
//           </h1>
//           <p>
//             At Sport Zaga, we bring you a premium selection of sports equipment
//             and fitness gear to help you achieve your goals. Whether you're into
//             strength training, team sports, or outdoor adventures, we have the
//             right gear for you.
//           </p>
//           <button className="cta-button" onClick={() => navigate("/login")}>
//             Join Now
//           </button>
//         </div>
//       </header>

//       <Footer />
//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import Navbar from "../../../Components/Navbar/Navbar";
import Footer from "../../../Components/Footer/Footer";
import "./Home.css";
import HomeCategory from "../../../Components/HomeCategory/HomeCategory";
import Banner from "../../../Components/Banner/Banner";

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="heroSection">
        <div className="heroLeft"></div>
        <div className="heroRight">
          <div className="heroBg">
            <h1 className="heroMainTitle">Where Passion Meets the Game.</h1>
          </div>
        </div>
      </div>
      <div className="bannerSection">
        <Banner />
      </div>
      <div className="categorySection">
        <h1 className="categoryTItle">Our Categories</h1>
        <HomeCategory />
      </div>
      <div className="footerSection">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
