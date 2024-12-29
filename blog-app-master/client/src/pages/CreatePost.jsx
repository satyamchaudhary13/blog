import { useState } from "react";
import axios from "axios";

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null); // State for the image file
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in to create a post.");
        return;
      }

      // Create FormData to send text and file data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post(`${apiUrl}/api/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      if (response.status === 201) {
        alert("Post created successfully");
        setTitle("");
        setContent("");
        setImage(null);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      alert("An error occurred while creating the post.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Create a New Post</h2>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-2 border-gray-300 px-5 py-3 rounded-lg focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out"
            required
            placeholder="Enter your post title"
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border-2 border-gray-300 px-5 py-3 rounded-lg focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out"
            rows="6"
            required
            placeholder="Enter the content of your post"
          ></textarea>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border-2 border-gray-300 px-5 py-3 rounded-lg focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500 transition duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreatePost;

