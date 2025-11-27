"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const Navbar = () => {
  const { currentUser, loadingUser } = useCurrentUser();
  const [loadingButton, setLoadingButton] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoadingButton(null);
  }, [pathname]);

  const handleLogout = () => {
    setLoadingButton("logout");
    document.cookie = "token=; path=/; max-age=0";
    router.push("/auth/login");
  };

  const btnClasses =
    "px-4 py-2 text-white rounded-md hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-gray-800">
        E-Cart
      </Link>

      <div className="space-x-4 flex items-center">
        {loadingUser ? (
          <span>Checking user...</span>
        ) : currentUser ? (
          <>
            {currentUser.role === "ADMIN" && (
              <Link
                href="/admin"
                onClick={() => setLoadingButton("admin")}
                className={`${btnClasses} bg-red-500 ${
                  loadingButton === "admin"
                    ? "opacity-60 pointer-events-none"
                    : ""
                }`}
              >
                {loadingButton === "admin" ? "Loading..." : "Admin"}
              </Link>
            )}

            <Link
              href="/main/cart"
              onClick={() => setLoadingButton("cart")}
              className={`${btnClasses} bg-blue-500 ${
                loadingButton === "cart" ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              {loadingButton === "cart" ? "Loading..." : "Cart"}
            </Link>

            <Link
              href="/main/orders"
              onClick={() => setLoadingButton("orders")}
              className={`${btnClasses} bg-blue-500 ${
                loadingButton === "orders"
                  ? "opacity-60 pointer-events-none"
                  : ""
              }`}
            >
              {loadingButton === "orders" ? "Loading..." : "Orders"}
            </Link>

            <button
              onClick={handleLogout}
              disabled={loadingButton === "logout"}
              className={`${btnClasses} bg-gray-500`}
            >
              {loadingButton === "logout" ? "Logging out..." : "Logout"}
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            onClick={() => setLoadingButton("login")}
            className={`${btnClasses} bg-green-500 ${
              loadingButton === "login" ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {loadingButton === "login" ? "Loading..." : "Login"}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
