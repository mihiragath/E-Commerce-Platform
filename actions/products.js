"use server";

import { prisma } from "@/prisma/prisma";

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "desc",
      },
    });
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!product) throw new Error("Product not found");
  return product;
}

export async function addProduct(formData) {
  const name = formData.get("name") || "";
  const price = parseFloat(formData.get("price") || "0");
  const category = formData.get("category") || "Uncategorized";
  const stock = parseInt(formData.get("stock") || "0", 10);
  const rating = formData.get("rating")
    ? parseFloat(formData.get("rating"))
    : null;
  const image = formData.get("image") || null;

  if (!name || price <= 0) {
    throw new Error("Invalid product data: Name and price are required.");
  }

  return await prisma.product.create({
    data: { name, price, category, stock, rating, image },
  });
}

export async function updateProduct(id, data) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!product) throw new Error("Product not found");
  return await prisma.product.update({ where: { id: Number(id) }, data });
}

export async function deleteProduct(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!product) throw new Error("Product not found");
  return await prisma.product.delete({ where: { id: Number(id) } });
}
