"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';
import { ShoppingCart, PackageX } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: product });
    toast({
      title: 'Added to cart!',
      description: `${product.name} has been added to your shopping cart.`,
    });
  };

  return (
    <Card className={`flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl ${product.inStock ? 'hover:-translate-y-1' : ''}`}>
      <CardHeader className="p-0">
        <div className="aspect-square relative">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className={`object-cover ${!product.inStock ? 'grayscale' : ''}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={product.dataAiHint}
          />
           {!product.inStock && (
            <Badge variant="destructive" className="absolute top-2 right-2 text-base">Out of Stock</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="font-headline text-lg mb-2">{product.name}</CardTitle>
        <p className="text-xl font-semibold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart} disabled={!product.inStock}>
          {product.inStock ? <ShoppingCart className="mr-2 h-4 w-4" /> : <PackageX className="mr-2 h-4 w-4" /> }
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
}
