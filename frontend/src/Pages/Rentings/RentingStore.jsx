import { Text, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../Store/rentingItems";
import ProductCard from "../../../Components/RentingProductCard/ProductCard";
import Navbar from "../../../Components/Navbar/Navbar";

const RentingStore = () => {
  const { fetchProducts, products } = useProductStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) =>
    product?.eqName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar />

      <div className="headings">
        <h3 className="heading01"> Renting Store</h3>
        <hr className="horizontal-line" />
      </div>

      {/* Search Bar */}
      <div style={{ textAlign: "center", margin: "20px" }}>
        <input
          placeholder="Search equipments by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Product Grid */}
      <div className="grid-box">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* No products message */}
      {filteredProducts.length === 0 && (
        <Text fontSize="xl" textAlign="center" fontWeight="bold" color="black">
          No Equipments Found
        </Text>
      )}
    </div>
  );
};

export default RentingStore;
