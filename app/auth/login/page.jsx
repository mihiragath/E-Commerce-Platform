"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authenticateUser } from "@/actions/user";

export default function LoginPage() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");

      const response = await authenticateUser({ email, password });

      if (response?.token) {
        document.cookie = `token=${response.token}; path=/; max-age=3600`;
      }

      setMessage(response?.message || "Login successful");

      if (response?.user?.id) {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setMessage(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white transition-colors ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-600">
          New user?{" "}
          <Link
            href="/auth/register"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
