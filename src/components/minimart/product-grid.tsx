"use client";

import ProductCard from "@/components/minimart/product-card";
import { useProducts } from "@/context/product-context";

export default function ProductGrid() {
  const { products } = useProducts();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}