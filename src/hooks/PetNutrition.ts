"use client";
import Cookies from "js-cookie";
import { mutate } from "swr";

// Define your API URL
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Hook for generating a pet nutrition PDF
export function useGeneratePetNutritionPDF() {
  const generatePetNutritionPDF = async (petType, age, weight) => {
    const token = Cookies.get("accessToken");

    const response = await fetch(`${API_URL}/Nutrition/generate-pdf`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Set the Content-Type for JSON data
      },
      body: JSON.stringify({ petType, age, weight }), // Send JSON directly
    });

    // Check for successful generation response
    if (!response.ok) {
      const errorData = await response.json(); // Capture error details
      throw new Error(
        errorData.message || "Failed to generate pet nutrition PDF"
      );
    }

    const pdfBlob = await response.blob(); // Get the PDF as a blob
    const url = window.URL.createObjectURL(pdfBlob); // Create a URL for the blob

    // Trigger a re-fetch of the relevant data if needed
    mutate(`${API_URL}/pet/nutrition-data`); // This can be adjusted based on your specific needs

    return url; // Return the URL for downloading the PDF
  };

  return generatePetNutritionPDF;
}
