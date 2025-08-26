
"use client";

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/context/cart-context';
import { Home, Menu, ShoppingCart, User } from 'lucide-react';

export default function Header() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { href: '/main', label: 'Home' },
    { href: '/minimart', label: 'Minimart' },
    { href: '/attendance', label: 'Attendance' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/main" className="mr-6 flex items-center space-x-2">
           <span className="font-bold font-headline hidden sm:inline-block">DLIHE</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
           <Button variant="ghost" size="icon" asChild>
            <Link href="/my-orders" aria-label="My Orders">
              <User className="h-5 w-5" />
            </Link>
          </Button>
           <Button variant="ghost" size="icon" asChild>
            <Link href="/minimart/cart" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute top-1 right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                  {totalItems}
                </Badge>
              )}
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 py-6">
                <Link href="/main" className="mr-6 flex items-center space-x-2 mb-4">
                  <span className="font-bold font-headline">DLIHE</span>
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                 <Link
                    href="/my-orders"
                    className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                  >
                    My Orders
                  </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
