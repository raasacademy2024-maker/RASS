import React, { useState, useEffect } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import apiClient from "../../services/api";
import { Edit, Copy, Download, Trash2, ArrowLeft, Users, User, X } from "lucide-react";
import { resolveImageUrl } from "../../utils/imageUrl";

interface AgendaItem {
  day: string;
  title: string;
  description: string;
  time: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Attendee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  registeredAt: string;
}

interface Event {
  _id: string;
  title: string;
  description: string;
  aboutEvent: string;
  date: string;
  location: string;
  type: "Free" | "Paid";
  price: number;
  imageUrl: string;
  highlights: string[];
  agenda: AgendaItem[];
  faq: FAQItem[];
  attendees: Attendee[];
  createdAt: string;
  updatedAt: string;
}

interface DashboardStats {
  totalEvents: number;
  totalAttendees: number;
  eventsByType: { _id: string; count: number }[];
  recentEvents: Event[];
  upcomingEvents: Event[];
}

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit" | "attendees">("list");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    aboutEvent: "",
    date: "",
    location: "",
    type: "Free" as "Free" | "Paid",
    price: 0,
    imageUrl: "",
    highlights: [] as string[],
    agenda: [] as AgendaItem[],
    faq: [] as FAQItem[]
  });

  // Form states for dynamic fields
  const [newHighlight, setNewHighlight] = useState("");
  const [newAgendaItem, setNewAgendaItem] = useState({
    day: "",
    title: "",
    description: "",
    time: ""
  });
  const [newFAQItem, setNewFAQItem] = useState({
    question: "",
    answer: ""
  });

  // Attendee form state
  const [attendeeForm, setAttendeeForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchEvents();
    fetchDashboardStats();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await apiClient.get("/admin/events");
      setEvents(res.data.events || res.data);
    } catch (error: any) {
      console.error("Error fetching events:", error);
      alert(`Error fetching events: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await apiClient.get("/admin/dashboard/stats");
      setStats(res.data);
    } catch (error: any) {
      console.error("Error fetching stats:", error);
      alert(`Error fetching stats: ${error.message}`);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post("/admin/create-event", form);
      
      alert("Event created successfully!");
      setForm({ 
        title: "", 
        description: "", 
        aboutEvent: "",
        date: "", 
        location: "", 
        type: "Free", 
        price: 0,
        imageUrl: "",
        highlights: [],
        agenda: [],
        faq: []
      });
      setView("list");
      fetchEvents();
      fetchDashboardStats();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const res = await apiClient.put(`/admin/events/${selectedEvent._id}`, form);
      
      alert("Event updated successfully!");
      setView("list");
      fetchEvents();
      fetchDashboardStats();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await apiClient.delete(`/admin/events/${id}`);
      
      alert("Event deleted successfully!");
      fetchEvents();
      fetchDashboardStats();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedEvents.length || !confirm("Are you sure you want to delete selected events?")) return;

    try {
      const res = await apiClient.delete("/admin/events", {
        data: { eventIds: selectedEvents }
      });
      
      alert("Events deleted successfully!");
      setSelectedEvents([]);
      fetchEvents();
      fetchDashboardStats();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleAddAttendee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    try {
      const res = await apiClient.post(`/admin/events/${selectedEvent._id}/attendees`, attendeeForm);
      
      alert("Attendee added successfully!");
      setAttendeeForm({ name: "", email: "", phone: "" });
      fetchEvents(); // Refresh to get updated attendees
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleRemoveAttendee = async (attendeeId: string) => {
    if (!selectedEvent || !confirm("Remove this attendee?")) return;

    try {
      const res = await apiClient.delete(`/admin/events/${selectedEvent._id}/attendees/${attendeeId}`);
      
      alert("Attendee removed successfully!");
      fetchEvents();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleExportAttendees = async (eventId: string, eventTitle: string) => {
    try {
      const res = await apiClient.get(`/admin/export/${eventId}`, {
        responseType: 'blob'
      });
      
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${eventTitle.replace(/\s+/g, '_')}_attendees.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleDuplicateEvent = async (eventId: string) => {
    try {
      const res = await apiClient.post(`/admin/events/${eventId}/duplicate`);
      
      alert("Event duplicated successfully!");
      fetchEvents();
      fetchDashboardStats();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      aboutEvent: event.aboutEvent,
      date: event.date.split('T')[0],
      location: event.location,
      type: event.type,
      price: event.price,
      imageUrl: event.imageUrl,
      highlights: [...event.highlights],
      agenda: [...event.agenda],
      faq: [...event.faq]
    });
    setView("edit");
  };

  const handleViewAttendees = (event: Event) => {
    setSelectedEvent(event);
    setView("attendees");
  };

  const resetForm = () => {
    setForm({ 
      title: "", 
      description: "", 
      aboutEvent: "",
      date: "", 
      location: "", 
      type: "Free", 
      price: 0,
      imageUrl: "",
      highlights: [],
      agenda: [],
      faq: []
    });
    setNewHighlight("");
    setNewAgendaItem({ day: "", title: "", description: "", time: "" });
    setNewFAQItem({ question: "", answer: "" });
    setSelectedEvent(null);
  };

  // Highlight management
  const addHighlight = () => {
    if (newHighlight.trim()) {
      setForm({ ...form, highlights: [...form.highlights, newHighlight.trim()] });
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    const newHighlights = [...form.highlights];
    newHighlights.splice(index, 1);
    setForm({ ...form, highlights: newHighlights });
  };

  // Agenda management
  const addAgendaItem = () => {
    if (newAgendaItem.day && newAgendaItem.title && newAgendaItem.description && newAgendaItem.time) {
      setForm({ ...form, agenda: [...form.agenda, { ...newAgendaItem }] });
      setNewAgendaItem({ day: "", title: "", description: "", time: "" });
    }
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = [...form.agenda];
    newAgenda.splice(index, 1);
    setForm({ ...form, agenda: newAgenda });
  };

  // FAQ management
  const addFAQItem = () => {
    if (newFAQItem.question && newFAQItem.answer) {
      setForm({ ...form, faq: [...form.faq, { ...newFAQItem }] });
      setNewFAQItem({ question: "", answer: "" });
    }
  };

  const removeFAQItem = (index: number) => {
    const newFAQ = [...form.faq];
    newFAQ.splice(index, 1);
    setForm({ ...form, faq: newFAQ });
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || event.type === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Events</h1>
            <p className="text-gray-600">Create, edit, and manage your events</p>
          </div>

          {/* Dashboard Stats - Card Layout */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-5 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalEvents}</div>
                <div className="text-gray-600 text-sm">Total Events</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.totalAttendees}</div>
                <div className="text-gray-600 text-sm">Total Attendees</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats.eventsByType.find(e => e._id === "Free")?.count || 0}
                </div>
                <div className="text-gray-600 text-sm">Free Events</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-5 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {stats.eventsByType.find(e => e._id === "Paid")?.count || 0}
                </div>
                <div className="text-gray-600 text-sm">Paid Events</div>
              </div>
            </div>
          )}

          {/* Navigation - Mobile Responsive */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => { setView("list"); resetForm(); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                view === "list" 
                  ? "bg-blue-600 text-white shadow-md" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => { setView("create"); resetForm(); }}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                view === "create" 
                  ? "bg-green-600 text-white shadow-md" 
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Create Event
            </button>
          </div>

          {/* Event List View - Card Layout for Mobile, Table for Desktop */}
          {view === "list" && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Events ({filteredEvents.length})</h2>
              </div>
              
              {/* Search and Filter - Mobile Responsive */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                    {selectedEvents.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete ({selectedEvents.length})
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
                </div>
              ) : (
                <>
                  {/* Mobile view - Card layout */}
                  <div className="md:hidden">
                    <div className="px-4 pb-4 space-y-4">
                      {filteredEvents.map((event) => (
                        <div key={event._id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{event.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {event.type} {event.type === "Paid" && `₹${event.price}`}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-3 text-xs text-gray-600 line-clamp-2">
                                {event.description}
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              event.type === "Free" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {event.type}
                            </span>
                          </div>
                          
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="text-xs">
                              <div className="text-gray-500">Date</div>
                              <div className="text-gray-900">{formatDate(event.date)}</div>
                            </div>
                            <div className="text-xs">
                              <div className="text-gray-500">Location</div>
                              <div className="text-gray-900 truncate" title={event.location}>{event.location}</div>
                            </div>
                            <div className="text-xs">
                              <div className="text-gray-500">Attendees</div>
                              <div className="text-gray-900">{event.attendees.length}</div>
                            </div>
                            <div className="text-xs">
                              <div className="text-gray-500">Status</div>
                              <div className="text-gray-900">Active</div>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex justify-between">
                            <button
                              onClick={() => handleViewAttendees(event)}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              View Attendees
                            </button>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => handleEdit(event)}
                                className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDuplicateEvent(event._id)}
                                className="p-1 rounded-full text-green-600 hover:bg-green-100"
                                title="Duplicate"
                              >
                                <Copy size={16} />
                              </button>
                              <button
                                onClick={() => handleExportAttendees(event._id, event.title)}
                                className="p-1 rounded-full text-purple-600 hover:bg-purple-100"
                                title="Export"
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event._id)}
                                className="p-1 rounded-full text-red-600 hover:bg-red-100"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Desktop view - Table layout */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-4 text-left">
                            <input
                              type="checkbox"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedEvents(filteredEvents.map(e => e._id));
                                } else {
                                  setSelectedEvents([]);
                                }
                              }}
                              className="rounded"
                            />
                          </th>
                          <th className="py-3 px-4 text-left">Event</th>
                          <th className="py-3 px-4 text-left">Date & Location</th>
                          <th className="py-3 px-4 text-left">Type</th>
                          <th className="py-3 px-4 text-left">Attendees</th>
                          <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEvents.map((event) => (
                          <tr key={event._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                checked={selectedEvents.includes(event._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedEvents([...selectedEvents, event._id]);
                                  } else {
                                    setSelectedEvents(selectedEvents.filter(id => id !== event._id));
                                  }
                                }}
                                className="rounded"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <div className="font-semibold text-gray-800">{event.title}</div>
                                <div className="text-sm text-gray-600 line-clamp-2">{event.description}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm">
                                <div className="font-medium">{formatDate(event.date)}</div>
                                <div className="text-gray-600">{event.location}</div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                event.type === "Free" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {event.type} {event.type === "Paid" && `₹${event.price}`}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-center">
                                <div className="font-semibold">{event.attendees.length}</div>
                                <button
                                  onClick={() => handleViewAttendees(event)}
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  View
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                <button
                                  onClick={() => handleEdit(event)}
                                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDuplicateEvent(event._id)}
                                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                                >
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => handleExportAttendees(event._id, event.title)}
                                  className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
                                >
                                  Export
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(event._id)}
                                  className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Create/Edit Event Form - Mobile Responsive */}
          {(view === "create" || view === "edit") && (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4">
                {view === "create" ? "Create New Event" : "Edit Event"}
              </h2>
              
              <form onSubmit={view === "create" ? handleCreateEvent : handleUpdateEvent}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Short Description *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      About This Event
                    </label>
                    <textarea
                      rows={3}
                      value={form.aboutEvent}
                      onChange={(e) => setForm({ ...form, aboutEvent: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Detailed description of the event..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Event Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as "Free" | "Paid" })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>

                  {form.type === "Paid" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                  )}

                  {/* Image URL Field */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Event Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optional: Provide a URL for the event image
                    </p>
                  </div>

                  {/* Image Preview */}
                  {form.imageUrl && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Image Preview
                      </label>
                      <div className="border border-gray-300 rounded-lg p-3">
                        <img
                          src={resolveImageUrl(form.imageUrl, 800)}
                          alt="Event preview"
                          className="max-w-full max-h-40 object-contain rounded-lg mx-auto"
                          onError={(e) => {
                            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='100' viewBox='0 0 150 100'%3E%3Crect width='150' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%239ca3af'%3EImage not available%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <p className="text-xs text-gray-500 text-center mt-1">
                          Preview of your event image
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Highlights Section */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Event Highlights
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Add a highlight"
                      />
                      <button
                        type="button"
                        onClick={addHighlight}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Add
                      </button>
                    </div>
                    {form.highlights.length > 0 && (
                      <div className="mt-2">
                        {form.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded mb-1">
                            <span className="text-sm">{highlight}</span>
                            <button
                              type="button"
                              onClick={() => removeHighlight(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Agenda Section */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Event Agenda
                    </label>
                    <div className="grid grid-cols-1 gap-2 mb-2">
                      <input
                        type="text"
                        value={newAgendaItem.day}
                        onChange={(e) => setNewAgendaItem({ ...newAgendaItem, day: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Day (e.g., Day 1)"
                      />
                      <input
                        type="text"
                        value={newAgendaItem.time}
                        onChange={(e) => setNewAgendaItem({ ...newAgendaItem, time: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Time (e.g., 10:00 AM)"
                      />
                      <input
                        type="text"
                        value={newAgendaItem.title}
                        onChange={(e) => setNewAgendaItem({ ...newAgendaItem, title: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Title"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAgendaItem.description}
                          onChange={(e) => setNewAgendaItem({ ...newAgendaItem, description: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Description"
                        />
                        <button
                          type="button"
                          onClick={addAgendaItem}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {form.agenda.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {form.agenda.map((item, index) => (
                          <div key={index} className="grid grid-cols-1 gap-1 bg-gray-50 p-2 rounded">
                            <div className="font-medium text-sm">{item.day}</div>
                            <div className="text-sm">{item.time}</div>
                            <div className="text-sm">{item.title}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">{item.description}</span>
                              <button
                                type="button"
                                onClick={() => removeAgendaItem(index)}
                                className="text-red-600 hover:text-red-800 ml-2 p-1"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FAQ Section */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Frequently Asked Questions
                    </label>
                    <div className="grid grid-cols-1 gap-2 mb-2">
                      <input
                        type="text"
                        value={newFAQItem.question}
                        onChange={(e) => setNewFAQItem({ ...newFAQItem, question: e.target.value })}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Question"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newFAQItem.answer}
                          onChange={(e) => setNewFAQItem({ ...newFAQItem, answer: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Answer"
                        />
                        <button
                          type="button"
                          onClick={addFAQItem}
                          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {form.faq.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {form.faq.map((item, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded">
                            <div className="font-medium text-sm">Q: {item.question}</div>
                            <div className="text-gray-600 text-sm">A: {item.answer}</div>
                            <div className="flex justify-end mt-1">
                              <button
                                type="button"
                                onClick={() => removeFAQItem(index)}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    {view === "create" ? "Create Event" : "Update Event"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setView("list"); resetForm(); }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Attendees View - Card Layout */}
          {view === "attendees" && selectedEvent && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title} - Attendees</h2>
                  <p className="text-gray-600">Total: {selectedEvent.attendees.length} attendees</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleExportAttendees(selectedEvent._id, selectedEvent.title)}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Download size={18} className="mr-2" />
                    Export to Excel
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className="inline-flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    Back to List
                  </button>
                </div>
              </div>

              {/* Add Attendee Form - Card Layout */}
              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-5 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Attendee</h3>
                  <form onSubmit={handleAddAttendee} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Name *"
                      required
                      value={attendeeForm.name}
                      onChange={(e) => setAttendeeForm({ ...attendeeForm, name: e.target.value })}
                      className="px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email *"
                      required
                      value={attendeeForm.email}
                      onChange={(e) => setAttendeeForm({ ...attendeeForm, email: e.target.value })}
                      className="px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={attendeeForm.phone}
                        onChange={(e) => setAttendeeForm({ ...attendeeForm, phone: e.target.value })}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                </div>

                {/* Attendees List - Card Layout for Mobile, Table for Desktop */}
                {selectedEvent.attendees.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No attendees</h3>
                    <p className="mt-1 text-sm text-gray-500">No one has registered for this event yet.</p>
                  </div>
                ) : (
                  <>
                    {/* Mobile view - Card layout */}
                    <div className="md:hidden">
                      <div className="space-y-4">
                        {selectedEvent.attendees.map((attendee) => (
                          <div key={attendee._id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{attendee.name}</div>
                                  <div className="text-xs text-gray-500">{attendee.email}</div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveAttendee(attendee._id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                title="Remove"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2">
                              <div className="text-xs">
                                <div className="text-gray-500">Phone</div>
                                <div className="text-gray-900">{attendee.phone || "-"}</div>
                              </div>
                              <div className="text-xs">
                                <div className="text-gray-500">Registered</div>
                                <div className="text-gray-900">{formatDate(attendee.registeredAt)}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Desktop view - Table layout */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Phone</th>
                            <th className="py-3 px-4 text-left">Registered</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEvent.attendees.map((attendee) => (
                            <tr key={attendee._id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{attendee.name}</td>
                              <td className="py-3 px-4">{attendee.email}</td>
                              <td className="py-3 px-4">{attendee.phone || "-"}</td>
                              <td className="py-3 px-4 text-sm">
                                {formatDate(attendee.registeredAt)}
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => handleRemoveAttendee(attendee._id)}
                                  className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}