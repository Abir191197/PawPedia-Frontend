"use server";

import axiosInstance from "@/lib/Axios";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const registerUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/signup", userData);
    console.log(data.data.token); // Corrected line
    if (data.success) {
      // Setting tokens in cookies if signup is successful
      cookies().set("accessToken",data?.token);
      // cookies().set("refreshToken", data?.data?.refreshToken);
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Error during registration");
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(
        axiosError.response?.data?.message || "Error during registration"
      );
    } else {
      throw new Error("An unknown error occurred during registration");
    }
  }
};

export const loginUser = async (userData: FieldValues) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", userData);

    if (data.success) {
      // Setting tokens in cookies if signup is successful
      cookies().set("accessToken", data?.token);
      // cookies().set("refreshToken", data?.data?.refreshToken);
    }
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || "Error during login");
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(
        axiosError.response?.data?.message || "Error during login"
      );
    } else {
      throw new Error("An unknown error occurred during login");
    }
  }
};


export const logoutUser = async () => {
  cookies().delete("accessToken");
  cookies().delete("refreshToken");
  return { success: true };
};
