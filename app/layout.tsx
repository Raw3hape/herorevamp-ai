import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HeroRevamp AI - Мгновенный AI-редизайн hero-секций',
  description: 'Преобразуйте устаревшие hero-секции в современный дизайн с помощью AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>{children}</body>
    </html>
  )
}