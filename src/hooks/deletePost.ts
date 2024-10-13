import Cookies from "js-cookie";
import { mutate } from "swr";

// Define your API URL
const API_URL = "http://localhost:5000/api";

// Fetcher function for deleting a pet post
const deletePetPost = async (postId: string) => {
  const token = Cookies.get("accessToken");

  // Check if the token exists
  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const response = await fetch(`${API_URL}/pet/posts/${postId}`, {
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
export function useDeletePost() {
  const deletePost = async (postId: string) => {
    try {
      // Call the delete function
      await deletePetPost(postId);

      // Optimistically mutate the SWR cache to update the UI
      mutate(`${API_URL}/pet/posts/MyContents`); // Adjust this to your specific data key if necessary

      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete the post:", error);
    }
  };

  return deletePost;
}
