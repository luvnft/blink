import React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from 'react-query'

import { Header } from '@/components/ui/header'
import { Footer } from '@/components/ui/footer'
import { Toaster } from '@/components/ui/toaster'

import '@/styles/globals.css'

const queryClient = new QueryClient()

function BarkBlinkApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <React.Fragment>
      <Head>
        <title>BARK | BLINK</title>
        <meta name="description" content="Transform your digital experience with BARK BLINK" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                <Component {...pageProps} />
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </QueryClientProvider>
      </SessionProvider>
    </React.Fragment>
  )
}

export default BarkBlinkApp