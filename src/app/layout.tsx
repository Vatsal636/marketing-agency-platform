import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'CampaignHub — Marketing Agency Project Management',
  description: 'Streamline your marketing campaigns, track team workload, and deliver client visibility with CampaignHub.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 ml-64">
            <div className="p-8 max-w-[1400px]">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
