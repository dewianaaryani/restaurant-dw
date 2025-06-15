// app/api/admin/sales/summary/route.ts
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    // Current period data
    const currentOrders = await prisma.order.findMany({
      where: {
        payment_status: "paid",
        order_status: "completed",
        completed_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        total_amount: true,
        customer_id: true,
        completed_time: true,
      },
    });

    // Previous period data for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(startDate.getDate() - parseInt(period));

    const previousOrders = await prisma.order.findMany({
      where: {
        payment_status: "paid",
        order_status: "completed",
        completed_time: {
          gte: prevStartDate,
          lte: startDate,
        },
      },
      select: {
        total_amount: true,
        customer_id: true,
      },
    });

    // Calculate current period metrics
    const currentRevenue = currentOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const currentOrderCount = currentOrders.length;
    const currentCustomers = new Set(
      currentOrders.map((order) => order.customer_id)
    ).size;
    const currentAvgOrder =
      currentOrderCount > 0 ? currentRevenue / currentOrderCount : 0;

    // Calculate previous period metrics
    const prevRevenue = previousOrders.reduce(
      (sum, order) => sum + order.total_amount,
      0
    );
    const prevOrderCount = previousOrders.length;
    const prevCustomers = new Set(
      previousOrders.map((order) => order.customer_id)
    ).size;
    const prevAvgOrder = prevOrderCount > 0 ? prevRevenue / prevOrderCount : 0;

    // Calculate growth percentages
    const revenueGrowth =
      prevRevenue > 0
        ? ((currentRevenue - prevRevenue) / prevRevenue) * 100
        : 0;
    const orderGrowth =
      prevOrderCount > 0
        ? ((currentOrderCount - prevOrderCount) / prevOrderCount) * 100
        : 0;
    const customerGrowth =
      prevCustomers > 0
        ? ((currentCustomers - prevCustomers) / prevCustomers) * 100
        : 0;
    const avgOrderGrowth =
      prevAvgOrder > 0
        ? ((currentAvgOrder - prevAvgOrder) / prevAvgOrder) * 100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: currentRevenue,
        totalOrders: currentOrderCount,
        uniqueCustomers: currentCustomers,
        avgOrderValue: currentAvgOrder,
        growth: {
          revenue: revenueGrowth,
          orders: orderGrowth,
          customers: customerGrowth,
          avgOrder: avgOrderGrowth,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching sales summary:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch sales summary",
      },
      { status: 500 }
    );
  }
}
