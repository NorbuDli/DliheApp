"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import ProductGrid from '@/components/minimart/product-grid';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

export default function MinimartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('minimartUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
        toast({
            variant: 'destructive',
            title: 'Please Log In',
            description: 'You need to enter your details to access the minimart.',
        });
        router.push('/');
    }
  }, [router, toast]);

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
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('minimartUser');
    setCurrentUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  }

  if (loading || !currentUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* Optional: Add a loading spinner or skeleton */}
        Loading products...
      </div>); // Or a loading component
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline text-3xl md:text-4xl font-bold">
              Welcome, {currentUser.name}!
          </h1>
          <Button variant="outline" onClick={handleLogout}><LogIn className="mr-2"/>Change User</Button>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}