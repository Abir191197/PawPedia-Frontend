"use client";
import Cookies from "js-cookie";
import { mutate } from "swr";

// Define your API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Hook for creating a new comment
export function useCreateComment() {
  const createComment = async (commentData: any) => {
    const token = Cookies.get("accessToken");

    const response = await fetch(`${API_URL}/api/pet/posts/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content-type to JSON
        Authorization: `Bearer ${token}`, // Authorization header
      },
      body: JSON.stringify({ commentData }), // Send the comment text
    });

    // Check for a successful response
    if (!response.ok) {
      const errorData = await response.json(); // Capture error details
      throw new Error(errorData.message || "Failed to create comment");
    }

    const data = await response.json();
    mutate(`${API_URL}/api/pet/posts`); // Return created comment data
    return data;
  };

  return createComment;
}
