import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMapPin, FiCalendar, FiClock } from "react-icons/fi";
import Loader from "../components/Loader";
import SeatPicker from "../components/SeatPicker";
import * as eventService from "../services/eventService";
import { useAuth } from "../context/AuthContext";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await eventService.getEventById(id);
        setEvent(data.event);
      } catch (err) {
        toast.error("Event not found");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleProceed = () => {
    if (!user) {
      toast.error("Please login to book tickets");
      navigate("/login", { state: { from: `/events/${id}` } });
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat");
      return;
    }
    navigate("/checkout", { state: { eventId: id, selectedSeats } });
  };

  if (loading) return <Loader />;
  if (!event) return <p className="text-center py-20 text-gray-500">Event not found.</p>;

  const dateStr = new Date(event.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="h-72 bg-gray-100 rounded-xl overflow-hidden">
          {event.poster?.url ? (
            <img src={event.poster.url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-primary-50">
              <FiCalendar className="text-5xl" />
            </div>
          )}
        </div>

        <div>
          <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            {event.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-4">{event.title}</h1>

          <div className="space-y-2 text-gray-600 mb-4">
            <div className="flex items-center gap-2"><FiMapPin /> {event.location}</div>
            <div className="flex items-center gap-2"><FiCalendar /> {dateStr}</div>
            <div className="flex items-center gap-2"><FiClock /> {event.time}</div>
          </div>

          <p className="text-gray-700 mb-6">{event.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">₹{event.price} <span className="text-sm font-normal text-gray-500">/ seat</span></span>
            <span className="text-sm text-gray-500">{event.availableSeats} of {event.totalSeats} seats available</span>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-bold mb-6">Select Your Seats</h2>
        <SeatPicker
          totalSeats={event.totalSeats}
          bookedSeats={event.bookedSeats}
          selectedSeats={selectedSeats}
          setSelectedSeats={setSelectedSeats}
        />

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          <div>
            <p className="text-sm text-gray-500">Selected: {selectedSeats.join(", ") || "None"}</p>
            <p className="text-lg font-bold">Total: ₹{selectedSeats.length * event.price}</p>
          </div>
          <button onClick={handleProceed} className="btn-primary">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
