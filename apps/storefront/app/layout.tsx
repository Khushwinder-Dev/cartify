import type { Metadata } from 'next';
import './globals.css';
import { fontSans, fontSerif } from '@/lib/fonts';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import Footer from '@/components/Footer';

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
      className={`${fontSans.variable} ${fontSerif.variable} h-full w-full max-w-full overflow-x-hidden antialiased`}
    >
      <body className="min-h-full w-full max-w-full overflow-x-hidden flex flex-col bg-white text-zinc-900 dark:bg-[#09090b] dark:text-zinc-100 font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
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
