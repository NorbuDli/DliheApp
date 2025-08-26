"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, Shield, User } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  useEffect(() => {
    // If user is already logged in as admin, redirect to dashboard
    if (sessionStorage.getItem('isAdmin') === 'true') {
      router.replace('/admin');
    }
  }, [router]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'minimart' && password === 'dlihe@minimart') {
      sessionStorage.setItem('isAdmin', 'true');
      toast({
        title: 'Login Successful',
        description: 'Welcome back, Admin!',
      });
      router.replace('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid username or password.',
      });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md">
        <form onSubmit={handleAdminLogin}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2"><Shield /> Admin Login</CardTitle>
            <CardDescription>Enter your admin credentials to access the dashboard.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className='flex items-center gap-2'><User size={16}/> Username</Label>
              <Input
                id="admin-username"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password" className='flex items-center gap-2'><KeyRound size={16}/> Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full">Login</Button>
            <Button variant="link" asChild>
                <Link href="/">Not an admin? Go back.</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
