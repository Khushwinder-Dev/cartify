import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import AdminAuthGuard from '@/components/AdminAuthGuard';
import AdminShell from '@/components/AdminShell';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cartify Admin Studio | Merchant Back-Office',
  description: 'Enterprise back-office dashboard for Cartify Apparel. Variant matrix control, inventory adjustments, orders fulfillment, CRM, and discount rules.',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-zinc-950 dark:text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <AdminAuthGuard>
            <AdminShell>{children}</AdminShell>
          </AdminAuthGuard>
        </ThemeProvider>
      </body>
    </html>
  );
}
