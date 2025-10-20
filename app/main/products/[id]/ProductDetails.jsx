"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "../../../../actions/cart";

export default function ProductDetails({ product, currentUser }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!currentUser?.id) {
      alert("⚠️ Please log in to add items to your cart.");
      router.push("/sign-in");
      return;
    }

    try {
      setLoading(true);
      await addToCart(currentUser.id, product.id, 1);
      alert("✅ Product added to cart successfully!");
      router.push("/main/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add product to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold">Product Details</h1>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/2 flex justify-center items-center">
          <img
            src={product?.image || "https://via.placeholder.com/600x500"}
            alt={product?.name || "Product Image"}
            className="rounded-2xl shadow-xl w-full max-w-md object-cover"
          />
        </div>

        <div className="lg:w-1/2 flex flex-col justify-center gap-6">
          <h2 className="text-4xl font-extrabold text-gray-900">
            {product?.name || "Unnamed Product"}
          </h2>

          <p className="text-gray-700 text-lg">
            <span className="font-semibold">Category:</span>{" "}
            {product?.category || "N/A"}
          </p>

          <p className="text-blue-600 text-2xl font-bold">
            Price: ${product?.price?.toFixed(2) || "0.00"}
          </p>

          <p className="text-yellow-500 text-lg">
            Rating: {product?.rating ? `${product.rating} ⭐` : "No rating"}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`mt-6 w-44 py-3 rounded-lg font-semibold transition-all duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed opacity-70"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
            } text-white shadow-lg`}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </main>
    </div>
  );
}
