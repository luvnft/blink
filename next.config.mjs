/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Load environment variables
  env: {
    // Public variables (accessible in the browser)
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_MAILCHIMP_API_KEY: process.env.NEXT_PUBLIC_MAILCHIMP_API_KEY,
    NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID: process.env.NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID,
    NEXT_PUBLIC_MAILCHIMP_DATA_CENTER: process.env.NEXT_PUBLIC_MAILCHIMP_DATA_CENTER,

    // Server-side only variables (not exposed to the browser)
    NEXT_SERVER_POSTGRES_URL: process.env.POSTGRES_URL,
    NEXT_SERVER_BASE_URL: process.env.BASE_URL,
    NEXT_SERVER_AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_SERVER_SOLANA_NETWORK: process.env.SOLANA_NETWORK,
    NEXT_SERVER_SOLANA_MAINNET_RPC: process.env.SOLANA_MAINNET_RPC,
    NEXT_SERVER_TOKEN_PROGRAM_ID: process.env.TOKEN_PROGRAM_ID,
    NEXT_SERVER_TOKEN_METADATA_PROGRAM_ID: process.env.TOKEN_METADATA_PROGRAM_ID,
    NEXT_SERVER_HELIUS_API_URL: process.env.HELIUS_API_URL,
    NEXT_SERVER_HELIUS_API_KEY: process.env.HELIUS_API_KEY,
    NEXT_SERVER_SHYFT_API_URL: process.env.SHYFT_API_URL,
    NEXT_SERVER_SHYFT_API_KEY: process.env.SHYFT_API_KEY,
    NEXT_SERVER_STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_SERVER_STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    NEXT_SERVER_BARK_BLINK_POSTGRES_URL: process.env.BARK_BLINK_POSTGRES_URL,
    NEXT_SERVER_BARK_BLINK_STRIPE_SECRET_KEY: process.env.BARK_BLINK_STRIPE_SECRET_KEY,
    NEXT_SERVER_BARK_BLINK_STRIPE_WEBHOOK_SECRET: process.env.BARK_BLINK_STRIPE_WEBHOOK_SECRET,
    NEXT_SERVER_BARK_BLINK_BASE_URL: process.env.BARK_BLINK_BASE_URL,
    NEXT_SERVER_BARK_BLINK_AUTH_SECRET: process.env.BARK_BLINK_AUTH_SECRET,
  },

  // Add your custom domains for image optimization
  images: {
    domains: [
      'uploadcare.com',
      'ucarecdn.com',
      'unsplash.com',
    ],
  },
};

export default nextConfig;