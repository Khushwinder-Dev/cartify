import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';

const sansFont = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const serifFont = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cartify | Modern Everyday Clothing & Essentials',
  description: 'Premium everyday clothing, custom-milled heavyweight fleece hoodies, Japanese selvedge denim, and elevated wardrobe essentials.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sansFont.variable} ${serifFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100 font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <div className="flex-1">{children}</div>
              <Footer />
              <CartDrawer />
              <CheckoutModal />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
