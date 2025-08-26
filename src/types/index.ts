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

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  items: CartItem[];
  totalPrice: number;
  timestamp: string;
  status: 'active' | 'cancelled' | 'done';
}
