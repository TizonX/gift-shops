import Image from "next/image";
import { Product } from "@/util/types/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
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
          <button className="bg-heart text-white px-4 py-1 rounded-md text-sm hover:bg-heart-dark transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
