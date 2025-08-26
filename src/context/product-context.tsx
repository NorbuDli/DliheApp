"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { Product } from '@/types';
import { products as initialProducts } from '@/lib/products';

type ProductState = {
  products: Product[];
};

type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] };

const ProductContext = createContext<{
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
} | undefined>(undefined);

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
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
      } else {
        // If nothing in local storage, set initial products
        localStorage.setItem('products', JSON.stringify(initialProducts));
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
