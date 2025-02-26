import React from "react";
import Header from "../../components/header";
import { useCart } from "../../context/CartContext";
import { Button } from "@relume_io/relume-ui";
import "./index.css";

const products = [
  { id: 1, name: "Smart Watch", price: 55, color: "Black", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
  { id: 2, name: "Wireless Headphones", price: 55, color: "Blue", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
  { id: 3, name: "Bluetooth Speaker", price: 55, color: "Red", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
  { id: 4, name: "Fitness Tracker", price: 55, color: "Green", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
  { id: 5, name: "Laptop Stand", price: 55, color: "Silver", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
  { id: 6, name: "Phone Case", price: 55, color: "Clear", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
  { id: 7, name: "Gaming Mouse", price: 55, color: "Black", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" },
  { id: 8, name: "Webcam HD", price: 55, color: "1080p", image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg" }
];

const Shop = () => {
  const { addToCart } = useCart();

  return (
    <div className="bg-gray-100 min-h-screen text-center">
      <Header />
      <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28 ">
      <div className="mb-12 grid grid-cols-1 md:mb-18 md:grid-cols-[1fr_max-content] md:items-end md:gap-x-12 lg:mb-20 lg:gap-x-20 ">
            <div className="w-full max-w-lg ">
              <p className="mb-3 font-semibold md:mb-4">Discover</p>
              <h2 className="mb-3 text-5xl font-bold md:mb-4 md:text-7xl lg:text-5xl ">Products</h2>
              <p className="md:text-md">Explore our extensive range of quality products.</p>
            </div>
            <div className="hidden md:block">
              <Button title="View all" variant="secondary">View all</Button>
            </div>
          </div>
        <div className="container">
         
          <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="cursor-pointer">
                <div className="mb-3 md:mb-4">
                  <img src={product.image} alt={product.name} className="aspect-[10/12] size-full object-cover" />
                </div>
                <div className="mb-2">
                  <p className="font-semibold md:text-md">{product.name}</p>
                  <p className="text-sm">{product.color}</p>
                </div>
                <p className="text-md font-semibold md:text-lg">${product.price}</p>
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
      </section>
    </div>
  );
};

export default Shop;
