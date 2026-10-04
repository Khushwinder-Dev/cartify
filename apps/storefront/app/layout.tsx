import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Atelier | Headless Shopify E-Commerce',
  description: 'Full-featured Headless Shopify-like platform with Cartesian Variant Matrix, atomic stock decrementing, and idempotent checkout.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-neutral-50 dark:bg-neutral-950 font-sans">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <CartDrawer />
            <CheckoutModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
