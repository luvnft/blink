import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { Connection, PublicKey } from "@solana/web3.js"
import * as nacl from "tweetnacl"
import bs58 from "bs58"

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
        publicKey: {
          label: "Public Key",
          type: "text",
        },
      },
      async authorize(credentials) {
        if (!credentials?.message || !credentials?.signature || !credentials?.publicKey) {
          return null
        }

        try {
          const message = new TextEncoder().encode(credentials.message)
          const signature = bs58.decode(credentials.signature)
          const publicKey = new PublicKey(credentials.publicKey)

          const isValid = nacl.sign.detached.verify(message, signature, publicKey.toBytes())

          if (!isValid) {
            console.error("Invalid signature")
            return null
          }

          let user = await prisma.user.findUnique({
            where: { address: publicKey.toString() },
          })

          if (!user) {
            user = await prisma.user.create({
              data: {
                address: publicKey.toString(),
                name: `Solana User ${publicKey.toString().slice(0, 4)}`,
              },
            })
          }

          return {
            id: user.id,
            address: user.address,
            name: user.name,
          }
        } catch (error) {
          console.error("Error during authentication:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.address = user.address
      }
      return token
    },
    async session({ session, token }) {
      if (token && typeof token.address === "string") {
        session.user.address = token.address
      }
      return session
    },
  },
}

declare module "next-auth" {
  interface Session {
    user: {
      address: string
    } & DefaultSession["user"]
  }

  interface User {
    address: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    address: string
  }
}