import Footer from "../../../Components/Footer/Footer";
import "./Home.css";
import HomeCategory from "../../../Components/HomeCategory/HomeCategory";
import Banner from "../../../Components/Banner/Banner";

const Home = () => {
  return (
    <div>
      <div className="heroSection">
        <div className="heroLeft"></div>
        <div className="heroRight">
          <div className="heroBg">
            <h1 className="heroMainTitle">Where Passion Meets the Harsha.</h1>
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
