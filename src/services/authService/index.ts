// "use server";


// import { cookies } from "next/headers";
// import { FieldValues } from "react-hook-form";

// export const registerUser = async (userData: FieldValues) => {
//   try {
//     const { data } = await axiosInstance.post("/auth/signup", userData);
//     if (data.success) {
//       cookies().set("accessToken", data?.token);
//     }
//     return data;
//   } catch (error: unknown) {
//     // Error handling remains the same...
//   }
// };

// export const loginUser = async (userData: FieldValues) => {
//   try {
//     const { data } = await axiosInstance.post("/auth/login", userData);
//     if (data.success) {
//       cookies().set("accessToken", data?.token);
//     }
//     return data;
//   } catch (error: unknown) {
//     // Error handling remains the same...
//   }
// };

// export const logoutUser = async () => {
//   cookies().delete("accessToken");
//   cookies().delete("refreshToken");
//   return { success: true };
// };
