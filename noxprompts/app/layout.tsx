import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  metadataBase: new URL('https://noxzone111.online'),

  title: {
    default:
      'NoxPrompts — Viral AI Prompts, Ghibli Art, GTA 6, Pixar & AI Trends',
    template: '%s | NoxPrompts',
  },

  description:
    'Discover viral AI prompts for Ghibli art, GTA 6 posters, Pixar characters, anime edits, cinematic AI trends and more. Copy ready-to-use prompts for ChatGPT, Midjourney, Gemini, Grok, Leonardo AI & DALL-E.',

  keywords: [
    'AI prompts',
    'viral AI prompts',
    'trending AI prompts',
    'AI art prompts',
    'ChatGPT prompts',
    'Midjourney prompts',
    'DALL-E prompts',
    'Leonardo AI prompts',
    'Ghibli AI art',
    'Pixar AI prompt',
    'GTA 6 AI poster',
    'anime AI art',
    'cinematic AI prompts',
    'realistic AI prompts',
    'AI image prompts',
    'free AI prompts',
    'best AI prompts 2025',
    'AI trends',
    'viral AI art styles',
    'NoxPrompts',
  ],

  authors: [{ name: 'NoxPrompts Team' }],
  creator: 'NoxPrompts',
  publisher: 'NoxPrompts',

  alternates: {
    canonical: 'https://noxzone111.online',
  },

  category: 'technology',

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'PASTE_GOOGLE_SEARCH_CONSOLE_CODE_HERE',
  },

  openGraph: {
    title:
      'NoxPrompts — Viral AI Prompts, Ghibli Art, GTA 6 & Pixar Trends',

    description:
      'Explore trending AI prompts for Ghibli art, GTA 6 posters, Pixar characters, anime edits & cinematic AI styles.',

    url: 'https://noxzone111.online',

    siteName: 'NoxPrompts',

    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NoxPrompts AI Trends',
      },
    ],

    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    title:
      'NoxPrompts — Viral AI Prompts, Ghibli Art & AI Trends',

    description:
      'Copy trending AI prompts instantly for ChatGPT, Midjourney, Gemini & more.',

    creator: '@noxprompts',

    images: ['/og-image.png'],
  },

  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],

    shortcut: ['/favicon.ico'],

    apple: [{ url: '/apple-touch-icon.png' }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',

    '@type': 'WebSite',

    name: 'NoxPrompts',

    alternateName: 'NoxPrompts AI Trends',

    url: 'https://noxzone111.online',

    description:
      'Discover viral AI prompts, trending AI art styles, Ghibli prompts, GTA 6 posters, Pixar prompts and more.',

    publisher: {
      '@type': 'Organization',

      name: 'NoxPrompts',

      logo: {
        '@type': 'ImageObject',

        url: 'https://noxzone111.online/logo.png',
      },
    },

    potentialAction: {
      '@type': 'SearchAction',

      target:
        'https://noxzone111.online/search?q={search_term_string}',

      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Unbounded:wght@700;900&display=swap"
          rel="stylesheet"
        />

        {/* Theme */}
        <meta name="theme-color" content="#0B0B12" />

        {/* Extra SEO */}
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="language" content="English" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>

      <body className="bg-[#09090F] text-white antialiased">
        <ThemeProvider>
          <Navbar />

          <main>{children}</main>

          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#12121A',
                color: '#fff',
                border:
                  '1px solid rgba(255,45,120,0.3)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
