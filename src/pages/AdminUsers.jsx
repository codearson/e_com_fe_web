import React, { useState, useEffect } from "react";
import { fetchUsers, updateUserStatus, saveUser, updateUser, updatePassword } from "../API/UserApi";
import { fetchUserRoles } from "../API/UserRoleApi";
import { FaLock, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import AdminLayout from "../components/AdminLayout";

export const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userRoles, setUserRoles] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(true);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    mobileNumber: "",
    whatsappNumber: "",
    address: "",
    userRoleDto: { id: null },
    isActive: 1
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    loadUsers();
    loadUserRoles();
  }, [currentPage, pageSize, selectedStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await fetchUsers(currentPage, pageSize, selectedStatus);
      setUsers(result.payload);
      setTotalRecords(result.totalRecords);
    } catch (err) {
      setError("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRoles = async () => {
    try {
      const roles = await fetchUserRoles();
      setUserRoles(roles);
    } catch (err) {
      console.error("Failed to load user roles:", err);
    }
  };

  const handleStatusToggle = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      loadUsers();
    } catch (err) {
      console.error("Failed to update user status:", err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const result = await saveUser(newUser);
      setFormLoading(false);
      if (result && !result.errorDescription) {
        setShowAddModal(false);
        loadUsers();
        setNewUser({
          firstName: "",
          lastName: "",
          emailAddress: "",
          password: "",
          mobileNumber: "",
          whatsappNumber: "",
          address: "",
          userRoleDto: { id: null },
          isActive: 1
        });
        setConfirmPassword("");
      } else {
        setFormError(result.errorDescription || "Failed to add user");
      }
    } catch (err) {
      setFormLoading(false);
      setFormError("Failed to add user");
      console.error(err);
    }
  };

  // Edit User Handlers
  const openEditModal = (user) => {
    setEditUser(user);
    setEditForm({ ...user, userRoleDto: { ...user.userRoleDto } });
    setShowEditModal(true);
    setEditError("");
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditUser(null);
    setEditForm({});
    setEditError("");
  };
  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleEditRoleChange = (id) => {
    setEditForm((prev) => ({ ...prev, userRoleDto: { id: Number(id) } }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    try {
      const result = await updateUser(editForm);
      setEditLoading(false);
      if (result && !result.errorDescription) {
        closeEditModal();
        loadUsers();
      } else {
        setEditError(result?.errorDescription || "Failed to update user");
      }
    } catch (err) {
      setEditLoading(false);
      setEditError("Failed to update user");
    }
  };
  // Change Password Handlers
  const openPasswordModal = (user) => {
    setPasswordUser(user);
    setShowPasswordModal(true);
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
  };
  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordUser(null);
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      const changedByUserId = passwordUser?.id;
      const result = await updatePassword(passwordUser.id, newPassword, changedByUserId);
      setPasswordLoading(false);
      if (result && !result.errorDescription) {
        closePasswordModal();
        loadUsers();
      } else {
        setPasswordError(result?.errorDescription || "Failed to update password");
      }
    } catch (err) {
      setPasswordLoading(false);
      setPasswordError("Failed to update password");
    }
  };

  // Filtered users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.mobileNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? user.userRoleDto?.id === Number(roleFilter) : true;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-[#1E90FF] transition-colors"
              >
                <IoArrowBack className="w-5 h-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedStatus.toString()}
                onChange={(e) => setSelectedStatus(e.target.value === "true")}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-[#1E90FF] font-semibold bg-white hover:bg-[#e6f3ff]"
                style={{ minWidth: 120 }}
              >
                <option value="true" className="text-[#1E90FF] font-semibold">Active</option>
                <option value="false" className="text-[#1E90FF] font-semibold">Inactive</option>
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#1E90FF] text-white px-4 py-2 rounded-md hover:bg-[#1876cc] transition-colors font-medium text-base"
              >
                Add New User
              </button>
            </div>
          </div>

          {/* Add filter bar above the table */}
          <div className="flex flex-wrap gap-4 mb-4 items-center">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-2 min-w-[180px] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
            />
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="border rounded px-3 py-2 min-w-[160px] focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
            >
              <option value="">Select Role</option>
              {userRoles.map(role => (
                <option key={role.id} value={role.id}>{role.userRole}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.emailAddress}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-800">{user.address || 'N/A'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-purple-600 text-white">
                              {user.userRoleDto?.userRole}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleStatusToggle(user.id, !user.isActive)}
                              className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none ${user.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                              aria-pressed={user.isActive}
                            >
                              <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full shadow transition-transform ${user.isActive ? 'translate-x-4' : 'translate-x-1'}`}
                              />
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap flex gap-2 items-center">
                            <button className="border border-gray-300 rounded-md p-1.5 hover:bg-gray-100 text-sm" title="Lock" onClick={() => openPasswordModal(user)}>
                              <FaLock className="text-gray-500 w-4 h-4" />
                            </button>
                            <button className="border border-gray-300 rounded-md p-1.5 hover:bg-gray-100 text-sm" title="Edit" onClick={() => openEditModal(user)}>
                              <FaEdit className="text-[#1E90FF] w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Section - Remove results text and per page dropdown */}
              <div className="flex justify-end items-center mt-6 px-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border rounded-md disabled:opacity-50 text-sm flex items-center gap-1 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>
                  <span className="px-3 py-1 text-sm text-gray-700">
                    Page {currentPage} of {Math.ceil(totalRecords / pageSize)}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * pageSize >= totalRecords}
                    className="px-3 py-1.5 border rounded-md disabled:opacity-50 text-sm flex items-center gap-1 hover:bg-gray-50"
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg w-full max-w-2xl mx-4 flex flex-col max-h-[90vh] shadow-xl">
            {/* Modal Header - Fixed */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-900">Add New User</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto relative">
              {/* Overlay for loading and error */}
              {(formLoading || formError) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/60 backdrop-blur-sm">
                  {formLoading && (
                    <div className="flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    </div>
                  )}
                  {formError && !formLoading && (
                    <div className="bg-white rounded-lg shadow-lg px-6 py-4 text-center">
                      <div className="text-red-600 font-semibold text-lg mb-2">{formError}</div>
                      <button
                        className="mt-2 px-3 py-1.5 bg-[#1E90FF] text-white rounded-md hover:bg-[#1876cc] transition-colors text-sm"
                        onClick={() => setFormError("")}
                      >
                        OK
                      </button>
                    </div>
                  )}
                </div>
              )}
              <form id="addUserForm" onSubmit={handleAddUser} className={`space-y-6 ${formLoading || formError ? 'pointer-events-none filter blur-sm select-none' : ''}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={newUser.mobileNumber}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewUser({
                          ...newUser,
                          mobileNumber: value,
                          whatsappNumber: value
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={newUser.emailAddress}
                      onChange={(e) => setNewUser({...newUser, emailAddress: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={newUser.address}
                      onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={newUser.userRoleDto.id || ""}
                      onChange={(e) => setNewUser({
                        ...newUser,
                        userRoleDto: { id: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                      required
                    >
                      <option value="">Choose Role</option>
                      {userRoles.map(role => (
                        <option key={role.id} value={role.id}>
                          {role.userRole}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          ) : (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        tabIndex={-1}
                      >
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {showConfirmPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          ) : (
                            <>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer - Fixed */}
            <div className={`border-t px-6 py-4 flex justify-end gap-3 ${formLoading || formError ? 'pointer-events-none filter blur-sm select-none' : ''}`}>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="addUserForm"
                className="px-3 py-1.5 bg-[#1E90FF] text-white rounded-md hover:bg-[#1876cc] transition-colors text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg w-full max-w-lg mx-4 flex flex-col max-h-[90vh] shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-900">Edit User</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input type="text" value={editForm.firstName || ""} onChange={e => handleEditChange("firstName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input type="text" value={editForm.lastName || ""} onChange={e => handleEditChange("lastName", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input type="tel" value={editForm.mobileNumber || ""} onChange={e => handleEditChange("mobileNumber", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value={editForm.emailAddress || ""} onChange={e => handleEditChange("emailAddress", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" value={editForm.address || ""} onChange={e => handleEditChange("address", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select value={editForm.userRoleDto?.id || ""} onChange={e => handleEditRoleChange(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white" required>
                      <option value="">Choose Role</option>
                      {userRoles.map(role => (
                        <option key={role.id} value={role.id}>{role.userRole}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {editError && <div className="text-red-600 text-center font-semibold">{editError}</div>}
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={closeEditModal} className="px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#1E90FF] text-white rounded-md hover:bg-[#1876cc] transition-colors text-sm">Update</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg w-full max-w-md mx-4 flex flex-col max-h-[90vh] shadow-xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-900">Change Password</h2>
              <button onClick={closePasswordModal} className="text-gray-400 hover:text-gray-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="Enter new password" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowNewPassword(v => !v)} tabIndex={-1}>
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showNewPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmNewPassword ? "text" : "password"} value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required placeholder="Confirm new password" />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmNewPassword(v => !v)} tabIndex={-1}>
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {showConfirmNewPassword ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        ) : (
                          <>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
                {passwordError && <div className="text-red-600 text-center font-semibold">{passwordError}</div>}
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={closePasswordModal} className="px-3 py-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors text-sm">Cancel</button>
                  <button type="submit" className="px-3 py-1.5 bg-[#1E90FF] text-white rounded-md hover:bg-[#1876cc] transition-colors text-sm">Update Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};