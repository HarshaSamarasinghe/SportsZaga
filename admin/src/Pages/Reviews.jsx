import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reviews.css";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reviews/all");
      setReviews(response.data.reviews);
      setLoading(false);
    } catch (error) {
      showToast("Failed to fetch reviews", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleGenerateReviewReports = async () => {
    navigate("/ReviewReports");
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleDeleteClick = (review) => {
    setSelectedReview(review);
    setShowDeleteModal(true);
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      await axios.post(
        `http://localhost:4000/api/reviews/delete/${selectedReview._id}/${selectedReview.itemID}`
      );
      showToast("Review deleted successfully", "success");
      setShowDeleteModal(false);
      fetchReviews();
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete review",
        "error"
      );
      setShowDeleteModal(false);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.cusID.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating =
      filterRating === "all" || review.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const getRatingColor = (rating) => {
    switch (rating) {
      case 5:
        return "green";
      case 4:
        return "blue";
      case 3:
        return "yellow";
      case 2:
        return "orange";
      case 1:
        return "red";
      default:
        return "gray";
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="reviews-container">
      <h1 className="reviews-title">Reviews Management</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
          className="rating-filter"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>

        <button
          className="btn-review-reports"
          onClick={handleGenerateReviewReports}
        >
          Generate Review Reports
        </button>
      </div>

      <div className="table-container">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Item ID</th>
              <th>Rating</th>
              <th>Review</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReviews.map((review) => (
              <tr key={review._id}>
                <td>{review.cusID}</td>
                <td>{review.itemID}</td>
                <td>
                  <div className="rating-cell">
                    <span
                      className={`rating-badge ${getRatingColor(
                        review.rating
                      )}`}
                    >
                      {review.rating}
                    </span>
                    <div className="stars-container">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </td>
                <td>{review.reviewText}</td>
                <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteClick(review)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Delete Review</h2>
            <p>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={handleDeleteReview}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}
    </div>
  );
};

export default Reviews;
