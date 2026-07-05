import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiCalendar, FiBookOpen, FiUsers } from "react-icons/fi";

const links = [
  { to: "/admin", label: "Dashboard", icon: <FiGrid />, end: true },
  { to: "/admin/events", label: "Events", icon: <FiCalendar /> },
  { to: "/admin/bookings", label: "Bookings", icon: <FiBookOpen /> },
  { to: "/admin/users", label: "Users", icon: <FiUsers /> },
];

const AdminLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8">
      <aside className="card p-4 h-fit">
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive ? "bg-primary-600 text-white" : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {l.icon} {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
