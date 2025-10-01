"use client";

import { useState } from "react";
import { addProduct } from "@/actions/products";

const AddProductForm = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target); // collect from <input name="...">

    try {
      await addProduct(formData);

      setMessage("✅ Product added successfully!");

      // Reset the form fields
      e.target.reset();

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage("❌ " + (error.message || "Failed to add product"));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Add New Product
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          step="0.01"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Stock"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          step="0.1"
          name="rating"
          placeholder="Rating"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Product
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 text-center text-white rounded-md ${
            message.startsWith("✅") ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddProductForm;
