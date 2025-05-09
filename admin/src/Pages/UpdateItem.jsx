import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./AddItem.css"; // Import the CSS file

const UpdateItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Getting the item ID from the URL
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    basePrice: "",
    image: null,
    specifications: {
      color: [],
      weight: [],
      size: [],
      material: [],
      durability: [],
    },
  });

  useEffect(() => {
    // Fetching the item details from the backend using the ID
    const fetchItemData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/items/item/${id}`
        );
        const data = response.data.data;
        setFormData({
          name: data.name,
          category: data.category,
          brand: data.brand,
          basePrice: data.basePrice,
          image: null, // We will not update the image here, but it's possible to add that functionality
          specifications: data.specifications,
        });

        console.log("UYH", formData);
      } catch (error) {
        console.error("Error fetching item data:", error);
        alert("Error fetching item data");
      }
    };

    fetchItemData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecificationChange = (e, specType, index) => {
    const { name, value } = e.target;
    const updatedSpecifications = { ...formData.specifications };
    updatedSpecifications[specType][index][name] = value;

    setFormData({
      ...formData,
      specifications: updatedSpecifications,
    });
  };

  const addSpecification = (specType) => {
    setFormData((prevData) => ({
      ...prevData,
      specifications: {
        ...prevData.specifications,
        [specType]: [
          ...prevData.specifications[specType],
          { value: "", price: 0 },
        ],
      },
    }));
  };

  const removeSpecification = (specType, index) => {
    const updatedSpecifications = { ...formData.specifications };
    updatedSpecifications[specType].splice(index, 1);
    setFormData({
      ...formData,
      specifications: updatedSpecifications,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("basePrice", formData.basePrice);
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }
    formDataToSend.append(
      "color",
      JSON.stringify(formData.specifications.color)
    );
    formDataToSend.append(
      "weight",
      JSON.stringify(formData.specifications.weight)
    );
    formDataToSend.append("size", JSON.stringify(formData.specifications.size));
    formDataToSend.append(
      "material",
      JSON.stringify(formData.specifications.material)
    );
    formDataToSend.append(
      "durability",
      JSON.stringify(formData.specifications.durability)
    );

    try {
      const response = await axios.put(
        `http://localhost:4000/api/items/update/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Item updated successfully");
      }

      console.log("updated data", formData);

      navigate("/list");
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item");
    }
  };

  return (
    <div className="add-item-container">
      <h1 className="page-title">Update Product</h1>
      <form onSubmit={handleSubmit} className="add-item-form">
        <div className="input-group">
          <label htmlFor="name">Item Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="brand">Brand</label>
          <input
            id="brand"
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="basePrice">Base Price</label>
          <input
            id="basePrice"
            type="number"
            name="basePrice"
            value={formData.basePrice}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="image">Product Image</label>
          <input
            id="image"
            type="file"
            name="image"
            onChange={handleFileChange}
            className="input-field"
          />
          {formData.image && (
            <div className="image-preview">
              <h3>Selected Image:</h3>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Selected"
                className="image-preview-img"
              />
            </div>
          )}
        </div>

        {/* Specifications Section */}
        {["color", "weight", "size", "material", "durability"].map(
          (specType) => (
            <div key={specType} className="specifications-section">
              <h3>{specType.charAt(0).toUpperCase() + specType.slice(1)}</h3>
              <button
                type="button"
                className="spec-button add-spec"
                onClick={() => addSpecification(specType)}
              >
                Add {specType}
              </button>

              {formData.specifications[specType].map((spec, index) => (
                <div key={index} className="spec-item">
                  <input
                    type="text"
                    name="value"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecificationChange(e, specType, index)
                    }
                    className="spec-input"
                    placeholder={`Enter ${specType} value`}
                  />
                  <input
                    type="number"
                    name="price"
                    value={spec.price}
                    onChange={(e) =>
                      handleSpecificationChange(e, specType, index)
                    }
                    className="spec-input"
                    placeholder="Price"
                  />
                  <button
                    type="button"
                    className="spec-button delete-spec"
                    onClick={() => removeSpecification(specType, index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )
        )}

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdateItemForm;
