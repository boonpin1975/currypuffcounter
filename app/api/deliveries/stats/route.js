import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

/**
 * GET /api/deliveries/stats
 */
export async function GET(req) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);

    const totalVendorsActive = await prisma.vendor.count({
      where: { user_id: user.id }
    });

    const recentDeliveries = await prisma.delivery.findMany({
      where: {
        user_id: user.id,
        date: {
          gte: sevenDaysAgo
        }
      },
      select: {
        quantity: true,
        unit_price: true,
        date: true
      }
    });

    let totalDeliveredToday = 0;
    let totalDeliveredThisWeek = 0;
    let totalRevenueTodayRM = 0;
    let totalRevenueThisWeekRM = 0;

    recentDeliveries.forEach(d => {
      const dDate = new Date(d.date);
      const price = d.unit_price || 1.50;
      const revenue = d.quantity * price;

      totalDeliveredThisWeek += d.quantity;
      totalRevenueThisWeekRM += revenue;

      if (dDate >= todayStart) {
        totalDeliveredToday += d.quantity;
        totalRevenueTodayRM += revenue;
      }
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const dateKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`;
      const dayLabel = `${dayNames[dayDate.getDay()]} ${dayDate.getDate()}`;

      let dayTotalCount = 0;
      let dayTotalRevenue = 0;

      recentDeliveries.forEach(item => {
        const itemDate = new Date(item.date);
        const itemDateKey = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}-${String(itemDate.getDate()).padStart(2, '0')}`;
        if (itemDateKey === dateKey) {
          dayTotalCount += item.quantity;
          dayTotalRevenue += item.quantity * (item.unit_price || 1.50);
        }
      });

      chartData.push({
        dateKey,
        day: dayLabel,
        total: dayTotalCount,
        revenueRM: parseFloat(dayTotalRevenue.toFixed(2)),
      });
    }

    return NextResponse.json({
      stats: {
        totalDeliveredToday,
        totalVendorsActive,
        totalDeliveredThisWeek,
        totalRevenueTodayRM: parseFloat(totalRevenueTodayRM.toFixed(2)),
        totalRevenueThisWeekRM: parseFloat(totalRevenueThisWeekRM.toFixed(2)),
        chartData
      }
    });

  } catch (error) {
    console.error('Stats endpoint error:', error);
    return NextResponse.json(
      { error: 'Failed to aggregate statistics' },
      { status: 500 }
    );
  }
}
