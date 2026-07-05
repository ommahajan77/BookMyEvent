import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiCalendar, FiBookOpen, FiDollarSign } from "react-icons/fi";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import Loader from "../../components/Loader";
import * as adminService from "../../services/adminService";

const COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl text-white ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await adminService.getAnalytics();
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader />;
  if (!data) return <p className="text-gray-500">Failed to load dashboard.</p>;

  const revenueChartData = data.revenueByMonth.map((r) => ({
    name: `${MONTHS[r._id.month - 1]} ${r._id.year}`,
    revenue: r.revenue,
    bookings: r.bookings,
  }));

  const categoryChartData = data.bookingsByCategory.map((c) => ({ name: c._id, value: c.count }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FiUsers />} label="Total Users" value={data.stats.totalUsers} color="bg-indigo-500" />
        <StatCard icon={<FiCalendar />} label="Total Events" value={data.stats.totalEvents} color="bg-emerald-500" />
        <StatCard icon={<FiBookOpen />} label="Total Bookings" value={data.stats.totalBookings} color="bg-amber-500" />
        <StatCard icon={<FiDollarSign />} label="Total Revenue" value={`₹${data.stats.totalRevenue}`} color="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Bookings by Category</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={categoryChartData} dataKey="value" nameKey="name" outerRadius={90} label>
                {categoryChartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold mb-4">Bookings Volume by Month</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={revenueChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="bookings" fill="#818cf8" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-semibold mb-4">Upcoming Events</h2>
          <ul className="divide-y divide-gray-100">
            {data.upcomingEvents.map((e) => (
              <li key={e._id} className="py-3 flex justify-between text-sm">
                <span>{e.title}</span>
                <span className="text-gray-500">{new Date(e.date).toLocaleDateString()}</span>
              </li>
            ))}
            {data.upcomingEvents.length === 0 && <p className="text-gray-400 text-sm">No upcoming events.</p>}
          </ul>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Latest Bookings</h2>
          <ul className="divide-y divide-gray-100">
            {data.latestBookings.map((b) => (
              <li key={b._id} className="py-3 flex justify-between text-sm">
                <span>{b.event?.title} — {b.user?.name}</span>
                <span className="text-gray-500">₹{b.totalAmount}</span>
              </li>
            ))}
            {data.latestBookings.length === 0 && <p className="text-gray-400 text-sm">No bookings yet.</p>}
          </ul>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/admin/events" className="btn-primary">Manage Events</Link>
        <Link to="/admin/bookings" className="btn-outline">Manage Bookings</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
