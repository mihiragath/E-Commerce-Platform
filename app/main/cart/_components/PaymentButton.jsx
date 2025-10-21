"use client";

import { useState, useEffect } from "react";
import createOrder from "../../../../actions/order";
import { getUserFromToken } from "../../../../actions/user";

export default function PaymentButton({ cartItems, totalAmount }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];
        if (!token) {
          setIsLoading(false);
          return;
        }

        const user = await getUserFromToken(token);
        console.log("Fetched User:", user);
        setCurrentUser(user);
      } catch (err) {
        console.error("Error fetching user:", err);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handlePayment = async () => {
    if (!currentUser) {
      alert("Please login first!");
      return;
    }

    if (!cartItems?.length) {
      alert("Cart is empty!");
      return;
    }

    setIsProcessing(true);
    try {
      const itemsToSend = cartItems
        .map((item) => ({
          productId: item.product?.id,
          quantity: item.quantity ?? 1,
          totalPrice: (item.product?.price ?? 0) * (item.quantity ?? 1),
        }))
        .filter((i) => i.productId);

      console.log("User ID:", currentUser.id);
      console.log("Items:", itemsToSend);

      const res = await createOrder(currentUser.id, itemsToSend);
      if (!res) throw new Error("Can't create order right now");

      setSuccess(true);
    } catch (err) {
      console.error("Payment error:", err);
      alert("Failed to place order.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-500">
        Checking user session...
      </p>
    );

  if (!currentUser)
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view your cart.
      </p>
    );

  if (success)
    return (
      <div className="mt-6 p-4 bg-green-100 text-green-800 font-semibold rounded-lg text-center">
        🎉 Order placed successfully! Total Paid: ${totalAmount.toFixed(2)}
      </div>
    );

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
