"use client";

import React, { useEffect, useState } from "react";
import { getUserCart } from "@/actions/cart";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import RemoveButton from "./_components/RemoveButton";
import UpdateButton from "./_components/UpdateButton";
import PaymentButton from "./_components/PaymentButton";

export default function CartPage() {
  const { currentUser, loadingUser, userError } = useCurrentUser();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      if (!currentUser) return;

      try {
        const items = await getUserCart(currentUser.id);
        if (!items || items.length === 0) {
          setCartError("Your cart is empty.");
        } else {
          setCartItems(items);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        setCartError(err.message || "Failed to load cart.");
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [currentUser]);

  if (loadingUser || loadingCart)
    return (
      <p className="text-center mt-10 text-gray-500">Loading your cart...</p>
    );

  if (userError)
    return <p className="text-center mt-10 text-red-500">{userError}</p>;

  if (cartError)
    return <p className="text-center mt-10 text-gray-500">{cartError}</p>;

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );
  const gst = subtotal * 0.02;
  const totalAmount = subtotal + gst;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <img
              src={item.product?.image || "https://via.placeholder.com/100"}
              alt={item.product?.name || "Product image"}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1 px-4">
              <h2 className="font-bold text-lg line-clamp-1">
                {item.product?.name || "Unnamed Product"}
              </h2>
              <p className="text-gray-600">
                Price: ${item.product?.price?.toFixed(2) || "N/A"}
              </p>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <div className="flex items-center gap-4">
              <UpdateButton cartId={item.id} currentQuantity={item.quantity} />
              <RemoveButton cartId={item.id} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal:</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">GST:</span>
            <span className="font-medium">${gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2">
            <span className="text-gray-700">Total:</span>
            <span className="font-medium">${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <PaymentButton cartItems={cartItems} totalAmount={totalAmount} />
      </div>
    </div>
  );
}
