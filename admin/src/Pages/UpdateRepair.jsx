import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./UpdateRepair.css";
function UpdateRepair() {
  const url = "http://localhost:4000";
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL
  const [repairData, setRepairData] = useState({
    name: "",
    equipment: "",
    description: "",
    progress: 0,
    price: 0,
    status: "",
  });

  // Fetch the repair data based on the ID
  useEffect(() => {
    const fetchRepair = async () => {
      try {
        const response = await axios.get(`${url}/api/repair/get/${id}`);
        if (response.data.success) {
          setRepairData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching repair data:", error);
      }
    };
    fetchRepair();
  }, [id]);

  // Handle input changes for the form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRepairData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the update
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(
        `${url}/api/repair/update/my/${id}`,
        repairData
      );
      if (response.data.success) {
        alert("Repair updated successfully!");
        navigate("/repairs"); // Redirect back to the repair list page
      }
    } catch (error) {
      console.error("Error updating repair:", error);
    }
  };

  return (
    <div className="rep-update-repair-container">
      <h2 className="rep-repair-list-heading">Edit Repair</h2>

      <div className="rep-update-repair-form">
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={repairData.name}
            onChange={handleChange}
            disabled="true"
          />

          <label>Equipment:</label>
          <input
            type="text"
            name="equipment"
            value={repairData.equipment}
            onChange={handleChange}
            disabled="true"
          />

          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={repairData.description}
            onChange={handleChange}
            disabled="true"
          />

          <label>Progress:</label>
          <input
            type="number"
            name="progress"
            value={repairData.progress}
            onChange={handleChange}
          />

          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={repairData.price}
            onChange={handleChange}
          />

          <label>Status:</label>
          <select
            name="status"
            value={repairData.status}
            onChange={handleChange}
          >
            <option value="Status">Status</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="rep-update-repair-form-button">
            <button
              type="submit"
              className="rep-update-btn"
              onClick={() => handleSubmit}
            >
              Update Repair
            </button>
            <button
              type="button"
              className="rep-cancel-btn"
              onClick={() => navigate("/repairs")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRepair;
