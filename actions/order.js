"use server";

import { prisma } from "../prisma/prisma";

export default async function createOrder(userId, items) {
  console.log("Creating order with:", { userId, items });
  try {
    if (!userId) {
      console.error("Missing userId:", userId);
      throw new Error("User ID is required");
    }

    // Validate user ID
    const userIdNum = Number(userId);
    if (isNaN(userIdNum)) {
      console.error("Invalid userId format:", userId);
      throw new Error("User ID must be a number");
    }

    console.log("Looking up user:", userIdNum);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userIdNum },
      select: { id: true },
    });
    if (!user) {
      console.error("User not found:", userIdNum);
      throw new Error("User not found");
    }

    console.log("Found user:", user.id);

    if (!Array.isArray(items)) {
      console.error("Invalid items format:", items);
      throw new Error("Items must be an array");
    }

    if (items.length === 0) {
      console.error("Empty items array");
      throw new Error("Cannot create order with empty items");
    }

    console.log("Validating items structure:", items);

    // Validate items structure
    for (const item of items) {
      if (!item.productId || !item.quantity) {
        console.error("Invalid item structure:", item);
        throw new Error("Each item must have a productId and quantity");
      }
    }

    console.log("Verifying products and stock...");

    // Verify that all products exist and have sufficient stock
    const verifiedItems = await Promise.all(
      items.map(async (item) => {
        console.log("Checking product:", item.productId);
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          console.error("Product not found:", item.productId);
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        console.log("Found product:", product.name, "Stock:", product.stock);

        if (product.stock < item.quantity) {
          console.error("Insufficient stock:", {
            product: product.name,
            requested: item.quantity,
            available: product.stock,
          });
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        const itemWithPrice = {
          ...item,
          totalPrice: item.totalPrice ?? product.price * item.quantity,
        };
        console.log("Verified item:", itemWithPrice);
        return itemWithPrice;
      })
    );

    console.log("Starting transaction with verified items:", verifiedItems);

    // Use a transaction to ensure all operations succeed or none do
    const orders = await prisma.$transaction(async (tx) => {
      console.log("Creating orders...");
      // Create orders
      const createdOrders = await Promise.all(
        verifiedItems.map(async (item) => {
          console.log("Creating order for product:", item.productId);
          return tx.order.create({
            data: {
              userId: userIdNum,
              productId: item.productId,
              quantity: item.quantity,
              totalPrice: item.totalPrice,
              status: "PENDING",
            },
          });
        })
      );

      console.log("Updating stock levels...");
      // Update stock levels
      await Promise.all(
        verifiedItems.map(async (item) => {
          console.log(
            "Updating stock for product:",
            item.productId,
            "Reducing by:",
            item.quantity
          );
          return tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        })
      );

      console.log("Clearing cart for user:", userIdNum);
      // Clear cart
      await tx.cart.deleteMany({
        where: { userId: userIdNum },
      });

      console.log("Transaction completed successfully");
      return createdOrders;
    });

    console.log("Order creation successful:", orders);
    return orders;
  } catch (error) {
    console.error("❌ Error creating order:", {
      message: error.message,
      userId,
      items,
      stack: error.stack,
    });
    throw new Error(error.message || "Failed to create order");
  }
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
