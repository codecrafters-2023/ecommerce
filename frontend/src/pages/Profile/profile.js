import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";

const Profile = () => {
  const { user, updateUser, logout } = useAuth(); // Assuming you have updateUser function in AuthContext
  const [formData, setFormData] = useState({
    fullname: user?.fullName || "",
    email: user?.email || "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData); // Call update function (should be defined in AuthContext)
    alert("Profile updated successfully!");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center">
            <FaUserCircle className="text-gray-400 text-7xl" />
            <h2 className="text-2xl font-semibold text-gray-800 mt-2">{user?.fullName}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">New Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              Save Changes
            </button>
          </form>

          <div className="border-t border-gray-200 my-6"></div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
