import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import Loader from "../../components/Loader";
import * as adminService from "../../services/adminService";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await adminService.getAllUsers();
      setUsers(data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await adminService.deleteUser(id);
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-gray-100">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  {u.role !== "admin" && (
                    <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
