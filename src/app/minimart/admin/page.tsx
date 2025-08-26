"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { UploadCloud, DollarSign, Package, PlusCircle } from 'lucide-react';
import ProductCard from '@/components/minimart/product-card';

export default function AdminPage() {
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
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

    const createdProduct: Product = {
      id: products.length + 1,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      imageUrl: newProduct.imageUrl,
      dataAiHint: newProduct.dataAiHint || newProduct.name.toLowerCase().split(' ').slice(0,2).join(' '),
    };

    setProducts(prev => [...prev, createdProduct]);

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

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
        Admin - Manage Products
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><PlusCircle /> Add New Product</CardTitle>
              <CardDescription>Fill in the details to add a new product to the minimart.</CardDescription>
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
                  <Label htmlFor="product-price" className="flex items-center gap-2"><DollarSign size={16} />Price</Label>
                  <Input 
                    id="product-price" 
                    type="number" 
                    placeholder="e.g., 1.50" 
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
              <CardTitle>Live Product Preview</CardTitle>
              <CardDescription>This is how your products will appear to customers.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.length > 0 ? (
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No products added yet. Use the form to add your first product.</p>
                  </div>
                )}
              </div>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}