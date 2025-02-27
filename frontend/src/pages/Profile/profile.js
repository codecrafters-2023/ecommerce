import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/header";
import axios from "axios"
import "./index.css"
import { toast } from "react-toastify";

const Profile = () => {
  const { user, updateUser} = useAuth(); // Assuming you have updateUser function in AuthContext
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


  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{10,}$/;
    return regex.test(password);
};

  const handleSubmit = async (id) => {
    // e.preventDefault();
    console.log(id);
    

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (!isValidPassword(formData.password)) {
      toast.error('Password must be at least 8 characters long and include one uppercase letter, and one special character.');
      return;
  }

    // if (!formData.password) {
    //   const confirm = window.confirm('Are you sure you want to update without changing password?');
    //   if (!confirm) return;
    // }

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
      
      toast.success('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(error.response?.data?.message || 'Update failed');
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

        </div>
      </div>
    </div>
  );
};

export default Profile;
