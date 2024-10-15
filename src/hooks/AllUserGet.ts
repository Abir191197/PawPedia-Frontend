import Cookies from "js-cookie";
import useSWR from "swr";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

const fetchAllUsers = async (url) => {
  const token = Cookies.get("accessToken");

  if (!token) {
    throw new Error("Authorization token is missing");
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch users");
  }

  const data = await response.json();

  if (!Array.isArray(data.data)) {
    throw new Error("Invalid response format, expected an array");
  }

  return data.data;
};

export function useGetAllUsers() {
  const { data, error } = useSWR(`${API_URL}/users/allUsers`, fetchAllUsers);

  return {
    users: data || [],
    isLoading: !error && !data,
    isError: error,
  };
}
