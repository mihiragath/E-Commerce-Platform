"use client";

import React, { useState, useEffect } from "react";
import { Edit, Trash, X } from "lucide-react";
import { deleteUser, getAllUsers, updateUserRole } from "../../../actions/user";

const UsersPage = () => {
  const [usersPage, setUsersPage] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersData = await getAllUsers();
        setUsersPage(usersData || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedUser) return;
    try {
      const updated = await updateUserRole(selectedUser.id, newRole);
      if (!updated) {
        alert("❌ Failed to update user role");
        return;
      }

      setUsersPage((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, role: newRole } : user
        )
      );

      alert("✅ User role updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("❌ Error updating role: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        const result = await deleteUser(id); 
        if (!result) {
          alert("❌ Failed to delete user");
          return;
        }

        setUsersPage((prev) => prev.filter((user) => user.id !== id));
        alert("✅ User deleted successfully");
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("❌ Error deleting user: " + error.message);
      }
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="py-3 px-6 border-b">ID</th>
              <th className="py-3 px-6 border-b">Name</th>
              <th className="py-3 px-6 border-b">Email</th>
              <th className="py-3 px-6 border-b">Role</th>
              <th className="py-3 px-6 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(usersPage) && usersPage.length > 0 ? (
              usersPage.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-6 border-b">{user.id}</td>
                  <td className="py-3 px-6 border-b">{user.name}</td>
                  <td className="py-3 px-6 border-b">{user.email}</td>
                  <td className="py-3 px-6 border-b">{user.role}</td>
                  <td className="py-3 px-6 border-b text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Role Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Role</h2>
            <p className="mb-2">
              {selectedUser.name} - {selectedUser.email}
            </p>

            <select
              className="w-full border px-3 py-2 rounded mb-4"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
