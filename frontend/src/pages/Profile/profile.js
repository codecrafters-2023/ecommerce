import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import axios from "axios"
import "./index.css"

const Profile = () => {
  const { user, updateUser, logout } = useAuth(); // Assuming you have updateUser function in AuthContext
  const [formData, setFormData] = useState({
    fullName: user?.fullName,
    email: user?.email,
    phone: user?.phone || '',
    password: '',
    confirmPassword: '',
  });


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (id) => {
  //   // e.preventDefault();

  //   console.log(id);


  //   const data = new FormData();
  //   data.append('fullName', formData.fullName);
  //   data.append('email', formData.email);
  //   data.append('phone', formData.phone);
  //   data.append('password', formData.password);
  //   // if (file) data.append('userImage', file);


  //   try {
  //     const config = {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };

  //     const response = await axios.put(`${process.env.REACT_APP_API_URL}/auth/userUpdate/${id}`,
  //       data,
  //       config
  //     );

  //     updateUser(response.data);
  //     // Reset form or show success message
  //   } catch (error) {
  //     console.error('Update failed:', error.response?.data?.message);
  //   }
  // };


  const handleSubmit = async (id) => {
    // e.preventDefault();
    console.log(id);
    

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (!formData.password) {
      const confirm = window.confirm('Are you sure you want to update without changing password?');
      if (!confirm) return;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/userUpdate/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // updateUser(response.data);
      console.log(response.data);
      
      alert('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
    } catch (error) {
      console.error('Update failed:', error);
      alert(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div >
      <Header />
      <div className="profile-content">
        <div className="profile-card">
          {/* Profile Header */}
          <div className="profile-header">
            <FaUserCircle className="profile-icon" />
            <h2 className="profile-name">{user?.fullName}</h2>
          </div>

          <div className="divider"></div>

          {/* Profile Form */}
          <div className="profile-form">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData?.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="number"
                name="phone"
                value={formData?.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn save-btn" onClick={() => handleSubmit(user._id)}>
              Save Changes
            </button>
          </div>

          <div className="divider"></div>

          {/* Logout Button */}
          <button onClick={logout} className="btn logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
