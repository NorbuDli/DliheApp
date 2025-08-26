"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Shield, Phone, LogIn } from 'lucide-react';
import ProductGrid from '@/components/minimart/product-grid';

export default function MinimartPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string } | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('minimartUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please enter both your name and phone number.',
      });
      return;
    }
    const user = { name, phone };
    sessionStorage.setItem('minimartUser', JSON.stringify(user));
    setCurrentUser(user);
    toast({
      title: `Welcome, ${name}!`,
      description: 'You can now start shopping.',
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('minimartUser');
    setCurrentUser(null);
    setName('');
    setPhone('');
     toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
  }

  if (currentUser) {
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

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <Card className="flex flex-col">
          <form onSubmit={handleUserLogin}>
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center gap-2"><User /> I am a Customer</CardTitle>
              <CardDescription>Enter your details to start shopping.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <div className="space-y-2">
                <Label htmlFor="customer-name" className='flex items-center gap-2'><User size={16}/> Name</Label>
                <Input
                  id="customer-name"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-phone" className='flex items-center gap-2'><Phone size={16}/> Phone Number</Label>
                <Input
                  id="customer-phone"
                  placeholder="Your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Start Shopping</Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Shield /> I am an Admin</CardTitle>
            <CardDescription>Login to manage products and orders.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
             <p className="text-muted-foreground text-center">Click below to proceed to the administrative dashboard.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/minimart/admin/login')} className="w-full" variant="secondary">
              Admin Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}