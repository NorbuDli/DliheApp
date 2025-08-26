"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import ProductGrid from '@/components/minimart/product-grid';

export default function MinimartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string } | null>(null);

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

  const handleLogout = () => {
    sessionStorage.removeItem('minimartUser');
    setCurrentUser(null);
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    router.push('/');
  }

  if (!currentUser) {
    return null; // Or a loading component
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
          <h1 className="font-headline text-3xl md:text-4xl font-bold">
              Welcome, {currentUser.name}!
          </h1>
          <Button variant="outline" onClick={handleLogout}><LogIn className="mr-2"/>Change User</Button>
      </div>
      <ProductGrid />
    </div>
  );
}