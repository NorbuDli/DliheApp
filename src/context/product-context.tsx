"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { Product } from '@/types';
import { products as initialProducts } from '@/lib/products';

type ProductState = {
  products: Product[];
};

type ProductAction =
  | { type: 'ADD_PRODUCT'; payload: Omit<Product, 'id' | 'inStock'> }
  | { type: 'REMOVE_PRODUCT'; payload: number }
  | { type: 'TOGGLE_STOCK_STATUS'; payload: number }
  | { type: 'SET_PRODUCTS'; payload: Product[] };

const ProductContext = createContext<{
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
} | undefined>(undefined);

function productReducer(state: ProductState, action: ProductAction): ProductState {
  let newState: ProductState;
  switch (action.type) {
    case 'ADD_PRODUCT': {
      const newProduct: Product = {
        ...action.payload,
        id: state.products.length > 0 ? Math.max(...state.products.map(p => p.id)) + 1 : 1,
        inStock: true,
      };
      newState = {
        ...state,
        products: [...state.products, newProduct],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(newState.products));
      }
      return newState;
    }
     case 'REMOVE_PRODUCT': {
      newState = {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(newState.products));
      }
      return newState;
    }
    case 'TOGGLE_STOCK_STATUS': {
      newState = {
        ...state,
        products: state.products.map(p => p.id === action.payload ? { ...p, inStock: !p.inStock } : p),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(newState.products));
      }
      return newState;
    }
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    default:
      return state;
  }
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, { products: initialProducts });

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        dispatch({ type: 'SET_PRODUCTS', payload: JSON.parse(storedProducts) });
      }
    } catch (error) {
        console.error("Failed to parse products from localStorage", error)
    }
  }, []);

  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return { products: context.state.products, dispatch: context.dispatch };
}
