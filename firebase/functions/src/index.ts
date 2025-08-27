// firebase/functions/src/index.ts
import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onHttpRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions/v2";

initializeApp();
const db = getFirestore();

export const onProductUpdate = onDocumentUpdated("products/{productId}", (event) => {
  const data = event.data?.after.data();
  logger.info("Product updated:", data);
});

export const updateProduct = onHttpRequest(async (req, res) => {
  if (req.method !== 'PUT') {
    return res.status(405).send('Method Not Allowed');
  }

  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized: Missing or invalid authorization header');
  }

  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    // Optional: Check for a custom claim like 'admin: true' in decodedToken
    // if (!decodedToken.admin) {
    //   return res.status(403).send('Forbidden: Admin access required');
    // }
  } catch (error) {
    logger.error("Error verifying token:", error);
    return res.status(401).send('Unauthorized: Invalid token');
  }

  const { productId, updatedData } = req.body;
  if (!productId || !updatedData) {
    await db.collection('products').doc(productId).update(updatedData);
    res.status(200).send(`Product ${productId} updated successfully`);
  } catch (error) {
    logger.error("Error updating product:", error);
    res.status(500).send('Error updating product');
  }
});


```

```typescript
// app/products/page.tsx
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Assuming you have firebase initialized in lib/firebase.ts

interface Product {
  id: string;
  name: string;
  price: number;
  // Add other product properties as needed
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productsData: Product[] = [];
      snapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(productsData);
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
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - ${product.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;