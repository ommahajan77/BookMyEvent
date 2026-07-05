import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as authService from "../services/authService";
import { useAuth } from "../context/AuthContext";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.resetPassword(token, { password });
      toast.success("Password reset successful. Please login again.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password" required minLength={6} value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field" placeholder="New password"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
