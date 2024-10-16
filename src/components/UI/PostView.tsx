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
  const { posts, isLoading, isError, mutate } = useFetchPosts();
  const createComment = useCreateComment();
  const upvotePost = useUpvotePost();
  const downvotePost = useDownvotePost();
  const createPayment = usePayment();
  const followPost = useFollowPost();

  const [userId, setUserId] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(10);
  const [sortOption, setSortOption] = useState("mostUpvoted");
  const observer = useRef();

  useEffect(() => {
    // Delay fetching user information by 500 milliseconds (adjust as needed)
    const timer = setTimeout(() => {
      const user = localStorage.getItem("user");
      if (user) {
        const userData = JSON.parse(user);
        setUserId(userData._id);
      }
    }, 2000); // 500 ms delay

    // Cleanup function to clear the timeout when the component unmounts
    return () => clearTimeout(timer);
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
        mutate(); // Refetch posts to update the UI
      } catch (error) {
        console.error("Failed to post comment:", error.message);
      }
    }
  };

  const handleUpvote = async (postId) => {
    try {
      await upvotePost(postId);
      mutate(); // Refetch posts to update the UI
    } catch (error) {
      console.error("Failed to upvote the post:", error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await downvotePost(postId);
      mutate(); // Refetch posts to update the UI
    } catch (error) {
      console.error("Failed to downvote the post:", error.message);
    }
  };

  const handlePayToSee = async (postId) => {
    console.log("handlePayToSee", postId);
    try {
      const paymentData = await createPayment(postId);
      if (paymentData.success && paymentData.data.payment_url) {
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
      mutate(); // Refetch posts to update the UI
    } catch (error) {
      console.error("Failed to follow the author:", error.message);
    }
  };

  return (
    <div className="lg:max-w-full lg:mx-auto bg-white rounded-lg shadow-md overflow-hidden p-4">
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
                </div>
                <div className="absolute inset-0 bg-black opacity-30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-600 transition duration-300"
                    onClick={() => handlePayToSee(post._id)}>
                    <Lock size={20} />
                    <span>Pay to See</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="px-4 py-2">
                  <div
                    className={`post-content break-words whitespace-pre-wrap ${
                      !isExpanded && post.content.length > MAX_LENGTH
                        ? "truncate"
                        : ""
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(post.content),
                    }}
                  />
                  {post.content.length > MAX_LENGTH && (
                    <button
                      className="text-blue-500"
                      onClick={() => toggleExpand(post._id)}>
                      {isExpanded ? "Show less" : "Read more"}
                    </button>
                  )}
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
                </div>

                <div className="px-4 py-2">
                  <button
                    className="text-blue-500"
                    onClick={() => toggleCommentExpand(post._id)}>
                    {areCommentsExpanded ? "Hide comments" : "Show comments"}
                  </button>

                  {areCommentsExpanded && (
                    <div>
                      {post.comments?.map((comment) => (
                        <div key={comment._id} className="mt-2">
                          <p className="text-gray-700">{comment.content}</p>
                          <p className="text-sm text-gray-500">
                            {comment.authorName} •{" "}
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                      ))}

                      <form
                        onSubmit={(e) => handleCommentSubmit(e, post._id)}
                        className="mt-4 flex space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment"
                          className="border border-gray-300 rounded-md p-2 w-full"
                        />
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                          Post
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostView;
