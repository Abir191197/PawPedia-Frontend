"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import DOMPurify from "dompurify";
import { useFetchPosts } from "@/hooks/getPost";
import Loading from "@/app/register/loading";
import {
  MessageCircle,
  ThumbsDown,
  ThumbsUp,
  Lock,
  UserPlus,
} from "lucide-react";
import { useCreateComment } from "@/hooks/CreateComment";
import { useUpvotePost } from "@/hooks/upvote";
import { useDownvotePost } from "@/hooks/downvote";
import { usePayment } from "@/hooks/payment";
import { useFollowPost } from "@/hooks/follow";

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

const PostView = () => {
  const [newComment, setNewComment] = useState("");
  const [expandedPosts, setExpandedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const { posts, isLoading, isError } = useFetchPosts();
  const createComment = useCreateComment();
  const upvotePost = useUpvotePost();
  const downvotePost = useDownvotePost();
  const createPayment = usePayment();
  const followPost = useFollowPost();

  const [userId, setUserId] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(10);
  const [sortOption, setSortOption] = useState("mostUpvoted"); // State to keep track of sorting
  const observer = useRef();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData._id);
    }
  }, []);

  const lastPostRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setVisiblePosts((prevVisiblePosts) => prevVisiblePosts + 10);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading posts</div>;

  // Sort posts based on the selected option
  const sortedPosts = () => {
    if (!posts?.success) return [];
    let sortedArray = [...posts.data];

    if (sortOption === "mostUpvoted") {
      sortedArray.sort((a, b) => b.upvote.length - a.upvote.length);
    } else if (sortOption === "mostRecent") {
      sortedArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return sortedArray.slice(0, visiblePosts);
  };

  const blogPosts = sortedPosts();

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

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (newComment.trim()) {
      try {
        const commentData = {
          postId: postId,
          content: newComment,
        };
        await createComment(commentData);
        setNewComment(""); // Clear the input after submission
      } catch (error) {
        console.error("Failed to post comment:", error.message);
      }
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await upvotePost(postId);
    } catch (error) {
      console.error("Failed to upvote the post:", error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await downvotePost(postId);
    } catch (error) {
      console.error("Failed to downvote the post:", error.message);
    }
  };

  const handlePayToSee = async (postId) => {
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

  const handleFollow = async (postId) => {
    try {
      await followPost(postId);
    } catch (error) {
      console.error("Failed to follow the author:", error.message);
    }
  };

  return (
    <div className="lg:max-w-full lg:mx-auto bg-white rounded-lg shadow-md overflow-hidden p-4">
      {/* Sorting Options */}
      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded-md p-2">
          <option value="mostUpvoted">Most Upvoted</option>
          <option value="mostRecent">Most Recent</option>
        </select>
      </div>

      {blogPosts.map((post, index) => {
        const isExpanded = expandedPosts[post._id];
        const areCommentsExpanded = expandedComments[post._id];
        const isAuthor = post.authorId === userId;
        const canAccessPremium = post.isPremium
          ? post.PaidByUserPostId.includes(userId)
          : true;

        const lastPost = blogPosts.length === index + 1;

        return (
          <div
            ref={lastPost ? lastPostRef : null}
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
                  <p className="text-sm text-gray-500">{post.authorId.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
              {!isAuthor && (
                <button
                  onClick={() => handleFollow(post._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-600 transition duration-300">
                  <UserPlus size={20} />
                  <span>Follow The User</span>
                </button>
              )}
            </div>

            {post.isPremium && !canAccessPremium ? (
              <div className="relative">
                <div className="blur-md">
                  <div className="px-4 py-2">
                    <div
                      className="post-content break-words whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content),
                      }}
                    />
                  </div>

                  {post?.images?.length > 0 && post.images[0] && (
                    <div className="relative w-full h-96 overflow-hidden">
                      <Image
                        src={post.images[0]}
                        alt="Post image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="px-4 py-2 flex justify-between text-sm text-gray-500">
                    <span>
                      {post.upvote.length} likes • {post.downvote.length}{" "}
                      dislikes
                    </span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>

                  <div className="px-4 py-2 border-t border-gray-200 flex justify-around">
                    <button
                      className="flex items-center space-x-2 text-gray-600"
                      onClick={() => handleUpvote(post._id)}>
                      <ThumbsUp size={20} />
                      <span>Upvote</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 text-gray-600"
                      onClick={() => handleDownvote(post._id)}>
                      <ThumbsDown size={20} />
                      <span>Downvote</span>
                    </button>
                    <button
                      className="flex items-center space-x-2 text-gray-600"
                      onClick={() => handlePayToSee(post._id)}>
                      <Lock size={20} />
                      <span>Pay to See</span>
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black opacity-30"></div>
              </div>
            ) : (
              <div>
                <div className="px-4 py-2">
                  <div
                    className="post-content break-words whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.content),
                    }}
                  />
                </div>
                {post?.images?.length > 0 && post.images[0] ? (
                  <div className="relative w-full h-96 overflow-hidden">
                    <Image
                      src={post.images[0]} // Ensure this URL is valid
                      alt="" // No alt text if you don't want to show anything
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onError={() =>
                        console.error("Image failed to load:", post.images[0])
                      } // Log error if the image fails to load
                    />
                  </div>
                ) : null}{" "}
               
                <div className="px-4 py-2 flex justify-between text-sm text-gray-500">
                  <span>
                    {post.upvote.length} likes • {post.downvote.length} dislikes
                  </span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>
                <div className="px-4 py-2 border-t border-gray-200 flex justify-around">
                  <button
                    className="flex items-center space-x-2 text-gray-600"
                    onClick={() => handleUpvote(post._id)}>
                    <ThumbsUp size={20} />
                    <span>Upvote</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-600"
                    onClick={() => handleDownvote(post._id)}>
                    <ThumbsDown size={20} />
                    <span>Downvote</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-600"
                    onClick={() => toggleCommentExpand(post._id)}>
                    <MessageCircle size={20} />
                    <span>Comment</span>
                  </button>
                </div>
                {/* Comment section */}
                {areCommentsExpanded && (
                  <div className="px-4 py-2">
                    <form onSubmit={(e) => handleCommentSubmit(e, post._id)}>
                      <textarea
                        className="w-full p-2 border rounded-lg mb-2"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                        required // Ensure this field is required
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Post Comment
                      </button>
                    </form>
                    {post.comments.map((comment) => (
                      <div key={comment._id} className="py-2">
                        <p className="text-sm text-gray-700">
                          {comment.content}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(comment.createdAt)} by{" "}
                          {comment.authorName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostView;
