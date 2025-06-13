// app/api/menu/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";

const menuItemSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  desc: z.string().optional(),
  price: z.number().int().positive("Price must be a positive integer in IDR"),
  image: z.string().max(255).optional(),
  category_id: z.string().min(1, "Category is required"),
  is_available: z.boolean().default(true),
});

// GET - Fetch single menu item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const menuItem = await prisma.menu.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            desc: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    if (!menuItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating =
      menuItem.ratings.length > 0
        ? menuItem.ratings.reduce((sum, r) => sum + r.rating, 0) /
          menuItem.ratings.length
        : 4.5;

    const transformedItem = {
      id: menuItem.id,
      category_id: menuItem.category_id,
      categoryName: menuItem.category.name,
      name: menuItem.name,
      desc: menuItem.desc,
      price: menuItem.price, // Return as IDR integer
      image: menuItem.image,
      is_available: menuItem.is_available,
      rating: Math.round(avgRating * 10) / 10,
      created_at: menuItem.created_at.toISOString(),
      updated_at: menuItem.updated_at.toISOString(),
    };

    return NextResponse.json(transformedItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update menu item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = menuItemSchema.parse(body);

    const existingItem = await prisma.menu.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: validatedData.category_id },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    if (
      validatedData.name !== existingItem.name ||
      validatedData.category_id !== existingItem.category_id
    ) {
      const duplicateItem = await prisma.menu.findFirst({
        where: {
          name: {
            equals: validatedData.name,
            mode: "insensitive",
          },
          category_id: validatedData.category_id,
          id: { not: id },
        },
      });

      if (duplicateItem) {
        return NextResponse.json(
          { error: "Menu item with this name already exists in this category" },
          { status: 400 }
        );
      }
    }

    const updatedItem = await prisma.menu.update({
      where: { id },
      data: {
        name: validatedData.name,
        desc: validatedData.desc || null,
        price: validatedData.price, // Store as IDR integer
        image: validatedData.image || null,
        category_id: validatedData.category_id,
        is_available: validatedData.is_available,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            desc: true,
          },
        },
        ratings: {
          select: {
            rating: true,
          },
        },
      },
    });

    const avgRating =
      updatedItem.ratings.length > 0
        ? updatedItem.ratings.reduce((sum, r) => sum + r.rating, 0) /
          updatedItem.ratings.length
        : 4.5;

    const transformedItem = {
      id: updatedItem.id,
      category_id: updatedItem.category_id,
      categoryName: updatedItem.category.name,
      name: updatedItem.name,
      desc: updatedItem.desc,
      price: updatedItem.price, // Return as IDR integer
      image: updatedItem.image,
      is_available: updatedItem.is_available,
      rating: Math.round(avgRating * 10) / 10,
      created_at: updatedItem.created_at.toISOString(),
      updated_at: updatedItem.updated_at.toISOString(),
    };

    return NextResponse.json(transformedItem);
  } catch (error) {
    console.error("Error updating menu item:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete menu item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingItem = await prisma.menu.findUnique({
      where: { id },
      include: {
        order_items: true,
      },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    if (existingItem.order_items.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete menu item with associated orders",
          details: `This menu item has ${existingItem.order_items.length} associated orders.`,
        },
        { status: 400 }
      );
    }

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Menu item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
