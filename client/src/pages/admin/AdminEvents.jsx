import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import Loader from "../../components/Loader";
import * as adminService from "../../services/adminService";

const emptyForm = {
  title: "", description: "", location: "", date: "", time: "",
  price: "", totalSeats: "", category: "Music",
};

const CATEGORIES = ["Music", "Sports", "Theatre", "Conference", "Comedy", "Workshop", "Other"];

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [posterFile, setPosterFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchEvents = async () => {
    try {
      const { data } = await adminService.getAllEventsAdmin();
      setEvents(data.events);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setPosterFile(null);
    setShowModal(true);
  };

  const openEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.slice(0, 10),
      time: event.time,
      price: event.price,
      totalSeats: event.totalSeats,
      category: event.category,
    });
    setEditingId(event._id);
    setPosterFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (posterFile) formData.append("poster", posterFile);

      if (editingId) {
        await adminService.updateEvent(editingId, formData);
        toast.success("Event updated");
      } else {
        await adminService.createEvent(formData);
        toast.success("Event created");
      }
      setShowModal(false);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await adminService.deleteEvent(id);
      toast.success("Event deleted");
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Event
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date</th>
              <th className="p-3">Price</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e._id} className="border-t border-gray-100">
                <td className="p-3 font-medium">{e.title}</td>
                <td className="p-3">{e.category}</td>
                <td className="p-3">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-3">₹{e.price}</td>
                <td className="p-3">{e.availableSeats}/{e.totalSeats}</td>
                <td className="p-3 flex gap-3">
                  <button onClick={() => openEdit(e)} className="text-primary-600 hover:text-primary-800"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(e._id)} className="text-red-500 hover:text-red-700"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No events yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 relative my-8">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <FiX className="text-xl" />
            </button>
            <h2 className="text-lg font-bold mb-4">{editingId ? "Edit Event" : "Add New Event"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" />
              <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
              <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-field" />
                <input required placeholder="Time e.g. 7:00 PM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" />
                <input required type="number" min="1" placeholder="Total Seats" value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: e.target.value })} className="input-field" />
              </div>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div>
                <label className="block text-sm font-medium mb-1">Poster Image</label>
                <input type="file" accept="image/*" onChange={(e) => setPosterFile(e.target.files[0])} className="text-sm" />
              </div>
              <button type="submit" disabled={saving} className="btn-primary w-full">
                {saving ? "Saving..." : editingId ? "Update Event" : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
