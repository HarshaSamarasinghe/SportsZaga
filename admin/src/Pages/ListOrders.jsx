import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListOrders.css";

const ListOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/order/list"
        );
        setOrders(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the orders!", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateTracking = async (orderId, trackingStatus) => {
    const validStatuses = [
      "Pending",
      "Shipped",
      "Delivered",
      "Out for Delivery",
    ];
    if (validStatuses.includes(trackingStatus)) {
      try {
        await axios.put(`http://localhost:4000/api/order/tracking/${orderId}`, {
          tracking: trackingStatus,
        });
        alert("Order tracking updated successfully");
        // Refresh orders
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, tracking: trackingStatus }
              : order
          )
        );
      } catch (error) {
        console.error("Error updating tracking info!", error);
      }
    } else {
      alert(
        `Please choose a valid tracking status: ${validStatuses.join(", ")}`
      );
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await axios.post(
          `http://localhost:4000/api/order/delete-order/${orderId}`
        );
        alert("Order deleted successfully");
        setOrders(orders.filter((order) => order._id !== orderId));
      } catch (error) {
        console.error("Error deleting the order!", error);
      }
    }
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.tracking === filterStatus);

  if (loading) return <div className="loading-text">Loading...</div>;

  return (
    <div className="order-list-container">
      <h1>Orders</h1>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          maxWidth: "300px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      >
        <option value="All">All Orders</option>
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Out for Delivery">Out for Delivery</option>
      </select>

      {filteredOrders.map((order) => (
        <div key={order._id} className="order-horizontal-card">
          <div className="order-section order-id-section">
            <h3>Order ID: {order._id}</h3>
          </div>

          <div className="order-section">
            <h4>Customized Details</h4>
            {order.customizedDetails ? (
              <ul>
                <li>
                  <strong>Material:</strong> {order.customizedDetails.material}
                </li>
                <li>
                  <strong>Color:</strong> {order.customizedDetails.color}
                </li>
                <li>
                  <strong>Size:</strong> {order.customizedDetails.size}
                </li>
                <li>
                  <strong>Weight:</strong> {order.customizedDetails.weight}
                </li>
                <li>
                  <strong>Durability:</strong>{" "}
                  {order.customizedDetails.durability}
                </li>
                <li>
                  <strong>Total Price:</strong> LKR
                  {order.customizedDetails.totalPrice}
                </li>
              </ul>
            ) : (
              <p>No customization details</p>
            )}
          </div>

          <div className="order-section">
            <h4>Shipping Details</h4>
            <ul>
              <li>
                <strong>Name:</strong> {order.shippingDetails.firstname}{" "}
                {order.shippingDetails.lastname}
              </li>
              <li>
                <strong>Email:</strong> {order.shippingDetails.email}
              </li>
              <li>
                <strong>Phone:</strong> {order.shippingDetails.phone}
              </li>
              <li>
                <strong>Address:</strong> {order.shippingDetails.address},{" "}
                {order.shippingDetails.city}, {order.shippingDetails.country}
              </li>
            </ul>
          </div>

          <div className="order-section">
            <h4>Summary</h4>
            <ul>
              <li>
                <strong>Amount:</strong> ${order.amount}
              </li>
              <li>
                <strong>Payment Status:</strong>{" "}
                {order.payment ? "Paid" : "Pending"}
              </li>
              <li>
                <strong>Tracking:</strong> {order.tracking}
              </li>
              <li>
                <select
                  onChange={(e) =>
                    handleUpdateTracking(order._id, e.target.value)
                  }
                  defaultValue={order.tracking}
                  className="tracking-select"
                >
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                </select>
              </li>
            </ul>
          </div>

          <div className="order-section delete-section">
            <button
              className="delete-button"
              onClick={() => handleDeleteOrder(order._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListOrders;
