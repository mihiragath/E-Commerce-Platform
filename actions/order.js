"use server";

import { prisma } from "../prisma/prisma";

export default async function createOrder(userId, items) {
  try {
    if (!userId) throw new Error("User ID is required");
    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) throw new Error("Invalid user ID format");

    if (!Array.isArray(items) || items.length === 0)
      throw new Error("Items array is invalid or empty");

    const user = await prisma.user.findUnique({ where: { id: userIdNum } });
    if (!user) throw new Error("User not found");

    const verifiedItems = await Promise.all(
      items.map(async (item) => {
        if (!item.productId || !item.quantity)
          throw new Error("Invalid item structure");

        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity)
          throw new Error(`Insufficient stock for ${product.name}`);

        return {
          ...item,
          totalPrice: item.totalPrice ?? product.price * item.quantity,
        };
      })
    );

    const orders = await prisma.$transaction(async (tx) => {
      const createdOrders = await Promise.all(
        verifiedItems.map((item) =>
          tx.order.create({
            data: {
              userId: userIdNum,
              productId: item.productId,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              status: "PENDING",
            },
          })
        )
      );

      await Promise.all(
        verifiedItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );

      await tx.cart.deleteMany({ where: { userId: userIdNum } });
      return createdOrders;
    });

    return orders;
  } catch (error) {
    console.error("Order creation failed:", error.message);
    throw new Error(error.message || "Failed to create order");
  }
}

export async function getUserOrders(userId) {
  if (!userId) return [];
  const numericUserId = Number(userId);
  if (isNaN(numericUserId)) return [];
  try {
    const userOrders = await prisma.order.findMany({
      where: { userId: numericUserId },
      include: {
        product: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return userOrders;
  } catch (error) {
    console.error("❌ Error fetching user orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  if (!orderId || !status) {
    throw new Error("Order ID and status are required");
  }
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: { status },
    });
    return updatedOrder;
  } catch (error) {
    console.error("❌ Error updating order status:", {
      orderId,
      status,
      errorCode: error.code,
      errorMessage: error.message,
    });
  }
}

export async function deleteOrder(orderId) {
  try {
    const deletedOrder = await prisma.order.delete({
      where: { id: Number(orderId) },
    });
    return deletedOrder;
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    throw new Error("Failed to delete order");
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        product: {
          select: { id: true, name: true, price: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    throw new Error("Failed to fetch orders");
  }
}
