import "./RatingsAndReviews.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "../ReviewCard/ReviewCard";

const RatingsAndReviews = ({ itemID }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (itemID) {
          const response = await axios.get(
            `http://localhost:4000/api/reviews/list/${itemID}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.data.success) {
            setReviews(response.data.reviews); // Set reviews for the specific item
          }
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [itemID]);

  if (loading) {
    return <div>Loading reviews...</div>;
  }

  return (
    <div className="ratingsAndReviewsContainer">
      {reviews.length === 0 ? (
        <p>No reviews yet for this item.</p>
      ) : (
        reviews.map((review) => <ReviewCard key={review._id} review={review} />)
      )}
    </div>
  );
};

export default RatingsAndReviews;
