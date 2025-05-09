import { Link } from "react-router-dom";
import React from "react";
import "./ProductCard.css";
import "boxicons/css/boxicons.min.css";

const ProductCard = ({ product }) => {
  // background colors
  // const textColor = useColorModeValue("gray.600", "gray.200");
  // const bg = useColorModeValue("white", "gray.800");

  return (
    <React.Fragment>
      <div className="card-product">
        <Link to={`/viewSingleItem/${product._id}`}>
          <div className="card-product-img">
            <img
              src={`http://localhost:4000/images/${product.eqImage}`}
              alt={product.eqName}
              className="product-img"
            />
          </div>
        </Link>
        <div className="card-product-body">
          <h1 className="product-name"></h1>
          <div className="flex-item">
            <h1 className="product-name">{product.eqName}</h1>
            <p className="product-price">Rs. {product.eqPrice}/day</p>
          </div>
        </div>
        <div className="product-rate">
          <i className="bx bx-star icon-rate"></i>
          <p> 4.5</p>
          <span className="rate"></span>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProductCard;
