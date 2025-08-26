"use client";

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import type { Order } from '@/types';

type OrderState = {
  orders: Order[];
};

type OrderAction =
  | { type: 'ADD_ORDER'; payload: Omit<Order, 'status' | 'id'> }
  | { type: 'SET_ORDERS'; payload: Order[] }
  | { type: 'REMOVE_ORDER'; payload: string }
  | { type: 'CANCEL_ORDER'; payload: string }
  | { type: 'MARK_AS_DONE'; payload: string };

const OrderContext = createContext<{
  state: OrderState;
  dispatch: React.Dispatch<OrderAction>;
} | undefined>(undefined);

function orderReducer(state: OrderState, action: OrderAction): OrderState {
  let newState: OrderState;
  switch (action.type) {
    case 'ADD_ORDER': {
      const newOrder: Order = {
        ...action.payload,
        id: new Date().toISOString() + Math.random().toString(36).substring(2, 9),
        status: 'active'
      }
      newState = {
        ...state,
        orders: [newOrder, ...state.orders],
      };
      break;
    }
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'REMOVE_ORDER': {
      newState = {
        ...state,
        orders: state.orders.filter(order => order.id !== action.payload),
      };
      break;
    }
    case 'CANCEL_ORDER': {
      newState = {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.payload ? { ...order, status: 'cancelled' } : order
        ),
      };
      break;
    }
    case 'MARK_AS_DONE': {
      newState = {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload ? { ...order, status: 'done' } : order
        ),
      };
      break;
    }
    default:
      return state;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('orders', JSON.stringify(newState.orders));
  }
  return newState;
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
