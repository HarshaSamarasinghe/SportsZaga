import express from "express";
import crypto from "crypto";
import { Router } from "express";

const paymentRoute = Router();

const merchant_id = process.env.MERCHANT_ID; // Replace with your actual Merchant ID
const merchant_secret = process.env.MERCHANT_SECRET; // Replace with your Merchant Secret

// Merchant details
paymentRoute.post("/start", (req, res) => {
  const { order_id, amount, currency } = req.body;
  console.log("Payment request for order:", order_id);

  // Generate the hash value
  const hash = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        amount +
        currency +
        crypto
          .createHash("md5")
          .update(merchant_secret)
          .digest("hex")
          .toUpperCase()
    )
    .digest("hex")
    .toUpperCase();

  console.log("Hash generated for order:", order_id);

  res.json({ hash, merchant_id });
});

// Payment notification endpoint
paymentRoute.post("/notify", (req, res) => {
  console.log("Payment notification received:", req.body); // Log full request

  const {
    merchant_id,
    order_id,
    payhere_amount,
    payhere_currency,
    status_code,
    md5sig,
  } = req.body;

  // If order_id is missing, immediately redirect to the success page or failure page
  if (!order_id) {
    console.error("Missing order_id in PayHere notification!");
  }

  const local_md5sig = crypto
    .createHash("md5")
    .update(
      merchant_id +
        order_id +
        payhere_amount +
        payhere_currency +
        status_code +
        crypto
          .createHash("md5")
          .update(merchant_secret)
          .digest("hex")
          .toUpperCase()
    )
    .digest("hex")
    .toUpperCase();

  if (local_md5sig === md5sig && status_code == "2") {
    console.log("Payment successful for order:", order_id);
    return res.json({
      status: "success",
      redirectUrl: `/payment/success?status=success&order_id=${order_id}`,
    });
  } else {
    console.error("Payment verification failed for order:", order_id);
    return res.json({
      status: "fail",
      redirectUrl: `/payment/cancel?status=cancel&order_id=${order_id}`,
    });
  }
});

export default paymentRoute;
