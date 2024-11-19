// src/app/api/test/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Try to count users as a simple database test
    const count = await prisma.user.count();
    return NextResponse.json({ status: 'Database connected', userCount: count });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { status: 'Database error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}