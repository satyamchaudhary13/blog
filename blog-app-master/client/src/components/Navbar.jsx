import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SidebarNavbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  // Create a separate variable for the profile picture URL
  const profilePictureUrl = profilePicture ? `${apiUrl}${profilePicture}` : null;

  useEffect(() => {
    // This effect will run whenever the 'user' item in localStorage changes.
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.username);
      setProfilePicture(user.profilePicture); // Set the profile picture URL
    }
  }, [localStorage.getItem("user")]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUsername(null);
    setProfilePicture(null);
    navigate("/login");
  };

  return (
    <div className="flex">
      <nav className="bg-gradient-to-r from-purple-600 to-teal-500 w-64 h-full p-6 fixed left-0 top-0 shadow-lg">
        <div className="text-white text-3xl font-bold mb-8">Blog</div>
        <ul className="space-y-6">
          <li>
            <Link to="/" className="hover:text-gray-200 transition duration-300 text-lg font-medium">
              Home
            </Link>
          </li>

          {!localStorage.getItem("token") ? (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-200 transition duration-300 text-lg font-medium">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-200 transition duration-300 text-lg font-medium">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/create-post" className="hover:text-gray-200 transition duration-300 text-lg font-medium">
                  Create Post
                </Link>
              </li>
              <li className="flex items-center space-x-3">
                {profilePictureUrl && (
                  <img
                    src={profilePictureUrl}
                    alt="Profile Picture"
                    className="w-10 h-10 rounded-full border-2 border-white"
                  />
                )}
                <span className="text-gray-100 font-medium text-lg">Welcome, {username}!</span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 transition duration-300 py-2 px-6 rounded-md text-white text-lg"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Content Area */}
      <div className="ml-64 p-8 w-full">
        {/* Your content goes here */}
      </div>
    </div>
  );
}

export default SidebarNavbar;
