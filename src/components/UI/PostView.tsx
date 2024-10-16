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

const MAX_CONTENT_LENGTH = 300;

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
  const [comments, setComments] = useState({}); // Store comments per post
  const [newComments, setNewComments] = useState({}); // Store new comment text per post
  const [expandedPosts, setExpandedPosts] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [userId, setUserId] = useState(null);
  const [visiblePosts, setVisiblePosts] = useState(10);
  const [sortOption, setSortOption] = useState("mostUpvoted");
  const { posts, isLoading, isError, mutate } = useFetchPosts();
  const createComment = useCreateComment();
  const upvotePost = useUpvotePost();
  const downvotePost = useDownvotePost();
  const createPayment = usePayment();
  const followPost = useFollowPost();
  const observer = useRef();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserId(userData._id);
    }
  }, []);

  useEffect(() => {
    // Initialize comments from posts data
    if (posts?.success) {
      const initialComments = {};
      posts.data.forEach((post) => {
        initialComments[post._id] = post.comments || [];
      });
      setComments(initialComments);
    }
  }, [posts]);

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

  const truncateContent = (content, postId) => {
    if (!content) return "";
    if (content.length <= MAX_CONTENT_LENGTH || expandedPosts[postId]) {
      return content;
    }
    return `${content.slice(0, MAX_CONTENT_LENGTH)}...`;
  };

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
    const commentText = newComments[postId]?.trim();

    if (commentText) {
      try {
        const commentData = {
          postId: postId,
          content: commentText,
        };
        const response = await createComment(commentData);

        // Update local comments state
        setComments((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), response.data],
        }));

        // Clear the comment input for this post
        setNewComments((prev) => ({
          ...prev,
          [postId]: "",
        }));

        // Automatically expand comments after posting
        setExpandedComments((prev) => ({
          ...prev,
          [postId]: true,
        }));

        // Refresh posts data
        mutate();
      } catch (error) {
        console.error("Failed to post comment:", error.message);
      }
    }
  };

  const handleCommentChange = (postId, value) => {
    setNewComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleUpvote = async (postId) => {
    try {
      await upvotePost(postId);
      mutate(); // Refresh posts data
    } catch (error) {
      console.error("Failed to upvote the post:", error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await downvotePost(postId);
      mutate(); // Refresh posts data
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
      mutate(); // Refresh posts data
    } catch (error) {
      console.error("Failed to follow the author:", error.message);
    }
  };

  const blogPosts = sortedPosts();

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
          ? post.PaidByUserPostId?.includes(userId)
          : true;
        const lastPost = blogPosts.length === index + 1;
        const truncatedContent = truncateContent(post.content, post._id);
        const postComments = comments[post._id] || [];

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
              <div className="relative p-4 border rounded-lg">
                <div className="blur-sm">
                  <div className="px-4 py-2">
                    <p>This content is premium. Please pay to see it.</p>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => handlePayToSee(post._id)}
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-blue-600 transition duration-300 z-10">
                    <Lock size={20} />
                    <span>Pay to Unlock Content</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="px-4 py-2">
                  <div className="post-content break-words whitespace-pre-wrap">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(truncatedContent),
                      }}
                    />
                    {post.content.length > MAX_CONTENT_LENGTH && (
                      <button
                        onClick={() => toggleExpand(post._id)}
                        className="text-blue-500 hover:underline mt-2">
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}
                  </div>
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
                  <span>{postComments.length} comments</span>
                </div>

                <div className="px-4 py-2 border-t border-gray-200 flex justify-around">
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-500"
                    onClick={() => handleUpvote(post._id)}>
                    <ThumbsUp size={20} />
                    <span>Upvote</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-500"
                    onClick={() => handleDownvote(post._id)}>
                    <ThumbsDown size={20} />
                    <span>Downvote</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 text-gray-600 hover:text-green-500"
                    onClick={() => toggleCommentExpand(post._id)}>
                    <MessageCircle size={20} />
                    <span>
                      {areCommentsExpanded ? "Hide Comments" : "Show Comments"}
                    </span>
                  </button>
                </div>

                <div className="px-4 py-2 border-t border-gray-200">
                  <form
                    onSubmit={(e) => handleCommentSubmit(e, post._id)}
                    className="w-full flex items-center">
                    <input
                      type="text"
                      value={newComments[post._id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post._id, e.target.value)
                      }
                      className="border border-gray-300 rounded-md p-2 w-full mr-2"
                      placeholder="Add a comment..."
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                      Comment
                    </button>
                  </form>
                </div>

                {areCommentsExpanded && (
                  <div className="px-4 py-2">
                    {postComments.map((comment) => (
                      <div
                        key={comment._id}
                        className="border-b border-gray-200 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <Image
                            src="/api/placeholder/24/24"
                            alt="Commenter Avatar"
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <p className="font-semibold text-sm text-gray-600">
                            {comment.authorName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                          </p>
                        </div>
                        <p className="ml-8 text-gray-700">{comment.content}</p>
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
