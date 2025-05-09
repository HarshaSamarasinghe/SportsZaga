import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";
import Sidebar from "../../../Components/Sidebar/Sidebar";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch orders function
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token provided. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/order/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete with confirmation
  const handleDelete = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return; // User cancelled

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token provided. Please log in again.");
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/api/order/my-orders/delete/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data.message);

      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
      alert("Order deleted successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete the order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Sidebar />
      <div className="orders-container" style={{ marginLeft: "280px" }}>
        <h2 className="orders-title">My Orders</h2>
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-info">
                <p>
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p>
                  <strong>Amount:</strong> LKR{order.amount}
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {order.payment ? "Paid" : "Pending"}
                </p>
                <p>
                  <strong>Tracking:</strong>{" "}
                  <span className={`tracking ${order.tracking.toLowerCase()}`}>
                    {order.tracking}
                  </span>
                </p>
                <p>
                  <strong>Created At:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              {order.customizedDetails ? (
                <div className="customization-info">
                  <h3>Customization Details</h3>
                  <p>
                    <strong>Material:</strong>{" "}
                    {order.customizedDetails.material}
                  </p>
                  <p>
                    <strong>Color:</strong> {order.customizedDetails.color}
                  </p>
                  <p>
                    <strong>Size:</strong> {order.customizedDetails.size}
                  </p>
                  <p>
                    <strong>Weight:</strong> {order.customizedDetails.weight}
                  </p>
                  <p>
                    <strong>Durability:</strong>{" "}
                    {order.customizedDetails.durability}
                  </p>
                  <p>
                    <strong>Total Price:</strong> LKR
                    {order.customizedDetails.totalPrice}
                  </p>
                </div>
              ) : (
                <p className="no-customization">
                  No customization details available.
                </p>
              )}

              {order.tracking === "Pending" && (
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(order._id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyOrders;
