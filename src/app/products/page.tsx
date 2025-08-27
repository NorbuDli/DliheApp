"use client";

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming you have your Firebase initialized in lib/firebase.ts

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  // Add any other product properties
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productsData: Product[] = [];
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products: ", error);
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price.toFixed(2)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;