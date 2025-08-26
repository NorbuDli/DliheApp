"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { Product } from '@/types';
import { products as initialProducts } from '@/lib/products';

type ProductState = {
  products: Product[];
};

type ProductAction =
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'ADD_PRODUCT'; payload: Omit<Product, 'id' | 'inStock'> }
  | { type: 'REMOVE_PRODUCT'; payload: number }
  | { type: 'TOGGLE_STOCK_STATUS'; payload: number };

const ProductContext = createContext<{
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
} | undefined>(undefined);

function productReducer(state: ProductState, action: ProductAction): ProductState {
  let newState: ProductState;
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'ADD_PRODUCT': {
        const newProduct: Product = {
            id: new Date().getTime(), // simple id generation
            ...action.payload,
            inStock: true
        };
        newState = {
            ...state,
            products: [...state.products, newProduct]
        };
        break;
    }
    case 'REMOVE_PRODUCT': {
        newState = {
            ...state,
            products: state.products.filter(p => p.id !== action.payload)
        };
        break;
    }
    case 'TOGGLE_STOCK_STATUS': {
        newState = {
            ...state,
            products: state.products.map(p => 
                p.id === action.payload ? { ...p, inStock: !p.inStock } : p
            )
        };
        break;
    }
    default:
      return state;
  }
  // Persist state to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem('products', JSON.stringify(newState.products));
  }
  return newState;
}

export function ProductProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productReducer, { products: [] });

  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        dispatch({ type: 'SET_PRODUCTS', payload: JSON.parse(storedProducts) });
      } else {
        dispatch({ type: 'SET_PRODUCTS', payload: initialProducts });
        localStorage.setItem('products', JSON.stringify(initialProducts));
      }
    } catch (error) {
        console.error("Failed to parse products from localStorage", error)
    }
  }, []);

  return (
    <ProductContext.Provider value={{ state: state, dispatch }}>
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
