import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // pastikan ini mengembalikan user session
import prisma from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || session.user.role !== "cashier") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
  }

  const orderId = params.id;

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        payment_status: "paid",
        order_status: "completed",
        completed_time: new Date(),
        kasir_id: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Payment processed",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { message: "Failed to process payment" },
      { status: 500 }
    );
  }
}
