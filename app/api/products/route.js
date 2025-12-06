import { NextResponse } from "next/server";
import { prisma } from "../../../prisma/prisma";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.max(1, Number(url.searchParams.get("limit") || "10"));

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.product.count(),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / limit));

    return NextResponse.json({
      page,
      limit,
      totalCount,
      totalPages,
      products,
    });
  } catch (error) {
    console.error("API /api/products error:", error);
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
