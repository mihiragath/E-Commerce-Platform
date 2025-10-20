"use server";

import { prisma } from "@/prisma/prisma";

export async function addToCart(userId, productId, quantity = 1) {
  if (!userId || !productId) {
    throw new Error("Missing required fields: userId or productId.");
  }

  if (!prisma?.cart) {
    throw new Error("Database connection not initialized");
  }

  const numericUserId = Number(userId);
  const numericProductId = Number(productId);
  const numericQuantity = Number(quantity);

  if (
    isNaN(numericUserId) ||
    isNaN(numericProductId) ||
    isNaN(numericQuantity)
  ) {
    throw new Error("Invalid input type. Expected numeric values.");
  }

  try {
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: numericUserId,
          productId: numericProductId,
        },
      },
    });

    if (existingCartItem) {
      return await prisma.cart.update({
        where: {
          userId_productId: {
            userId: numericUserId,
            productId: numericProductId,
          },
        },
        data: {
          quantity: existingCartItem.quantity + numericQuantity,
        },
      });
    }

    return await prisma.cart.create({
      data: {
        userId: numericUserId,
        productId: numericProductId,
        quantity: numericQuantity,
      },
    });
  } catch (error) {
    console.error("❌ Prisma Cart Operation Error:", error);
    throw new Error(
      "Failed to manage cart item: " + (error.message || "Unknown error")
    );
  }
}

export async function getUserCart(userId) {
  if (!prisma?.cart) throw new Error("Database connection not initialized");
  if (!userId) return [];

  const numericUserId = Number(userId);
  if (isNaN(numericUserId)) return [];

  try {
    return await prisma.cart.findMany({
      where: { userId: numericUserId },
      include: { product: true },
    });
  } catch (error) {
    console.error("❌ Prisma GetUserCart Error:", error);
    return [];
  }
}

export async function updateCartItem(cartId, quantity) {
  if (!prisma?.cart) {
    throw new Error("Database connection not initialized");
  }
  if (!cartId) {
    throw new Error("cartId is required");
  }
  const numericCartId = Number(cartId);
  const numericQuantity = Number(quantity);
  if (isNaN(numericCartId) || isNaN(numericQuantity)) {
    throw new Error("Invalid input type. Expected numeric values.");
  }
  try {
    return await prisma.cart.update({
      where: { id: numericCartId },
      data: { quantity: numericQuantity },
    });
  } catch (error) {
    console.error("❌ Prisma UpdateCartItem Error:", error);
    throw new Error(
      "Failed to update cart item: " + (error.message || "Unknown error")
    );
  }
}

export async function removeFromCart(cartId) {
  if (!prisma?.cart) {
    throw new Error("Database connection not initialized");
  }

  if (!cartId) {
    throw new Error("cartId is required");
  }

  const numericCartId = Number(cartId);
  if (isNaN(numericCartId)) {
    throw new Error("Invalid cartId");
  }

  try {
    return await prisma.cart.delete({
      where: { id: numericCartId },
    });
  } catch (error) {
    console.error("❌ Prisma RemoveFromCart Error:", error);
    throw new Error(
      "Failed to remove item from cart: " + (error.message || "Unknown error")
    );
  }
}
