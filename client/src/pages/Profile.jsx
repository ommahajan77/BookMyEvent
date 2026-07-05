import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import * as authService from "../services/authService";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (avatarFile) formData.append("avatar", avatarFile);
      const { data } = await authService.updateProfile(formData);
      updateUser(data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwSaving(true);
    try {
      await authService.changePassword(pwForm);
      toast.success("Password changed successfully");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Profile Details</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center overflow-hidden border">
              {user?.avatar?.url ? (
                <img src={user.avatar.url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <FiUser className="text-2xl text-primary-400" />
              )}
            </div>
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} className="text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input value={user?.email} disabled className="input-field bg-gray-100 cursor-not-allowed" />
          </div>

          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            type="password" required placeholder="Current password"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            className="input-field"
          />
          <input
            type="password" required minLength={6} placeholder="New password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            className="input-field"
          />
          <button type="submit" disabled={pwSaving} className="btn-primary">
            {pwSaving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
