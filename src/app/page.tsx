"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Shield, Phone, LogIn } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = sessionStorage.getItem('minimartUser');
    if (storedUser) {
      router.push('/main');
    }
  }, [router]);

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
    toast({
      title: `Welcome, ${name}!`,
      description: 'You can now access the Minimart and Attendance Tracker.',
    });
    router.push('/main');
  };

  if (!isClient) {
    return null; // Render nothing on the server to avoid flash of unauthenticated content
  }

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <div className="max-w-4xl w-full text-center">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4 animate-fade-in-down">
            Welcome to DLIHE
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-12">
            Your all-in-one solution for managing your daily needs. Please select your role to continue.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="flex flex-col text-left">
            <form onSubmit={handleUserLogin}>
                <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><User /> I am a Customer</CardTitle>
                <CardDescription>Enter your details to access the app.</CardDescription>
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
                <Button type="submit" className="w-full">Continue</Button>
                </CardFooter>
            </form>
            </Card>

            <Card className="flex flex-col text-left">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2"><Shield /> I am an Admin</CardTitle>
                <CardDescription>Login to manage products and orders.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center">
                <p className="text-muted-foreground text-center">Click below to proceed to the administrative dashboard.</p>
            </CardContent>
            <CardFooter>
                <Button onClick={() => router.push('/minimart/admin')} className="w-full" variant="secondary">
                Admin Dashboard
                </Button>
            </CardFooter>
            </Card>
        </div>
       </div>
    </div>
  );
}
