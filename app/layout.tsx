import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '../components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata = {
  title: 'Nitesh Handicraft - Premium Handcrafted Art & Statues',
  description: 'Discover exquisite handcrafted art statues, traditional handicrafts, and unique decorative pieces at Nitesh Handicraft. Premium quality, authentic designs, worldwide shipping.',
  keywords: 'handicraft, handmade art, statues, traditional crafts, home decor, sculptures, authentic handicrafts, premium art',
  authors: [{ name: 'Nitesh Handicraft' }],
  manifest: '/manifest.json',
  metadataBase: new URL('http://localhost:3000'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Nitesh Handicraft',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Nitesh Handicraft - Premium Handcrafted Art & Statues',
    description: 'Discover exquisite handcrafted art statues, traditional handicrafts, and unique decorative pieces.',
    type: 'website',
    locale: 'en_US',
    url: 'https://niteshhandicraft.com',
    siteName: 'Nitesh Handicraft',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nitesh Handicraft - Premium Handcrafted Art',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nitesh Handicraft - Premium Handcrafted Art & Statues',
    description: 'Discover exquisite handcrafted art statues, traditional handicrafts, and unique decorative pieces.',
    creator: '@niteshhandicraft',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#2563eb',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Performance optimization preconnects */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.niteshhandicraft.com" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://unpkg.com" />
        
        {/* Critical resource hints */}
        <link rel="preload" href="/api/products" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/api/categories" as="fetch" crossOrigin="anonymous" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="Nitesh Handicraft" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nitesh Handicraft" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180x180.png" />
        
        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
