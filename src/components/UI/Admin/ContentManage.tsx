"use client"; // Ensures that this component only runs on the client

import React, { useEffect, useState } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";
import { useFetchPosts } from "@/hooks/getPost";
import Loading from "@/app/register/loading";
import { MessageCircle, ThumbsDown, ThumbsUp, UserPlus } from "lucide-react";
import { useCreateComment } from "@/hooks/CreateComment";
import { useUpvotePost } from "@/hooks/upvote";
import { useDownvotePost } from "@/hooks/downvote";
import { useFollowPost } from "@/hooks/follow";
import { useDeletePost } from "@/hooks/deletePost"; // Added delete post hook
import CompactEditor from "../CreatePost";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ContentManage = () => {
  const [newComment, setNewComment] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const { posts, isLoading, isError } = useFetchPosts();
  const createComment = useCreateComment();
  const upvotePost = useUpvotePost();
  const downvotePost = useDownvotePost();
  const followPost = useFollowPost();
  const deletePost = useDeletePost(); // Added delete post hook

  const [userId, setUserId] = useState(null); // State to store userId

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData._id); // Set the userId state
      console.log(userData._id);
    }
  }, []); // Empty dependency array ensures this runs only on mount

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading posts</div>;

  const blogPosts = posts?.success ? posts?.data : [];
  const MAX_LENGTH = 100;

  const toggleExpand = (postId) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleCommentExpand = (postId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    postId: string | number
  ) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const commentData = {
          postId: postId,
          content: newComment,
        };
        await createComment(commentData);
        setNewComment("");
      } catch (error) {
        console.error("Failed to post comment:", error.message);
      }
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      await upvotePost(postId);
      console.log("Post upvoted successfully");
    } catch (error) {
      console.error("Failed to upvote the post:", error.message);
    }
  };

  const handleDownvote = async (postId: string) => {
    try {
      await downvotePost(postId);
      console.log("Post downvoted successfully");
    } catch (error) {
      console.error("Failed to downvote the post:", error.message);
    }
  };

  const handleFollow = async (postId: string) => {
    try {
      await followPost(postId);
      console.log("Successfully followed the author of post:", postId);
    } catch (error) {
      console.error("Failed to follow the author:", error.message);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePost(postId); // Call the deletePost function
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete the post:", error.message);
    }
  };

    return (
      <>
        <CompactEditor></CompactEditor>
        <div className="lg:max-w-full lg:mx-auto bg-white rounded-lg shadow-md overflow-hidden p-4">
          {blogPosts.map((post) => {
            const isExpanded = expandedPosts[post._id];
            const areCommentsExpanded = expandedComments[post._id];

            return (
              <div
                key={post._id}
                className="mb-12 p-6 bg-gray-50 rounded-lg shadow-lg">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Image
                      src="/api/placeholder/40/40"
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full"
                      width={40}
                      height={40}
                    />
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="font-semibold">Category: {post.category}</p>
                      <p className="text-sm text-gray-500">
                        {post.authorId.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(post._id)} // Admin can delete any post
                    className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-red-600 transition duration-300">
                    <span>Delete Post</span>
                  </button>
                </div>

                <div>
                  <div className="px-4 py-2">
                    <div
                      className="post-content break-words whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          post.body
                            ? isExpanded
                              ? post.body
                              : post.body.substring(0, MAX_LENGTH) + "..."
                            : ""
                        ),
                      }}
                    />
                  </div>
                  {post.images && (
                    <div className="relative w-full h-64 overflow-hidden">
                      <Image
                        src={post.images[0]}
                        alt="Post image"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                  )}
                  <div className="px-4 py-2 flex justify-between text-sm text-gray-500">
                    <span>
                      {post.upvote?.length || 0} likes •{" "}
                      {post.downvote?.length || 0} dislikes
                    </span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>
                  <div className="px-4 py-2 border-t border-gray-200 flex justify-around">
                    <button
                      onClick={() => handleUpvote(post._id)}
                      className="flex items-center space-x-2 text-gray-600">
                      <ThumbsUp size={20} />
                      <span>Upvote</span>
                    </button>
                    <button
                      onClick={() => handleDownvote(post._id)}
                      className="flex items-center space-x-2 text-gray-600">
                      <ThumbsDown size={20} />
                      <span>Dislike</span>
                    </button>
                    <button
                      onClick={() => toggleCommentExpand(post._id)}
                      className="flex items-center space-x-2 text-gray-600">
                      <MessageCircle size={20} />
                      <span>Comment</span>
                    </button>
                  </div>
                  {areCommentsExpanded && (
                    <form onSubmit={(e) => handleCommentSubmit(e, post._id)}>
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full mt-2 p-2 border rounded"
                        placeholder="Add a comment..."
                      />
                      <button
                        type="submit"
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-full">
                        Submit
                      </button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
};

export default ContentManage;
