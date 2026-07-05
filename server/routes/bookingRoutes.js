const express = require("express");
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  downloadTicket,
} = require("../controllers/bookingController");
const { protect } = require("../middlewares/auth");

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id/ticket", protect, downloadTicket);

module.exports = router;
