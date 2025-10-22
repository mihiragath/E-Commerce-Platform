"use client";
import React, { useEffect, useState } from "react";
import { getUserOrders, cancelOrder } from "@/actions/order";
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

  const handleCancelOrder = async (orderId) => {
    try {
      const cancelled = await cancelOrder(orderId);
      if (cancelled) {
        setUserOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "CANCELLED" } : order
          )
        );
      } else {
        alert("Failed to cancel the order. Please try again.");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel the order. Please try again.");
    }
  };

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
          <p className="text-gray-600">
            Price: ${order.product?.price?.toFixed(2) || 0}
          </p>
          <p className="text-gray-600">Quantity: {order.quantity}</p>
          <p
            className={`font-semibold ${
              order.status === "DELIVERED"
                ? "text-green-600"
                : order.status === "PENDING"
                ? "text-yellow-600"
                : order.status === "CANCELLED"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            Status: {order.status}
          </p>
          {order.status === "PENDING" && (
            <button
              onClick={() => handleCancelOrder(order.id)}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
