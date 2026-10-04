import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Atelier Admin Studio | Self-Hosted E-Commerce Back Office',
  description: 'Enterprise back-office dashboard for Atelier E-Commerce. Cartesian product matrix, inventory adjustments, orders fulfillment, CRM, and discount rules.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500 selection:text-white">
        <AdminSidebar />
        <div className="md:pl-64 flex flex-col min-h-screen">
          <AdminTopNav />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
