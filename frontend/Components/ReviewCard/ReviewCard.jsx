import "./ReviewCard.css";

const ReviewCard = ({ review }) => {
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
      </div>
    </div>
  );
};

export default ReviewCard;
