// import React, { useState } from "react";
// import "./Sidebar.css";
// import { Link } from "react-router-dom";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(null);

//   const toggleDropdown = (index) => {
//     setDropdownOpen(dropdownOpen === index ? null : index);
//   };

//   return (
//     <div className="container-sideBar">
//       <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
//         ☰
//       </button>
//       <div className={`sidebar ${isOpen ? "open" : ""}`}>
//         <ul>
//           <li onClick={() => toggleDropdown(1)}>
//             Renting Management ▼
//             <ul className={`dropdown ${dropdownOpen === 1 ? "open" : ""}`}>
//               <li>
//                 <Link to="/create-renting">Add Renting Items</Link>
//               </li>
//               <li>
//                 <Link to="/view-renting-store">View Renting Store</Link>
//               </li>
//               <li>
//                 <Link to="/rented-orders-list">Rented Orders List</Link>
//               </li>
//             </ul>
//           </li>

//           <li onClick={() => toggleDropdown(2)}>
//             Review Management ▼
//             <ul className={`dropdown ${dropdownOpen === 2 ? "open" : ""}`}>
//               <li>Sample1</li>
//               <li>Sample2</li>
//             </ul>
//           </li>

//           <li onClick={() => toggleDropdown(3)}>
//             Repair Management ▼
//             <ul className={`dropdown ${dropdownOpen === 3 ? "open" : ""}`}>
//               <li>Sample3</li>
//               <li>Sample4</li>
//             </ul>
//           </li>

//           <li onClick={() => toggleDropdown(4)}>
//             Customization Management ▼
//             <ul className={`dropdown ${dropdownOpen === 4 ? "open" : ""}`}>
//               <li>Sample5</li>
//               <li>Sample6</li>
//             </ul>
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <div className="container-sideBar">
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => toggleDropdown(1)}>
            User Management ▼
            <ul className={`dropdown ${dropdownOpen === 1 ? "open" : ""}`}>
              <li>
                <Link to="/users">View Users</Link>
              </li>
            </ul>
          </li>

          <li onClick={() => toggleDropdown(2)}>
            Inventory Management ▼
            <ul className={`dropdown ${dropdownOpen === 2 ? "open" : ""}`}>
              <li>
                <Link to="/add">Add New Product</Link>
              </li>
              <li>
                <Link to="/list">List Products</Link>
              </li>
              <li>
                <Link to="/orders">List Orders</Link>
              </li>
            </ul>
          </li>

          <li onClick={() => toggleDropdown(3)}>
            Renting Management ▼
            <ul className={`dropdown ${dropdownOpen === 3 ? "open" : ""}`}>
              <li>
                <Link to="/create-renting">Add Renting Items</Link>
              </li>
              <li>
                <Link to="/view-renting-store">View Renting Store</Link>
              </li>
              <li>
                <Link to="/rented-orders-list">Return Request List</Link>
              </li>
            </ul>
          </li>

          <li onClick={() => toggleDropdown(4)}>
            Repair Management ▼
            <ul className={`dropdown ${dropdownOpen === 4 ? "open" : ""}`}>
              <li>
                <Link to="/repairs">Repair Order List</Link>
              </li>
            </ul>
          </li>

          <li onClick={() => toggleDropdown(5)}>
            Review Management ▼
            <ul className={`dropdown ${dropdownOpen === 5 ? "open" : ""}`}>
              <li>
                <Link to="/reviewList">Review List</Link>
              </li>
            </ul>
          </li>

          <li onClick={() => toggleDropdown(6)}>
            Customization Management ▼
            <ul className={`dropdown ${dropdownOpen === 6 ? "open" : ""}`}>
              <li>
                <Link to="/customization">Customization List</Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
