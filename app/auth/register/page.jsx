"use client";

import React, { useState } from "react";
import { createUser } from "@/actions/user";
import Link from "next/link";

const RegisterPage = () => {
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await createUser({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
      setMessage(response.message);
      console.log(response);
    } catch (error) {
      setMessage(error.message);
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-red-500 font-medium">{message}</p>
        )}

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
