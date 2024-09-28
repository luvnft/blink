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
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    ACCESS_KEY_PASSWORD: process.env.ACCESS_KEY_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
  },

  images: {
    domains: [
      'uploadcare.com',
      'ucarecdn.com',
      'unsplash.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
    ],
  },

  // Improved error handling and logging
  onError: (error, req, res) => {
    console.error('Next.js Error:', error);
    res.statusCode = 500;
    res.end('Internal Server Error');
  },

  // Enable source maps in production for better error tracking
  productionBrowserSourceMaps: true,

  // Optimize loading of ES modules
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', '@mui/icons-material', 'lodash'],
  },

  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      };
    }

    // Add any other custom webpack configurations here

    return config;
  },
};

export default nextConfig;