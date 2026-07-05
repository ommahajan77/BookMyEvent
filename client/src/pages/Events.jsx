import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import * as eventService from "../services/eventService";

const CATEGORIES = ["All", "Music", "Sports", "Theatre", "Conference", "Comedy", "Workshop", "Other"];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const { data } = await eventService.getEvents({ keyword, category, sort, page, limit: 9 });
        setEvents(data.events);
        setPagination({ page: data.page, pages: data.pages });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [keyword, category, sort, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold mb-6">Explore Events</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          defaultValue={keyword}
          onKeyDown={(e) => e.key === "Enter" && updateParam("keyword", e.target.value)}
          placeholder="Search by title or location, press Enter"
          className="input-field md:w-1/2"
        />
        <select value={category} onChange={(e) => updateParam("category", e.target.value === "All" ? "" : e.target.value)} className="input-field md:w-1/4">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => updateParam("sort", e.target.value)} className="input-field md:w-1/4">
          <option value="">Sort: Date</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : events.length === 0 ? (
        <p className="text-gray-500">No events found matching your criteria.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => <EventCard key={event._id} event={event} />)}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.set("page", p);
                    setSearchParams(params);
                  }}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${p === pagination.page ? "bg-primary-600 text-white" : "bg-white border border-gray-200 hover:border-primary-400"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Events;
