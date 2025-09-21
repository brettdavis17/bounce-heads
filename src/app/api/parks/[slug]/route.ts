import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const park = await prisma.trampolinePark.findUnique({
      where: { slug }
    });

    if (!park) {
      return NextResponse.json(
        { error: 'Park not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(park);
  } catch (error) {
    console.error('Error fetching park:', error);
    return NextResponse.json(
      { error: 'Failed to fetch park' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}