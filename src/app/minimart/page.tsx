"use client";

import ProductCard from "@/components/minimart/product-card";
import { useProducts } from "@/context/product-context";

export default function MinimartPage() {
  const { products } = useProducts();
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
        Minimart Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
