const Event = require("../models/Event");

// @desc    Get all events (search, filter, pagination)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res, next) => {
  try {
    const { keyword, category, location, sort, page = 1, limit = 9 } = req.query;

    const query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    let sortOption = { date: 1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({
      success: true,
      count: events.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

module.exports = { getEvents, getEventById };
