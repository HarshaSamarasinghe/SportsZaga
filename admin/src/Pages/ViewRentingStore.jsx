import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useProductStore } from "../../../frontend/src/store/rentingItems";
import AdProductCard from "../Components/AdminProductCard";
import "../Components/AdminProductCard.css";

const AdminViewRentingStore = () => {
  const { fetchProducts, products } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  console.log("products", products);

  return (
    <div>
      <div className="headings">
        <h3 className="heading01"> Renting Store</h3>
        <hr className="horizontal-line"></hr>
      </div>

      <div className="grid-box">
        {products.map((product) => (
          <AdProductCard key={product._id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <Text
          fontSize="xl"
          textAlign={"center"}
          fontWeight="bold"
          color="gray.500"
        >
          No Equipments Available Yet 😢{" "}
          <Link to={"/create"}>
            <Text
              as="span"
              color="blue.500"
              _hover={{ textDecoration: "underline" }}
            >
              Create a New Equipment
            </Text>
          </Link>
        </Text>
      )}
    </div>
  );
};
export default AdminViewRentingStore;
