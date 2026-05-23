import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import InfoBanner from '@/components/InfoBanner';

export const metadata: Metadata = {
  title: { default: 'NoxPrompts — Trending AI Art Prompts 2025', template: '%s | NoxPrompts' },
  description: 'Discover the latest trending AI art styles with ready-to-use prompts. Ghibli, Anime, Realistic, Dark, Neon & more.',
  keywords: ['AI art prompts','trending AI art','Ghibli AI prompt','anime AI art prompt','Midjourney prompts 2025','ChatGPT image prompts','DALL-E prompts','viral AI art style','NoxPrompts'],
  metadataBase: new URL('https://noxzone111.online'),
  openGraph: {
    title: 'NoxPrompts — Trending AI Art Prompts 2025',
    description: 'Every viral AI art style — one prompt away. Copy & create instantly.',
    url: 'https://noxzone111.online',
    siteName: 'NoxPrompts',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'NoxPrompts', description: 'Every viral AI art style — one prompt away.' },
  robots: { index: true, follow: true },
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
          <InfoBanner />
          <Toaster position="bottom-right" toastOptions={{
            style: { background: '#12121A', color: '#fff', border: '1px solid rgba(255,45,120,0.3)' }
          }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
