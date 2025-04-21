import Image from "next/image";

type Product = {
  name: string;
  description: string;
  price: number | string;
  image: string;
};

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg">
      <div className="relative w-full h-48">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-blue-600">₹{product.price}</span>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm hover:bg-blue-600 transition">
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
