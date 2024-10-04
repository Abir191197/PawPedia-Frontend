import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import getUserFromCookies from "./services/authService/tokenVerify"; // Adjust the path if necessary

// Define the routes that don't require authentication
const AuthRoutes = ["/login", "/register"];

// Define role-based access control
const roleBasedRoutes = {
  user: [/^\/user/],
  admin: [/^\/admin/],
};

// Middleware function
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user authentication data asynchronously
  const user = await getUserFromCookies(request); // Ensure this function returns a promise

  // If the user is not logged in
  if (!user) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next(); // Allow access to auth routes
    } else {
      return NextResponse.redirect(new URL("/login", request.url)); // Redirect to login
    }
  }

  // If user is authenticated, check their role
  if (user.role && roleBasedRoutes[user.role as keyof typeof roleBasedRoutes]) {
    const routes = roleBasedRoutes[user.role as keyof typeof roleBasedRoutes];

    // Check if the user's role has access to the requested route
    if (routes.some((route) => pathname.match(route))) {
      return NextResponse.next(); // Allow access
    }
  }

  // Redirect if user does not have access
  return NextResponse.redirect(new URL("/", request.url));
}

// Configuration to match specific routes for the middleware
export const config = {
  matcher: ["/user/:path*", "/admin/:path*", "/login", "/register"],
 
};
