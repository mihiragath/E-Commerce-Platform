"use client";
import React, { useEffect, useState } from "react";
import { getUserOrders } from "@/actions/order";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function OrdersPage() {
  const { currentUser, loadingUser, userError } = useCurrentUser();
  const [userOrders, setUserOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderError, setOrderError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;

      try {
        const orders = await getUserOrders(currentUser.id);
        if (!orders || orders.length === 0) {
          setOrderError("No orders found");
        } else {
          setUserOrders(orders);
        }
      } catch (err) {
        console.error("Error fetching user orders:", err);
        setOrderError(err.message || "Failed to fetch orders");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  if (loadingUser || loadingOrders)
    return <p className="p-6 text-gray-600">Loading orders...</p>;

  if (userError) return <p className="p-6 text-red-500">{userError}</p>;
  if (orderError) return <p className="p-6 text-red-500">{orderError}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {userOrders.map((order) => (
        <div
          key={order.id}
          className="mb-4 p-4 border rounded-lg bg-white shadow-sm"
        >
          <h2 className="text-xl font-semibold mb-2">
            {order.product?.name || "Unnamed Product"}
          </h2>
          <p className="text-gray-600">Price: ${order.product?.price}</p>
          <p className="text-gray-600">Quantity: {order.quantity}</p>
          <p
            className={`font-semibold ${
              order.status === "Delivered"
                ? "text-green-600"
                : order.status === "Pending"
                ? "text-yellow-600"
                : order.status === "Cancelled"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            Status: {order.status}
          </p>
        </div>
      ))}
    </div>
  );
}
