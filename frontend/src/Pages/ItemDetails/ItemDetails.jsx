import "./ItemDetails.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import RatingsAndReviews from "../../../Components/RatingsAndReviews/RatingsAndReviews";
import ReviewBox from "../../../Components/Review/ReviewBox";
import MyReviews from "../../../Components/MyReviews/MyReviews";
import Navbar from "../../../Components/Navbar/Navbar";

const ItemDetails = () => {
  const url = "http://localhost:4000";
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [customization, setCustomization] = useState({
    color: null,
    weight: null,
    size: null,
    material: null,
    durability: null,
    totalPrice: 0,
  });
  const [reviews, setReviews] = useState([]);
  const [errors, setErrors] = useState({
    color: "",
    weight: "",
    size: "",
    material: "",
    durability: "",
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/items/item/${id}`
        );
        if (response.data.success) {
          setItem(response.data.data);
          setCustomization((prev) => ({
            ...prev,
            totalPrice: response.data.data.basePrice,
          }));
          setReviews(response.data.data.review || []);
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [id]);

  const handleCustomizationChange = (field, value, price) => {
    setCustomization((prev) => {
      let updatedCustomization = { ...prev };
      if (updatedCustomization[field] !== value) {
        updatedCustomization[field] = value;
        updatedCustomization.totalPrice = prev.totalPrice + price;
      }
      return updatedCustomization;
    });
  };

  const validateForm = () => {
    const newErrors = {
      color: "",
      weight: "",
      size: "",
      material: "",
      durability: "",
    };

    let isValid = true;

    if (!customization.color) {
      newErrors.color = "Please select a color.";
      isValid = false;
    }
    if (!customization.weight) {
      newErrors.weight = "Please select a weight.";
      isValid = false;
    }
    if (!customization.size) {
      newErrors.size = "Please select a size.";
      isValid = false;
    }
    if (!customization.material) {
      newErrors.material = "Please select a material.";
      isValid = false;
    }
    if (!customization.durability) {
      newErrors.durability = "Please select durability.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/customize/create",
        {
          name: item.name,
          image: item.image,
          color: customization.color,
          weight: customization.weight,
          size: customization.size,
          material: customization.material,
          durability: customization.durability,
          totalPrice: customization.totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        const customizedId = response.data.data._id; // Get _id from backend
        navigate("/shipping", {
          state: {
            customizedId,
            amount: customization.totalPrice,
            itemTitle: item.name,
          },
        }); // Pass state instead of URL params
      }
    } catch (error) {
      console.error("Error submitting customization:", error);
      alert("Failed to submit customization.");
    }
  };

  if (!item) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {" "}
      <Navbar />
      <div className="itemDetailsWrapper">
        <div className="itemDetailsContainer">
          <section className="leftItemDetails">
            <div className="itemDetailsTitle">
              <i
                className="bx bx-chevron-left"
                onClick={() => navigate(-1)}
              ></i>
              <h1 className="itemDetailsItemName">{item.name}</h1>
            </div>
            <div className="itemDetailsImage">
              <i className="bx bx-heart"></i>
              <img src={url + "/images/" + item.image} alt={item.name} />
            </div>

            <div className="leftItemDetailsInfo">
              <div className="itemDetailsBrand">
                <h3>Brand:</h3>
                <h4>{item.brand}</h4>
              </div>
              <div className="itemDetailsCategory">
                <h3>Category:</h3>
                <h4>{item.category}</h4>
              </div>
              <div className="itemDetailsPrice">
                <h3>Price:</h3>
                <h4>LKR {customization.totalPrice.toFixed(2)}</h4>
              </div>
            </div>
          </section>

          <section className="rightItemDetails">
            <form onSubmit={handleSubmit}>
              <div className="itemWeight">
                {item.specifications?.weight?.length > 0 && (
                  <div className="customization-option">
                    <h4>Weight</h4>
                    <select
                      value={customization.weight || ""}
                      onChange={(e) =>
                        handleCustomizationChange(
                          "weight",
                          e.target.value,
                          item.specifications.weight.find(
                            (w) => w.value === e.target.value
                          )?.price || 0
                        )
                      }
                    >
                      <option value="">Select Weight</option>
                      {item.specifications.weight.map((option) => (
                        <option key={option._id} value={option.value}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                    {errors.weight && <p className="error">{errors.weight}</p>}
                  </div>
                )}
              </div>

              <div className="itemSize">
                {item.specifications?.size?.length > 0 && (
                  <div className="customization-option">
                    <h4>Size</h4>
                    <select
                      value={customization.size || ""}
                      onChange={(e) =>
                        handleCustomizationChange(
                          "size",
                          e.target.value,
                          item.specifications.size.find(
                            (d) => d.value === e.target.value
                          )?.price || 0
                        )
                      }
                    >
                      <option value="">Select Size</option>
                      {item.specifications.size.map((option) => (
                        <option key={option._id} value={option.value}>
                          <i className={`bx ${option.icon}`} /> {option.value}
                        </option>
                      ))}
                    </select>
                    {errors.size && <p className="error">{errors.size}</p>}
                  </div>
                )}
              </div>

              <div className="itemMaterial">
                {item.specifications?.material?.length > 0 && (
                  <div className="customization-option">
                    <h4>Material</h4>
                    <select
                      value={customization.material || ""}
                      onChange={(e) =>
                        handleCustomizationChange(
                          "material",
                          e.target.value,
                          item.specifications.material.find(
                            (m) => m.value === e.target.value
                          )?.price || 0
                        )
                      }
                    >
                      <option value="">Select Material</option>
                      {item.specifications.material.map((option) => (
                        <option key={option._id} value={option.value}>
                          <i className={`bx ${option.icon}`} /> {option.value}
                        </option>
                      ))}
                    </select>
                    {errors.material && (
                      <p className="error">{errors.material}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="itemDurability">
                {item.specifications?.durability?.length > 0 && (
                  <div className="customization-option">
                    <h4>Durability</h4>
                    <select
                      value={customization.durability || ""}
                      onChange={(e) =>
                        handleCustomizationChange(
                          "durability",
                          e.target.value,
                          item.specifications.durability.find(
                            (d) => d.value === e.target.value
                          )?.price || 0
                        )
                      }
                    >
                      <option value="">Select Durability</option>
                      {item.specifications.durability.map((option) => (
                        <option key={option._id} value={option.value}>
                          <i className={`bx ${option.icon}`} /> {option.value}
                        </option>
                      ))}
                    </select>
                    {errors.durability && (
                      <p className="error">{errors.durability}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="itemColor">
                {item.specifications?.color?.length > 0 && (
                  <div className="customization-option">
                    <h4>Color</h4>
                    <div className="color-options">
                      {item.specifications.color.map((option) => (
                        <div
                          className={`colorOutline ${
                            customization.color === option.value
                              ? "selected"
                              : ""
                          }`}
                          key={option._id}
                        >
                          <div className="color-wrapper">
                            <div
                              className="color-option"
                              style={{ backgroundColor: option.value }}
                              onClick={() =>
                                handleCustomizationChange(
                                  "color",
                                  option.value,
                                  option.price
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    {errors.color && <p className="error">{errors.color}</p>}
                  </div>
                )}
              </div>

              <button type="submit" className="buyNowBtn">
                Buy Now
              </button>
            </form>
          </section>
        </div>

        <section className="reviewsSection">
          <h1>Ratings and Reviews</h1>
          <p>Write a review...</p>
          <ReviewBox itemId={id} />
          <MyReviews itemID={id} />
          <RatingsAndReviews itemID={id} />
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
