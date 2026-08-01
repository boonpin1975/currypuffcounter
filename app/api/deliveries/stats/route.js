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

    const toLocalDateKey = (d) => {
      const date = new Date(d);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const todayKey = toLocalDateKey(now);

    const totalVendorsActive = await prisma.vendor.count({
      where: { user_id: user.id }
    });

    const allDeliveries = await prisma.delivery.findMany({
      where: {
        user_id: user.id,
      },
      select: {
        quantity: true,
        unit_price: true,
        date: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    let totalDeliveredToday = 0;
    let totalDeliveredActive = 0;
    let totalRevenueTodayRM = 0;
    let totalRevenueActiveRM = 0;

    allDeliveries.forEach(d => {
      const price = d.unit_price || 1.50;
      const revenue = d.quantity * price;
      const dKey = toLocalDateKey(d.date);

      totalDeliveredActive += d.quantity;
      totalRevenueActiveRM += revenue;

      if (dKey === todayKey) {
        totalDeliveredToday += d.quantity;
        totalRevenueTodayRM += revenue;
      }
    });

    // Determine active date range for the chart (default at least past 14 days up to today)
    let startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13);
    if (allDeliveries.length > 0) {
      const earliestDate = new Date(allDeliveries[0].date);
      const earliestStart = new Date(earliestDate.getFullYear(), earliestDate.getMonth(), earliestDate.getDate());
      if (earliestStart < startDate) {
        startDate = earliestStart;
      }
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = [];

    for (let d = new Date(startDate); d <= todayStart; d.setDate(d.getDate() + 1)) {
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLabel = `${dayNames[d.getDay()]} ${d.getDate()}`;

      let dayTotalCount = 0;
      let dayTotalRevenue = 0;

      allDeliveries.forEach(item => {
        if (toLocalDateKey(item.date) === dateKey) {
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
        totalDeliveredThisWeek: totalDeliveredActive,
        totalDeliveredActive,
        totalRevenueTodayRM: parseFloat(totalRevenueTodayRM.toFixed(2)),
        totalRevenueThisWeekRM: parseFloat(totalRevenueActiveRM.toFixed(2)),
        totalRevenueActiveRM: parseFloat(totalRevenueActiveRM.toFixed(2)),
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

