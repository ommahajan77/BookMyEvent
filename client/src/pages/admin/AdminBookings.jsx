import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import * as adminService from "../../services/adminService";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await adminService.getAllBookings();
        setBookings(data.bookings);
      } catch (err) {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <Loader />;

  const filtered = filter === "All" ? bookings : bookings.filter((b) => b.paymentStatus === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-48">
          {["All", "pending", "paid", "failed", "refunded"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Event</th>
              <th className="p-3">User</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b._id} className="border-t border-gray-100">
                <td className="p-3 font-mono text-xs">{b.bookingId}</td>
                <td className="p-3">{b.event?.title}</td>
                <td className="p-3">{b.user?.name}<br /><span className="text-xs text-gray-400">{b.user?.email}</span></td>
                <td className="p-3">{b.selectedSeats.join(", ")}</td>
                <td className="p-3">₹{b.totalAmount}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[b.paymentStatus]}`}>{b.paymentStatus}</span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
