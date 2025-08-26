"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/cart-context';
import { useOrders } from '@/context/order-context';
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Order } from '@/types';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, dispatch: cartDispatch } = useCart();
  const { dispatch: orderDispatch } = useOrders();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const storedUser = sessionStorage.getItem('minimartUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.name);
      setPhoneNumber(user.phone);
    } else {
      // Redirect to login if no user data
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'Please enter your details before proceeding to cart.',
      });
      router.push('/minimart');
    }
  }, [router, toast]);


  const totalPrice = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    cartDispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity: newQuantity },
    });
  };

  const handleRemoveItem = (productId: number) => {
    cartDispatch({ type: 'REMOVE_ITEM', payload: productId });
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!name || !phoneNumber) {
       toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all the fields.',
      });
      return;
    }

    const newOrder: Omit<Order, 'status' | 'id'> = {
      customerName: name,
      phoneNumber,
      items: cart,
      totalPrice,
      timestamp: new Date().toLocaleString()
    };
    
    orderDispatch({ type: 'ADD_ORDER', payload: newOrder });

    toast({
      title: 'Order Placed!',
      description: 'Your order has been successfully submitted.',
    });

    // Clear cart and close dialog
    cartDispatch({ type: 'CLEAR_CART' });
    setIsDialogOpen(false);
    router.push('/my-orders');
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
        <h1 className="font-headline text-3xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/minimart">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <Card key={product.id} className="flex items-center p-4">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={80}
                height={80}
                className="rounded-md object-cover"
                data-ai-hint={product.dataAiHint}
              />
              <div className="ml-4 flex-grow">
                <h2 className="font-headline text-lg">{product.name}</h2>
                <p className="text-sm text-muted-foreground">Rupees {product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(product.id, quantity - 1)}>
                  <MinusCircle className="h-5 w-5" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                  className="w-16 h-9 text-center"
                />
                <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(product.id, quantity + 1)}>
                  <PlusCircle className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="ml-4 text-destructive hover:text-destructive" onClick={() => handleRemoveItem(product.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rupees {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>FREE</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rupees {totalPrice.toFixed(2)}</span>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Confirm Order
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleCheckoutSubmit}>
                    <DialogHeader>
                      <DialogTitle>Confirm Your Order</DialogTitle>
                      <DialogDescription>
                        Please confirm your details before submitting the order.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="Your full name" readOnly />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          Phone
                        </Label>
                        <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="col-span-3" placeholder="Your phone number" readOnly />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                         <Button type="button" variant="secondary">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit">Submit Order</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
