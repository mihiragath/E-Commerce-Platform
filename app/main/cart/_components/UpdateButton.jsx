"use client";

import React, { useState, useTransition } from "react";
import { updateCartItem } from "../../../../actions/cart";

export default function UpdateButton({ cartId, currentQuantity }) {
  const [showInput, setShowInput] = useState(false);
  const [quantity, setQuantity] = useState(currentQuantity || 1);
  const [isPending, startTransition] = useTransition();

  const handleUpdateClick = () => setShowInput(true);

  const handleSave = () => {
    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }

    startTransition(async () => {
      try {
        await updateCartItem(cartId, quantity);
        alert("✅ Quantity updated successfully!");
        setShowInput(false);
        window.location.reload();
      } catch (error) {
        console.error("❌ Error updating quantity:", error);
        alert("Failed to update. Please try again.");
      }
    });
  };

  return (
    <div className="flex items-center gap-3">
      {!showInput ? (
        <button
          onClick={handleUpdateClick}
          disabled={isPending}
          className={`px-4 py-2 rounded-lg font-semibold transition ${
            isPending
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      ) : (
        <>
          <input
            type="number"
            value={quantity}
            min="1"
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-16 border rounded-lg px-2 py-1 text-center"
          />
          <button
            onClick={handleSave}
            disabled={isPending}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              isPending
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            Save
          </button>
          <button
            onClick={() => setShowInput(false)}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}
