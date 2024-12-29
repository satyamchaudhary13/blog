import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineInfoCircle } from "react-icons/ai";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [formProgress, setFormProgress] = useState(0); // Dynamic progress bar
  const [errors, setErrors] = useState({});
  const apiUrl = import.meta.env.VITE_API_URL;

  // Handle real-time validation
  const validateField = (field, value) => {
    switch (field) {
      case "username":
        return value.length >= 3 ? null : "Username must be at least 3 characters.";
      case "email":
        return /\S+@\S+\.\S+/.test(value) ? null : "Enter a valid email address.";
      case "password":
        return value.length >= 6 ? null : "Password must be at least 6 characters.";
      default:
        return null;
    }
  };

  useEffect(() => {
    // Calculate form completion percentage
    const completedFields = Object.values(formData).filter((value) => value).length;
    setFormProgress((completedFields / 3) * 100);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (profilePicture) data.append("profilePicture", profilePicture);

    try {
      await axios.post(`${apiUrl}/api/auth/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Registration successful!");
    } catch (err) {
      alert("Error: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="relative w-full max-w-lg p-8 bg-white/30 backdrop-blur-md rounded-3xl shadow-xl">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-3xl overflow-hidden">
          <div
            className="h-2 bg-gradient-to-r from-teal-500 to-blue-500 transition-all"
            style={{ width: `${formProgress}%` }}
          ></div>
        </div>

        <h2 className="text-4xl font-extrabold text-center text-white mb-8">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="relative group">
            <label htmlFor="username" className="flex items-center space-x-2 text-white">
              <span>Username</span>
              <AiOutlineInfoCircle className="text-lg group-hover:animate-spin" />
            </label>
            <input
              name="username"
              type="text"
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-4 rounded-lg bg-white/90 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 ${
                errors.username ? "focus:ring-red-300" : "focus:ring-teal-300"
              }`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="relative group">
            <label htmlFor="email" className="flex items-center space-x-2 text-white">
              <span>Email</span>
              <AiOutlineInfoCircle className="text-lg group-hover:animate-spin" />
            </label>
            <input
              name="email"
              type="email"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-4 rounded-lg bg-white/90 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 ${
                errors.email ? "focus:ring-red-300" : "focus:ring-teal-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative group">
            <label htmlFor="password" className="flex items-center space-x-2 text-white">
              <span>Password</span>
              <AiOutlineInfoCircle className="text-lg group-hover:animate-spin" />
            </label>
            <input
              name="password"
              type="password"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-4 rounded-lg bg-white/90 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 ${
                errors.password ? "focus:ring-red-300" : "focus:ring-teal-300"
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Profile Picture Drag & Drop */}
          <div className="relative group p-4 border-dashed border-2 border-gray-300 rounded-lg bg-white/90">
            <input
              name="profilePicture"
              type="file"
              id="profilePicture"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept="image/*"
              onChange={handleFileChange}
            />
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-16 h-16 mx-auto rounded-full object-cover"
              />
            ) : (
              <p className="text-center text-gray-500">Drag & drop or click to upload profile picture</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-teal-400 via-blue-500 to-indigo-600 text-white font-bold text-lg rounded-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
