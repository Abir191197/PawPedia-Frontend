import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import "react-quill/dist/quill.snow.css"; // Import Quill's default "snow" theme CSS
import { useCreatePost } from "@/hooks/createPost"; // Custom hook for creating posts
import { User } from "@/types"; // Type definition for User
import Image from "next/image";

// Dynamically import react-quill to disable SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

// Quill toolbar and formats configuration
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "align",
  "link",
  "image",
  "color",
  "background",
];

const tagOptions = ["Tip", "Story"];
const PremiemTagsOptions = ["Free", "Paid"];

export default function CompactEditor() {
  const { register, handleSubmit } = useForm();
  const [content, setContent] = useState<string>(""); // State for the editor content
  const [tags, setTags] = useState<string>(""); // State for selected tags
  const [premierTags, setPremierTags] = useState<string>(""); // State for premium tags
  const [image, setImage] = useState<File | null>(null); // State for the selected image file
  const [user, setUser] = useState<User | null>(null); // State for user data
  const [loading, setLoading] = useState<boolean>(false); // Loading state for form submission
  const createPost = useCreatePost(); // Use the custom hook to create a post

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!user) {
      console.error("User not logged in.");
      return;
    }

    setLoading(true); // Set loading state to true when submission starts

    // Determine if the post is premium based on selected premium tag
    const isPremium = premierTags === "Paid"; // True if "Paid", false if "Free"

    // Create a JSON object for the post submission
    const postData = [
      {
        authorId: user._id, // User ID
        title: data.title, // Title from the input
        content: content, // Content from the editor
        category: tags, // Selected category
        isPremium: isPremium, // Premium status based on the selected tag
      },
    ];

    const formData = new FormData();
    formData.append("formData", JSON.stringify(postData)); // Append the JSON string
    if (image) {
      formData.append("file", image); // Append image file if exists
    }

    try {
      // Send the FormData to the backend
      const response = await createPost(formData);

      // Check the response and handle it
      if (response) {
        console.log("Post created successfully:", response);
        // Reset the form fields
        setContent("");
        setTags("");
        setImage(null);
        setPremierTags(""); // Reset premierTags as well
      }
    } catch (error) {
      console.error(
        "Failed to create post:",
        error instanceof Error ? error.message : String(error)
      );
    } finally {
      setLoading(false); // Set loading state back to false after submission is complete
    }
  };

  return (
    <div className="max-w-full p-4 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">
            Write the Title of the Post!!
          </label>
          <input
            id="title"
            type="text"
            placeholder="What's on your mind?"
            {...register("title", { required: true })} // Register the title input
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
          />
        </div>

        <div className="mb-4">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Share something..."
          />
        </div>

        <div className="mb-4">
          <select
            value={premierTags}
            onChange={(e) => setPremierTags(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md">
            <option value="" disabled>
              Want to premium the Post?
            </option>
            {PremiemTagsOptions.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <select
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md">
            <option value="" disabled>
              Select a tag
            </option>
            {tagOptions.map((tag, index) => (
              <option key={index} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-500 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-gray-100 file:text-indigo-600"
          />
          {image && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Selected: {image.name}</p>
              <Image
                src={URL.createObjectURL(image)} // Create object URL for image preview
                alt="Preview"
                className="mt-2 max-w-xs"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>

        {/* Show loading spinner or disable button while loading */}
        <button
          type="submit"
          disabled={loading} // Disable the button while loading
          className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {loading ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
}
