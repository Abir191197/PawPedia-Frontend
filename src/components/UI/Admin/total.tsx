"use client"; // For client-side fetching
import { useGetAllUsers } from "@/hooks/AllUserGet";
import { useFetchPosts } from "@/hooks/getPost";
import React, { useEffect, useState } from "react";
import { FaUsers, FaFileAlt } from "react-icons/fa"; // Icons for users and posts

// A simple counter animation hook
const useCounter = (targetValue: number, duration: number) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = targetValue / (duration / 1000); // Adjust the increment based on duration
    const interval = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        clearInterval(interval);
        setCount(targetValue);
      } else {
        setCount(Math.ceil(start));
      }
    }, 1000 / 60); // Update at 60fps

    return () => clearInterval(interval); // Cleanup
  }, [targetValue, duration]);

  return count;
};

const Dashboard = () => {
  const {
    users,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
  } = useGetAllUsers();
  const {
    posts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = useFetchPosts();

  // Use 0 as default if `users` or `posts` is undefined
  const userCount = useCounter(users ? users.length : 0, 2000);
  const postCount = useCounter(posts ? posts.data.length : 0, 2000);

  // Loading or Error States
  if (isLoadingUsers || isLoadingPosts) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center text-lg font-semibold">
          <span className="animate-pulse text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (isErrorUsers || isErrorPosts) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center text-red-500 text-lg font-semibold">
          Failed to load data
        </div>
      </div>
    );
  }

  // Render the UI once data is fetched
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Dashboard
        </h1>
        <div className="flex justify-between items-center mb-4 space-x-6">
          {/* Total Users Card */}
          <div className="flex-1 text-center bg-indigo-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-center items-center mb-2">
              <FaUsers className="text-4xl text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">
                Total Users
              </h2>
            </div>
            <p className="text-5xl font-bold text-indigo-600">{userCount}</p>
          </div>

          {/* Total Posts Card */}
          <div className="flex-1 text-center bg-yellow-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-center items-center mb-2">
              <FaFileAlt className="text-4xl text-yellow-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-700">
                Total Posts
              </h2>
            </div>
            <p className="text-5xl font-bold text-yellow-600">{postCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
