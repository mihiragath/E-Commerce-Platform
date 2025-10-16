"use server";

import { prisma } from "@/prisma/prisma";

export async function addToCart(userId, productId, quantity = 1) {
  if (!userId || !productId) throw new Error("Invalid input");

  const existingCart = await prisma.cart.findFirst({
    where: {
      userId: Number(userId),
      productId: Number(productId),
    },
  });

  if (existingCart) {
    return prisma.cart.update({
      where: { id: existingCart.id },
      data: { quantity: existingCart.quantity + quantity },
    });
  }

  return prisma.cart.create({
    data: {
      userId: Number(userId),
      productId: Number(productId),
      quantity,
    },
  });
}

export async function getUserCart(userId) {
  if (!userId) return [];
  return prisma.cart.findMany({
    where: { userId: Number(userId) },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function removeFromCart(cartId) {
  return prisma.cart.delete({
    where: { id: Number(cartId) },
  });
}
