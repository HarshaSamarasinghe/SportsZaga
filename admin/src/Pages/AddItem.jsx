// import React, { useState } from "react";
// import axios from "axios";
// import "./AddItem.css"; // Import the CSS file

// const AddItemForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     brand: "",
//     basePrice: "",
//     image: null,
//     specifications: {
//       color: [],
//       weight: [],
//       size: [],
//       material: [],
//       durability: [],
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSpecificationChange = (e, specType, index) => {
//     const { name, value } = e.target;
//     const updatedSpecifications = { ...formData.specifications };
//     updatedSpecifications[specType][index][name] = value;

//     setFormData({
//       ...formData,
//       specifications: updatedSpecifications,
//     });
//   };

//   const addSpecification = (specType) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       specifications: {
//         ...prevData.specifications,
//         [specType]: [
//           ...prevData.specifications[specType],
//           { value: "", price: 0 },
//         ],
//       },
//     }));
//   };

//   const removeSpecification = (specType, index) => {
//     const updatedSpecifications = { ...formData.specifications };
//     updatedSpecifications[specType].splice(index, 1);
//     setFormData({
//       ...formData,
//       specifications: updatedSpecifications,
//     });
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       image: e.target.files[0],
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formDataToSend = new FormData();
//     formDataToSend.append("name", formData.name);
//     formDataToSend.append("category", formData.category);
//     formDataToSend.append("brand", formData.brand);
//     formDataToSend.append("basePrice", formData.basePrice);
//     formDataToSend.append("image", formData.image);
//     formDataToSend.append(
//       "color",
//       JSON.stringify(formData.specifications.color)
//     );
//     formDataToSend.append(
//       "weight",
//       JSON.stringify(formData.specifications.weight)
//     );
//     formDataToSend.append("size", JSON.stringify(formData.specifications.size));
//     formDataToSend.append(
//       "material",
//       JSON.stringify(formData.specifications.material)
//     );
//     formDataToSend.append(
//       "durability",
//       JSON.stringify(formData.specifications.durability)
//     );

//     try {
//       const response = await axios.post(
//         "http://localhost:4000/api/items/create",
//         formDataToSend,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       setFormData({
//         name: "",
//         category: "",
//         brand: "",
//         basePrice: "",
//         image: null,
//         specifications: {
//           color: [],
//           weight: [],
//           size: [],
//           material: [],
//           durability: [],
//         },
//       });

//       if (response.data.success) {
//         alert("Item added successfully");
//       }
//     } catch (error) {
//       console.error("Error adding item:", error);
//       alert("Error adding item");
//     }
//   };

//   return (
//     <div className="add-item-container">
//       <h1 className="page-title">Add New Product</h1>
//       <form onSubmit={handleSubmit} className="add-item-form">
//         <div className="input-group">
//           <label htmlFor="name">Item Name</label>
//           <input
//             id="name"
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             className="input-field"
//             required
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="category">Category</label>
//           <input
//             id="category"
//             type="text"
//             name="category"
//             value={formData.category}
//             onChange={handleChange}
//             className="input-field"
//             required
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="brand">Brand</label>
//           <input
//             id="brand"
//             type="text"
//             name="brand"
//             value={formData.brand}
//             onChange={handleChange}
//             className="input-field"
//             required
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="basePrice">Base Price</label>
//           <input
//             id="basePrice"
//             type="number"
//             name="basePrice"
//             value={formData.basePrice}
//             onChange={handleChange}
//             className="input-field"
//             required
//           />
//         </div>

//         <div className="input-group">
//           <label htmlFor="image">Product Image</label>
//           <input
//             id="image"
//             type="file"
//             name="image"
//             onChange={handleFileChange}
//             className="input-field"
//             required
//           />
//           {formData.image && (
//             <div className="image-preview">
//               <h3>Selected Image:</h3>
//               <img
//                 src={URL.createObjectURL(formData.image)}
//                 alt="Selected"
//                 className="image-preview-img"
//               />
//             </div>
//           )}
//         </div>

//         {/* Specifications Section */}
//         {["color", "weight", "size", "material", "durability"].map(
//           (specType) => (
//             <div key={specType} className="specifications-section">
//               <h3>{specType.charAt(0).toUpperCase() + specType.slice(1)}</h3>
//               <button
//                 type="button"
//                 className="spec-button add-spec"
//                 onClick={() => addSpecification(specType)}
//               >
//                 Add {specType}
//               </button>

//               {formData.specifications[specType].map((spec, index) => (
//                 <div key={index} className="spec-item">
//                   <input
//                     type="text"
//                     name="value"
//                     value={spec.value}
//                     onChange={(e) =>
//                       handleSpecificationChange(e, specType, index)
//                     }
//                     className="spec-input"
//                     placeholder={`Enter ${specType} value`}
//                     required
//                   />
//                   <input
//                     type="number"
//                     name="price"
//                     value={spec.price}
//                     onChange={(e) =>
//                       handleSpecificationChange(e, specType, index)
//                     }
//                     className="spec-input"
//                     placeholder="Price"
//                     required
//                   />
//                   <button
//                     type="button"
//                     className="spec-button delete-spec"
//                     onClick={() => removeSpecification(specType, index)}
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )
//         )}

//         <button type="submit" className="submit-button">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddItemForm;

import React, { useState } from "react";
import axios from "axios";
import "./AddItem.css";

const AddItemForm = () => {
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

  const isFormValid = () => {
    const { name, category, brand, basePrice, image, specifications } =
      formData;

    if (!name || !category || !brand || !basePrice || !image) return false;

    for (const specType of Object.keys(specifications)) {
      if (specifications[specType].length === 0) return false;
      for (const spec of specifications[specType]) {
        if (!spec.value || spec.price === "") return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert(
        "Please fill in all fields and add at least one entry for each specification."
      );
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("basePrice", formData.basePrice);
    formDataToSend.append("image", formData.image);
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
      const response = await axios.post(
        "http://localhost:4000/api/items/create",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setFormData({
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

      if (response.data.success) {
        alert("Item added successfully");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item");
    }
  };

  return (
    <div className="add-item-container">
      <h1 className="page-title">Add New Product</h1>
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
            required
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
                    required
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
                    required
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

export default AddItemForm;
