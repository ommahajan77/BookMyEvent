const Event = require("../models/Event");
const Booking = require("../models/Booking");
const User = require("../models/User");

// @desc    Create new event
// @route   POST /api/admin/events
// @access  Private/Admin
const createEvent = async (req, res, next) => {
  try {
    const { title, description, location, date, time, price, totalSeats, category } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      date,
      time,
      price,
      totalSeats,
      availableSeats: totalSeats,
      category,
      poster: req.file ? { url: req.file.path, public_id: req.file.filename } : undefined,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    const fields = ["title", "description", "location", "date", "time", "price", "category"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) event[f] = req.body[f];
    });

    if (req.body.totalSeats) {
      const diff = Number(req.body.totalSeats) - event.totalSeats;
      event.totalSeats = Number(req.body.totalSeats);
      event.availableSeats += diff;
    }

    if (req.file) {
      event.poster = { url: req.file.path, public_id: req.file.filename };
    }

    const updated = await event.save();
    res.json({ success: true, event: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    await event.deleteOne();
    res.json({ success: true, message: "Event deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events (admin list, no pagination limits)
// @route   GET /api/admin/events
// @access  Private/Admin
const getAllEventsAdmin = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("event", "title date location")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Dashboard analytics summary
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments({ bookingStatus: "confirmed" });

    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // Revenue trend by month (last 6 months)
    const revenueByMonth = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Bookings per category
    const bookingsByCategory = await Booking.aggregate([
      { $lookup: { from: "events", localField: "event", foreignField: "_id", as: "eventInfo" } },
      { $unwind: "$eventInfo" },
      { $group: { _id: "$eventInfo.category", count: { $sum: 1 } } },
    ]);

    const upcomingEvents = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5);

    const latestBookings = await Booking.find()
      .populate("event", "title")
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: { totalUsers, totalEvents, totalBookings, totalRevenue },
      revenueByMonth,
      bookingsByCategory,
      upcomingEvents,
      latestBookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEventsAdmin,
  getAllBookings,
  getAllUsers,
  deleteUser,
  getAnalytics,
};
