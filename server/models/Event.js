const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    poster: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    totalSeats: { type: Number, required: true, min: 1 },
    availableSeats: { type: Number, required: true },
    bookedSeats: { type: [String], default: [] },
    category: {
      type: String,
      enum: ["Music", "Sports", "Theatre", "Conference", "Comedy", "Workshop", "Other"],
      default: "Other",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", location: "text", category: "text" });

module.exports = mongoose.model("Event", eventSchema);
