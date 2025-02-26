import React from "react";
import Header from "../components/header"; // Ensure the correct import
import { useCart } from "../context/CartContext";

const products = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  name: `Product ${index + 1}`,
  price: (index + 1) * 100,
  image: "https://via.placeholder.com/150", // Placeholder image
}));

const Shop = () => {
  const { addToCart } = useCart();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <h2 className="text-2xl font-bold text-center">Our Products</h2>

      <div className="container mx-auto py-10">

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center"
            >
              <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mb-3" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600">Price: ${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;
