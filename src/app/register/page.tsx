// app/register/page.tsx
"use client";

import React, { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail, User, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner"; // Import the toast function from Sonner
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useRegister } from "@/hooks/useAuth";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter(); // Initialize the router for navigation

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    try {
      const userData = {
        ...data,
        role: "user", // Set default role here
      };
      const result = await useRegister()(userData);
      console.log(result);
      if (result.success) {
        // Show success toast
        toast.success("Registration successful! Redirecting to login...");

        // Redirect after a brief delay
        setTimeout(() => {
          router.push("/login"); // Redirect to /login
        }, 2000); // Adjust the delay as needed (2000 ms = 2 seconds)
      } else {
        setServerError(result.message || "Registration failed");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message || "An error occurred");
      } else {
        setServerError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Sign up for a new account</p>
        </div>

        {serverError && (
          <p className="text-red-600 text-center mb-4">{serverError}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                id="name"
                {...register("name", { required: "Name is required" })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="John Doe"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              {errors.name && (
                <p className="text-red-600">{errors.name.message as string}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                {...register("email", { required: "Email is required" })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="you@example.com"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="text-red-600">{errors.email.message as string}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  {...register("phone", {
                    required: "Phone number is required",
                  })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="+1 (555) 123-4567"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                {errors.phone && (
                  <p className="text-red-600">
                    {errors.phone.message as string}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  {...register("address", {
                    required: "Address is required",
                  })}
                  rows={3}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  placeholder="123 Main St, City, State, ZIP"
                />
                <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                {errors.address && (
                  <p className="text-red-600">
                    {errors.address.message as string}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                {...register("password", {
                  required: "Password is required",
                })}
                type={showPassword ? "text" : "password"}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md"
                placeholder="••••••••"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
              {errors.password && (
                <p className="text-red-600">
                  {errors.password.message as string}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              Register
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
