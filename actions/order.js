"use server";

import { prisma } from "../prisma/prisma";

export default async function createOrder(userId, items) {
  if (!userId || !Array.isArray(items) || items.length === 0) {
    throw new Error("userId or items are not found");
  }

  const orders = await prisma.$transaction(
    items.map((item) =>
      prisma.order.create({
        data: {
          userId,
          productId: item.productId,
          quantity: item.quantity,
          totalPrice:
            item.totalPrice || (item.product?.price || 0) * item.quantity,
          status: "PENDING",
        },
      })
    )
  );

  await prisma.cart.deleteMany({
    where: { userId },
  });

  return orders;
}
export async function getOrder() {
  try {
    const allOrders = await prisma.order.findMany({
      include: {
        user: true,
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return allOrders;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return [];
  }
}
