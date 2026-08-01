import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

/**
 * GET /api/vendors
 */
export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const vendors = await prisma.vendor.findMany({
      where: { user_id: user.id },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { deliveries: true },
        },
      },
    });

    return NextResponse.json({ vendors });
  } catch (error) {
    console.error('Fetch vendors error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve vendors' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/vendors
 */
export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { name, default_price } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Vendor name is required' },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(default_price) || 1.50;

    // Check for duplicate vendor name for this user
    const existing = await prisma.vendor.findFirst({
      where: {
        user_id: user.id,
        name: { equals: name.trim() },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'A vendor with this name already exists' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        name: name.trim(),
        default_price: parsedPrice,
        user_id: user.id,
      },
    });

    return NextResponse.json({ vendor, message: 'Vendor created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Create vendor error:', error);
    return NextResponse.json(
      { error: 'Failed to create vendor' },
      { status: 500 }
    );
  }
}
