"use server";

import { jwtVerify } from "jose"; // Import the jose jwtVerify method
import { NextRequest } from "next/server";
import envConfig from "@/envConfig"; // Adjust the path to your config file

// Helper function to get user data from cookies and verify the token
async function getUserFromCookies(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value; // Retrieve the access token from cookies

  if (token) {
    try {
      // Decode and verify the token
      const secret = new TextEncoder().encode(envConfig.jwt_access_secret); // Convert secret to Uint8Array
      const { payload } = await jwtVerify(token, secret); // Verifying JWT with secret key

      // Return the user object based on the payload
      return {
        name: payload.name as string, // Access name from the JWT payload
        role: payload.role as string,
        _id: payload._id as string,
        email: payload.email as string,
        phone: payload.phone as string,
        // Add any other fields from the decoded token that you need
      };
    } catch (error) {
      console.error("Token verification failed:", error);
      return null; // Return null if the token is invalid or expired
    }
  }

  return null; // Return null if no valid token
}

export default getUserFromCookies;
