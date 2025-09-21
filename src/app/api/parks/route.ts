import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const search = searchParams.get('search');

    let whereClause: any = {};

    if (state) {
      whereClause.state = state;
    }

    if (city) {
      whereClause.city = city;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const parks = await prisma.trampolinePark.findMany({
      where: whereClause,
      orderBy: [
        { rating: 'desc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(parks);
  } catch (error) {
    console.error('Error fetching parks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch parks' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}