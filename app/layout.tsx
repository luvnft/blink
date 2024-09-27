import React from 'react'
import type { Metadata } from "next"
import localFont from "next/font/local"
import { Inter, Syne, Poppins } from "next/font/google"
import { ToastProvider } from '@/components/ui/toast'
import "./styles/globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const syne = Syne({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-syne',
})

const poppins = Poppins({
  weight: ['300', '400', '600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: "BARK BLINKS",
  description: "Solana Actions & Blinks dApp",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${syne.variable} ${poppins.variable} antialiased font-sans bg-gradient-to-b from-sand-50 to-white min-h-screen`}
      >
        <div className="bg-white bg-opacity-80 backdrop-blur-sm min-h-screen">
          <ToastProvider>
            {children}
          </ToastProvider>
        </div>
      </body>
    </html>
  )
}