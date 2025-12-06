"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchProducts(p = page, l = limit) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/products?page=${p}&limit=${l}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(
          txt || `Failed to fetch products (status ${res.status})`
        );
      }

      const data = await res.json();

      setProducts(data.products || []);
      setPage(data.page || p);
      setLimit(data.limit || l);
      setTotalCount(data.totalCount || 0);
      setTotalPages(
        data.totalPages ||
          Math.max(1, Math.ceil((data.totalCount || 0) / (data.limit || l)))
      );
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err && err.message ? err.message : "Unknown error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleBuy(product) {
    alert(
      `Product: ${product.name}\nPrice: $${(product.price || 0).toFixed(2)}`
    );
  }

  function goPrev() {
    if (page <= 1) return;
    fetchProducts(page - 1, limit);
  }

  function goNext() {
    if (page >= totalPages) return;
    fetchProducts(page + 1, limit);
  }

  function handleLimitChange(e) {
    const newLimit = Number(e.target.value) || 10;
    setLimit(newLimit);
    fetchProducts(1, newLimit);
  }

  // simple page buttons
  function renderPageButtons() {
    var pages = [];
    var start = Math.max(1, page - 2);
    var end = Math.min(totalPages, page + 2);
    for (var i = start; i <= end; i++) pages.push(i);

    return (
      <div className="inline-flex items-center space-x-2">
        {start > 1 && (
          <>
            <button
              onClick={() => fetchProducts(1, limit)}
              className="px-3 py-1 rounded border"
            >
              1
            </button>
            {start > 2 && <span className="px-1">…</span>}
          </>
        )}

        {pages.map(function (p) {
          return (
            <button
              key={p}
              onClick={() => fetchProducts(p, limit)}
              className={
                "px-3 py-1 rounded border " +
                (p === page ? "bg-blue-600 text-white" : "")
              }
            >
              {p}
            </button>
          );
        })}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1">…</span>}
            <button
              onClick={() => fetchProducts(totalPages, limit)}
              className="px-3 py-1 rounded border"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
          Featured Products
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Show</label>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border rounded px-2 py-1"
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
            <label className="text-sm text-gray-700">per page</label>
          </div>

          <div className="text-sm text-gray-600">
            {loading
              ? "Loading…"
              : `${totalCount} products — page ${page} of ${totalPages}`}
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-600 mb-6">{error}</div>
        ) : loading && products.length === 0 ? (
          <div className="text-center text-gray-500 mb-6">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            No products available
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map(function (product) {
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105 flex flex-col"
                  >
                    <div className="w-full h-48 overflow-hidden">
                      <img
                        src={
                          product.image || "https://via.placeholder.com/400x300"
                        }
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
                          ${(product.price || 0).toFixed(2)}
                        </p>
                        <p className="text-yellow-500 mt-1">
                          {product.rating
                            ? product.rating + " ⭐"
                            : "No rating"}
                        </p>
                      </div>

                      <div className="mt-4">
                        <Link href={"/main/products/" + product.id}>
                          <button
                            onClick={() => handleBuy(product)}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
                          >
                            Buy
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  disabled={page <= 1 || loading}
                  className="px-4 py-2 rounded border disabled:opacity-50"
                >
                  Prev
                </button>

                {renderPageButtons()}

                <button
                  onClick={goNext}
                  disabled={page >= totalPages || loading}
                  className="px-4 py-2 rounded border disabled:opacity-50"
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-600">
                {loading
                  ? "Updating…"
                  : "Showing " +
                    ((page - 1) * limit + 1) +
                    " - " +
                    Math.min(page * limit, totalCount) +
                    " of " +
                    totalCount}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
