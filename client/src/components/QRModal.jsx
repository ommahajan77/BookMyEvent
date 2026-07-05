import React from "react";
import { FiX, FiDownload } from "react-icons/fi";

const QRModal = ({ booking, onClose, onDownload }) => {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 relative text-center">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <FiX className="text-xl" />
        </button>

        <h3 className="text-lg font-bold mb-1">Your E-Ticket</h3>
        <p className="text-sm text-gray-500 mb-4">Booking ID: {booking.bookingId}</p>

        {booking.ticketQR ? (
          <img src={booking.ticketQR} alt="QR Ticket" className="mx-auto w-48 h-48 border rounded-lg" />
        ) : (
          <p className="text-gray-400">QR not available yet</p>
        )}

        <p className="mt-4 text-sm text-gray-600">Seats: {booking.selectedSeats?.join(", ")}</p>

        <button onClick={onDownload} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
          <FiDownload /> Download Ticket PDF
        </button>
      </div>
    </div>
  );
};

export default QRModal;
