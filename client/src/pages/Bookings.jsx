import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiMapPin, FiCalendar, FiDownload, FiXCircle } from "react-icons/fi";
import Loader from "../components/Loader";
import QRModal from "../components/QRModal";
import * as bookingService from "../services/bookingService";

const statusColor = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingService.getMyBookings();
      setBookings(data.bookings);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await bookingService.cancelBooking(id);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  const handleDownload = async (id, bookingId) => {
    try {
      const response = await bookingService.downloadTicket(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket-${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(err.response?.data?.message || "Download failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You haven't booked any events yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b._id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{b.event?.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><FiMapPin /> {b.event?.location}</span>
                  <span className="flex items-center gap-1"><FiCalendar /> {new Date(b.event?.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Seats: {b.selectedSeats.join(", ")} • Booking ID: {b.bookingId}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[b.paymentStatus]}`}>{b.paymentStatus}</span>
                  {b.bookingStatus === "cancelled" && (
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-200 text-gray-600">cancelled</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[140px]">
                <p className="font-bold text-right md:text-left">₹{b.totalAmount}</p>
                {b.paymentStatus === "paid" && b.bookingStatus === "confirmed" && (
                  <>
                    <button onClick={() => setSelected(b)} className="btn-outline text-sm">View QR</button>
                    <button onClick={() => handleDownload(b._id, b.bookingId)} className="btn-primary text-sm flex items-center justify-center gap-1">
                      <FiDownload /> Ticket PDF
                    </button>
                    <button onClick={() => handleCancel(b._id)} className="text-sm text-red-500 hover:underline flex items-center justify-center gap-1">
                      <FiXCircle /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <QRModal
          booking={selected}
          onClose={() => setSelected(null)}
          onDownload={() => handleDownload(selected._id, selected.bookingId)}
        />
      )}
    </div>
  );
};

export default Bookings;
