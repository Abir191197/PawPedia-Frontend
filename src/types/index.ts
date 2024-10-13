import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};




interface PetPost {
  href: string | undefined;
  id: string; // Unique identifier for the post
  authorId: string; // ID of the author
  title: string; // Title of the post
  content: string; // Content of the post
  category: "Tip" | "Story"; // Category of the post
  isPremium: boolean; // Indicates if the post is premium
  PremiumAmount: number;
  images: string[]; // Array of image URLs
  createdAt: Date; // Creation date of the post
  updatedAt: Date; // Last updated date of the post
  upvote: number; // Number of upvotes
  downvote: number; // Number of downvotes
}

// Interface for a comment
interface Comment {
  _id: string;
  id: string; // Unique identifier for the comment
  postId: string; // ID of the post the comment belongs to
  authorId: string; // ID of the author of the comment
  content: string; // Content of the comment
  createdAt: Date; // Creation date of the comment
  updatedAt: Date; // Last updated date of the comment
}

// Interface representing a pet post along with its comments
export interface IPetPost {
  _id: string | null | undefined;
  post: PetPost; // The pet post
  comments: Comment[]; // Array of comments associated with the post
}

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: string;
}
