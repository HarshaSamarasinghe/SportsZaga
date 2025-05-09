// import "./Shop.css";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../../Components/Navbar/Navbar";
// import ItemCard from "../../../Components/ItemCard/ItemCard";

// const Shop = () => {
//   const url = "http://localhost:4000";
//   const [items, setItems] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchItems = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:4000/api/items/list"
//         );
//         if (response.data.success) {
//           setItems(response.data.data);
//         }
//       } catch (error) {
//         console.error("Error fetching items:", error);
//       }
//     };

//     fetchItems();
//   }, []);

//   return (
//     <div className="shop">
//       <Navbar />
//       <div className="shopTitle"></div>
//       <div className="cardSection">
//         <div className="cardGridSection">
//           {items.map((item, i) => (
//             <div
//               className="itemCardNav"
//               onClick={() => navigate(`/item/${item._id}`)}
//               key={i}
//             >
//               <ItemCard item={item} url={url} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Shop;

import "./Shop.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../Components/Navbar/Navbar";
import ItemCard from "../../../Components/ItemCard/ItemCard";

const Shop = () => {
  const url = "http://localhost:4000";
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/items/list"
        );
        if (response.data.success) {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="shop">
      <Navbar />

      {/* 🔍 Search Bar */}
      <div
        className="search-bar"
        style={{ textAlign: "center", margin: "20px" }}
      >
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
          style={{
            padding: "8px 20px",
            width: "300px",
            borderRadius: "40px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </div>

      <div className="shopTitle"></div>

      <div className="cardSection">
        <div className="cardGridSection">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, i) => (
              <div
                className="itemCardNav"
                onClick={() => navigate(`/item/${item._id}`)}
                key={i}
              >
                <ItemCard item={item} url={url} />
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#888", fontSize: "18px" }}>
              No items found matching your search 😢
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
