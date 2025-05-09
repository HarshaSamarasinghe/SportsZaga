import "./Shipping.css";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Shipping = () => {
  const forwardUrl =
    "https://b99f-2402-4000-2150-34dd-b0c1-e955-fd5f-5dc5.ngrok-free.app";
  const location = useLocation();
  const navigate = useNavigate();
  const { customizedId, amount, itemTitle } = location.state || {}; // Get the customizedId, amount passed via state

  const [shippingDetails, setShippingDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePaymentStatus = async (orderId) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/order/update/${orderId}`, //  backend URL
        { payment: true }, // Send payment flag as true
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Payment status updated successfully:", response.data);
      } else {
        console.error("Failed to update payment status");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const orderResponse = await axios.post(
        "http://localhost:4000/api/order/create",
        {
          customizedId: customizedId,
          shippingDetails: shippingDetails,
          amount: amount.toFixed(2),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (orderResponse.status !== 201) {
        console.error("Failed to create order");
        return;
      }

      const orderId = orderResponse.data.data._id;

      const paymentDetails = {
        order_id: orderId,
        amount: amount.toFixed(2),
        currency: "LKR",
        first_name: shippingDetails.firstname,
        last_name: shippingDetails.lastname,
        email: shippingDetails.email,
        phone: shippingDetails.phone,
        address: shippingDetails.address,
        city: shippingDetails.city,
        country: shippingDetails.country,
      };

      // Request backend to generate the hash
      const response = await axios.post(
        `${forwardUrl}/payment/start`,
        paymentDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { hash, merchant_id } = response.data;

        const payment = {
          sandbox: true,
          merchant_id: merchant_id,
          return_url: "http://localhost:5137/payment/success",
          cancel_url: "http://localhost:5137/payment/cancel",
          notify_url: `${forwardUrl}/payment/notify`,
          order_id: paymentDetails.order_id,
          items: itemTitle,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          first_name: paymentDetails.first_name,
          last_name: paymentDetails.last_name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: paymentDetails.city,
          country: paymentDetails.country,
          hash: hash,
        };

        payhere.startPayment(payment); // Start payment on checkout
        updatePaymentStatus(orderId); // Update payment flag after successful payment
      } else {
        console.error("Failed to generate hash for payment.");
      }
    } catch (error) {
      console.error("Error submitting shipping details:", error);
    }
  };

  return (
    <div className="shippingWrapper">
      <div className="shippingContainer">
        <section className="shippingDetails">
          <div className="shippingDetailsTitle">
            <i className="bx bx-chevron-left" onClick={() => navigate(-1)}></i>
            <h1 className="shippingDetailsName">Shipping Informations</h1>
          </div>

          <section className="shippingForm">
            <form onSubmit={handleShippingSubmit} className="shippingInfoForm">
              <div className="shippingInfo">
                <h4>Firstname</h4>
                <input
                  type="text"
                  name="firstname"
                  value={shippingDetails.firstname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="shippingInfo">
                <h4>Lastname</h4>
                <input
                  type="text"
                  name="lastname"
                  value={shippingDetails.lastname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="shippingInfo">
                <h4>Email</h4>
                <input
                  type="email"
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="shippingInfo">
                <h4>Phone</h4>
                <input
                  type="tel"
                  name="phone"
                  value={shippingDetails.phone}
                  onChange={(e) => {
                    const input = e.target.value;
                    // Only allow up to 10 digits
                    if (/^\d{0,10}$/.test(input)) {
                      handleChange(e);
                    }
                  }}
                  maxLength="10"
                  pattern="\d{10}"
                  required
                />
              </div>
              <div className="shippingInfo">
                <h4>Address</h4>
                <input
                  type="text"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="shippingState shippingInfo">
                <h4>City</h4>
                <input
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="shippingPostalCode shippingInfo">
                <h4>Country</h4>
                <input
                  type="text"
                  name="country"
                  value={shippingDetails.country}
                  onChange={handleChange}
                  required
                />
              </div>

              <button className="checkout" type="submit">
                Checkout
              </button>
            </form>
          </section>
        </section>
      </div>
    </div>
  );
};

export default Shipping;
