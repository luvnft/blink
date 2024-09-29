import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { validateNFTInput } from '@/lib/validators';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { PublicKey } from '@solana/web3.js';
import { mintNFT } from '@/lib/solana';

// Define the input schema for minting an NFT
const mintNFTSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
  image: z.string().url(),
  attributes: z.array(
    z.object({
      trait_type: z.string(),
      value: z.union([z.string(), z.number()]),
    })
  ),
  royaltyPercentage: z.number().min(0).max(100),
  collectionId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate the request body
    const body = await req.json();
    const validatedData = mintNFTSchema.parse(body);

    // Validate NFT input
    const { isValid, errors } = validateNFTInput({
      metadata: {
        name: validatedData.name,
        description: validatedData.description,
        image: validatedData.image,
        attributes: validatedData.attributes,
      },
      creatorAddress: session.user.id,
    });

    if (!isValid) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Generate a new Solana public key for the NFT
    const mintAddress = new PublicKey(PublicKey.unique()).toString();

    // Mint the NFT on the Solana blockchain
    const { signature } = await mintNFT(
      mintAddress,
      session.user.id,
      validatedData.name,
      validatedData.description,
      validatedData.image,
      validatedData.attributes,
      validatedData.royaltyPercentage
    );

    // Create the NFT in the database
    const newNFT = await prisma.nFT.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        image: validatedData.image,
        ownerId: session.user.id,
        mintAddress: mintAddress,
        metadata: {
          name: validatedData.name,
          description: validatedData.description,
          image: validatedData.image,
          attributes: validatedData.attributes,
        },
        royaltyPercentage: validatedData.royaltyPercentage,
        collectionId: validatedData.collectionId,
      },
    });

    // Create a transaction record
    await prisma.transaction.create({
      data: {
        type: 'MINT',
        fromId: session.user.id,
        toId: session.user.id,
        nftId: newNFT.id,
        amount: 1,
        currency: 'NFT',
        status: 'COMPLETED',
        txHash: signature,
      },
    });

    return NextResponse.json(newNFT, { status: 201 });
  } catch (error) {
    console.error('Error minting NFT:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}