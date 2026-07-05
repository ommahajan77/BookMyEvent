import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import * as eventService from "../services/eventService";

const CATEGORIES = ["Music", "Sports", "Theatre", "Conference", "Comedy", "Workshop"];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await eventService.getEvents({ limit: 6, sort: "newest" });
        setEvents(data.events);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <Hero />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-bold mb-4">Browse by Category</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/events?category=${cat}`}
              className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-primary-500 hover:text-primary-600 transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Latest Events</h2>
          <Link to="/events" className="text-primary-600 font-medium hover:underline">View All</Link>
        </div>

        {loading ? (
          <Loader />
        ) : events.length === 0 ? (
          <p className="text-gray-500">No events available right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
