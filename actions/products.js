"use server";

import { prisma } from "@/prisma/prisma";

export async function getAllProducts(page = 1, limit = 10) {
  try {
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }

    const currentPage = Math.max(1, Number(page));
    const pageSize = Math.max(1, Number(limit));

    const skip = (currentPage - 1) * pageSize;

    const products = await prisma.product.findMany({
      skip: skip,
      take: pageSize,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        stock: true,
        rating: true,
        image: true,
        createdAt: true,
      },
    });

    const totalCount = await prisma.product.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      page: currentPage,
      limit: pageSize,
      totalCount,
      totalPages,
      products,
    };
  } catch (error) {
    console.error("Error fetching paged products:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error");
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
