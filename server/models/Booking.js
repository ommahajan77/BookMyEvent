const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    selectedSeats: { type: [String], required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    ticketQR: { type: String, default: "" },
    bookingId: { type: String, unique: true, default: () => uuidv4() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
