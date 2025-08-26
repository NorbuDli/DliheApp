import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/layout/header';
import { CartProvider } from '@/context/cart-context';
import { ProductProvider } from '@/context/product-context';
import { Toaster } from '@/components/ui/toaster';
import { OrderProvider } from '@/context/order-context';

export const metadata: Metadata = {
  title: 'DLIHE',
  description: 'Your one-stop app for minimart shopping and attendance tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen flex flex-col')}>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Toaster />
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
