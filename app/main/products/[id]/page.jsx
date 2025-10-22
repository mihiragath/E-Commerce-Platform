"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import ProductDetails from "./ProductDetails";

export default function ProductPage() {
  const { currentUser, loadingUser, userError } = useCurrentUser();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) return;
        const productId = Number(id);
        if (isNaN(productId)) {
          setProductError("Invalid product ID");
          return;
        }

        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product details");

        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProductError(err.message || "Product not found");
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loadingUser || loadingProduct)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;

  if (userError)
    return <p className="text-center mt-10 text-red-500">{userError}</p>;

  if (!currentUser)
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view this page.
      </p>
    );

  if (productError)
    return <p className="text-center mt-10 text-red-500">{productError}</p>;

  if (!product)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-2xl font-semibold">
          🚫 Product not found
        </p>
      </div>
    );

  return (
    <ProductDetails product={product} currentUser={{ id: currentUser.id }} />
  );
}
