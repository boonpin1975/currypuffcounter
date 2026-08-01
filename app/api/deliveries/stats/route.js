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

    const { searchParams } = new URL(req.url);
    const clientToday = searchParams.get('today');

    const toLocalDateKey = (d) => {
      const date = new Date(d);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const serverNow = new Date();
    const todayKey = (clientToday && /^\d{4}-\d{2}-\d{2}$/.test(clientToday))
      ? clientToday
      : toLocalDateKey(serverNow);

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

    let latestDeliveryKey = todayKey;

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

      if (dKey > latestDeliveryKey) {
        latestDeliveryKey = dKey;
      }
    });

    // Chart bounds: endDate is max of todayKey and latest delivery key
    const endDateKey = latestDeliveryKey;

    const parseDateKey = (keyStr) => {
      const [y, m, d] = keyStr.split('-').map(Number);
      return new Date(y, m - 1, d);
    };

    const endObj = parseDateKey(endDateKey);

    // Default start date is at least 13 days before endDate
    let startObj = new Date(endObj.getFullYear(), endObj.getMonth(), endObj.getDate() - 13);
    if (allDeliveries.length > 0) {
      const earliestKey = toLocalDateKey(allDeliveries[0].date);
      const earliestObj = parseDateKey(earliestKey);
      if (earliestObj < startObj) {
        startObj = earliestObj;
      }
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = [];

    for (let curr = new Date(startObj); curr <= endObj; curr.setDate(curr.getDate() + 1)) {
      const dateKey = toLocalDateKey(curr);
      const dayLabel = `${dayNames[curr.getDay()]} ${curr.getDate()}`;

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


