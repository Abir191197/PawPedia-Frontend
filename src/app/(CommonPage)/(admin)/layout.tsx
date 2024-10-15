import AdminDashboard from "@/components/UI/Admin/AdminDashboard";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <AdminDashboard></AdminDashboard>
      <main>{children}</main>
    </div>
  );
}
