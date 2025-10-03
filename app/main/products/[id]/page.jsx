import { prisma } from "@/prisma/prisma";

export default async function ProductPage({ params }) {
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

  const handleSubmit = () => {
    
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold">Product Details</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Product Image */}
        <div className="lg:w-1/2 flex justify-center items-center">
          <img
            src={product.image || "https://via.placeholder.com/600x500"}
            alt={product.name || "Product Image"}
            className="rounded-2xl shadow-xl w-full max-w-md object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2 flex flex-col justify-center gap-6">
          <h2 className="text-4xl font-extrabold text-gray-900">
            {product.name || "Unnamed Product"}
          </h2>
          <p className="text-gray-700 text-lg">
            Category:{" "}
            <span className="font-medium">{product.category || "N/A"}</span>
          </p>
          <p className="text-blue-600 text-2xl font-bold">
            Price: ${product.price ?? "0.00"}
          </p>
          <p className="text-yellow-500 text-lg">
            Rating: {product.rating ? `${product.rating} ⭐` : "No rating"}
          </p>

          <form action={`/main/cart`} method="POST">
            <input type="hidden" name="productId" value={product.id} />
            <button
              onClick={handleSubmit}
              type="submit"
              className="mt-6 w-40 bg-blue-600 text-white py-3 rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              Add to Cart
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
