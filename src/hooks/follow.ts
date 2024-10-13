"use client";
import Cookies from "js-cookie";
import { mutate } from "swr";

// Define your API URL
const API_URL = "http://localhost:5000/api";

// Hook for following a post's author
export function useFollowPost() {
  const followPost = async (postId: string) => {
    const token = Cookies.get("accessToken");

    // Check if the token exists
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const response = await fetch(`${API_URL}/pet/posts/following/${postId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content-type to JSON
        Authorization: `Bearer ${token}`, // Authorization header
      },
    });

    // Check for a successful response
    if (!response.ok) {
      const errorData = await response.json(); // Capture error details
      throw new Error(errorData.message || "Failed to follow the user");
    }

    const data = await response.json();

    // Optionally mutate the cache for posts or followers if needed
    mutate(`${API_URL}/pet/posts`); // Update posts data
    // Optionally, you might want to mutate the user's followers

    return data;
  };

  return followPost;
}
