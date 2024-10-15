"use client";
import Cookies from "js-cookie";
import { mutate } from "swr";

// Define your API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Hook for creating a new post
export function useCreatePost() {
  const createPost = async (formData: FormData) => {
    const token = Cookies.get("accessToken");

    const response = await fetch(`${API_URL}/pet/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Do NOT set 'Content-Type' when sending FormData
      },
      body: formData, // Send FormData directly
    });

    // Check for successful creation response
    if (!response.ok) {
      const errorData = await response.json(); // Capture error details
      throw new Error(errorData.message || "Failed to create post");
    }

    const data = await response.json(); // Return created post data

    // Trigger a re-fetch of the posts
    mutate(`${API_URL}/pet/posts`); // This will refresh the posts data

    return data;
  };

  return createPost;
}
