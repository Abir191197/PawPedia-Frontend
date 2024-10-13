"use client";

import React, { useState} from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLogin, useUser } from "@/hooks/useAuth";
import Loading from "@/components/UI/Loading";



type LoginFormInputs = {
  email: string;
  password: string;
};

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "user1@gmail.com",
      password: "123456789",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const login = useLogin();
  const {  isLoading } = useUser();
  console.log(isLoading);
 

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await login(data);
      console.log(result);
      setIsSubmitting(false);
      if (result.success) {
        toast.success("Login successful! Redirecting...");
        router.push(`/${result.data.role}`);

      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error: unknown) {
      setIsSubmitting(false);
      if (error instanceof Error) {
        toast.error(error.message || "An error occurred");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                type="email"
                autoComplete="email"
                className={`block w-full pl-10 pr-3 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 
                  ${errors.email ? "border-red-500" : "border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm`}
                placeholder="you@example.com"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
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
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className={`block w-full pl-10 pr-10 py-2 border rounded-md leading-5 bg-white placeholder-gray-500 
                  ${errors.password ? "border-red-500" : "border-gray-300"}
                  focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm`}
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
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium 
                text-white ${
                  isSubmitting
                    ? "bg-gray-400"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {/* Social Sign-in Buttons (Facebook, Twitter, GitHub) */}
            {/* Add social sign-in buttons here as in your original code */}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Not a member?{" "}
          <Link
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500">
            Register Now!
          </Link>
        </p>
      </div>
    </div>
  );
}
