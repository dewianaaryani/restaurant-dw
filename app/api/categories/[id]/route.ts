// app/api/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";
import { categorySchema } from "@/lib/schemas/category";

// GET - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;
    const categoryId = id;

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const transformedCategory = {
      id: category.id,
      name: category.name,
      desc: category.desc,
      menuCount: category._count.menus,
      created_at: category.created_at.toISOString(),
      updated_at: category.updated_at.toISOString(),
    };

    return NextResponse.json(transformedCategory);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;
    const categoryId = id;

    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if name is being changed and if new name already exists
    if (validatedData.name !== existingCategory.name) {
      const categoryWithSameName = await prisma.category.findFirst({
        where: {
          name: {
            equals: validatedData.name,
            mode: "insensitive",
          },
        },
      });

      if (categoryWithSameName) {
        return NextResponse.json(
          { error: "Category with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
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
      id: updatedCategory.id,
      name: updatedCategory.name,
      desc: updatedCategory.desc,
      menuCount: updatedCategory._count.menus,
      created_at: updatedCategory.created_at.toISOString(),
      updated_at: updatedCategory.updated_at.toISOString(),
    };

    return NextResponse.json(transformedCategory);
  } catch (error) {
    console.error("Error updating category:", error);

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

// DELETE - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;
    const categoryId = id;

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        _count: {
          select: { menus: true },
        },
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if category has associated menu items
    if (existingCategory._count.menus > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete category with associated menu items",
          details: `This category has ${existingCategory._count.menus} menu items. Please remove them first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
