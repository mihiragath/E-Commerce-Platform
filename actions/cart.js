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

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    include: {
      cart: {
        include: { product: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return user?.cart || [];
}

export async function removeFromCart(cartId) {
  return prisma.cart.delete({ where: { id: cartId } });
}
