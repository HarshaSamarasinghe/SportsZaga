// import { Button, ButtonGroup } from "@chakra-ui/react";
// import React from "react";
// import { useParams, Link } from "react-router-dom";
// import { useProductStore } from "../../Store/rentingItems";
// import "./ViewSingleItem.css";

// const ViewSingleItem = () => {
//   const { id } = useParams();
//   const product = useProductStore((state) =>
//     state.products.find((prod) => prod._id === id)
//   );

//   const isAvailable = product.eqAvailability === "In Stock";

//   return (
//     <React.Fragment>
//       <div className="product-card-outer">
//         <div className="product-container">
//           <div className="product-image">
//             <img
//               src={`http://localhost:4000/images/${product.eqImage}`}
//               alt={product.eqName}
//             />
//           </div>

//           <div className="product-details">
//             <div>
//               <p className="product-name">{product.eqName}</p>
//             </div>

//             <div className="ratings">
//               <p>
//                 Ratings : <span className="ratings-count">⭐⭐⭐⭐☆</span>
//               </p>
//             </div>

//             <p className="availability">
//               Availability :{" "}
//               <span
//                 className="brand-name"
//                 style={{
//                   color:
//                     product.eqAvailability === "In Stock" ? "green" : "red",
//                 }}
//               >
//                 {product.eqAvailability}
//               </span>
//             </p>
//             <div className="price">
//               <h2>
//                 Price : {product.eqPrice} <span className="day">/day</span>
//               </h2>
//             </div>

//             <div className="description">
//               <p>{product.eqDescription}</p>
//             </div>
//           </div>
//         </div>

//         <div className="button-container">
//           <ButtonGroup gap={80}>
//             <Button
//               as={Link}
//               to={isAvailable ? `/checkout/${product._id}` : "#"}
//               colorScheme="green"
//               isDisabled={!isAvailable}
//             >
//               Proceed to Pay
//             </Button>
//             <Button colorScheme="red" as={Link} to="/">
//               Cancel
//             </Button>
//           </ButtonGroup>
//         </div>
//       </div>
//     </React.Fragment>

//   );
// };

// export default ViewSingleItem;

import React from "react";
import { useParams, Link } from "react-router-dom";
import { useProductStore } from "../../Store/rentingItems";
import "./ViewSingleItem.css";

const ViewSingleItem = () => {
  const { id } = useParams();
  const product = useProductStore((state) =>
    state.products.find((prod) => prod._id === id)
  );

  if (!product) {
    return <p className="error-message">Product not found</p>;
  }

  const isAvailable = product.eqAvailability === "In Stock";

  return (
    // <div className="product-card-outer">
    //   <div className="product-container">
    //     <div className="product-image">
    //       <img
    //         src={`http://localhost:4000/images/${product.eqImage}`}
    //         alt={product.eqName}
    //       />
    //     </div>

    //     <div className="product-details">
    //       <p className="product-name">{product.eqName}</p>

    //       <div className="ratings">
    //         <p>
    //           Ratings : <span className="ratings-count">⭐⭐⭐⭐☆</span>
    //         </p>
    //       </div>

    //       <p className="availability">
    //         Availability:{" "}
    //         <span
    //           className="availability-status"
    //           style={{ color: isAvailable ? "green" : "red" }}
    //         >
    //           {product.eqAvailability}
    //         </span>
    //       </p>

    //       <div className="price">
    //         <h2>
    //           Price: {product.eqPrice} <span className="day">/day</span>
    //         </h2>
    //       </div>

    //       <div className="description">
    //         <p>{product.eqDescription}</p>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="button-container">
    //     <div className="button-group">
    //       {isAvailable ? (
    //         <Link to={`/checkout/${product._id}`} className="custom-button green">
    //           Proceed to Pay
    //         </Link>
    //       ) : (
    //         <span className="custom-button disabled">Out of Stock</span>
    //       )}
    //       <Link to="/rentingStore" className="custom-button red">
    //         Cancel
    //       </Link>
    //     </div>
    //   </div>
    // </div>

    <div style={{ display: "flex", width: "100%" }}>
      <div
        className="orders-container"
        style={{ marginLeft: "280px", marginTop: "40px" }}
      >
        <div className="order-card" key={product._id}>
          <div className="order-card-image">
            <img
              src={
                `http://localhost:4000/images/${product?.eqImage}` ||
                "https://via.placeholder.com/150"
              }
              alt={product?.eqName || "Equipment Image"}
            />
          </div>

          <div className="order-card-content">
            <div className="order-info">
              <h2>{product.eqName}</h2>
              <p>
                Ratings : <span className="ratings-count">⭐⭐⭐⭐☆</span>
              </p>
              <p className="availability">
                Availability:{" "}
                <span
                  className="availability-status"
                  style={{ color: isAvailable ? "green" : "red" }}
                >
                  {product.eqAvailability}
                </span>
              </p>

              <div className="price">
                <h3>
                  Price: {product.eqPrice} <span className="day">/day</span>
                </h3>
              </div>
              <div className="description">
                <p>{product.eqDescription}</p>
              </div>
            </div>

            <div className="order-card-buttons">
              {isAvailable ? (
                <Link
                  to={`/checkout/${product._id}`}
                  className="custom-button green"
                >
                  Proceed to Pay
                </Link>
              ) : (
                <span className="custom-button disabled">Out of Stock</span>
              )}
              <Link to="/rentingStore" className="custom-button red">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleItem;
