import "./MyReviews.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MyReviewCard from "../MyReviewCard/MyReviewCard";

const MyReviews = ({ itemID }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        if (itemID) {
          const response = await axios.get(
            `http://localhost:4000/api/reviews/my/${itemID}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.data.success) {
            setReviews(response.data.reviews);
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
        reviews.map((review) => (
          <MyReviewCard review={review} itemID={itemID} />
        ))
      )}
    </div>
  );
};

export default MyReviews;
