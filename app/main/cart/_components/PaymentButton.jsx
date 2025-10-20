"use client";

import { useState } from "react";
import createOrder from "../../../../actions/order";

export default function PaymentButton({ userId, cartItems, totalAmount }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      if (!userId || !cartItems?.length)
        throw new Error("userId or items are not found");

      const itemsToSend = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        totalPrice: (item.product.price || 0) * item.quantity,
      }));

      const res = await createOrder(userId, itemsToSend);

      if (!res) throw new Error("Can't create order right now");

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="mt-6 p-4 bg-green-100 text-green-800 font-semibold rounded-lg text-center">
        🎉 Order placed successfully! Total Paid: ${totalAmount.toFixed(2)}
      </div>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isProcessing}
      className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
    >
      {isProcessing ? "Processing..." : "Proceed to Payment"}
    </button>
  );
}
