"use client";

import React, { useEffect, useState } from "react";
import { getAllProducts } from "@/actions/products"; // Your server function

const ProductsSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const handleBuy = (product) => {
    // Placeholder: integrate your cart logic here
    alert(`Added "${product.name}" to cart!`);
  };

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Title */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">
          Featured Products
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 flex flex-col"
              >
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={product.image || "https://via.placeholder.com/400x300"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{product.category}</p>
                    <p className="text-blue-600 font-bold mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-yellow-500 mt-1">
                      {product.rating ? `${product.rating} ⭐` : "No rating"}
                    </p>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={() => handleBuy(product)}
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No products available
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
