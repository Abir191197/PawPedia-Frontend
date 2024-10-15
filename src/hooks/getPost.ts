"use client";
import useSWR from "swr";

// Define your API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      return res.json().then((errorData) => {
        throw new Error(errorData.message || "Failed to fetch posts");
      });
    }
    return res.json();
  });

// Hook to fetch posts
export function useFetchPosts() {
  const { data, error, isLoading } = useSWR(`${API_URL}/pet/posts`, fetcher);

  return {
    posts: data,
    isLoading,
    isError: error,
  };
}
