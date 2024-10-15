
import Cookies from "js-cookie";
import useSWR, { mutate } from "swr";

// Define your API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Fetcher function for pet posts by user ID
const fetchPetPostsByUser = async (url: string) => {
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
    throw new Error(errorData.message || "Failed to fetch pet posts");
  }

  return response.json(); // Return the pet posts
};

// Hook to fetch pet posts by user ID
export function useGetMyPost() {
  const { data, error } = useSWR(
    `${API_URL}/pet/posts/MyContents`, // Ensure this endpoint is correct
    fetchPetPostsByUser
  );
 mutate(`${API_URL}/pet/posts/MyContents`); 
  return {
    posts: data,
    isLoading: !error && !data, // Loading if there is no data and no error
    isError: error, // Error if there is an error
  };
}
