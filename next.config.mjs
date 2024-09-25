/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  publicRuntimeConfig: {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    MAILCHIMP_API_KEY: process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY,
    MAILCHIMP_AUDIENCE_ID: process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID,
    MAILCHIMP_DATA_CENTER: process.env.NEXT_PUBLIC_MAILCHIMP_DATA_CENTER,
  },

  serverRuntimeConfig: {
    POSTGRES_URL: process.env.POSTGRES_URL,
    BASE_URL: process.env.BASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    SOLANA_NETWORK: process.env.SOLANA_NETWORK,
    SOLANA_MAINNET_RPC: process.env.SOLANA_MAINNET_RPC,
    TOKEN_PROGRAM_ID: process.env.TOKEN_PROGRAM_ID,
    TOKEN_METADATA_PROGRAM_ID: process.env.TOKEN_METADATA_PROGRAM_ID,
    HELIUS_API_URL: process.env.HELIUS_API_URL,
    HELIUS_API_KEY: process.env.HELIUS_API_KEY,
    SHYFT_API_URL: process.env.SHYFT_API_URL,
    SHYFT_API_KEY: process.env.SHYFT_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    BARK_BLINK_POSTGRES_URL: process.env.BARK_BLINK_POSTGRES_URL,
    BARK_BLINK_STRIPE_SECRET_KEY: process.env.BARK_BLINK_STRIPE_SECRET_KEY,
    BARK_BLINK_STRIPE_WEBHOOK_SECRET: process.env.BARK_BLINK_STRIPE_WEBHOOK_SECRET,
    BARK_BLINK_BASE_URL: process.env.BARK_BLINK_BASE_URL,
    BARK_BLINK_AUTH_SECRET: process.env.BARK_BLINK_AUTH_SECRET,
  },

  images: {
    domains: [
      'uploadcare.com',
      'ucarecdn.com',
      'unsplash.com',
    ],
  },
};

export default nextConfig;