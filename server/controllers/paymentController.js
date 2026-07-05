const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const generateQR = require("../utils/generateQR");

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const options = {
      amount: Math.round(booking.totalAmount * 100), // amount in paise
      currency: "INR",
      receipt: booking.bookingId,
    };

    const order = await razorpayInstance.orders.create(options);

    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalAmount,
      orderId: order.id,
      status: "created",
    });

    res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment signature & mark booking as paid
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    const payment = await Payment.findOne({ orderId: razorpay_order_id });
    const booking = await Booking.findById(bookingId).populate("event").populate("user");

    if (!isAuthentic) {
      if (payment) {
        payment.status = "failed";
        await payment.save();
      }
      if (booking) {
        booking.paymentStatus = "failed";
        await booking.save();
      }
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    if (payment) {
      payment.paymentId = razorpay_payment_id;
      payment.signature = razorpay_signature;
      payment.status = "success";
      await payment.save();
    }

    // Generate QR ticket
    const qrData = {
      bookingId: booking.bookingId,
      event: booking.event.title,
      seats: booking.selectedSeats,
      user: booking.user.name,
    };
    const qr = await generateQR(qrData);

    booking.paymentStatus = "paid";
    booking.ticketQR = qr;
    await booking.save();

    res.json({ success: true, message: "Payment verified successfully", booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment };
