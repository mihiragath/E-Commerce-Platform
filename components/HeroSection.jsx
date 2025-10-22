"use client";

import React from "react";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-10 py-24">
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
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg transform transition hover:scale-105 hover:bg-blue-700"
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

        <div className="lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=800&q=80"
            alt="Hero Image"
            className="rounded-xl shadow-2xl object-cover w-full h-full transform transition hover:scale-105"
          />
        </div>
      </div>

      <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-blue-200 rounded-full opacity-30 blur-3xl"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-blue-300 rounded-full opacity-30 blur-3xl"></div>
    </section>
  );
};

export default HeroSection;
