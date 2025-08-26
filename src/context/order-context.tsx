"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { Order } from '@/types';

type OrderState = {
  orders: Order[];
};

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'SET_ORDERS'; payload: Order[] };

const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
} | undefined>(undefined);

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  let newState: OrderState;
  switch (action.type) {
    case 'ADD_ORDER':
      newState = {
        ...state,
        orders: [action.payload, ...state.orders],
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('orders', JSON.stringify(newState.orders));
      }
      return newState;
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    default:
      return state;
  }
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, { orders: [] });

  useEffect(() => {
    try {
      const storedOrders = localStorage.getItem('orders');
      if (storedOrders) {
        dispatch({ type: 'SET_ORDERS', payload: JSON.parse(storedOrders) });
      }
    } catch (error) {
      console.error("Failed to parse orders from localStorage", error);
    }
  }, []);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return { orders: context.state.orders, dispatch: context.dispatch };
}
