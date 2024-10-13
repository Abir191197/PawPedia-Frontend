"use server"; // Ensure that this function runs on the server side

import axios from "axios";
import { cookies } from "next/headers"; // Next.js headers API for handling cookies

// Function to create a new post
export const CreatePost = async (formData: FormData) => {
  try {
    // Retrieve the access token from cookies (server-side)
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      throw new Error("Access token not found in cookies");
    }

    // Make the Axios request to the API
    const response = await axios.post(
      "http://localhost:5000/api/pet/posts",
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the access token
          // Note: Axios automatically sets the correct Content-Type for FormData
        },
      }
    );

    // Log the response data
    console.log("Response data: ", response.data);

    // Return the data from the response
    return response.data;
  } catch (error: any) {
    console.error("Error creating post:", error.message || error);
    return { success: false, message: "Error creating post" }; // Return an error object
  }
};
