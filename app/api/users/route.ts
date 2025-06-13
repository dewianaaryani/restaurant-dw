// app/api/users/route.ts
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

enum Role {
  admin = "admin",
  cashier = "cashier",
  kitchen = "kitchen",
  customer = "customer",
}

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (role && role !== "all" && Object.values(Role).includes(role as Role)) {
      where.role = role;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get users with pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true,
          updated_at: true,
          // Don't include password or other sensitive fields
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, password } = body;

    // Validate required fields
    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: "Name, email, role, and password are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (!Object.values(Role).includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password (you should use bcrypt in production)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role,
        password, // In production, use hashedPassword
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

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
