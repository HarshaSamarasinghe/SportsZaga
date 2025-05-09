import React, { useState } from "react";
import "./ReviewBox.css";
import axios from "axios";

const ReviewBox = ({ itemId }) => {
  const [formData, setFormData] = useState({
    rating: "1",
    reviewText: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create review
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:4000/api/reviews/add/${itemId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Submitted Data:", formData);
      console.log("Response Data:", response.data);
    } catch (error) {
      console.error("Error creating review:", error);
    }
  };

  return (
    <div className="review-form-container">
      <form>
        <div className="rating-section">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={formData.rating >= num ? "star selected" : "star"}
              onClick={() =>
                setFormData({ ...formData, rating: num.toString() })
              }
            >
              ★
            </span>
          ))}
        </div>

        <label htmlFor="review">Review</label>
        <br />
        <textarea
          className="addReviewArea"
          id="review"
          name="reviewText"
          rows="4"
          value={formData.reviewText}
          onChange={handleChange}
          required
        ></textarea>
        <br />
        <br />

        <button type="button" className="submit-button" onClick={handleSubmit}>
          Add Review
        </button>
      </form>
    </div>
  );
};

export default ReviewBox;
