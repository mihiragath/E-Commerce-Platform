"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">E-Cart</h2>
            <p className="text-sm text-gray-400">
              Your one-stop online shopping destination. Fast delivery, great
              deals, and easy returns.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/main/cart" className="hover:text-white transition">
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  href="/main/orders"
                  className="hover:text-white transition"
                >
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Social */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Stay Connected
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@ecart.com"
                  className="hover:text-white transition"
                >
                  support@ecart.com
                </a>
              </li>
              <li className="flex space-x-4 mt-2">
                <a
                  href="#"
                  className="hover:text-white transition"
                  aria-label="Facebook"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="hover:text-white transition"
                  aria-label="Twitter"
                >
                  <i className="fab fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="hover:text-white transition"
                  aria-label="Instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} E-Cart. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
