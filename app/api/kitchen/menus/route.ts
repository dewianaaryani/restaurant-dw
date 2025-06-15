import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      include: {
        category: true,
      },
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error("Fetch menus error:", error);
    return NextResponse.json(
      { message: "Failed to load menus" },
      { status: 500 }
    );
  }
}
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { menu_id } = body;
    if (!menu_id) {
      return NextResponse.json(
        { error: "Menu ID is required" },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.findUnique({
      where: { id: menu_id },
      select: {
        id: true,
        is_available: true,
      },
    });

    const newAvailability = !menu?.is_available;

    const updatedMenu = await prisma.menu.update({
      where: { id: menu_id },
      data: {
        is_available: newAvailability,
        updated_at: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Menu item ${
        newAvailability ? "activated" : "deactivated"
      } successfully`,
      menu: updatedMenu,
      previousAvailability: !newAvailability,
    });
  } catch (error) {
    console.error("Error toggling menu availability:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
