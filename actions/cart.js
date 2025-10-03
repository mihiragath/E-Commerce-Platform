"use server";

import { prisma } from "@/prisma/prisma";

export async function addToCart(userId, productId, quantity = 1) {
  try {
    if (!userId || !productId) throw new Error("Invalid input");

    const existingCart = await prisma.cart.findFirst({
      where: { userId: Number(userId), productId: Number(productId) },
    });

    if (existingCart) {
      return await prisma.cart.update({
        where: { id: existingCart.id },
        data: { quantity: existingCart.quantity + quantity },
      });
    }

    return await prisma.cart.create({
      data: {
        userId: Number(userId),
        productId: Number(productId),
        quantity,
      },
    });
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
}

export async function getUserCart(userId) { 
  try {
    if (!userId) return [];

    return await prisma.cart.findMany({
      where: { userId: Number(userId) },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
}

export async function removeFromCart(cartId) {
  try {
    return await prisma.cart.delete({
      where: { id: Number(cartId) },
    });
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
}
