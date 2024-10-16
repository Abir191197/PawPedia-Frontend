"use client";
import Cookies from "js-cookie";
import { mutate } from "swr";

// Define your API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Hook for upvoting a post
export function useUpvotePost() {
  const upvotePost = async (postId: string) => {
    const token = Cookies.get("accessToken");

    // Check if the token exists
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const response = await fetch(`${API_URL}/api/pet/posts/upvote/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content-type to JSON
        Authorization: `Bearer ${token}`, // Authorization header
      },
    });

    // Check for a successful response
    if (!response.ok) {
      const errorData = await response.json(); // Capture error details
      throw new Error(errorData.message || "Failed to upvote the post");
    }

    const data = await response.json();
    mutate(`${API_URL}/api/pet/posts`); // Return updated post data
    return data;
  };

  return upvotePost;
}
