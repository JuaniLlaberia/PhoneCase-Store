import type { Metadata } from 'next';
import { Recursive } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from '@/components/Providers';
import { Toaster } from '@/components/ui/toaster';

const inter = Recursive({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'caseCobra',
  description: 'Customizable phone cases',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <NextTopLoader color='#16a34a' />
        <Navbar />
        <main className='flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]'>
          <div className='flex-1 flex flex-col h-full'>
            <Providers>{children}</Providers>
          </div>
          <Footer />
        </main>
        <Toaster />
      </body>
    </html>
  );
}
