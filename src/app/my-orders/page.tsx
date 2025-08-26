
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/context/order-context';
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Package, CalendarClock, IndianRupee, Ban, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';


export default function MyOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { orders, dispatch: orderDispatch } = useOrders();
  const [currentUser, setCurrentUser] = useState<{ name: string; phone: string } | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('minimartUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      toast({
        variant: 'destructive',
        title: 'Not Logged In',
        description: 'You need to be logged in to view your orders.',
      });
      router.push('/');
    }
  }, [router, toast]);

  useEffect(() => {
    if (currentUser && orders.length > 0) {
      const filteredOrders = orders.filter(
        (order) => order.customerName === currentUser.name && order.phoneNumber === currentUser.phone
      );
      setUserOrders(filteredOrders.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } else {
      setUserOrders([]);
    }
  }, [currentUser, orders]);

  const handleCancelOrder = (orderId: string) => {
    orderDispatch({ type: 'CANCEL_ORDER', payload: orderId });
    toast({
      title: 'Order Cancelled',
      description: 'Your order has been successfully cancelled.',
    });
  };

  if (!currentUser) {
    return null; // Or a loading skeleton
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8">My Orders</h1>
      {userOrders.length > 0 ? (
        <div className="space-y-6">
          {userOrders.map((order) => (
            <Card key={order.id} className={`overflow-hidden ${order.status !== 'active' ? 'bg-muted/50' : ''}`}>
              <CardHeader>
                 <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className='flex items-center gap-4'>
                      <span>Order ID: {order.id.substring(0, 8)}...</span>
                      {order.status === 'cancelled' ? (
                          <Badge variant="destructive" className='flex items-center gap-1'><Ban size={12}/>Cancelled</Badge>
                        ) : order.status === 'done' ? (
                          <Badge variant="default" className='flex items-center gap-1 bg-green-600'><CheckCircle size={12}/>Completed</Badge>
                        ) : (
                          <Badge variant="secondary">Active</Badge>
                        )}
                    </CardTitle>
                    <CardDescription className='flex items-center gap-2 pt-2'><CalendarClock size={16}/>{order.timestamp}</CardDescription>
                  </div>
                  <div className='text-right'>
                     <p className={`text-xl font-bold flex items-center gap-2 justify-end ${order.status !== 'active' ? 'text-muted-foreground' : 'text-primary'}`}><IndianRupee size={20}/> {order.totalPrice.toFixed(2)}</p>
                     <p className="text-sm text-muted-foreground">Total Amount</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Separator className="mb-4" />
                <h4 className="font-semibold mb-4 flex items-center gap-2"><ShoppingBag size={18}/>Ordered Items</h4>
                <ul className="space-y-3">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center">
                       <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} x Rupees {item.product.price.toFixed(2)}</p>
                       </div>
                       <p className="font-semibold">Rupees {(item.quantity * item.product.price).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
               {order.status === 'active' && (
                <CardFooter className="bg-muted/50 p-4">
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">
                          <Ban className="mr-2 h-4 w-4"/>
                          Cancel Order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to cancel this order?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will mark the order as cancelled. You cannot undo this action.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Order</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleCancelOrder(order.id)}>
                            Yes, Cancel
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
               )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <Package className="mx-auto h-24 w-24 text-muted-foreground mb-4" />
          <h2 className="font-headline text-2xl font-bold mb-2">No Orders Yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders. Let's change that!</p>
          <Button asChild>
            <Link href="/minimart">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
