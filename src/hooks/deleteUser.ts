"use client";
import Cookies from "js-cookie";
import { mutate } from "swr";

// Define your API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetcher function for deleting a pet post
const deleteUserById = async (userId: string) => {
  const token = Cookies.get("accessToken");

  // Check if the token exists
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const response = await fetch(`${API_URL}/api/users/allUsers/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete post");
  }

  return response.json(); // Return any relevant data if needed
};

// Hook to delete a post
export function useDeleteUser() {
  const deleteUser = async (userId: string) => {
    try {
      // Call the delete function
      await deleteUserById(userId);

      // Optimistically mutate the SWR cache to update the UI
      mutate(`${API_URL}/api/users/allUsers`);

      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete the post:", error);
    }
  };

  return deleteUser;
}
