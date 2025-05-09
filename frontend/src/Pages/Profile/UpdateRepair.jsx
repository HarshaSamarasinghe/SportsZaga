import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./UpdateRepair.css";

function UserRepairList() {
  const { userId } = useParams(); // Get user ID from URL
  const [repairs, setRepairs] = useState([]); // Store repair list
  const [editingRepair, setEditingRepair] = useState(null); // Store the repair being edited
  const [formData, setFormData] = useState({
    name: "",
    equipment: "",
    description: "",
  });

  // Fetch user-specific repair data
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/repair/my/${userId}`)
      .then((response) => setRepairs(response.data.data))
      .catch((error) => console.error("Error fetching repairs:", error));
  }, [userId]);

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle edit button click (prefill form with existing repair details)
  const handleEdit = (repair) => {
    setEditingRepair(repair._id); // Store the repair ID being edited
    setFormData({
      name: repair.name,
      equipment: repair.equipment,
      description: repair.description,
      price: repair.price,
      status: repair.status,
      progress: repair.progress,
    });
  };

  // Handle update repair request
  const handleUpdate = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:4000/api/repair/update/${editingRepair}`, formData)
      .then(() => {
        setRepairs(
          repairs.map((rep) =>
            rep._id === editingRepair ? { ...rep, ...formData } : rep
          )
        );
        setEditingRepair(null); // Reset editing state
        setFormData({ name: "", equipment: "", description: "" }); // Clear form
      })
      .catch((error) => console.error("Error updating repair:", error));
  };

  // Handle delete repair request
  const handleDelete = (repairId) => {
    axios
      .post(`http://localhost:4000/api/repair/delete/${repairId}`)
      .then(() => {
        setRepairs(repairs.filter((rep) => rep._id !== repairId)); // Remove deleted item from UI
      })
      .catch((error) => console.error("Error deleting repair:", error));
  };

  return (
    <div className="rep-user-repair-container">
      {/* Update Form - Only Visible When Editing */}
      {editingRepair && (
        <form onSubmit={handleUpdate} className="rep-update-form">
          <h3>Update Repair</h3>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="equipment"
            value={formData.equipment}
            onChange={handleChange}
            placeholder="Equipment"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <div className="rep-action-buttons">
            <button type="submit" className="rep-update-btn">
              Update
            </button>
            <button
              onClick={() => setEditingRepair(null)}
              className="rep-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UserRepairList;
