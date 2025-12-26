"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getPaginatedProducts } from "@/actions/products";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchSearchResults(p = 1, l = limit, q = searchQuery) {
    try {
      setLoading(true);
      setError(null);

      const res = await getPaginatedProducts(p, l, q);

      let data;
      if (res && typeof res === "object" && typeof res.ok === "boolean") {
        if (!res.ok)
          throw new Error(`Failed to fetch products (status ${res.status})`);
        data = typeof res.json === "function" ? await res.json() : res;
      } else {
        data = res || {};
      }

      const productsList = data.products || data.data || [];
      const pageVal = data.page || p;
      const limitVal = data.limit || l;
      const totalCountVal = data.totalCount || data.total_count || 0;

      setProducts(productsList);
      setPage(pageVal);
      setLimit(limitVal);
      setTotalCount(totalCountVal);
      setTotalPages(
        data.totalPages || Math.max(1, Math.ceil(totalCountVal / limitVal))
      );
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError(err && err.message ? err.message : "Unknown error");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (searchQuery) {
      fetchSearchResults(1, limit, searchQuery);
    }
  }, [searchQuery]);

  function goPrev() {
    if (page <= 1) return;
    fetchSearchResults(page - 1, limit, searchQuery);
  }

  function goNext() {
    if (page >= totalPages) return;
    fetchSearchResults(page + 1, limit, searchQuery);
  }

  function handleLimitChange(e) {
    const newLimit = Number(e.target.value) || 12;
    setLimit(newLimit);
    fetchSearchResults(1, newLimit, searchQuery);
  }

  function renderPageButtons() {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) pages.push(i);

    return (
      <div className="inline-flex items-center space-x-2">
        {start > 1 && (
          <>
            <button
              onClick={() => fetchSearchResults(1, limit, searchQuery)}
              className="px-3 py-1 rounded border hover:bg-gray-100"
            >
              1
            </button>
            {start > 2 && <span className="px-1">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => fetchSearchResults(p, limit, searchQuery)}
            className={`px-3 py-1 rounded border ${
              p === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
            }`}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-1">…</span>}
            <button
              onClick={() => fetchSearchResults(totalPages, limit, searchQuery)}
              className="px-3 py-1 rounded border hover:bg-gray-100"
            >
              {totalPages}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-lg text-gray-600">
            {searchQuery ? (
              <>
                Results for{" "}
                <span className="font-semibold">&quot;{searchQuery}&quot;</span>
              </>
            ) : (
              "Enter a search term to find products"
            )}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Show</label>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border rounded px-2 py-1"
            >
              <option value={6}>6</option>
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
          <div className="text-center text-red-600 mb-8">{error}</div>
        ) : loading && products.length === 0 ? (
          <div className="text-center text-gray-500 mb-8">
            Loading products…
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No products found for &quot;{searchQuery}&quot;
            </p>
            <Link
              href="/"
              className="text-blue-600 hover:underline font-semibold"
            >
              Back to Home
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
              {products.map((product) => (
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
                        {product.rating ? `${product.rating} ⭐` : "No rating"}
                      </p>
                    </div>

                    <div className="mt-4">
                      <Link href={"/main/products/" + product.id}>
                        <button className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={goPrev}
                  disabled={page <= 1 || loading}
                  className="px-4 py-2 rounded border disabled:opacity-50 hover:bg-gray-100"
                >
                  Prev
                </button>

                {renderPageButtons()}

                <button
                  onClick={goNext}
                  disabled={page >= totalPages || loading}
                  className="px-4 py-2 rounded border disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>

              <div className="text-sm text-gray-600">
                {loading
                  ? "Updating…"
                  : `Showing ${(page - 1) * limit + 1} - ${Math.min(
                      page * limit,
                      totalCount
                    )} of ${totalCount}`}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
