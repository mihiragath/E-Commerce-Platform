"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  // const [searchQuery, setSearchQuery] = useState("");
  // const router = useRouter();

  // const handleSearch = (e) => {
  //   e.preventDefault();

  //   if (!searchQuery.trim()) return;

  //   router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  // };

  return (
    <div>
      {/* <div className="bg-blue-600 text-white py-4 px-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or category..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Search
            </button>
          </form>
        </div>
      </div> */}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24 flex flex-col-reverse lg:flex-row items-center gap-10">
        <div className="lg:w-1/2 flex flex-col gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
            Shop the Best <span className="text-blue-600">Products</span> Online
          </h1>

          <p className="text-gray-700 text-lg sm:text-xl">
            Discover exclusive deals, top-rated products, and everything you
            need for a smarter shopping experience.
          </p>

          <div className="flex gap-4 mt-4">
            <a
              href="#products"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
            >
              Start Shopping
            </a>

            <a
              href="#offers"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              View Offers
            </a>
          </div>
        </div>

        <div className="lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80"
            alt="Hero Image"
            className="rounded-xl shadow-2xl object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-3xl" />
      <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-blue-300 rounded-full opacity-30 blur-3xl" />
    </div>
  );
};

export default HeroSection;
