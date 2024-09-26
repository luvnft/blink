import { z } from 'zod'

const envSchema = z.object({
  // Database
  POSTGRES_URL: z.string().url(),
  BASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(1),

  // APIs
  NEXT_PUBLIC_RPC_ENDPOINT: z.string().url(),

  // BARK / Solana Programs IDs
  SWAP_PROGRAM_ID: z.string().min(1),

  // Auth
  NEXTAUTH_SECRET: z.string().min(1),
  JWT_SIGNING_PRIVATE_KEY: z.string().min(1),
  GITHUB_ID: z.string().min(1),
  GITHUB_SECRET: z.string().min(1),

  // Solana configurations
  SOLANA_NETWORK: z.enum(['devnet', 'testnet', 'mainnet-beta']),
  SOLANA_MAINNET_RPC: z.string().url(),
  TOKEN_PROGRAM_ID: z.string().min(1),

  // Metaplex
  TOKEN_METADATA_PROGRAM_ID: z.string().min(1),

  // Helius API configuration
  HELIUS_API_URL: z.string().url(),
  HELIUS_API_KEY: z.string().min(1),

  // SHYFT API configuration
  SHYFT_API_URL: z.string().url(),
  SHYFT_API_KEY: z.string().min(1),

  // Payments
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),

  // BARK BLINK configuration
  BARK_BLINK_POSTGRES_URL: z.string().url(),
  BARK_BLINK_STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  BARK_BLINK_STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_'),
  BARK_BLINK_BASE_URL: z.string().url(),
  BARK_BLINK_AUTH_SECRET: z.string().min(1),

  // Donations
  DONATION_WALLET: z.string().min(1),

  // Commerce
  MERCHANT_WALLET: z.string().min(1),

  // Marketing & Mail
  NEXT_PUBLIC_MAILCHIMP_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_MAILCHIMP_AUDIENCE_ID: z.string().min(1),
  NEXT_PUBLIC_MAILCHIMP_DATA_CENTER: z.string().min(1),
})

function validateEnv(): z.infer<typeof envSchema> {
  try {
    const env = envSchema.parse(process.env)
    
    // Additional validation or transformations
    if (env.SOLANA_NETWORK === 'mainnet-beta' && !env.SOLANA_MAINNET_RPC.includes('mainnet')) {
      throw new Error('SOLANA_MAINNET_RPC must be a mainnet RPC URL when SOLANA_NETWORK is set to mainnet-beta')
    }

    // Convert string values to appropriate types if needed
    return {
      ...env,
      SWAP_PROGRAM_ID: new PublicKey(env.SWAP_PROGRAM_ID),
      TOKEN_PROGRAM_ID: new PublicKey(env.TOKEN_PROGRAM_ID),
      TOKEN_METADATA_PROGRAM_ID: new PublicKey(env.TOKEN_METADATA_PROGRAM_ID),
      DONATION_WALLET: new PublicKey(env.DONATION_WALLET),
      MERCHANT_WALLET: new PublicKey(env.MERCHANT_WALLET),
    }
  } catch (error) {
    console.error(
      "❌ Invalid environment variables:",
      JSON.stringify(error.flatten?.() ?? error, null, 2)
    )
    throw new Error("Invalid environment variables")
  }
}

export const env = validateEnv()

// Type-safe access to environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}