import React from "react";
import Image from "next/image";
import { getRecentPosts } from "@/services"; // Import only the function we'll use

interface Post {
  _id: string;
  title: string;
  images: string[];
  createdAt: string;
}

interface RecentPostProps {
  blogPosts: Post[];
}

const RecentPost: React.FC<RecentPostProps> = async () => {
  const data = await getRecentPosts();
  const blogPosts = data.success ? data.data : [];

  return (
    <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {blogPosts.map((post: Post) => (
        <article
          key={post._id}
          className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80">
          {post.images?.[0] && (
            <Image
              src={
                post.images[0].startsWith("http")
                  ? post.images[0]
                  : `/${post.images[0]}`
              }
              alt={post.title}
              className="absolute inset-0 -z-10 h-full w-full object-cover"
              width={396}
              height={528}
              quality={100}
            />
          )}

          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
          <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

          <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
            <time
              dateTime={new Date(post.createdAt).toISOString()}
              className="mr-8">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>
          <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
            <a href="#">
              <span className="absolute inset-0" />
              {post.title}
            </a>
          </h3>
        </article>
      ))}
    </div>
  );
};

export default RecentPost;
