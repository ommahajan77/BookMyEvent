const express = require("express");
const router = express.Router();
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEventsAdmin,
  getAllBookings,
  getAllUsers,
  deleteUser,
  getAnalytics,
} = require("../controllers/adminController");
const { protect, admin } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.use(protect, admin);

router.get("/analytics", getAnalytics);

router.get("/events", getAllEventsAdmin);
router.post("/events", upload.single("poster"), createEvent);
router.put("/events/:id", upload.single("poster"), updateEvent);
router.delete("/events/:id", deleteEvent);

router.get("/bookings", getAllBookings);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

module.exports = router;
