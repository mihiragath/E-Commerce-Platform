"use client";

import { useEffect, useState } from "react";
import { Edit, Trash, Check, X } from "lucide-react";
import { deleteUser, getAllUsers, updateUserRole } from "../../../actions/user";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingRole, setEditingRole] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  const startEdit = (user) => {
    setEditingUserId(user.id);
    setEditingRole(user.role);
  };

  const cancelEdit = () => {
    setEditingUserId(null);
    setEditingRole("");
  };

  const saveRole = async (userId) => {
    try {
      const updated = await updateUserRole(userId, editingRole);
      if (!updated) {
        alert("❌ Failed to update role");
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: editingRole } : u))
      );

      setEditingUserId(null);
      alert("✅ Role updated");
    } catch (error) {
      console.error(error);
      alert("❌ Error updating role");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const result = await deleteUser(id);
      if (!result) {
        alert("❌ Failed to delete user");
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert("✅ User deleted");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Users</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-6">ID</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 border-b">
                  <td className="py-3 px-6">{user.id}</td>
                  <td className="py-3 px-6">{user.name}</td>
                  <td className="py-3 px-6">{user.email}</td>

                  {/* ROLE COLUMN */}
                  <td className="py-3 px-6">
                    {editingUserId === user.id ? (
                      <select
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-6 flex justify-center gap-2">
                    {editingUserId === user.id ? (
                      <>
                        <button
                          onClick={() => saveRole(user.id)}
                          className="text-green-600"
                        >
                          <Check size={18} />
                        </button>
                        <button onClick={cancelEdit} className="text-gray-500">
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(user)}
                          className="text-blue-500"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-500"
                        >
                          <Trash size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
