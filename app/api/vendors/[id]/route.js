import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

/**
 * PUT /api/vendors/[id]
 */
export async function PUT(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { id } = params;
    const { name, default_price } = await req.json();

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Vendor name cannot be empty' },
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.findFirst({
      where: { id, user_id: user.id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found or access denied' },
        { status: 404 }
      );
    }

    const dataToUpdate = { name: name.trim() };
    if (default_price !== undefined) {
      dataToUpdate.default_price = parseFloat(default_price) || 1.50;
    }

    const updatedVendor = await prisma.vendor.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({
      vendor: updatedVendor,
      message: 'Vendor updated successfully',
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    return NextResponse.json(
      { error: 'Failed to update vendor' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/vendors/[id]
 */
export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { id } = params;

    const vendor = await prisma.vendor.findFirst({
      where: { id, user_id: user.id },
    });

    if (!vendor) {
      return NextResponse.json(
        { error: 'Vendor not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.vendor.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Vendor and associated deliveries deleted' });
  } catch (error) {
    console.error('Delete vendor error:', error);
    return NextResponse.json(
      { error: 'Failed to delete vendor' },
      { status: 500 }
    );
  }
}
