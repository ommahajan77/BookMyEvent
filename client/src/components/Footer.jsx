import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 text-xl font-bold text-white mb-3">
            <FiCalendar /> BookMyEvent
          </div>
          <p className="text-sm text-gray-400">
            Discover and book tickets for the best concerts, shows, and events near you.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/events" className="hover:text-white">Events</Link></li>
            <li><Link to="/bookings" className="hover:text-white">My Bookings</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-white"><FiInstagram /></a>
            <a href="#" className="hover:text-white"><FiTwitter /></a>
            <a href="#" className="hover:text-white"><FiFacebook /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} BookMyEvent. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
