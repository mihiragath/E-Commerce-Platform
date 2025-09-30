"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderKanban,
  Shield,
} from "lucide-react";
import AddProduct from "./_components/AddProduct";
import Dashboard from "./_components/Dashboard";
import Products from "./_components/Products";
import Orders from "./_components/Orders";
import UsersPage from "./_components/Users";
import Categories from "./_components/Categories";

const Sidebar = ({ active, setActive }) => {
  const links = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Products", icon: <Package size={18} /> },
    { name: "Orders", icon: <ShoppingCart size={18} /> },
    { name: "Users", icon: <Users size={18} /> },
    { name: "Categories", icon: <FolderKanban size={18} /> },
    { name: "Add Product", icon: <Package size={18} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-700">
        <Shield size={24} />
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Nav Buttons */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <button
            key={link.name}
            onClick={() => setActive(link.name)}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-md transition ${
              active === link.name
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
          >
            {link.icon}
            <span>{link.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

const AdminPage = () => {
  const [active, setActive] = useState("Dashboard");

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar active={active} setActive={setActive} />

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        {active === "Dashboard" && <Dashboard />}
        {active === "Products" && <Products />}
        {active === "Orders" && <Orders />}
        {active === "Users" && <UsersPage />}
        {active === "Categories" && <Categories />}
        {active === "Add Product" && <AddProduct />}
      </main>
    </div>
  );
};

export default AdminPage;
