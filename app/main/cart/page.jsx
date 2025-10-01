import { getUserCart, removeFromCart } from "@/actions/cart";
import { getUserFromToken } from "@/actions/user";
import { cookies } from "next/headers";
import RemoveButton from "./_components/RemoveButton";

export default async function CartPage() {
  const cookieStore = await cookies();
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
    return <p className="text-center mt-10">Invalid user session</p>;
  }

  const cartItems = await getUserCart(currentUser.id);

  if (!cartItems || cartItems.length === 0) {
    return <p className="text-center mt-10">Your cart is empty</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="flex flex-col gap-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow"
          >
            <img
              src={item.product.image || "https://via.placeholder.com/100"}
              alt={item.product.name}
              className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1 px-4">
              <h2 className="font-bold text-lg">{item.product.name}</h2>
              <p>Price: ${item.product.price}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <RemoveButton cartId={item.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
