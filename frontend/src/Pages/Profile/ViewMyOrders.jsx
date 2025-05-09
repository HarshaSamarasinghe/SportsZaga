import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewMyOrders.css";
import { useOrderDetails } from "../../Store/rentingOrderDetails";
import { Link } from "react-router-dom";
import Sidebar from "../../../Components/Sidebar/Sidebar";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  useToast,
  Button,
  Input,
  VStack,
  Text,
} from "@chakra-ui/react";

function ViewMyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { updateReturnStatus } = useOrderDetails();
  const [isFinePaymentOpen, setIsFinePaymentOpen] = useState(false); // Fine Payment Modal
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedFineAmount, setSelectedFineAmount] = useState(0);

  const [updatedReturnStatus, setUpdatedReturnStatus] = useState({
    returnStatus: "Pending",
  });

  const [updatedFineStatus, setUpdatedFineStatus] = useState({
    returnStatus: "Successful",
    fineValue: 0,
  });

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Return Request Modal

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleUpdateReturnStatus = async (pid, updatedReturnStatus) => {
    const { success, message } = await updateReturnStatus(
      pid,
      updatedReturnStatus
    );
    onClose();
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      const updatedOrder = useOrderDetails
        .getState()
        .orders.find((o) => o._id === pid);
      setUpdatedReturnStatus(updatedOrder || updatedReturnStatus);
    } else {
      toast({
        title: "Success",
        description: "Return Request Sent successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      await fetchOrders();
    }
  };

  const handleFinePayment = async (pid, updatedFineStatus) => {
    console.log("Fine Paid:", paymentInfo);
    const { success, message } = await updateReturnStatus(
      pid,
      updatedFineStatus
    );
    onClose();
    if (!success) {
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      const updatedOrder = useOrderDetails
        .getState()
        .orders.find((o) => o._id === pid);
      setUpdatedFineStatus(updatedOrder || updatedFineStatus);
    } else {
      toast({
        title: "Success",
        description: `Rs.${selectedFineAmount} fine paid successfully.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      await fetchOrders();
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token provided. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:4000/api/RentingOrderDetails",
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

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment Details Submitted:", paymentDetails);
    alert("Payment Successful! 🎉");
    // Here you can integrate real payment gateway (Stripe, PayPal etc.)
  };
  const handleChange = (e) => {};

  return (
    <div style={{ display: "flex", width: "100%" }}>
      <Sidebar />
      <div className="orders-container" style={{ marginLeft: "280px" }}>
        <h2 className="orders-title">My Renting Orders</h2>
        {orders.length === 0 ? (
          <p className="no-orders">No Renting Orders Found! 😢</p>
        ) : (
          orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-image">
                <img
                  src={
                    `http://localhost:4000/images/${order?.eqID?.eqImage}` ||
                    "https://via.placeholder.com/150"
                  }
                  alt={order?.eqID?.eqName || "Equipment Image"}
                />
              </div>

              <div className="order-card-content">
                <div className="order-info">
                  <p>
                    <strong>Ref Number:</strong> {order?._id}
                  </p>
                  <p>
                    <strong>Renting Item Name:</strong> {order?.eqID?.eqName}
                  </p>
                  <p>
                    <strong>Price Paid:</strong> Rs.{order?.TotalPrice}
                  </p>
                  <p>
                    <strong>Shipping Method:</strong> {order?.shippingMethod}
                  </p>
                  <p>
                    <strong>Rented From:</strong>{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(order?.rentFrom))}
                  </p>
                  <p>
                    <strong>Rented To:</strong>{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(order?.rentTo))}
                  </p>
                  <p>
                    <strong>Return Status:</strong> {order?.returnStatus}
                  </p>
                  {order?.returnDate &&
                    order.returnDate !== "null" &&
                    !isNaN(new Date(order.returnDate)) && (
                      <p>
                        <strong>Return Requested Date:</strong>{" "}
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(order.returnDate))}
                      </p>
                    )}

                  {order?.fineValue > 0 && (
                    <p>
                      <strong>Fine to Pay:</strong> Rs.{order?.fineValue}
                    </p>
                  )}
                </div>

                <div className="order-card-buttons">
                  {order?.returnStatus !== "Successful" && (
                    <button
                      className="order-button"
                      onClick={() => {
                        setSelectedOrderId(order._id);
                        onOpen();
                      }}
                    >
                      Make Return Request
                    </button>
                  )}
                  {order?.returnStatus === "Fine" && (
                    <button
                      className="order-button-fine"
                      onClick={() => {
                        setSelectedOrderId(order._id);
                        setSelectedFineAmount(order?.fineValue);
                        setIsFinePaymentOpen(true);
                      }}
                    >
                      Pay Fine
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Modal for Return Request */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Text fontSize="lg" fontWeight="medium">
                  Enter Today's Date
                </Text>
                <Input
                  placeholder="Return Date"
                  name="returnDate"
                  type="date"
                  value={updatedReturnStatus.returnDate}
                  onChange={(e) =>
                    setUpdatedReturnStatus({
                      ...updatedReturnStatus,
                      returnDate: e.target.value,
                    })
                  }
                />
                <Input
                  hidden
                  readOnly
                  value={updatedReturnStatus.returnStatus}
                />
                <Input hidden readOnly value={updatedReturnStatus.fineValue} />
              </VStack>
            </ModalBody>

            <ModalFooter>
              <button
                type="submit"
                className="handleUpdate-button"
                onClick={() =>
                  handleUpdateReturnStatus(selectedOrderId, updatedReturnStatus)
                }
              >
                Request a Return
              </button>

              <button
                type="submit"
                className="handleUpdateCancel-button"
                onClick={onClose}
              >
                Cancel
              </button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal for Fine Payment */}
        <Modal
          isOpen={isFinePaymentOpen}
          onClose={() => setIsFinePaymentOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Input hidden readOnly value={updatedFineStatus.returnStatus} />
              <VStack spacing={4} mt={4}>
                <div className="payment-container">
                  <h2 className="payment-title">Complete Your Payment</h2>

                  <form className="payment-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Name on Card"
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="number"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        onChange={handleChange}
                        required
                        maxLength={19}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          onChange={handleChange}
                          required
                          maxLength={5}
                        />
                      </div>

                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          placeholder="123"
                          onChange={handleChange}
                          required
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <p>
                        <strong>Fine to Pay:</strong>{" "}
                        <span className="fine-pay">
                          Rs.{selectedFineAmount}.00
                        </span>
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="payment-button"
                      onClick={() =>
                        handleFinePayment(selectedOrderId, updatedFineStatus)
                      }
                    >
                      Pay Now
                    </button>
                  </form>
                </div>
              </VStack>
            </ModalBody>

            <div className="payment-footer">
              <p>Payment Secured bySportSaGa 💳</p>
            </div>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}

export default ViewMyOrders;
