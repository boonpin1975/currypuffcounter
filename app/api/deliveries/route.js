import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

/**
 * GET /api/deliveries
 */
export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get('vendorId');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')) : 50;

    const where = { user_id: user.id };
    if (vendorId) {
      where.vendor_id = vendorId;
    }

    const deliveries = await prisma.delivery.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit,
      include: {
        vendor: {
          select: { id: true, name: true, default_price: true }
        }
      }
    });

    return NextResponse.json({ deliveries });
  } catch (error) {
    console.error('Fetch deliveries error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve delivery logs' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/deliveries
 */
export async function POST(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { vendor_id, quantity, unit_price, date } = await req.json();

    if (!vendor_id) {
      return NextResponse.json({ error: 'Please select a vendor' }, { status: 400 });
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      return NextResponse.json({ error: 'Quantity must be a positive number' }, { status: 400 });
    }

    // Verify vendor belongs to user
    const vendor = await prisma.vendor.findFirst({
      where: { id: vendor_id, user_id: user.id }
    });

    if (!vendor) {
      return NextResponse.json({ error: 'Selected vendor not found' }, { status: 404 });
    }

    const priceInRM = unit_price !== undefined && !isNaN(parseFloat(unit_price)) 
      ? parseFloat(unit_price) 
      : (vendor.default_price || 1.50);

    let deliveryDate = new Date();
    if (date) {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        deliveryDate = parsedDate;
      }
    }

    const delivery = await prisma.delivery.create({
      data: {
        user_id: user.id,
        vendor_id,
        quantity: parsedQuantity,
        unit_price: priceInRM,
        date: deliveryDate,
      },
      include: {
        vendor: {
          select: { id: true, name: true, default_price: true }
        }
      }
    });

    const totalRM = (parsedQuantity * priceInRM).toFixed(2);

    return NextResponse.json({
      delivery,
      message: `Logged ${parsedQuantity} curry puffs delivered to ${vendor.name} @ RM ${priceInRM.toFixed(2)} each (Total: RM ${totalRM})!`
    }, { status: 201 });
  } catch (error) {
    console.error('Log delivery error:', error);
    return NextResponse.json(
      { error: 'Failed to record delivery' },
      { status: 500 }
    );
  }
}
