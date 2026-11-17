import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../../Store/rentingItems";
import axios from "axios";
import "./ProductCheckout.css";
import { useToast } from "@chakra-ui/react";

const ProductCheckout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProducts, products } = useProductStore();
  const toast = useToast();

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products, fetchProducts]);

  const product = products.find((prod) => prod._id === id);

  const [newRentingOrder, setNewRentingOrder] = useState({
    cusName: "",
    eqID: id || "",
    userId: "",
    cusEmail: "",
    cusPhone: "",
    cusAddress: "",
    cusTown: "",
    cusPostalCode: "",
    shippingMethod: "",
    rentFrom: "",
    rentTo: "",
  });

  // Helper: Calculate Renting Period
  const getRentingPeriod = () => {
    if (!newRentingOrder.rentFrom || !newRentingOrder.rentTo) return 0;
    const fromDate = new Date(newRentingOrder.rentFrom);
    const toDate = new Date(newRentingOrder.rentTo);
    const diffInMs = toDate.getTime() - fromDate.getTime();
    const diffInDays = Math.max(0, diffInMs / (1000 * 60 * 60 * 24));
    return Math.ceil(diffInDays); 
  };

  // Helper: Calculate Shipping Fee
  const getShippingFee = () => {
    switch (newRentingOrder.shippingMethod) {
      case "BANK":
        return 530;
      case "COD":
        return 500;
      default:
        return 0;
    }
  };

  // Derived Values calculated on every render
  const rentingPeriod = getRentingPeriod();
  const shippingFee = getShippingFee();
  const subtotal = product ? rentingPeriod * product.eqPrice : 0;
  const totalPrice = subtotal + shippingFee;

  // Validation Logic
  const validateForm = () => {
    const { 
      cusName, cusEmail, cusPhone, cusAddress, 
      cusTown, cusPostalCode, rentFrom, rentTo, shippingMethod 
    } = newRentingOrder;

    // Check for empty/whitespace values
    if (!cusName.trim()) return "Full Name is required.";
    if (!cusEmail.trim()) return "Email address is required.";
    
    // Simple Email Regex Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cusEmail.trim())) return "Please enter a valid email address.";

    if (!cusPhone.trim()) return "Phone number is required.";
    if (cusPhone.length !== 10) return "Phone number must be exactly 10 digits.";
    if (!cusAddress.trim()) return "Shipping Address is required.";
    if (!cusTown.trim()) return "Town/City is required.";
    if (!cusPostalCode.trim()) return "Postal Code is required.";
    
    // Date Validations
    if (!rentFrom) return "Please select a start date ('Rent From').";
    if (!rentTo) return "Please select an end date ('Rent To').";

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for precise day-to-day comparison
    const start = new Date(rentFrom);
    const end = new Date(rentTo);

    if (start < today) return "The start date ('Rent From') cannot be in the past.";
    if (end < start) return "The end date ('Rent To') cannot be earlier than your start date.";
    if (rentingPeriod <= 0) return "Rental period must be at least 1 day.";

    // Shipping Method Validation
    if (!shippingMethod) return "Please select a delivery method.";

    return null; // Form is valid
  };

  if (!product) {
    return (
      <div style={{ display: "flex", width: "100%", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <p style={{ fontSize: "1.2rem", fontWeight: "500", color: "#555" }}>
          Loading checkout details...
        </p>
      </div>
    );
  }

  const proceedToCheckout = async (e) => {
    e.preventDefault(); // Prevents default form submissions if wrapper changes

    // Run Validation
    const validationError = validateForm();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return; // Stop code execution
    }

    const finalOrderDetails = {
      ...newRentingOrder,
      TotalPrice: totalPrice, 
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/RentingOrderDetails",
        finalOrderDetails,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        toast({
          title: "Order Placed",
          description: `${product.eqName} order has been placed successfully.`,
          status: "success",
          isClosable: true,
        });

        // Reset Form Fields
        setNewRentingOrder({
          cusName: "",
          eqID: id || "",
          userId: "",
          cusEmail: "",
          cusPhone: "",
          cusAddress: "",
          cusTown: "", 
          cusPostalCode: "",
          shippingMethod: "",
          rentFrom: "",
          rentTo: "",
        });
      } else {
        toast({
          title: "Error",
          description: "Please login first to place order",
          status: "error",
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <div className="container">
      {/* Left Section */}
      <div className="left-section">
        <h1 className="heading">Shipping Information</h1>

        <div className="form-group">
          <input
            placeholder="Full Name"
            name="cusName"
            type="text"
            value={newRentingOrder.cusName}
            onChange={(e) => setNewRentingOrder({ ...newRentingOrder, ...newRentingOrder, cusName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Email"
            type="email"
            name="cusEmail"
            value={newRentingOrder.cusEmail}
            onChange={(e) => setNewRentingOrder({ ...newRentingOrder, cusEmail: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="tel"
            name="cusPhone"
            placeholder="Phone Number (10 digits)"
            value={newRentingOrder.cusPhone}
            maxLength={10}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d{0,10}$/.test(input)) {
                setNewRentingOrder({ ...newRentingOrder, cusPhone: input });
              }
            }}
            required
          />
        </div>

        <div className="form-group">
          <input
            placeholder="Address"
            name="cusAddress"
            type="text"
            value={newRentingOrder.cusAddress}
            onChange={(e) => setNewRentingOrder({ ...newRentingOrder, cusAddress: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            placeholder="Town"
            name="cusTown"
            type="text"
            value={newRentingOrder.cusTown}
            onChange={(e) => setNewRentingOrder({ ...newRentingOrder, cusTown: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            placeholder="Postal code"
            name="cusPostalCode"
            type="text"
            value={newRentingOrder.cusPostalCode}
            onChange={(e) => setNewRentingOrder({ ...newRentingOrder, cusPostalCode: e.target.value })}
            required
          />
        </div>
        
        <h2 className="sub-heading">Rent From</h2>
        <div className="form-group">
          <input
            type="date"
            name="rentFrom"
            value={newRentingOrder.rentFrom}
            onChange={(e) => setNewRentingOrder({ ...newRentingOrder, rentFrom: e.target.value })}
            required
          />
        </div>
        
        <h2 className="sub-heading">Rent To</h2>
        <div className="form-group">
          <input
            type="date"
            name="rentTo"
            value={newRentingOrder.rentTo}
            onChange={(e) => setNewRentingOrder({ ...newRentingOrder, rentTo: e.target.value })}
            required
          />
        </div>

        <h2 className="sub-heading">Delivery Method</h2>
        <select
          name="shippingMethod"
          value={newRentingOrder.shippingMethod}
          onChange={(e) => setNewRentingOrder({ ...newRentingOrder, shippingMethod: e.target.value })}
          required
        >
          <option value="">Select Delivery Method...</option>
          <option value="COD">Cash on Delivery - Rs.500.00</option>
          <option value="BANK">Bank Payment - Rs.530.00</option>
          <option value="FREE">Pickup from Store - Rs.0.00</option>
        </select>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <h2 className="heading">Order Summary</h2>
        <div className="product-summary">
          <img
            src={`http://localhost:4000/images/${product.eqImage}`}
            alt={product.eqName}
            className="product-image"
          />
          <div>
            <h3>{product?.eqName}</h3>
            <p>Price Per Day: Rs.{product?.eqPrice}</p>
            <p>Rental Period: {rentingPeriod} days</p>
          </div>
        </div>
        <div className="price-summary">
          <p>
            Subtotal: <strong>Rs.{subtotal}</strong>
          </p>
          <p>
            Shipping Fee: <strong>Rs.{shippingFee}</strong>
          </p>
          <p className="total">Total: Rs.{totalPrice}</p>
        </div>
        <button className="btn-checkout" onClick={proceedToCheckout}>
          Proceed to Checkout
        </button>
        <button className="btn-cancel" onClick={() => navigate("/")}>
          Cancel
        </button>
        <button className="btn-store" onClick={() => navigate("/rentingStore")}>
          Back to Store
        </button>
      </div>
    </div>
  );
};

export default ProductCheckout;