// app/api/ratings/route.ts
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.user.id;
    const body = await request.json();
    const { menu_id, rating } = body;

    // Validate input
    if (!menu_id || !rating) {
      return NextResponse.json(
        { error: "Menu ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if user has already rated this menu item
    const existingRating = await prisma.rating.findFirst({
      where: {
        menu_id: menu_id,
        customer_id: customerId,
      },
    });

    if (existingRating) {
      return NextResponse.json(
        { error: "You have already rated this item" },
        { status: 409 }
      );
    }

    // Verify menu item exists
    const menuItem = await prisma.menu.findUnique({
      where: { id: menu_id },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    // Create new rating
    const newRating = await prisma.rating.create({
      data: {
        menu_id,
        customer_id: customerId,
        rating,
      },
    });

    // Calculate average rating for the menu item
    const avgRating = await prisma.rating.aggregate({
      where: { menu_id },
      _avg: { rating: true },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      rating: newRating,
      averageRating: Number(avgRating._avg.rating?.toFixed(1)) || 0,
      totalRatings: avgRating._count,
    });
  } catch (error) {
    console.error("Error creating rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get("menu_id");
    const customerId = searchParams.get("customer_id");

    if (!menuId) {
      return NextResponse.json(
        { error: "Menu ID is required" },
        { status: 400 }
      );
    }

    // Get all ratings for the menu item
    const ratings = await prisma.rating.findMany({
      where: { menu_id: menuId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    // Calculate average rating
    const avgRating = await prisma.rating.aggregate({
      where: { menu_id: menuId },
      _avg: { rating: true },
      _count: true,
    });

    // Get user's specific rating if customer_id is provided
    let userRating = null;
    if (customerId) {
      userRating = await prisma.rating.findFirst({
        where: {
          menu_id: menuId,
          customer_id: customerId,
        },
      });
    }

    return NextResponse.json({
      ratings,
      averageRating: Number(avgRating._avg.rating?.toFixed(1)) || 0,
      totalRatings: avgRating._count,
      userRating,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT endpoint for updating existing ratings
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.user.id;
    const body = await request.json();
    const { menu_id, rating } = body;

    if (!menu_id || !rating) {
      return NextResponse.json(
        { error: "Menu ID and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Check if rating exists
    const existingRating = await prisma.rating.findFirst({
      where: {
        menu_id,
        customer_id: customerId,
      },
    });

    if (!existingRating) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }

    // Update existing rating
    const updatedRating = await prisma.rating.update({
      where: {
        id: existingRating.id,
      },
      data: {
        rating,
        updated_at: new Date(),
      },
    });

    // Calculate new average rating
    const avgRating = await prisma.rating.aggregate({
      where: { menu_id },
      _avg: { rating: true },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      rating: updatedRating,
      averageRating: Number(avgRating._avg.rating?.toFixed(1)) || 0,
      totalRatings: avgRating._count,
    });
  } catch (error) {
    console.error("Error updating rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint for removing ratings
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customerId = session.user.id;
    const { searchParams } = new URL(request.url);
    const menuId = searchParams.get("menu_id");

    if (!menuId) {
      return NextResponse.json(
        { error: "Menu ID is required" },
        { status: 400 }
      );
    }

    // Delete the rating
    const deletedRating = await prisma.rating.deleteMany({
      where: {
        menu_id: menuId,
        customer_id: customerId,
      },
    });

    if (deletedRating.count === 0) {
      return NextResponse.json({ error: "Rating not found" }, { status: 404 });
    }

    // Calculate new average rating
    const avgRating = await prisma.rating.aggregate({
      where: { menu_id: menuId },
      _avg: { rating: true },
      _count: true,
    });

    return NextResponse.json({
      success: true,
      averageRating: Number(avgRating._avg.rating?.toFixed(1)) || 0,
      totalRatings: avgRating._count,
    });
  } catch (error) {
    console.error("Error deleting rating:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
