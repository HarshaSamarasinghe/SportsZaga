import { useState } from "react";
import axios from "axios";

const AddRentingItem = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [productName, setProductName] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedImage || !productName) {
      alert("Please fill all fields and select an image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("productName", productName);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Upload successful!");
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="productName">Product Name</label>
        <input
          id="productName"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="image">Product Image</label>
        <input
          id="image"
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          required
        />
      </div>

      {selectedImage && (
        <div>
          <h3>Selected Image</h3>
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
            width="200"
          />
        </div>
      )}

      <button type="submit">Submit</button>
    </form>
  );
};

export default AddRentingItem;
