// app/api/users/[id]/role/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

enum Role {
  admin = "admin",
  cashier = "cashier",
  kitchen = "kitchen",
  customer = "customer",
}

// PATCH /api/users/[id]/role - Update user role
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await request.json();
    const { role } = body;

    console.log("Received role update request:", { userId, role, body });

    // Validate role
    if (!role || !Object.values(Role).includes(role as Role)) {
      console.log("Invalid role:", role, "Valid roles:", Object.values(Role));
      return NextResponse.json(
        {
          error: `Valid role is required. Valid roles: ${Object.values(
            Role
          ).join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Updating user role from", existingUser.role, "to", role);

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role as Role,
        updated_at: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    console.log("Successfully updated user:", updatedUser);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user role:", error);

    // Return more detailed error information
    return NextResponse.json(
      {
        error: "Failed to update user role",
        details: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : ""
            : undefined,
      },
      { status: 500 }
    );
  }
}

// GET /api/users/[id]/role - Get user role (optional)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: user.role, user });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json(
      { error: "Failed to fetch user role" },
      { status: 500 }
    );
  }
}
