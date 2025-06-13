// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the token using getToken instead of auth()
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log(`User ${token?.email || "anonymous"} accessing ${pathname}`);

  // Define route categories
  const publicRoutes = ["/", "/about", "/contact"];
  const authRoutes = ["/login", "/register"];
  const protectedRoutes = ["/dashboard", "/profile"];
  const adminRoutes = ["/admin"];
  const customerRoutes = ["/orders", "/menu"];

  // Helper functions
  const isPublicRoute =
    publicRoutes.includes(pathname) || pathname.startsWith("/api/auth");
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isCustomerRoute = customerRoutes.some((route) =>
    pathname.startsWith(route)
  );
  // Allow public routes and API auth routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to login
  if (!token && (isProtectedRoute || isAdminRoute)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  if (isAdminRoute && token) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }
  if (isCustomerRoute && token) {
    if (token.role !== "customer") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)",
  ],
};
