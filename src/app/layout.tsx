import { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { ClientLayout } from '@/components/client-layout'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'PhotoAlbum Pro - Sistema Profissional de Álbuns',
    template: '%s | PhotoAlbum Pro'
  },
  description: 'Sistema profissional de álbuns de fotos para fotógrafos e clientes. Gerencie, compartilhe e venda suas fotos com facilidade.',
  keywords: ['fotografia', 'álbums', 'fotos', 'profissional', 'galeria'],
  authors: [{ name: 'PhotoAlbum Pro Team' }],
  creator: 'PhotoAlbum Pro',
  publisher: 'PhotoAlbum Pro',
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
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    title: 'PhotoAlbum Pro - Sistema Profissional de Álbuns',
    description: 'Sistema profissional de álbuns de fotos para fotógrafos e clientes.',
    siteName: 'PhotoAlbum Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhotoAlbum Pro - Sistema Profissional de Álbuns',
    description: 'Sistema profissional de álbuns de fotos para fotógrafos e clientes.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased min-h-screen bg-background`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}