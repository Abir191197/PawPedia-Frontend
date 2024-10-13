"use server";
export const getRecentPosts = async () => {
  try {
    const res = await fetch(
      "https://paw-pedia-backend.vercel.app/api/pet/posts",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json();

    // Log the full response to confirm
    console.log("Fetched data: ", data);

    return data;
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return { success: false, message: "Error fetching posts" };
  }
};
