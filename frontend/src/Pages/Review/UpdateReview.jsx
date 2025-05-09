// import React, { useState } from "react";
// import axios from "axios";
// import "./UpdateReview.css";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const UpdateReview = ({ initialRating = 0, initialText = "" }) => {
//   const navigate = useNavigate();
//   const [rating, setRating] = useState(initialRating);
//   const [hoveredRating, setHoveredRating] = useState(null);
//   const [reviewText, setReviewText] = useState(initialText);
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();
//   const url = "http://localhost:4000";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!rating) return alert("Please select a rating.");

//     setLoading(true);
//     try {
//       const response = await axios.put(
//         `${url}/api/reviews/update/${id}`,
//         { rating, reviewText },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const data = response.data; // No need for await or .json()

//       if (data.success) {
//         alert("Review updated successfully!");
//         navigate(-1);
//       } else {
//         alert("Error: " + data.message);
//       }
//     } catch (error) {
//       console.log("Update failed:", error);
//       alert("Server error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
//       <h2>Update Your Review</h2>

//       <div
//         style={{
//           display: "flex",
//           flexDirection: "row-reverse",
//           fontSize: "2rem",
//           gap: "0.2rem",
//         }}
//       >
//         {[1, 2, 3, 4, 5].reverse().map((star) => (
//           <span
//             key={star}
//             style={{
//               cursor: "pointer",
//               color: (hoveredRating || rating) >= star ? "#f5b301" : "#ccc",
//             }}
//             onMouseEnter={() => setHoveredRating(star)}
//             onMouseLeave={() => setHoveredRating(null)}
//             onClick={() => setRating(star)}
//           >
//             ★
//           </span>
//         ))}
//       </div>

//       <div style={{ marginTop: "1rem" }}>
//         <label htmlFor="reviewText">Review:</label>
//         <textarea
//           id="reviewText"
//           rows={4}
//           style={{ width: "100%", padding: "0.5rem" }}
//           value={reviewText}
//           onChange={(e) => setReviewText(e.target.value)}
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         style={{ marginTop: "1rem", padding: "0.5rem 1rem", fontSize: "1rem" }}
//       >
//         {loading ? "Updating..." : "Update Review"}
//       </button>
//     </form>
//   );
// };

// export default UpdateReview;

import React, { useState } from "react";
import axios from "axios";
import "./UpdateReview.css";
import { useParams, useNavigate } from "react-router-dom";

const UpdateReview = ({ initialRating = 0, initialText = "" }) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(null);
  const [reviewText, setReviewText] = useState(initialText);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const url = "http://localhost:4000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return alert("Please select a rating.");

    setLoading(true);
    try {
      const response = await axios.put(
        `${url}/api/reviews/update/${id}`,
        { rating, reviewText },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.success) {
        alert("Review updated successfully!");
        navigate(-1);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.log("Update failed:", error);
      alert("Server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="ur-container-9384" onSubmit={handleSubmit}>
      <h2 className="ur-title-9384">Update Your Review</h2>

      <div className="ur-stars-wrapper-9384">
        {[1, 2, 3, 4, 5].reverse().map((star) => (
          <span
            key={star}
            className={`ur-star-9384 ${
              (hoveredRating || rating) >= star ? "ur-star-selected-9384" : ""
            }`}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <div className="ur-textarea-section-9384">
        <label htmlFor="reviewText" className="ur-label-9384">
          Review:
        </label>
        <textarea
          id="reviewText"
          className="ur-textarea-9384"
          rows={4}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="ur-button-9384" disabled={loading}>
        {loading ? "Updating..." : "Update Review"}
      </button>
    </form>
  );
};

export default UpdateReview;
