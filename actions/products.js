"use server";

import { prisma } from "@/prisma/prisma";

export async function getAllProducts() {
  return await prisma.product.findMany();
}

export async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
  });
  if (!product) throw new Error("Product not found");
  return product;
}

export async function addProduct(formData) {
  const name = formData.get("name");
  const price = parseFloat(formData.get("price"));
  const category = formData.get("category");
  const stock = parseInt(formData.get("stock")) || 0;
  const rating = parseFloat(formData.get("rating")) || null;
  const image = formData.get("image");
  const data = { name, price, category, stock, rating, image };

  return await prisma.product.create({
    data: {
      name,
      price,
      category,
      stock,
      rating,
      image,
    },
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
