import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut, FiCalendar } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  const linkClass = "text-gray-700 hover:text-primary-600 font-medium transition-colors";

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-600">
            <FiCalendar /> BookMyEvent
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={linkClass}>Home</Link>
            <Link to="/events" className={linkClass}>Events</Link>
            {user && <Link to="/bookings" className={linkClass}>My Bookings</Link>}
            {isAdmin && <Link to="/admin" className={linkClass}>Admin</Link>}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-primary-600">
                  <FiUser /> {user.name.split(" ")[0]}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-1 btn-outline">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass}>Login</Link>
                <Link to="/register" className="btn-primary">Sign Up</Link>
              </>
            )}
          </div>

          <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3 border-t border-gray-100 pt-3">
          <Link to="/" onClick={() => setOpen(false)} className={linkClass}>Home</Link>
          <Link to="/events" onClick={() => setOpen(false)} className={linkClass}>Events</Link>
          {user && <Link to="/bookings" onClick={() => setOpen(false)} className={linkClass}>My Bookings</Link>}
          {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className={linkClass}>Admin</Link>}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)} className={linkClass}>Profile</Link>
              <button onClick={handleLogout} className="btn-outline text-left">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className={linkClass}>Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
