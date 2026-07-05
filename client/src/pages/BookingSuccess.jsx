import React from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { FiCheckCircle, FiDownload } from "react-icons/fi";
import toast from "react-hot-toast";
import * as bookingService from "../services/bookingService";

const BookingSuccess = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) return <Navigate to="/bookings" replace />;

  const handleDownload = async () => {
    try {
      const response = await bookingService.downloadTicket(booking._id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ticket-${booking.bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Could not download ticket");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <FiCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
      <p className="text-gray-500 mb-8">Your tickets have been booked successfully.</p>

      <div className="card p-6 text-left mb-8">
        <p className="text-sm text-gray-500 mb-1">Booking ID</p>
        <p className="font-mono font-semibold mb-4">{booking.bookingId}</p>

        {booking.ticketQR && (
          <div className="text-center mb-4">
            <img src={booking.ticketQR} alt="QR Ticket" className="w-40 h-40 mx-auto border rounded-lg" />
          </div>
        )}

        <p className="text-sm text-gray-500">Seats: <span className="font-medium text-gray-800">{booking.selectedSeats.join(", ")}</span></p>
        <p className="text-sm text-gray-500">Amount Paid: <span className="font-medium text-gray-800">₹{booking.totalAmount}</span></p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={handleDownload} className="btn-primary flex items-center justify-center gap-2">
          <FiDownload /> Download Ticket PDF
        </button>
        <Link to="/bookings" className="btn-outline text-center">View My Bookings</Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
