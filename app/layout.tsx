import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Instrument_Serif, Noto_Sans_Arabic } from 'next/font/google'
import { Suspense } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { getSettings } from '@/lib/queries'
import { getSiteUrl } from '@/lib/site-url'
import { isAdmin } from '@/lib/admin-auth'
import { AdminProvider } from '@/components/admin/admin-provider'
import { LanguageProvider } from '@/components/site/language-provider'
import './globals.css'

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
})
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic', 'latin'], variable: '--font-noto-arabic' })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const titleVariants = [settings.siteTitle, 'Ryad Hejazy', 'رياض حجازي'].filter((value, index, array) => value && array.indexOf(value) === index)
  const descriptionVariants = [settings.siteDescription, 'Programmer and Information Technology student', 'مبرمج وطالب تقنية معلومات']

  return {
    metadataBase: getSiteUrl(),
    title: titleVariants.join(' | '),
    description: descriptionVariants.filter((value, index, array) => value && array.indexOf(value) === index).join(' — '),
    generator: 'v0.app',
    keywords: ['Ryad Hejazy', 'رياض حجازي', 'portfolio', 'مبرمج', 'programmer', 'developer'],
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        ar: '/',
      },
    },
    openGraph: {
      title: titleVariants.join(' | '),
      description: descriptionVariants.filter((value, index, array) => value && array.indexOf(value) === index).join(' — '),
      type: 'website',
      url: '/',
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
      className={`bg-background ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${notoArabic.variable}`}
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
        <LanguageProvider>
          <AdminProvider initialIsAdmin={admin}>{children}</AdminProvider>
        </LanguageProvider>
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
