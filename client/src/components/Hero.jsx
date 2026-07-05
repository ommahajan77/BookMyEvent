import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Hero = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Find & Book Your Next Experience
        </h1>
        <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
          Concerts, sports, theatre, and more — book tickets in seconds with instant QR e-tickets.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex bg-white rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search events, cities, venues..."
            className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
          />
          <button type="submit" className="bg-primary-800 hover:bg-primary-900 px-6 flex items-center justify-center transition-colors">
            <FiSearch className="text-xl" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;
