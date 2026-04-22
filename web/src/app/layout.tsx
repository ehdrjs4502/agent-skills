import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Agent Skills',
  description: 'Browse and explore agent skill rules',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-50 font-sans text-gray-900">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <a href="/en" className="text-sm font-semibold text-gray-900 hover:text-black">
              Agent Skills
            </a>
            <nav className="flex items-center gap-1 text-xs">
              <a
                href="/en"
                className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                EN
              </a>
              <a
                href="/ko"
                className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                KO
              </a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
