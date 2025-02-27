import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import axios from "axios"

const Profile = () => {
  const { user, updateUser, logout } = useAuth(); // Assuming you have updateUser function in AuthContext
  const [formData, setFormData] = useState({
    fullName: user?.fullName,
    email: user?.email,
    phone: user?.phone || '',
    password: '',
  });

  console.log(formData);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('fullName', formData.fullName);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('password', formData.password);
    // if (file) data.append('userImage', file);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(`${process.env.REACT_APP_API_URL}/auth/${user._id}`,
        data,
        config
      );

      updateUser(response.data);
      // Reset form or show success message
    } catch (error) {
      console.error('Update failed:', error.response?.data?.message);
    }
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
                value={formData?.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="number"
                name="phone"
                value={formData?.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
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
