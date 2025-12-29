"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPaginatedProducts } from "@/actions/products";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchProducts(p = 1, l = limit) {
    try {
      setLoading(true);
      setError("");

      const data = await getPaginatedProducts(p, l);

      setProducts(data.products);
      setPage(data.page);
      setLimit(data.limit);
      setTotalCount(data.totalCount);
      setTotalPages(Math.ceil(data.totalCount / data.limit));
    } catch (err) {
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(1, limit);
  }, []);

  function handleLimitChange(e) {
    const newLimit = Number(e.target.value);
    setLimit(newLimit);
    fetchProducts(1, newLimit);
  }

  function goPrev() {
    if (page > 1) fetchProducts(page - 1, limit);
  }

  function goNext() {
    if (page < totalPages) fetchProducts(page + 1, limit);
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">
          Featured Products
        </h2>

        <div className="flex justify-between mb-6 text-sm">
          <div>
            Show{" "}
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border px-2 py-1 rounded"
            >
              <option value={4}>4</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
            </select>{" "}
            per page
          </div>

          <div>
            {loading
              ? "Loading..."
              : `${totalCount} products | Page ${page} of ${totalPages}`}
          </div>
        </div>

        {error && <p className="text-center text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow p-4">
              <img
                src={product.image || "https://via.placeholder.com/300"}
                className="h-40 w-full object-cover rounded"
              />

              <h3 className="font-semibold mt-3">{product.name}</h3>
              <p className="text-gray-500">{product.category}</p>
              <p className="font-bold text-blue-600">${product.price}</p>

              <Link href={`/main/products/${product.id}`}>
                <button className="mt-3 w-full bg-blue-600 text-white py-2 rounded">
                  Buy
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={goPrev}
            disabled={page === 1}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <button
            onClick={goNext}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
