import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListItems.css";
import { useNavigate } from "react-router-dom";

const ListItems = () => {
  const navigate = useNavigate();
  const url = "http://localhost:4000";
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${url}/api/items/list`);
        if (response.data.success) {
          setItems(response.data.data);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        alert("Error fetching items");
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(`${url}/api/items/delete/${id}`);
      if (response.data.success) {
        alert("Item deleted successfully");
        setItems(items.filter((item) => item._id !== id));
      } else {
        alert("Error deleting item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item");
    }
  };

  // Filter items by name
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="list-items-container">
      <h1 className="page-title">Items List</h1>

      <input
        type="text"
        placeholder="Search by item name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "10px",
          fontSize: "16px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          display: "block",
        }}
      />

      <button
        className="genOrdersReport"
        onClick={() => navigate("/item/report")}
      >
        Generate Report
      </button>

      {filteredItems.length === 0 ? (
        <p className="no-items">No items found</p>
      ) : (
        filteredItems.map((item) => (
          <div key={item._id} className="item-horizontal-card">
            <div className="item-image-section">
              <img
                src={url + "/images/" + item.image}
                alt={item.name}
                className="item-image"
              />
            </div>

            <div className="item-info-section">
              <h2>{item.name}</h2>
              <p>
                <strong>Category:</strong> {item.category}
              </p>
              <p>
                <strong>Brand:</strong> {item.brand}
              </p>
              <p>
                <strong>Base Price:</strong> LKR {item.basePrice}
              </p>

              <div className="specifications">
                <h4>Specifications</h4>
                {item.specifications.color && (
                  <p>
                    <strong>Colors:</strong>{" "}
                    {item.specifications.color
                      .map((spec) => `${spec.value} (LKR${spec.price})`)
                      .join(", ")}
                  </p>
                )}
                {item.specifications.weight && (
                  <p>
                    <strong>Weight:</strong>{" "}
                    {item.specifications.weight
                      .map((spec) => `${spec.value} (LKR${spec.price})`)
                      .join(", ")}
                  </p>
                )}
                {item.specifications.size && (
                  <p>
                    <strong>Size:</strong>{" "}
                    {item.specifications.size
                      .map((spec) => `${spec.value} (LKR${spec.price})`)
                      .join(", ")}
                  </p>
                )}
                {item.specifications.material && (
                  <p>
                    <strong>Material:</strong>{" "}
                    {item.specifications.material
                      .map((spec) => `${spec.value} (LKR${spec.price})`)
                      .join(", ")}
                  </p>
                )}
                {item.specifications.durability && (
                  <p>
                    <strong>Durability:</strong>{" "}
                    {item.specifications.durability
                      .map((spec) => `${spec.value} (LKR${spec.price})`)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="item-action-section">
              <button
                className="action-button update-btn"
                onClick={() => navigate(`/update/${item._id}`)}
              >
                Update
              </button>
              <button
                className="action-button delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListItems;
