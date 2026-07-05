import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin, FiCalendar } from "react-icons/fi";

const EventCard = ({ event }) => {
  const dateStr = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Link to={`/events/${event._id}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
      <div className="h-44 bg-gray-100 overflow-hidden">
        {event.poster?.url ? (
          <img
            src={event.poster.url}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-primary-50">
            <FiCalendar className="text-4xl" />
          </div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
          {event.category}
        </span>
        <h3 className="mt-2 text-lg font-semibold text-gray-900 truncate">{event.title}</h3>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <FiMapPin /> {event.location}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <FiCalendar /> {dateStr} • {event.time}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">₹{event.price}</span>
          <span className="text-sm text-gray-500">{event.availableSeats} seats left</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
