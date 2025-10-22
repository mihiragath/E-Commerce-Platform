"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash, X } from "lucide-react";
import {
  deleteOrder,
  getAllOrders,
  updateOrderStatus,
} from "../../../actions/order";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(
          data.map((item) => ({
            id: item.id,
            customer: item.user?.name || "Unknown",
            product: item.product?.name || "Unknown",
            amount: item.totalPrice,
            status: item.status,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const handleEdit = (order) => {
    if (!order?.id) return;
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!id || !confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(id);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("An error occurred while deleting the order.");
    }
  };
  const handleSave = async () => {
    try {
      const updated = await updateOrderStatus(selectedOrder.id, newStatus);

      if (!updated) {
        console.error("Update failed — no response from server");
        alert("Failed to update order status");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: updated.status }
            : order
        )
      );

      alert("Order status updated successfully!");
    } catch (err) {
      console.error("❌ Error updating order:", err);
      alert("Something went wrong while updating order status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 border-b">ID</th>
              <th className="py-3 px-6 border-b">Customer</th>
              <th className="py-3 px-6 border-b">Product</th>
              <th className="py-3 px-6 border-b">Amount ($)</th>
              <th className="py-3 px-6 border-b">Status</th>
              <th className="py-3 px-6 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="py-3 px-6 border-b">{order.id}</td>
                <td className="py-3 px-6 border-b">{order.customer}</td>
                <td className="py-3 px-6 border-b">{order.product}</td>
                <td className="py-3 px-6 border-b">{order.amount}</td>
                <td className="py-3 px-6 border-b">{order.status}</td>
                <td className="py-3 px-6 border-b text-center">
                  <button
                    onClick={() => handleEdit(order)}
                    className="text-blue-500 hover:text-blue-700 mr-3"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Order Status</h2>
            <p className="mb-2">
              {selectedOrder?.customer} - {selectedOrder?.product}
            </p>
            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELED">CANCELED</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
