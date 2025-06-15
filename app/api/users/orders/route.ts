// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        customer_id: session.user.id, // or `email: session.user.email` if you're using email
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        order_items: {
          include: {
            menu: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    return NextResponse.json(
      { message: "Failed to load orders" },
      { status: 500 }
    );
  }
}

// POST endpoint to create new orders (if needed for direct API usage)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // This could redirect to the checkout endpoint or handle simple order creation
    return NextResponse.json(
      {
        message: "Use /api/checkout endpoint for creating orders",
        checkout_url: "/api/checkout",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
