import { prisma } from "@/prisma/prisma";
import { cookies } from "next/headers";
import { getUserFromToken } from "../../../../actions/user";
import ProductDetails from "./ProductDetails";

export default async function ProductPage({ params }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view your cart.
      </p>
    );
  }

  const currentUser = await getUserFromToken(token);
  if (!currentUser) {
    return (
      <p className="text-center mt-10 text-red-500">
        Invalid or expired user session.
      </p>
    );
  }

  const productId = Number(params?.id);
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-2xl font-semibold">
          🚫 Product not found
        </p>
      </div>
    );
  }

  return <ProductDetails product={product} currentUser={currentUser} />;
}
