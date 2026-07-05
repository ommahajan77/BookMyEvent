const Booking = require("../models/Booking");
const Event = require("../models/Event");
const generateQR = require("../utils/generateQR");
const generateTicketPDF = require("../utils/generateTicketPDF");

// @desc    Create a booking (seats reserved, payment pending)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { eventId, selectedSeats } = req.body;

    if (!eventId || !selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({ success: false, message: "Event and seats are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    // Check seat availability
    const alreadyBooked = selectedSeats.filter((seat) => event.bookedSeats.includes(seat));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${alreadyBooked.join(", ")}`,
      });
    }

    if (event.availableSeats < selectedSeats.length) {
      return res.status(400).json({ success: false, message: "Not enough seats available" });
    }

    const totalAmount = event.price * selectedSeats.length;

    const booking = await Booking.create({
      user: req.user._id,
      event: event._id,
      selectedSeats,
      totalAmount,
      paymentStatus: "pending",
    });

    // Reserve seats immediately to prevent double-booking during checkout
    event.bookedSeats.push(...selectedSeats);
    event.availableSeats -= selectedSeats.length;
    await event.save();

    res.status(201).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date time location poster price")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    res.json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking (frees the seats)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    booking.bookingStatus = "cancelled";
    await booking.save();

    const event = await Event.findById(booking.event);
    if (event) {
      event.bookedSeats = event.bookedSeats.filter((s) => !booking.selectedSeats.includes(s));
      event.availableSeats += booking.selectedSeats.length;
      await event.save();
    }

    res.json({ success: true, message: "Booking cancelled", booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Download ticket as PDF
// @route   GET /api/bookings/:id/ticket
// @access  Private
const downloadTicket = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event").populate("user");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({ success: false, message: "Ticket unavailable until payment is complete" });
    }

    generateTicketPDF(res, booking, booking.event, booking.user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  downloadTicket,
};
