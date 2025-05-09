import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ListRepairs.css";
function RepairList() {
  const url = "http://localhost:4000";
  const navigate = useNavigate(); // Initialize navigate function

  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [filterEquipment, setFilterEquipment] = useState("");

  const handleGenerateRepairReport = () => {
    navigate("/repair-report");
  };

  // Fetch repair list
  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      const response = await axios.get(`${url}/api/repair/list`);
      setRepairs(response.data.data);
    } catch (error) {
      console.error("Error fetching repairs:", error);
      setError("Failed to load repair data");
    } finally {
      setLoading(false);
    }
  };

  //Delete repair record
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this repair")) return;
    try {
      const response = await axios.post(`${url}/api/repair/delete/${id}`);
      if (response.data.success) {
        console.log("Deleted successfully");
      }
      setRepairs(repairs.filter((repair) => repair._id !== id));
    } catch (error) {
      console.error("Error deleting repair:", error);
    }
  };

  //Handle edit click
  //const handleEditClick = (repair) =>{
  //    setEditData(repair);
  //};

  // Handle edit click (redirect to update page with ID)
  const handleEditClick = (id) => {
    navigate(`/repair/update/${id}`); // Redirect to the update page with ID
  };
  /*
    //handle edit submit
    const handleEditSubmit = async (event)=>{
        event.preventDefault();
        try{
            await axios.put(`${url}/api/repair/update/${editData._id}`, editData);
            setEditData(null);
            fetchRepairs();   //refresh list
        }
        catch(error){
            console.error("Error updating repair",error);
        }
    };

    // Handle input change for editing
    const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
     };
    */

  // Sorting function
  const sortedRepairs = [...repairs].sort((a, b) => {
    if (sortBy === "progress") return b.progress - a.progress;
    return a[sortBy].localeCompare(b[sortBy]);
  });

  // Filtering function
  const filteredRepairs = sortedRepairs.filter((repair) =>
    filterEquipment
      ? repair.equipment.toLowerCase().includes(filterEquipment.toLowerCase())
      : true
  );

  return (
    <div className="rep-repair-list-container">
      <h2 className="rep-repair-list-heading">Repair List</h2>

      {loading && <p>Loading repairs...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Sorting & Filtering */}
      <div className="rep-repair-list-controls">
        <div className="rep-repair-list-controls-sort">
          <label>Sort by: </label>
          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>

        <div className="rep-repair-list-controls-filter">
          <label> Filter Equipment: </label>
          <input
            type="text"
            placeholder="Enter equipment"
            onChange={(e) => setFilterEquipment(e.target.value)}
          />
        </div>
        <button
          onClick={handleGenerateRepairReport}
          className="btn-repair-report"
        >
          Generate Repair Report
        </button>
      </div>

      {!loading && !error && filteredRepairs.length === 0 && (
        <p>No repair records found.</p>
      )}

      {!loading && !error && filteredRepairs.length > 0 && (
        <table className="rep-repair-table" border="1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Equipment</th>
              <th>Description</th>
              <th>Progress</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRepairs.map((repair) => (
              <tr key={repair._id}>
                <td>{repair.name}</td>
                <td>{repair.equipment}</td>
                <td>{repair.description}</td>
                <td>{repair.progress}%</td>
                <td>Rs.{repair.price}</td>
                <td>{repair.status}</td>
                <td>
                  <div className="rep-edit-delete-btns">
                    <button
                      type="submit"
                      onClick={() => handleEditClick(repair._id)}
                      className="rep-edit-btn"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(repair._id)}
                      className="rep-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RepairList;
