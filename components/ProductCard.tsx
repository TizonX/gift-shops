"use client";

import Image from "next/image";
import { Product } from "@/util/types/products";
import { useCart } from "@/app/context/CartContext";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addToCart({
        id: product._id,
        name: product.title,
        price: product.price,
        image: product.images[0],
        quantity: 1
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg">
      <div className="relative w-full h-48">
        <Image
          src={product?.images[0]}
          alt={product?.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority
          sizes="(max-width: 600px) 100vw, 50vw"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-heart">
            ₹{Math.floor(product.price) || 0}
          </span>
          <button 
            className={`bg-heart text-white px-4 py-1 rounded-md text-sm hover:bg-heart-dark transition flex items-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
