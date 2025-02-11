import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/posts`);
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiUrl}/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(posts.filter((post) => post._id !== postId)); // Update state locally
        alert("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-white min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-5xl font-semibold text-center text-gray-800 mb-12">Latest Blog Posts</h1>
        {loading ? (
          <div className="text-center mt-52">
            <div className="loader border-t-4 border-teal-600 rounded-full w-12 h-12 mx-auto mb-4 animate-spin"></div>
            <p className="text-gray-700">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white shadow-xl rounded-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                {post.image && (
                  <img
                    src={`${apiUrl}${post.image}`}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{post.content.substring(0, 150)}...</p>
                  <p className="text-gray-500 text-xs mt-2">
                    Published on: {new Date(post.createdAt).toLocaleDateString()} at{" "}
                    {new Date(post.createdAt).toLocaleTimeString()}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Read More
                    </Link>
                    {user && user.id === post.author._id && (
                      <div className="flex space-x-4">
                        <Link
                          to={`/edit/${post._id}`}
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-8">
            {user ? (
              <>
                <p className="text-gray-700 text-lg">No posts available. Create the first post now!</p>
                <Link
                  to="/create-post"
                  className="mt-4 inline-block bg-teal-600 text-white px-5 py-3 rounded-lg hover:bg-teal-700 transition duration-300"
                >
                  Create Post
                </Link>
              </>
            ) : (
              <p className="text-gray-700 text-lg">No posts available. Log in to create posts!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;


