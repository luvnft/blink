import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { processPayment } from '@/lib/solana/commerce';

const prisma = new PrismaClient();

const createProductSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
});

const createOrderSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export async function GET(request: NextRequest) {
  try {
    const { success } = await rateLimit(request.ip ?? 'anonymous');
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const offset = parseInt(searchParams.get('offset') ?? '0', 10);

    const products = await prisma.product.findMany({
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
    });

    const totalCount = await prisma.product.count();

    const responseData = {
      products,
      pagination: {
        total: totalCount,
        limit,
        offset,
      },
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { success } = await rateLimit(request.ip ?? 'anonymous');
    if (!success) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'create_product') {
      const validationResult = createProductSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json({ error: 'Invalid input', details: validationResult.error.errors }, { status: 400 });
      }

      const { name, description, price, imageUrl } = validationResult.data;

      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price,
          imageUrl,
          sellerId: session.user.id,
        },
      });

      return NextResponse.json(newProduct, { status: 201 });
    } else if (action === 'create_order') {
      const validationResult = createOrderSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json({ error: 'Invalid input', details: validationResult.error.errors }, { status: 400 });
      }

      const { productId, quantity } = validationResult.data;

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const totalAmount = product.price * quantity;

      const paymentResult = await processPayment(session.user.id, product.sellerId, totalAmount);

      const newOrder = await prisma.order.create({
        data: {
          buyerId: session.user.id,
          sellerId: product.sellerId,
          productId,
          quantity,
          totalAmount,
          status: 'COMPLETED',
          transactionSignature: paymentResult.signature,
        },
      });

      return NextResponse.json(newOrder, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in commerce operation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export const config = {
  runtime: 'edge',
};