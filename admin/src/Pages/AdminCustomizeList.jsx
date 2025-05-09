import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminCustomizeList.css";

const AdminCustomizeList = () => {
  const [customizations, setCustomizations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchCustomizations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/customize/list`
      );
      setCustomizations(response.data.data);
    } catch (error) {
      console.error("Error fetching customizations:", error);
    }
  };

  const deleteCustomization = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customization?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:4000/api/customize/delete/${id}`);
      setCustomizations(customizations.filter((item) => item._id !== id));
      alert("Customization deleted successfully!");
    } catch (error) {
      console.error("Error deleting customization:", error);
      alert("Failed to delete customization.");
    }
  };

  const handleGenerateCusReports = () => {
    navigate("/generate-cus-reports");
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  const filteredCustomizations = customizations.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h2 className="admin-heading">🛠️ Customer Customizations</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Color</th>
            <th>Weight</th>
            <th>Size</th>
            <th>Material</th>
            <th>Durability</th>
            <th>Price</th>
            <th>progress</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomizations.map((item) => (
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
                  onClick={() => navigate(`/customization/update/${item._id}`)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteCustomization(item._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleGenerateCusReports} className="genOrdersReport">
        Generate Customized Reports
      </button>
    </div>
  );
};

export default AdminCustomizeList;
