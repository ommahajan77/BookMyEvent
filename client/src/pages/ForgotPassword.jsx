import React, { useState } from "react";
import toast from "react-hot-toast";
import * as authService from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setSent(true);
      toast.success("Reset link sent to your email");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-2">Forgot Password</h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your email and we'll send you a reset link.
        </p>
        {sent ? (
          <p className="text-center text-green-600">Check your inbox for the reset link.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field" placeholder="you@example.com"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
