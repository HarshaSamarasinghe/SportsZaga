import React from "react";
import axios from "axios";

const PaymentButton = () => {
  const handlePayment = async () => {
    const paymentDetails = {
      order_id: "ItemNo12345",
      amount: "100.00",
      currency: "LKR",
      first_name: "Saman",
      last_name: "Perera",
      email: "samanp@gmail.com",
      phone: "0771234567",
      address: "No.1, Galle Road",
      city: "Colombo",
      country: "Sri Lanka",
    };

    try {
      // Request backend to generate the hash value using axios
      const response = await axios.post(
        "https://b5f5-212-104-231-7.ngrok-free.app/payment/start", // ngrok link
        paymentDetails,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const { hash, merchant_id } = response.data;

        // Payment configuration
        const payment = {
          sandbox: true, // Use sandbox for testing
          merchant_id: merchant_id,
          return_url: "http://localhost:3000/payment/success", // Replace with your return URL
          cancel_url: "http://localhost:3000/payment/cancel", // Replace with your cancel URL
          notify_url:
            "https://b5f5-212-104-231-7.ngrok-free.app/payment/notify", // ngrok notify URL
          order_id: paymentDetails.order_id,
          items: "Item Title",
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

        // Initialize PayHere payment
        payhere.startPayment(payment);
      } else {
        console.error("Failed to generate hash for payment.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <button id="payhere-payment" onClick={handlePayment}>
        PayHere Pay
      </button>
    </div>
  );
};

export default PaymentButton;
