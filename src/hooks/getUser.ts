"use client";
import Cookies from "js-cookie";
import useSWR from "swr";

// Define your API URL
const API_URL = "http://localhost:5000/api";

// Fetcher function for user data (with token)
const fetchUser = async (url: string) => {
  const token = Cookies.get("accessToken");

  // Check if the token exists
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json", // Set content-type to JSON
      Authorization: `Bearer ${token}`, // Authorization header
    },
  });

  // Check for a successful response
  if (!response.ok) {
    const errorData = await response.json(); // Capture error details
    throw new Error(errorData.message || "Failed to fetch user data");
  }

  return response.json(); // Return the user data
};

// Hook to fetch user info
export function useFetchUser() {
  const { data, error, isLoading } = useSWR(`${API_URL}/users/me`, fetchUser);

  return {
    user: data,
    isLoading,
    isError: error,
  };
}
