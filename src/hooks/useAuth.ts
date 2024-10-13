"use client"
import useSWR from "swr";
import { FieldValues } from "react-hook-form";
import Cookies from "js-cookie";

const API_URL = "http://localhost:5000/api";

// Fetcher function to handle API calls with authentication
const fetcher = async (url: string) => {
  const token = Cookies.get("accessToken");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Check for successful response
  if (!response.ok) {
    const errorData = await response.json(); // Capture the error details from the response
    throw new Error(
      errorData.message || "An error occurred while fetching the data."
    );
  }
  return response.json();
};

// Hook to get user data
export function useUser() {
  const { data, error, mutate } = useSWR(`${API_URL}/user`, fetcher); // Ensure the endpoint is correct for fetching user data

  return {
    user: data,
    isLoading: !error && !data,
    isError: !!error, // Convert to boolean
    mutate,
  };
}

// Hook for user login
export function useLogin() {
  const { mutate } = useUser();

  const login = async (userData: FieldValues) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Check for successful login response
    if (!response.ok) {
      const errorData = await response.json(); // Capture error details
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    // Store the token if login is successful
    if (data.token) {
      Cookies.set("accessToken", data.token, { expires: 7 }); // expires in 7 days
      localStorage.setItem("user", JSON.stringify(data.data));
      localStorage.setItem("accessToken", data.token);
    }

    mutate(); // Revalidate the user data after login
    return data;
  };

  return login;
}

// Hook for user registration
export function useRegister() {
  const register = async (userData: FieldValues) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    // Check for successful registration response
    if (!response.ok) {
      const errorData = await response.json(); // Capture error details
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();

    // Store the token if registration is successful
    if (data.token) {
      Cookies.set("accessToken", data.token, { expires: 7 }); // expires in 7 days
    }

    return data;
  };

  return register;
}

// Hook for user logout
export function useLogout() {
  const { mutate } = useUser();

  const logout = async () => {
    Cookies.remove("accessToken");
    mutate(null, false); // Clear the user data without revalidation
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");

    return { success: true };
  };

  return logout;
}
