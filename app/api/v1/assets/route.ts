import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { z } from 'zod';
import { uploadToS3, deleteFromS3, getSignedUrl } from '@/lib/s3';
import { v4 as uuidv4 } from 'uuid';

const uploadAssetSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().positive(),
});

const deleteAssetSchema = z.object({
  assetId: z.string().uuid(),
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
    const assetId = searchParams.get('assetId');

    if (assetId) {
      const asset = await prisma.asset.findUnique({
        where: { id: assetId },
      });

      if (!asset) {
        return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
      }

      if (asset.userId !== session.user.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }

      const signedUrl = await getSignedUrl(asset.key);

      return NextResponse.json({ ...asset, signedUrl });
    } else {
      const assets = await prisma.asset.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ assets });
    }
  } catch (error) {
    console.error('Error fetching asset(s):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
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
    const validationResult = uploadAssetSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: validationResult.error.errors }, { status: 400 });
    }

    const { fileName, fileType, fileSize } = validationResult.data;

    const key = `${session.user.id}/${uuidv4()}-${fileName}`;
    const { uploadUrl, publicUrl } = await uploadToS3(key, fileType);

    const newAsset = await prisma.asset.create({
      data: {
        key,
        fileName,
        fileType,
        fileSize,
        url: publicUrl,
        user: { connect: { id: session.user.id } },
      },
    });

    return NextResponse.json({ asset: newAsset, uploadUrl }, { status: 201 });
  } catch (error) {
    console.error('Error creating asset upload URL:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
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
    const validationResult = deleteAssetSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid input', details: validationResult.error.errors }, { status: 400 });
    }

    const { assetId } = validationResult.data;

    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    });

    if (!asset) {
      return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
    }

    if (asset.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await deleteFromS3(asset.key);

    await prisma.asset.delete({
      where: { id: assetId },
    });

    return NextResponse.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  runtime: 'edge',
};