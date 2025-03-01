// components/UserManagement.js
import React, { useState, useEffect } from 'react';
import { getUsers, updateUser, deleteUser } from '../../../context/userContext';
import "./index.css"
import AdminSidebar from '../../components/Navbar'
import ReactPaginate from 'react-paginate';
import { toast } from 'react-toastify';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      const backendPage = currentPage + 1; // Convert to 1-based index for backend
      const data = await getUsers(backendPage, itemsPerPage);

      console.log('API Response:', data); // Debug log

      setUsers(data.users);
      setTotalPages(data.totalPages);
      setTotalUsers(data.totalUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setItemsPerPage(newSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser._id, editingUser);
      setEditingUser(null);
      await fetchUsers();
      toast.success('User Updated successfully')
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    // if (window.confirm('Are you sure you want to delete this user?')) {
    // }
      try {
        await deleteUser(id);
        await fetchUsers();
        toast.success('User deleted successfully')
      } catch (err) {
        console.error(err);
      }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  return (
    <>
      <AdminSidebar />
      <div className="user-management">
        <div className="management-header">
          <h2>User Management</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {user.avatar ?
                          <img src={user.avatar} alt={user.fullName}
                            style={{ borderRadius: "50%" }}
                          />
                          :
                          user.fullName.charAt(0)
                        }
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.phone}
                  </td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <div className="actions-container">
                      <button
                        className="edit-btn"
                        onClick={() => setEditingUser(user)}
                      >
                        <i className="fas fa-edit"></i>
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(user._id)}
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-wrapper">
          <div className="pagination-info">
            Showing {(currentPage * itemsPerPage) + 1} -{' '}
            {Math.min((currentPage + 1) * itemsPerPage, totalUsers)} of {totalUsers}
          </div>

          <ReactPaginate
            breakLabel="..."
            nextLabel="Next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={totalPages}
            forcePage={currentPage} // Add this line
            previousLabel="< Previous"
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
          />

          <div className="page-size-selector">
            <select
              value={itemsPerPage}
              onChange={handlePageSizeChange}
            >
              {[5, 10, 20, 50].map(size => (
                <option key={size} value={size}>Show {size}</option>
              ))}
            </select>
          </div>
        </div>


        {/* =========User Update Form============== */}
        {editingUser && (
          <div className="edit-modal-overlay">
            <div className="edit-modal">
              <h3>Edit User</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={editingUser.fullName}
                    onChange={e => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="number"
                    value={editingUser.phone}
                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )} */}
      </div>
    </>
  );
};

export default UserManagement;