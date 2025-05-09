// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./UserRepairList.css";
// import Sidebar from "../../../Components/Sidebar/Sidebar";

// function UserRepairList() {
//   const { userId } = useParams();
//   const [repairs, setRepairs] = useState([]);
//   const [editingRepair, setEditingRepair] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     equipment: "",
//     description: "",
//   });

//   const fetchMyRepairs = async () => {
//     try {
//       const response = await axios.get("http://localhost:4000/api/repair/my", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setRepairs(response.data.data);
//     } catch (error) {
//       console.error("Error fetching repairs:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMyRepairs();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleEdit = (repair) => {
//     setEditingRepair(repair._id);
//     setFormData({
//       name: repair.name || "",
//       equipment: repair.equipment || "",
//       description: repair.description || "",
//     });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(
//         `http://localhost:4000/api/repair/update/${editingRepair}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setRepairs(
//         repairs.map((rep) =>
//           rep._id === editingRepair ? { ...rep, ...formData } : rep
//         )
//       );
//       setEditingRepair(null);
//       setFormData({ name: "", equipment: "", description: "" });
//     } catch (error) {
//       console.error("Error updating repair:", error);
//     }
//   };

//   const handleDelete = (repairId) => {
//     if (window.confirm("Are you sure you want to delete this repair?")) {
//       axios
//         .post(`http://localhost:4000/api/repair/delete/${repairId}`)
//         .then(() => {
//           setRepairs(repairs.filter((rep) => rep._id !== repairId));
//         })
//         .catch((error) => console.error("Error deleting repair:", error));
//     }
//   };

//   return (
//     <div style={{ display: "flex", width: "100%" }}>
//       <Sidebar />
//       <div
//         className="user-repair-wrapper"
//         style={{ marginLeft: "280px", width: "100%" }}
//       >
//         <div className="user-repair-container">
//           <h2 className="user-repair-heading">My Repairs</h2>

//           {editingRepair && (
//             <form onSubmit={handleUpdate} className="user-repair-edit-form">
//               <h3 className="user-repair-edit-title">Update Repair</h3>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Name"
//                 required
//                 className="user-repair-input"
//               />
//               <input
//                 type="text"
//                 name="equipment"
//                 value={formData.equipment}
//                 onChange={handleChange}
//                 placeholder="Equipment"
//                 required
//                 className="user-repair-input"
//               />
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Description"
//                 required
//                 className="user-repair-textarea"
//               />
//               <div className="user-repair-form-buttons">
//                 <button type="submit" className="user-repair-save-btn">
//                   Update
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setEditingRepair(null)}
//                   className="user-repair-cancel-btn"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           )}

//           <table className="user-repair-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Equipment</th>
//                 <th>Description</th>
//                 <th>Status</th>
//                 <th>Progress</th>
//                 <th>Price</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {repairs.length > 0 ? (
//                 repairs.map((repair) => (
//                   <tr key={repair._id}>
//                     <td>{repair.name}</td>
//                     <td>{repair.equipment}</td>
//                     <td>{repair.description}</td>
//                     <td>{repair.status}</td>
//                     <td>{repair.progress}</td>
//                     <td>{repair.price}</td>
//                     <td>
//                       <button
//                         onClick={() => handleEdit(repair)}
//                         className="update-btn"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(repair._id)}
//                         className="delete-btn"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="user-repair-no-data">
//                     No repairs found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default UserRepairList;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./UserRepairList.css";
import Sidebar from "../../../Components/Sidebar/Sidebar";

function UserRepairList() {
  const { userId } = useParams();
  const [repairs, setRepairs] = useState([]);
  const [editingRepair, setEditingRepair] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    equipment: "",
    description: "",
  });

  const fetchMyRepairs = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/repair/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRepairs(response.data.data);
    } catch (error) {
      console.error("Error fetching repairs:", error);
    }
  };

  useEffect(() => {
    fetchMyRepairs();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (repair) => {
    if (repair.status === "Completed" || repair.status === "InProgress") {
      alert(
        `You cannot edit this repair because its status is "${repair.status}".`
      );
      return;
    }

    setEditingRepair(repair._id);
    setFormData({
      name: repair.name || "",
      equipment: repair.equipment || "",
      description: repair.description || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/api/repair/update/${editingRepair}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRepairs(
        repairs.map((rep) =>
          rep._id === editingRepair ? { ...rep, ...formData } : rep
        )
      );
      setEditingRepair(null);
      setFormData({ name: "", equipment: "", description: "" });
      alert("Repair updated successfully.");
    } catch (error) {
      console.error("Error updating repair:", error);
      alert("Failed to update repair.");
    }
  };

  const handleDelete = (repair) => {
    if (repair.status === "Completed" || repair.status === "InProgress") {
      alert(
        `You cannot delete this repair because its status is "${repair.status}".`
      );
      return;
    }

    if (window.confirm("Are you sure you want to delete this repair?")) {
      axios
        .post(`http://localhost:4000/api/repair/delete/${repair._id}`)
        .then(() => {
          setRepairs(repairs.filter((rep) => rep._id !== repair._id));
          alert("Repair deleted successfully.");
        })
        .catch((error) => {
          console.error("Error deleting repair:", error);
          alert("Failed to delete repair.");
        });
    }
  };

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Sidebar />
      <div
        className="user-repair-wrapper"
        style={{ marginLeft: "280px", width: "100%" }}
      >
        <div className="user-repair-container">
          <h2 className="user-repair-heading">My Repairs</h2>

          {editingRepair && (
            <form onSubmit={handleUpdate} className="user-repair-edit-form">
              <h3 className="user-repair-edit-title">Update Repair</h3>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="user-repair-input"
              />
              <input
                type="text"
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                placeholder="Equipment"
                required
                className="user-repair-input"
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
                className="user-repair-textarea"
              />
              <div className="user-repair-form-buttons">
                <button type="submit" className="user-repair-save-btn">
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditingRepair(null)}
                  className="user-repair-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <table className="user-repair-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Equipment</th>
                <th>Description</th>
                <th>Status</th>
                <th>Progress (%)</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {repairs.length > 0 ? (
                repairs.map((repair) => (
                  <tr key={repair._id}>
                    <td>{repair.name}</td>
                    <td>{repair.equipment}</td>
                    <td>{repair.description}</td>
                    <td>{repair.status}</td>
                    <td>{repair.progress} %</td>
                    <td>{repair.price}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(repair)}
                        className="update-btn"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(repair)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="user-repair-no-data">
                    No repairs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UserRepairList;
