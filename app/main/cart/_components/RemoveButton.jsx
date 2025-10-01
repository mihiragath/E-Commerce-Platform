"use client";

import { removeFromCart } from "@/actions/cart";
import { useTransition } from "react";

export default function RemoveButton({ cartId }) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await removeFromCart(cartId);
      window.location.reload();
    });
  };

  return (
    <button
      onClick={handleRemove}
      className="text-red-500 hover:text-red-700 disabled:opacity-50"
      disabled={isPending}
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}
