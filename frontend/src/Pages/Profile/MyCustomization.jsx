import { useEffect, useState } from "react";
import axios from "axios";
import "./MyCustomization.css";
import Sidebar from "../../../Components/Sidebar/Sidebar";

const MyCustomization = () => {
  const [customizations, setCustomizations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomization, setSelectedCustomization] = useState(null);
  const [newColor, setNewColor] = useState("");
  const [newWeight, setNewWeight] = useState("");

  const fetchCustomizations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/customize/my`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCustomizations(response.data.data);
    } catch (error) {
      console.error("Error fetching customizations:", error);
    }
  };

  const deleteCustomization = async (id, progress) => {
    if (progress > 0) {
      alert("❌ You can't delete a customization");
      return;
    }
    try {
      await axios.delete(`http://localhost:4000/api/customize/delete/${id}`);
      setCustomizations(customizations.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting customization:", error);
    }
  };

  const handleUpdateClick = (item) => {
    if (item.progress > 0) {
      alert("❌ You can't update a customization that's already in progress.");
      return;
    }
    setSelectedCustomization(item);
    setNewColor(item.color);
    setNewWeight(item.weight);
    setShowModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:4000/api/customize/update/my/${selectedCustomization._id}`,
        {
          color: newColor,
          weight: newWeight,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchCustomizations();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating customization:", error);
    }
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  return (
    <div style={{ display: "flex", width: "250px" }}>
      <Sidebar />
      <div className="admin-container" style={{ marginLeft: "280px" }}>
        <h2 className="admin-heading">🛠️ My Customizations</h2>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Color</th>
              <th>Weight (g)</th>
              <th>Size</th>
              <th>Material</th>
              <th>Durability</th>
              <th>Price</th>
              <th>Progress</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customizations.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>
                  <img
                    src={`http://localhost:4000/images/${item.image}`}
                    alt={item.name}
                    className="custom-img"
                  />
                </td>
                <td>
                  <div
                    className="color-box"
                    style={{ backgroundColor: `${item.color}` }}
                  ></div>
                </td>
                <td>{item.weight}</td>
                <td>{item.size}</td>
                <td>{item.material}</td>
                <td>{item.durability}</td>
                <td>LKR {item.totalPrice}</td>
                <td>{item.progress} %</td>
                <td>
                  <button
                    className="update-btn"
                    onClick={() => handleUpdateClick(item)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this customization?"
                        )
                      ) {
                        deleteCustomization(item._id, item.progress);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="popup-overlay">
            <div className="popup-box">
              <h3>Update Customization</h3>

              <label>Color:</label>
              <div className="color-palette">
                {[
                  "#FF0000",
                  "#37914f",
                  "#0000FF",
                  "#f57125",
                  "#f21b63",
                  "#000000",
                  "#f5f5f5",
                ].map((color) => (
                  <div
                    key={color}
                    className={`palette-color ${
                      newColor === color ? "selected" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewColor(color)}
                  />
                ))}
              </div>

              <label>Weight (500g–1200g):</label>
              <input
                type="number"
                min="500"
                max="1200"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="weight-input"
              />

              <div className="popup-actions">
                <button className="save-btn" onClick={handleUpdateSubmit}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCustomization;
