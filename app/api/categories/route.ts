// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";
import { categorySchema } from "@/lib/schemas/category";

// GET - Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { menus: true }, // Count related menu items
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Transform the data to match your component interface
    const transformedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      desc: category.desc,
      menuCount: category._count.menus,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Check if category name already exists using findFirst
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: validatedData.name,
          mode: "insensitive", // Case-insensitive check
        },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        desc: validatedData.desc || null,
      },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });

    const transformedCategory = {
      id: category.id,
      name: category.name,
      desc: category.desc,
      menuCount: category._count.menus,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    };

    return NextResponse.json(transformedCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);

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
