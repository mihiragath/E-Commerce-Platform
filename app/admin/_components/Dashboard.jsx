"use client";

import { useEffect, useState } from "react";
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
import { getAllUsers } from "../../../actions/user";
import { getAllOrders } from "../../../actions/order";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0,
  });

  const [ordersData, setOrdersData] = useState({
    labels: [],
    datasets: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const users = await getAllUsers();
        const orders = await getAllOrders();

        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        setStats({
          users: users.length,
          orders: orders.length,
          revenue: totalRevenue,
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
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading dashboard...</div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Users" value={stats.users} />
        <StatCard title="Total Orders" value={stats.orders} />
        <StatCard title="Revenue ($)" value={stats.revenue} />
      </div>

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
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-gray-600 text-sm uppercase mb-2">{title}</h2>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
