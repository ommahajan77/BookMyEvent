import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import * as eventService from "../services/eventService";
import * as bookingService from "../services/bookingService";
import * as paymentService from "../services/paymentService";
import { useAuth } from "../context/AuthContext";

// Dynamically loads the Razorpay checkout script
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) return resolve(true);
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { eventId, selectedSeats } = location.state || {};

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!eventId || !selectedSeats) {
      navigate("/events");
      return;
    }
    const fetchEvent = async () => {
      try {
        const { data } = await eventService.getEventById(eventId);
        setEvent(data.event);
      } catch (err) {
        toast.error("Unable to load event");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId, selectedSeats, navigate]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // 1. Create booking (reserves seats, pending payment)
      const { data: bookingData } = await bookingService.createBooking({ eventId, selectedSeats });
      const booking = bookingData.booking;

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay SDK failed to load. Check your connection.");
        setProcessing(false);
        return;
      }

      // 3. Create order on backend
      const { data: orderData } = await paymentService.createOrder(booking._id);

      // 4. Open Razorpay checkout
      const options = {
        key: orderData.key,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "BookMyEvent",
        description: event.title,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const { data: verifyData } = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            });
            toast.success("Payment successful! Ticket generated.");
            navigate("/booking-success", { state: { booking: verifyData.booking } });
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: function () {
            toast("Payment cancelled", { icon: "⚠️" });
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
      setProcessing(false);
    }
  };

  if (loading) return <Loader />;
  if (!event) return null;

  const totalAmount = selectedSeats.length * event.price;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="card p-8">
        <h1 className="text-xl font-bold mb-6">Checkout Summary</h1>

        <div className="space-y-3 mb-6 text-gray-700">
          <div className="flex justify-between"><span>Event</span><span className="font-medium">{event.title}</span></div>
          <div className="flex justify-between"><span>Location</span><span className="font-medium">{event.location}</span></div>
          <div className="flex justify-between"><span>Date</span><span className="font-medium">{new Date(event.date).toLocaleDateString()}</span></div>
          <div className="flex justify-between"><span>Seats</span><span className="font-medium">{selectedSeats.join(", ")}</span></div>
          <div className="flex justify-between"><span>Price per seat</span><span className="font-medium">₹{event.price}</span></div>
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold mb-8">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>

        <button onClick={handlePayment} disabled={processing} className="btn-primary w-full">
          {processing ? "Processing..." : `Pay ₹${totalAmount}`}
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Secured by Razorpay. Set your RAZORPAY_KEY_ID / SECRET in the backend .env to enable live/test payments.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
