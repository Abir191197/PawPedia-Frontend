"use client"; // Ensures this code runs on the client side

import React, { useState } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";
import Loading from "@/app/register/loading"; // Placeholder for loading state
import {
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Lock,
  UserPlus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useCreateComment } from "@/hooks/CreateComment";
import { useUpvotePost } from "@/hooks/upvote";
import { useDownvotePost } from "@/hooks/downvote";
import { usePayment } from "@/hooks/payment";
import { useFollowPost } from "@/hooks/follow";
import { useGetMyPost } from "@/hooks/getMyPost";
import { useDeletePost } from "@/hooks/deletePost";

// Helper function to format date
const formatDate = (dateString: string) => {
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

const MyContent = () => {
  const [newComment, setNewComment] = useState("");
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state
  const [postToDelete, setPostToDelete] = useState<string | null>(null); // Post to delete

  const createComment = useCreateComment();
  const upvotePost = useUpvotePost();
  const downvotePost = useDownvotePost();
  const createPayment = usePayment();
  const followPost = useFollowPost();
  const deletePost = useDeletePost();

  const user = localStorage.getItem("user");
  let userId = null;
  if (user) {
    const userData = JSON.parse(user);
    userId = userData._id;
    console.log("User ID:", userId);
  }

  // Use the custom hook to fetch posts
  const { posts, isLoading, isError } = useGetMyPost();

  console.log("Error state:", isError);

  if (isLoading) return <Loading />;

  // Handle no posts or error state
  if (isError || posts?.data?.length === 0) {
    return <div className="text-center py-4">You have no posts.</div>;
  }

  const blogPosts = posts?.success ? posts?.data : [];

  const MAX_LENGTH = 100;

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleCommentExpand = (postId: string) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    postId: string
  ) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const commentData = { postId, content: newComment };
        await createComment(commentData);
        setNewComment(""); // Reset comment input
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

  const handlePayToSee = async (postId: string) => {
    try {
      const paymentData = await createPayment(postId);
      if (paymentData.data.payment_url) {
        window.location.href = paymentData.data.payment_url;
      } else {
        console.error("No payment URL received in response.");
      }
    } catch (error) {
      console.error("Payment failed:", error.message);
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

  const handleDelete = async () => {
    if (postToDelete) {
      try {
        await deletePost(postToDelete);
        console.log("Post deleted successfully");
        setShowDeleteModal(false); // Close the modal after deletion
      } catch (error) {
        console.error("Failed to delete post:", error.message);
      }
    }
  };

  const openDeleteModal = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setPostToDelete(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="lg:max-w-4xl lg:mx-auto bg-white rounded-lg shadow-md overflow-hidden p-6">
      {blogPosts.map((post) => {
        const isExpanded = expandedPosts[post._id];
        const areCommentsExpanded = expandedComments[post._id];
        const isAuthor = post.authorId === userId;
        const canAccessPremium = post.isPremium
          ? post.PaidByUserPostId.includes(userId)
          : true;

        return (
          <div
            key={post._id}
            className="mb-12 p-6 bg-gray-100 rounded-lg shadow-lg">
            {/* Post header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src="/api/placeholder/40/40" // Ensure to replace with the actual avatar
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full"
                  width={48}
                  height={48}
                />
                <div>
                  <h3 className="font-bold text-xl">{post.title}</h3>
                  <p className="font-semibold text-sm">
                    Category: {post.category}
                  </p>
                  <p className="text-sm text-gray-500">{post.authorId.name}</p>{" "}
                  <p className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>

              {/* Follow and Delete buttons */}
              <div className="flex items-center space-x-4">
                {!isAuthor && (
                  <button
                    onClick={() => handleFollow(post._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition duration-300">
                    <UserPlus size={20} />
                    <span>Follow</span>
                  </button>
                )}
                {isAuthor && (
                  <button
                    onClick={() => openDeleteModal(post._id)} // Open delete modal
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-600 transition duration-300">
                    <Trash2 size={20} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            {/* Post content */}
            {post.isPremium && !canAccessPremium ? (
              <div className="relative">
                {/* Blurred content for premium posts */}
                <div className="blur-md">
                  <div className="px-4 py-2">
                    <div
                      className="post-content break-words whitespace-pre-wrap text-gray-700"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content),
                      }}
                    />
                  </div>
                  {post.images && (
                    <div className="relative w-full h-64 overflow-hidden mt-4">
                      <Image
                        src={post.images[0]}
                        alt="Post image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => handlePayToSee(post._id)}
                    className="bg-blue-500 text-white px-6 py-3 rounded-full flex items-center space-x-2 hover:bg-blue-600 transition duration-300 shadow-lg">
                    <Lock size={24} />
                    <span className="text-lg font-semibold">
                      Pay to Unlock Full Post
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="px-4 py-2">
                  <div
                    className="post-content break-words whitespace-pre-wrap text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        isExpanded || isAuthor || canAccessPremium
                          ? post.content
                          : `${post.content.substring(0, MAX_LENGTH)}...`
                      ),
                    }}
                  />
                  {post.content.length > MAX_LENGTH &&
                    !isExpanded &&
                    !isAuthor && (
                      <button
                        onClick={() => toggleExpand(post._id)}
                        className="text-blue-500 hover:text-blue-700 focus:outline-none mt-2 block">
                        See More
                      </button>
                    )}
                </div>
                {post?.images && post?.images.length > 0 && (
                  <Image
                    src={post?.images[0]}
                    alt="Post image"
                    className="w-full h-auto rounded-lg mt-4"
                    width={600}
                    height={400}
                  />
                )}
                <div className="px-4 py-2 flex justify-between text-sm text-gray-500 mt-4">
                  <span>
                    {post.upvote.length} likes • {post.downvote.length} dislikes
                  </span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>
                <div className="px-4 py-2 border-t border-gray-200 flex justify-around">
                  <button
                    onClick={() => handleUpvote(post._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                    <ThumbsUp size={20} />
                    <span>Upvote</span>
                  </button>
                  <button
                    onClick={() => handleDownvote(post._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
                    <ThumbsDown size={20} />
                    <span>Dislike</span>
                  </button>
                  <button
                    onClick={() => toggleCommentExpand(post._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
                    <MessageCircle size={20} />
                    <span>
                      {areCommentsExpanded ? "Hide Comments" : "Comment"}
                    </span>
                  </button>
                </div>
                {areCommentsExpanded && (
                  <div className="mt-4">
                    <form
                      onSubmit={(e) => handleCommentSubmit(e, post._id)}
                      className="flex">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="border rounded-lg px-4 py-2 flex-grow"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg ml-2 hover:bg-blue-600">
                        Submit
                      </button>
                    </form>
                    <div className="mt-2">
                      {post.comments?.map((comment) => (
                        <div
                          key={comment._id}
                          className="p-2 border-b border-gray-200">
                          <strong>{comment.authorName}:</strong>{" "}
                          {comment.content}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </p>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyContent;
