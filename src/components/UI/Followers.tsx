"use client";
import { useFetchUser } from "@/hooks/getUser";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import Image from "next/image";

export default function FollowersAndFollowing() {
  // Fetch user data using the custom hook
  const { user, isLoading, isError } = useFetchUser();

  if (isLoading) {
    return <div>Loading followers and following...</div>;
  }

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  // Destructure user details, followers, and following from user data
  const {
    name,
    email,
    phone,
    address,
    role,
    followers = [],
    following = [],
  } = user?.data || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* User Details Section */}

      <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6">
        {/* <Image
          className="h-24 w-24 rounded-full object-cover bg-gray-300"
          src={"/default-avatar.png"} // Placeholder for user image
          alt={`${name}'s profile`}
          height={96}
          width={96}
        /> */}
        <div>
          {" "}
          <h1 className="text-4xl font-bold text-gray-900">User Profile</h1>
          <h1 className="text-2xl font-bold text-gray-900">
            {name || "Unknown Name"}
          </h1>
          <p className="text-md text-gray-600">
            {role || "Role not available"}
          </p>
          <p className="text-sm text-gray-500">
            {address || "Address not provided"}
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-gray-600">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>{email || "Email not available"}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>{phone || "Phone not available"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Followers Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Followers</h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
          {followers.length ? (
            followers.map((person) => (
              <li
                key={person._id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        {person.name || "Unknown Name"}
                      </h3>
                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {person.role || "Role not available"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {person.title || "No title provided"}
                    </p>
                  </div>
                  <Image
                    className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                    src={"/default-avatar.png"} // Placeholder for follower image
                    alt={`${person.name}'s profile`}
                    height={100}
                    width={100}
                  />
                </div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex-1 flex items-center justify-center py-3 text-sm text-gray-500">
                    <EnvelopeIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-2">{person.email || "No email"}</span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No followers available</p>
          )}
        </ul>
      </div>

      {/* Following Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Following</h2>
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1">
          {following.length ? (
            following.map((person) => (
              <li
                key={person._id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        {person.name || "Unknown Name"}
                      </h3>
                      <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {person.role || "Role not available"}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm text-gray-500">
                      {person.title || "No title provided"}
                    </p>
                  </div>
                  <Image
                    className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                    src={"/default-avatar.png"} // Placeholder for following person image
                    alt={`${person.name}'s profile`}
                    height={100}
                    width={100}
                  />
                </div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex-1 flex items-center justify-center py-3 text-sm text-gray-500">
                    <EnvelopeIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span className="ml-2">{person.email || "No email"}</span>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              Not following anyone yet
            </p>
          )}
        </ul>
      </div>
    </div>
  );
}
