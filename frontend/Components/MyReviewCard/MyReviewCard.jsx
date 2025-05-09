import "./MyReviewCard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyReviewCard = ({ review, itemID }) => {
  console.log(review, "rvv");
  const navigate = useNavigate();
  const deleteReview = async (reviewID) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/reviews/delete/${reviewID}/${itemID}`,
        {}, // Empty body (POST still needs an object here)
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error(
        "Error deleting review:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="reviewCard">
      <div className="reviewHeader">
        <div className="reviewUserIcon">
          <i className="bx bx-user-circle"></i>
          {/* <p>{review.cusID}</p> */}
        </div>
        <div className="reviewDate">
          {new Date(review.createdAt).toLocaleString()}
        </div>
      </div>
      <div className="reviewBody">
        <div className="reviewRating">
          {Array.from({ length: 5 }, (_, index) => (
            <i
              key={index}
              className={`bx bxs-star ${index < review.rating ? "filled" : ""}`}
            />
          ))}
        </div>
        <div className="reviewText">{review.reviewText}</div>
        <div className="updateAndDeleteReviewArea">
          <button
            className="updateReviewBtn"
            onClick={() => navigate(`/update-review/${review._id}`)}
          >
            Update
          </button>
          <button
            className="deleteReviewBtn"
            onClick={() => deleteReview(review._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyReviewCard;
