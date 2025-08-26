"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { UploadCloud, Package, PlusCircle, LogOut, Trash2, ShoppingBag, User, Phone, Trash, Ban } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/context/product-context';
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
} from "@/components/ui/alert-dialog"
import { Switch } from '@/components/ui/switch';
import { useOrders } from '@/context/order-context';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { products, dispatch } = useProducts();
  const { orders, dispatch: orderDispatch } = useOrders();

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdminAuthenticated') === 'true';
    if (!isAdmin) {
      router.replace('/minimart/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imageUrl: '',
    imageFile: null as File | null,
    dataAiHint: '',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          imageFile: file,
          imageUrl: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.imageUrl) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill out all product details.',
      });
      return;
    }

    const createdProduct: Omit<Product, 'id' | 'inStock'> = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      imageUrl: newProduct.imageUrl,
      dataAiHint: newProduct.dataAiHint || newProduct.name.toLowerCase().split(' ').slice(0,2).join(' '),
    };
    
    dispatch({ type: 'ADD_PRODUCT', payload: createdProduct });


    toast({
      title: 'Product Added!',
      description: `${createdProduct.name} has been added to the store.`,
    });

    // Reset form
    setNewProduct({
      name: '',
      price: '',
      imageUrl: '',
      imageFile: null,
      dataAiHint: ''
    });
  };

  const handleRemoveProduct = (productId: number) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: productId });
    toast({
      title: 'Product Removed',
      description: 'The product has been removed from the store.',
    });
  };

   const handleStockToggle = (productId: number) => {
    dispatch({ type: 'TOGGLE_STOCK_STATUS', payload: productId });
  };
  
  const handleRemoveOrder = (orderId: string) => {
    orderDispatch({ type: 'REMOVE_ORDER', payload: orderId });
    toast({
      title: 'Order Deleted',
      description: 'The order has been successfully removed.',
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/minimart/admin/login');
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
  };
  
  if (!isAuthenticated) {
    return (
       <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
           <Skeleton className="h-10 w-2/5" />
           <Skeleton className="h-10 w-24" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-[500px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());


  return (
    <div className="container mx-auto py-8 px-4">
       <div className="flex justify-between items-center mb-8">
        <h1 className="font-headline text-3xl md:text-4xl font-bold">
          Admin Dashboard
        </h1>
        <Button variant="outline" onClick={handleLogout}><LogOut className="mr-2"/>Logout</Button>
      </div>
      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>Manage Products</CardTitle>
            <CardDescription>Add, remove, and update products in your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PlusCircle /> Add New Product</CardTitle>
                    <CardDescription>Fill in the details to add a new product.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleAddProduct}>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="product-name" className="flex items-center gap-2"><Package size={16} />Product Name</Label>
                        <Input 
                          id="product-name" 
                          placeholder="e.g., Instant Noodles" 
                          value={newProduct.name}
                          onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-price" className="flex items-center gap-2">Price (Rupees)</Label>
                        <Input 
                          id="product-price" 
                          type="number" 
                          placeholder="e.g., 125" 
                          value={newProduct.price}
                          onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                          step="0.01"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="product-image" className="flex items-center gap-2"><UploadCloud size={16} />Product Picture</Label>
                        <Input id="product-image" type="file" accept="image/*" onChange={handleFileChange} />
                      </div>
                      {newProduct.imageUrl && (
                        <div className="relative aspect-video w-full">
                          <Image src={newProduct.imageUrl} alt="Preview" fill className="rounded-md object-cover" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label htmlFor="product-hint" className="flex items-center gap-2"><Package size={16} />Image Hint (Optional)</Label>
                        <Input 
                          id="product-hint" 
                          placeholder="e.g., instant noodles" 
                          value={newProduct.dataAiHint}
                          onChange={e => setNewProduct(p => ({ ...p, dataAiHint: e.target.value }))}
                        />
                        <p className="text-xs text-muted-foreground">Used to find better stock images. Max 2 words.</p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full">
                        Add Product
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Products</CardTitle>
                    <CardDescription>Manage products currently available.</CardDescription>
                  </CardHeader>
                  <CardContent className="max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                      {products.length > 0 ? (
                        products.map((product) => (
                          <Card key={product.id} className="flex flex-col overflow-hidden">
                            <CardHeader className="p-0">
                                <div className="aspect-square relative">
                                    <Image
                                      src={product.imageUrl}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      data-ai-hint={product.dataAiHint}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                              <CardTitle className="font-headline text-lg mb-2">{product.name}</CardTitle>
                              <p className="text-xl font-semibold text-primary">
                                Rupees {product.price.toFixed(2)}
                              </p>
                            </CardContent>
                            <CardFooter className="p-2 flex-col gap-2">
                              <div className="flex items-center space-x-2 w-full justify-center">
                                  <Switch 
                                    id={`stock-switch-${product.id}`} 
                                    checked={product.inStock}
                                    onCheckedChange={() => handleStockToggle(product.id)}
                                  />
                                  <Label htmlFor={`stock-switch-${product.id}`}>{product.inStock ? 'In Stock' : 'Out of Stock'}</Label>
                                </div>
                              <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full">
                                      <Trash2 className="mr-2" /> Remove
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently remove the product
                                        from your store.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleRemoveProduct(product.id)}>
                                        Continue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                          </Card>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-muted-foreground">No products added yet.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Orders</CardTitle>
            <CardDescription>View and manage incoming customer orders.</CardDescription>
          </CardHeader>
          <CardContent>
            {sortedOrders.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {sortedOrders.map((order) => (
                  <AccordionItem value={order.id} key={order.id}>
                    <AccordionTrigger
                      className={order.status === 'cancelled' ? 'text-muted-foreground' : ''}
                      disabled={order.status === 'cancelled'}
                    >
                      <div className="flex justify-between items-center w-full pr-4">
                        <span className='font-semibold'>{order.customerName}</span>
                         {order.status === 'cancelled' ? (
                          <Badge variant="destructive" className='flex items-center gap-1'><Ban size={12}/>Cancelled</Badge>
                        ) : (
                          <Badge variant="secondary">Active</Badge>
                        )}
                        <span className='text-muted-foreground'>{order.timestamp}</span>
                        <span className={`font-bold ${order.status === 'cancelled' ? '' : 'text-primary'}`}>Rupees {order.totalPrice.toFixed(2)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className='flex items-center gap-2'><User size={16} className='text-muted-foreground'/><span className="font-semibold">{order.customerName}</span></div>
                          <div className='flex items-center gap-2'><Phone size={16} className='text-muted-foreground'/><span className="font-semibold">{order.phoneNumber}</span></div>
                        </div>
                        <Separator className="my-4" />
                        <h4 className="font-semibold mb-2 flex items-center gap-2"><ShoppingBag size={18}/>Ordered Items</h4>
                        <ul className="space-y-2 list-disc list-inside">
                          {order.items.map((item, index) => (
                            <li key={index}>
                              {item.quantity}x {item.product.name} @ Rupees {item.product.price.toFixed(2)} each
                            </li>
                          ))}
                        </ul>
                         <Separator className="my-4" />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash className="mr-2 h-4 w-4"/>
                                Delete Order Record
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this order record?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the order record from view.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleRemoveOrder(order.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>No orders have been placed yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
