"use client";

import React, { useTransition } from "react";
import { removeFromCart } from "@/actions/cart";

export default function RemoveButton({ cartId }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    if (
      !confirm("🛒 Are you sure you want to remove this item from your cart?")
    )
      return;

    startTransition(async () => {
      try {
        await removeFromCart(cartId);
        alert("✅ Item removed successfully!");
        window.location.reload();
      } catch (error) {
        console.error("❌ Error removing from cart:", error);
        alert("Failed to remove item. Please try again.");
      }
    });
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className={`px-3 py-1 rounded-lg font-medium transition ${
        isPending
          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
          : "text-white bg-red-600 hover:bg-red-700"
      }`}
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}
