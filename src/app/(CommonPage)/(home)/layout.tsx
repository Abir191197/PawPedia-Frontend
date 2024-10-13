import React from "react";

export default function Layout({
  children,
  recentPosts,
  
}: {
  children: React.ReactNode;
    recentPosts: React.ReactNode;
    
}) {
  return (
    <>
      {children}
      {recentPosts}
      
    </>
  );
}
