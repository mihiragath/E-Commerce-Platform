import { cookies } from "next/headers";
import { getUserFromToken } from "../../../../actions/user";
import ProductDetails from "./ProductDetails";

export default async function ProductPage({ params }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Please login to view this page.
      </p>
    );
  }

  const user = await getUserFromToken(token);
  if (!user) {
    return (
      <p className="text-center mt-10 text-red-500">
        Invalid or expired session. Please log in again.
      </p>
    );
  }

  const productId = Number((await params).id);
  if (isNaN(productId)) {
    return (
      <p className="text-center mt-10 text-red-500">Invalid product ID.</p>
    );
  }

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

  return (
    <ProductDetails product={product} currentUser={{ id: Number(user.id) }} />
  );
}
