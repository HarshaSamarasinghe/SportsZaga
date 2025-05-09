import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminCustomizeList.css";

const AdminCustomizeList = () => {
  const [customizations, setCustomizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const navigate = useNavigate();

  const fetchCustomizations = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/customize/list`);
      setCustomizations(response.data.data);
    } catch (error) {
      console.error("Error fetching customizations:", error);
    }
  };

  const deleteCustomization = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/customize/delete/${id}`);
      setCustomizations(customizations.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting customization:", error);
    }
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  
  const filteredCustomizations = customizations.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-container">
      <h2 className="admin-heading">🛠️ Customer Customizations</h2>

    
      <input
        type="text"
        placeholder="Search by bat name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
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
                <img src={`http://localhost:4000/images/${item.image}`} alt={item.name} className="custom-img" />
              </td>
              <td>
                <div className="color-box" style={{ backgroundColor: `${item.color}` }}></div>
              </td>
              <td>{item.weight}</td>
              <td>{item.size}</td>
              <td>{item.material}</td>
              <td>{item.durability}</td>
              <td>${item.totalPrice}</td>
              <td>{item.progress} %</td>
              <td>
                <button className="update-btn" onClick={() => navigate(`/update/${item._id}`)}>Update</button>
                <button className="delete-btn" onClick={() => deleteCustomization(item._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomizeList;






















// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./AdminCustomizeList.css";  // Importing the CSS file

// const AdminCustomizeList = () => {
//   const [customizations, setCustomizations] = useState([]);
//   const navigate = useNavigate();

//   const fetchCustomizations = async () => {
//     try {
//       const response = await axios.get(`http://localhost:4000/api/customize/list`);
//       setCustomizations(response.data.data);
//     } catch (error) {
//       console.error("Error fetching customizations:", error);
//     }
//   };

//   const deleteCustomization = async (id) => {
//     try {
//       await axios.delete(`http://localhost:4000/api/customize/delete/${id}`);
//       setCustomizations(customizations.filter((item) => item._id !== id));
//     } catch (error) {
//       console.error("Error deleting customization:", error);
//     }
//   };

//   useEffect(() => {
//     fetchCustomizations();
//   }, []);

//   return (
//     <div className="admin-container">
//       <h2 className="admin-heading">🛠️ Customer Customizations</h2>
//       <table className="custom-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Image</th>
//             <th>Color</th>
//             <th>Weight</th>
//             <th>Size</th>
//             <th>Material</th>
//             <th>Durability</th>
//             <th>Price</th>
//             <th>progress</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customizations.map((item) => (
//             <tr key={item._id}>
//               <td>{item.name}</td>
//               <td>
//                 <img src={`http://localhost:4000/images/${item.image}`} alt={item.name} className="custom-img" />
//               </td>
//               <td>
//                 <div className="color-box" style={{ backgroundColor: `${item.color}` }}></div>
//               </td>
//               <td>{item.weight}</td>
//               <td>{item.size}</td>
//               <td>{item.material}</td>
//               <td>{item.durability}</td>
//               <td>${item.totalPrice}</td>
//               <td>{item.progress} %</td>
//               <td>
//                 <button className="update-btn" onClick={() => navigate(`/update/${item._id}`)}>Update</button>
//                 <button className="delete-btn" onClick={() => deleteCustomization(item._id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AdminCustomizeList;











































/*import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Add navigation hook
import axios from "axios";

const AdminCustomizeList = () => {
  const [customizations, setCustomizations] = useState([]);
  const navigate = useNavigate();  // Create navigate object

  const fetchCustomizations = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/customize/list`);
      setCustomizations(response.data.data);
    } catch (error) {
      console.error("Error fetching customizations:", error);
    }
  };

  const deleteCustomization = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/customize/delete/${id}`);
      setCustomizations(customizations.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting customization:", error);
    }
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);

  return (
    <div>
      <h2>🛠️ Customer Customizations</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customizations.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td><img src={item.image} alt={item.name} width="50" /></td>
              <td><div style={{ width: '20px', height: '20px', backgroundColor: `${item.color}` }}></div></td>
              <td>{item.weight}</td>
              <td>{item.size}</td>
              <td>{item.material}</td>
              <td>{item.durability}</td>
              <td>${item.totalPrice}</td>
              <td>
                <button onClick={() => navigate(`/update/${item._id}`)}>Update</button>  
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCustomizeList;*/


















/*import { useEffect, useState } from "react";
import axios from "axios";


const AdminCustomizeList = () => {
  const [customizations, setCustomizations] = useState([]);

  const fetchCustomizations = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/customize/list`)
      setCustomizations(response.data.data);
      console.log(response.data.data)
    } catch (error) {
      console.error("Error fetching customizations:", error);
    }
  };

  // Delete a customization
  const deleteCustomization = async (id) => {
  
      try {
        await axios.delete(`http://localhost:4000/api/customize/delete/${id}`);
        
        setCustomizations(customizations.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Error deleting customization:", error);
      }
  };

  useEffect(() => {
    fetchCustomizations();
  }, []);


   return( <div>
      <h2>🛠️ Customer Customizations</h2>
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
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
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {customizations.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>
                <img src={item.image} alt={item.name} width="50" />
              </td>
              <td><div style={{ width: '20px', height: '20px', backgroundColor: `${item.color}` }}></div></td>
              <td>{item.weight}</td>
              <td>{item.size}</td>
              <td>{item.material}</td>
              <td>{item.durability}</td>
              <td>${item.totalPrice}</td>
              <td><button onClick={()=>deleteCustomization(item._id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default AdminCustomizeList;

*/

