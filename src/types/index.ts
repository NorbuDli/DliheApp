export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  dataAiHint: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
