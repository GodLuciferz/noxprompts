import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'NoxPrompts — Trending AI Art Prompts',
  description: 'Discover the latest trending AI art styles with ready-to-use prompts. Ghibli, Anime, Realistic, Dark & more.',
  keywords: 'AI prompts, trending AI art, Ghibli prompts, anime AI art, Midjourney prompts',
  openGraph: {
    title: 'NoxPrompts — Trending AI Art Prompts',
    description: 'Discover trending AI art styles with ready-to-use prompts',
    url: 'https://noxzone111.online',
    siteName: 'NoxPrompts',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#12121A', color: '#fff', border: '1px solid rgba(255,45,120,0.3)' }
          }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
