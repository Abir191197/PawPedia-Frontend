
"use client";

import { useEffect, useState } from "react";
import { useFetchUser } from "@/hooks/getUser";
import { EnvelopeIcon, PhoneIcon, PencilIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useUpdateUser } from "@/hooks/updateUser";



export default function FollowersAndFollowing() {
  const { user, isLoading, isError } = useFetchUser();
  const updateUser = useUpdateUser();

  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (user?.data) {
      setFormData({
        name: user.data.name || "",
        email: user.data.email || "",
        phone: user.data.phone || "",
        address: user.data.address || "",
      });
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading followers and following...</div>;
  }

  if (isError) {
    return <div>Error: {isError.message}</div>;
  }

  const { role, followers = [], following = [] } = user?.data || {};

  const openModal = () => {
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateError(null);

    try {
      await updateUser(formData);
      setShowModal(false);
      alert("User profile updated successfully!");
    } catch (error: any) {
      setUpdateError(error.message);
      console.error("Update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUpdateError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* User Details Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6 relative">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">User Profile</h1>
          <h1 className="text-2xl font-bold text-gray-900">
            {formData.name || "Unknown Name"}
          </h1>
          <p className="text-md text-gray-600">
            {role || "Role not available"}
          </p>
          <p className="text-sm text-gray-500">
            {formData.address || "Address not provided"}
          </p>
          <div className="mt-3 space-y-2">
            <div className="flex items-center text-gray-600">
              <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>{formData.email || "Email not available"}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
              <span>{formData.phone || "Phone not available"}</span>
            </div>
          </div>
        </div>

        {/* Edit Icon */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={openModal}>
          <PencilIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Modal for Editing Profile */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange} // Update state on change
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange} // Update state on change
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange} // Update state on change
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {updateError && (
                <p className="text-red-500 text-sm">{updateError}</p>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
                  onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${
                    isUpdating ? "bg-gray-400" : "bg-blue-500"
                  } text-white py-2 px-4 rounded hover:bg-blue-600`}
                  disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <p className="text-gray-500 text-center">No followers yet</p>
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
                    src={"/default-avatar.png"} // Placeholder for following image
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
            <p className="text-gray-500 text-center">Not following anyone</p>
          )}
        </ul>
      </div>
    </div>
  );
}
