import React, { useState } from "react";
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

  const user = localStorage.getItem("user");
  let userId = null;
  if (user) {
    const userData = JSON.parse(user);
    userId = userData._id;
    console.log(userId);
  }

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

  const handlePayToSee = async (postId: string) => {
    console.log("Payment id:", postId);
    try {
      const paymentData = await createPayment(postId);
      console.log("Payment successful for post:", postId);
      console.log(paymentData);
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
      // You might want to update the UI to reflect the new follow status
    } catch (error) {
      console.error("Failed to follow the author:", error.message);
    }
  };

  return (
    <div className="lg:max-w-full lg:mx-auto bg-white rounded-lg shadow-md overflow-hidden p-4">
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
            className="mb-12 p-6 bg-gray-50 rounded-lg shadow-lg">
            {/* Post header */}
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
                  {/* Blurred content */}
                  <div className="px-4 py-2">
                    <div
                      className="post-content break-words whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(post.content),
                      }}
                    />
                  </div>

                  {/* Blurred image */}
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

                  {/* Blurred stats */}
                  <div className="px-4 py-2 flex justify-between text-sm text-gray-500">
                    <span>
                      {post.upvote.length} likes • {post.downvote.length}{" "}
                      dislikes
                    </span>
                    <span>{post.comments?.length || 0} comments</span>
                  </div>

                  {/* Blurred actions */}
                  <div className="px-4 py-2 border-t border-gray-200 flex justify-around">
                    <button className="flex items-center space-x-2 text-gray-600">
                      <ThumbsUp size={20} />
                      <span>Upvote</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600">
                      <ThumbsDown size={20} />
                      <span>Dislike</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600">
                      <MessageCircle size={20} />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>

                {/* Pay to see button */}
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
                {/* Regular post content or premium content for author */}
                <div className="px-4 py-2">
                  <div
                    className="post-content break-words whitespace-pre-wrap"
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
                        className="text-blue-500 hover:text-blue-700 focus:outline-none">
                        See More
                      </button>
                    )}
                </div>

                {/* Regular post image */}
                {post?.images && post?.images.length > 0 && (
                  <Image
                    src={post?.images[0]}
                    alt="Post image"
                    className="w-full h-auto"
                    width={600}
                    height={400}
                  />
                )}

                {/* Regular post stats */}
                <div className="px-4 py-2 flex justify-between text-sm text-gray-500">
                  <span>
                    {post.upvote.length} likes • {post.downvote.length} dislikes
                  </span>
                  <span>{post.comments?.length || 0} comments</span>
                </div>

                {/* Regular post actions */}
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

                {/* Comments section */}
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
    </div>
  );
};

export default PostView;
