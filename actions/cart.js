"use server";
import { prisma } from "@/prisma/prisma";

export async function addToCart(userId, productId, quantity = 1) {
  const existingCart = await prisma.cart.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existingCart) {
    return prisma.cart.update({
      where: { userId_productId: { userId, productId } },
      data: { quantity: existingCart.quantity + quantity },
    });
  }

  return prisma.cart.create({
    data: { userId, productId, quantity },
  });
}

export async function getUserCart(userId) {
  if (!userId) return [];
  return prisma.cart.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function removeFromCart(cartId) {
  return prisma.cart.delete({ where: { id: cartId } });
}
