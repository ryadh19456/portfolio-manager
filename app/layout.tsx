import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { getSettings } from '@/lib/queries'
import { isAdmin } from '@/lib/admin-auth'
import { AdminProvider } from '@/components/admin/admin-provider'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: settings.siteTitle,
    description: settings.siteDescription,
    generator: 'v0.app',
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      type: 'website',
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5ef' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1815' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const admin = await isAdmin()

  return (
    <html
      lang="en"
      className={`bg-background ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          // Applies stored theme before paint to avoid a flash.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <AdminProvider initialIsAdmin={admin}>{children}</AdminProvider>
        <Suspense>
          <Toaster position="bottom-center" />
        </Suspense>
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}
