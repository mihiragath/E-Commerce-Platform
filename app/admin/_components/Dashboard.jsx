"use client";

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
  });

  const [ordersData, setOrdersData] = useState({
    labels: [],
    datasets: [],
  });

  // Dummy data (replace with API later)
  useEffect(() => {
    setStats({
      users: 120,
      orders: 80,
      revenue: 15000,
    });

    setOrdersData({
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Orders",
          data: [12, 19, 15, 22, 18, 25],
          backgroundColor: "rgba(59, 130, 246, 0.7)",
        },
      ],
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600 text-sm uppercase mb-2">Total Users</h2>
          <p className="text-2xl font-bold text-gray-800">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600 text-sm uppercase mb-2">Total Orders</h2>
          <p className="text-2xl font-bold text-gray-800">{stats.orders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-gray-600 text-sm uppercase mb-2">Revenue ($)</h2>
          <p className="text-2xl font-bold text-gray-800">{stats.revenue}</p>
        </div>
      </div>

      {/* Orders Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-gray-700 font-semibold mb-4">Monthly Orders</h2>
        <Bar
          data={ordersData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
