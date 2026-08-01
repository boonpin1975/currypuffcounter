import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

/**
 * DELETE /api/deliveries/[id]
 * Remove delivery entry
 */
export async function DELETE(req, { params }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const delivery = await prisma.delivery.findFirst({
      where: { id, user_id: user.id },
    });

    if (!delivery) {
      return NextResponse.json(
        { error: 'Delivery record not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.delivery.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Delivery record deleted successfully' });
  } catch (error) {
    console.error('Delete delivery error:', error);
    return NextResponse.json(
      { error: 'Failed to delete delivery entry' },
      { status: 500 }
    );
  }
}
