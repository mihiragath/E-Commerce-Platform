"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/actions/user";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = document.cookie
          .split("; ")
          .find((c) => c.startsWith("token="))
          ?.split("=")[1];

        if (!token) {
          setUser(null);
          return;
        }

        const currentUser = await getUserFromToken(token);
        setUser(currentUser || null);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-gray-800">
        E-Cart
      </Link>

      <div className="space-x-4">
        {user ? (
          <>
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Admin
              </Link>
            )}
            <Link
              href="/main/cart"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Cart
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
