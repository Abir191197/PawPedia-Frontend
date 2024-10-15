"use client";
import Cookies from "js-cookie";
import { mutate } from "swr";
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export function useUpdateUser() {
  const updateUser = async (userData: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("User is not authenticated");
    }

    try {
      const response = await fetch(`${API_URL}/users/me/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userdata: userData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const data = await response.json();
      mutate(`${API_URL}/users/me`);
      return data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  return updateUser;
}
