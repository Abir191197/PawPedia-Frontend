"use client";
import Cookies from "js-cookie";
import { mutate } from "swr";

// Define your API URL
const API_URL = "http://localhost:5000/api";

// Hook for handling payment
export function usePayment() {
  const createPayment = async (postId: string) => {
    const token = Cookies.get("accessToken");

    // Ensure postId is defined
    if (!postId) {
      throw new Error("Post ID is required for payment.");
    }

    // Send payment request
    const paymentResponse = await fetch(
      `${API_URL}/pet/posts/payment/${postId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure this is included if you send a body
        },
        // Include a body if required by your backend
        // body: JSON.stringify({ amount: paymentAmount }), // Example body if needed
      }
    );

    // Check for successful payment response
    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json(); // Capture error details
      throw new Error(errorData.message || "Payment failed");
    }

    const data = await paymentResponse.json(); // Return payment confirmation data

    // Trigger a re-fetch of the posts to update UI
    mutate(`${API_URL}/pet/posts`); // This will refresh the posts data

    return data; // Optionally return payment confirmation data or other relevant info
  };

  return createPayment;
}
