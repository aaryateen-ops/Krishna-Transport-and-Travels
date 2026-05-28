"use client";

import React, { useState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getCustomerInquiries, cancelBooking } from "@/app/actions";
import { 
  User, 
  Phone, 
  Mail, 
  LogOut, 
  Plus, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  Search, 
  ExternalLink,
  CheckCircle2,
  Clock3,
  XCircle,
  AlertTriangle,
  Truck,
  MessageSquare,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

export default function CustomerDashboard() {
  const router = useRouter();

  // User States
  const [user, setUser] = useState<any>(null);
  const [userMetadata, setUserMetadata] = useState<any>({});
  const [sessionToken, setSessionToken] = useState("");
  
  // Data States
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Modal / Interaction States
  const [cancellingCode, setCancellingCode] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submitCancelLoading, setSubmitCancelLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadSessionAndData() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session || !session.user) {
          router.push("/login");
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);
        setUserMetadata(currentUser.user_metadata || {});
        setSessionToken(session.access_token);

        if (currentUser.email === "rohitsingh0641346@gmail.com") {
          router.push("/admin");
          return;
        }

        // Fetch Inquiries
        const result = await getCustomerInquiries(currentUser.email || "", session.access_token);
        if (result.success && result.inquiries) {
          setInquiries(result.inquiries);
        } else {
          setErrorMsg(result.error || "Failed to load booking history.");
        }
      } catch (err) {
        console.error("Dashboard mount error:", err);
        setErrorMsg("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadSessionAndData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("krishna_admin_password");
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleRefresh = async () => {
    if (!user || !sessionToken) return;
    setRefreshLoading(true);
    setErrorMsg("");
    try {
      const result = await getCustomerInquiries(user.email || "", sessionToken);
      if (result.success && result.inquiries) {
        setInquiries(result.inquiries);
      } else {
        setErrorMsg(result.error || "Failed to refresh inquiries.");
      }
    } catch (err) {
      setErrorMsg("Failed to refresh bookings.");
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleCancelClick = (code: string) => {
    setCancellingCode(code);
    setCancelReason("");
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingCode || !cancelReason.trim()) return;

    setSubmitCancelLoading(true);
    try {
      const result = await cancelBooking(cancellingCode, cancelReason.trim());
      if (result.success) {
        // Update local state status
        setInquiries((prev) => 
          prev.map((item) => 
            item.inquiry_code === cancellingCode 
              ? { ...item, status: "cancelled", cancellation_reason: cancelReason.trim() } 
              : item
          )
        );
        setCancellingCode(null);
        alert("Booking cancelled successfully.");
      } else {
        alert(`Failed to cancel booking: ${result.error}`);
      }
    } catch (err) {
      alert("Error occurred while cancelling booking.");
    } finally {
      setSubmitCancelLoading(false);
    }
  };

  // Helper for Status Badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded-full">
            <Clock3 className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-full">
            <Truck className="w-3.5 h-3.5 animate-pulse" /> Contacted
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-green-700 bg-green-50 border border-green-100 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-red-700 bg-red-50 border border-red-100 rounded-full">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-100 rounded-full">
            Unknown
          </span>
        );
    }
  };

  // Filter & Search Logic
  const filteredInquiries = inquiries.filter((item) => {
    const matchesFilter = statusFilter === "all" || item.status === statusFilter;
    const matchesSearch = 
      item.inquiry_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.pickup_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.drop_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.goods_type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <RefreshCw className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Loading your profile & bookings...</p>
      </div>
    );
  }

  // Pre-fill query param details for Book New Ride
  const nameQuery = userMetadata.full_name ? encodeURIComponent(userMetadata.full_name) : "";
  const phoneQuery = userMetadata.phone_number ? encodeURIComponent(userMetadata.phone_number) : "";
  const emailQuery = user?.email ? encodeURIComponent(user.email) : "";
  const bookNewRideUrl = `/#inquiry?name=${nameQuery}&phone=${phoneQuery}&email=${emailQuery}`;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      
      {/* Dashboard Header */}
      <header className="w-full bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/logo.png" 
                alt="Krishna Transport Logo" 
                fill 
                unoptimized
                className="object-cover scale-[1.4] origin-center"
              />
            </div>
            <div>
              <span className="block font-display font-extrabold text-xs sm:text-sm text-primary-800 leading-tight">
                Krishna Transport
              </span>
              <span className="block font-sans font-bold text-[8px] text-slate-400 uppercase tracking-wider">
                Customer Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-extrabold text-slate-700 leading-tight">
                {userMetadata.full_name || "Valued Customer"}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {userMetadata.phone_number || user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 hover:border-red-600 rounded-xl transition-all"
              title="Logout from Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <section className="bg-gradient-to-r from-primary-800 to-primary-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden mb-8">
          {/* Decorative design */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <span className="inline-block px-3 py-1 bg-white/10 text-accent-500 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-3">
                Customer Dashboard
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight leading-tight">
                Namaste, {userMetadata.full_name || "Valued Customer"}!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
                Check booking progress, connect with drivers, and book new transport trips across Varanasi and regional districts.
              </p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs font-bold text-slate-200">
                {userMetadata.phone_number && (
                  <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                    <Phone className="w-3.5 h-3.5 text-accent-500" /> {userMetadata.phone_number}
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg">
                  <Mail className="w-3.5 h-3.5 text-accent-500" /> {user?.email}
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-3">
              <Link
                href={bookNewRideUrl}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-accent-500/20 transition-all uppercase tracking-wider hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" /> Book New Ride
              </Link>
              <button
                onClick={handleRefresh}
                disabled={refreshLoading}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/10 font-bold text-xs sm:text-sm rounded-2xl transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`} />
                Refresh Data
              </button>
            </div>
          </div>
        </section>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Booking History Section */}
          <div className="lg:col-span-12 space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full sm:max-w-xs">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search Booking ID, locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none rounded-xl text-xs font-semibold transition-all"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 self-stretch sm:self-auto overflow-x-auto pb-1 sm:pb-0">
                {["all", "pending", "contacted", "completed", "cancelled"].map((filterOpt) => (
                  <button
                    key={filterOpt}
                    onClick={() => setStatusFilter(filterOpt)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                      statusFilter === filterOpt
                        ? "bg-primary-800 text-white shadow-sm"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {filterOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Bookings List */}
            {filteredInquiries.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-lg text-primary-800">
                  {inquiries.length === 0 ? "No Bookings Found" : "No Match for Filters"}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  {inquiries.length === 0
                    ? "You haven't submitted any inquiries yet. Book your first ride and get immediate driver assignments."
                    : "Try changing your search keywords or removing status filters to see other records."}
                </p>
                {inquiries.length === 0 && (
                  <Link
                    href={bookNewRideUrl}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary-800 hover:bg-primary-900 text-white font-bold text-xs rounded-xl shadow-md transition-all mt-5"
                  >
                    <Plus className="w-4 h-4" /> Book Your First Ride
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredInquiries.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="bg-white border border-slate-200/80 hover:border-primary-150 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                  >
                    
                    {/* Card Header */}
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <span className="block font-display font-extrabold text-primary-800 text-sm">
                          ID: {booking.inquiry_code}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          Submitted on {new Date(booking.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 space-y-4.5 flex-1">
                      
                      {/* Route Info */}
                      <div className="relative pl-5 border-l-2 border-dashed border-primary-200 space-y-3">
                        {/* Pickup pin */}
                        <div className="relative">
                          <span className="absolute left-[-26px] top-0 bg-primary-50 text-primary-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-primary-100">
                            A
                          </span>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Pickup Location</span>
                          <span className="block text-xs font-extrabold text-slate-800 mt-1">{booking.pickup_location}</span>
                        </div>
                        {/* Drop pin */}
                        <div className="relative">
                          <span className="absolute left-[-26px] top-0 bg-accent-50 text-accent-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border border-accent-100">
                            B
                          </span>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Drop Location</span>
                          <span className="block text-xs font-extrabold text-slate-800 mt-1">{booking.drop_location}</span>
                        </div>
                      </div>

                      {/* Date, Time & Goods */}
                      <div className="grid grid-cols-3 gap-2 border-y border-slate-100 py-3.5 text-center">
                        <div>
                          <Calendar className="w-3.5 h-3.5 text-primary-600 mx-auto mb-1" />
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Date</span>
                          <span className="block text-[11px] font-extrabold text-slate-700 mt-0.5">{booking.booking_date}</span>
                        </div>
                        <div>
                          <Clock className="w-3.5 h-3.5 text-primary-600 mx-auto mb-1" />
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Time</span>
                          <span className="block text-[11px] font-extrabold text-slate-700 mt-0.5">{booking.booking_time}</span>
                        </div>
                        <div>
                          <Package className="w-3.5 h-3.5 text-primary-600 mx-auto mb-1" />
                          <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Goods</span>
                          <span className="block text-[11px] font-extrabold text-slate-700 mt-0.5 truncate px-1">{booking.goods_type}</span>
                        </div>
                      </div>

                      {/* Weight, Notes */}
                      {(booking.weight || booking.notes) && (
                        <div className="space-y-1.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {booking.weight && (
                            <div>
                              <span className="font-bold text-slate-400">Weight:</span> <span className="font-extrabold text-slate-700">{booking.weight}</span>
                            </div>
                          )}
                          {booking.notes && (
                            <div className="line-clamp-2">
                              <span className="font-bold text-slate-400">Notes:</span> <span className="italic text-slate-600">"{booking.notes}"</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Driver & Assignment Details */}
                      <div className="bg-slate-50/50 rounded-2xl border border-slate-150 p-4 space-y-3">
                        <h4 className="font-display font-extrabold text-xs text-primary-800 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
                          Trip Operations Details
                        </h4>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {/* Quote */}
                          <div>
                            <span className="block font-bold text-slate-400 text-[10px] uppercase">Quoted Amount</span>
                            <span className="block font-extrabold text-slate-800 text-sm mt-0.5">
                              {booking.quoted_amount ? `₹${booking.quoted_amount}` : "Awaiting Quote"}
                            </span>
                          </div>

                          {/* Vehicle */}
                          <div>
                            <span className="block font-bold text-slate-400 text-[10px] uppercase">Vehicle Number</span>
                            <span className="block font-extrabold text-slate-800 mt-0.5">
                              {booking.vehicle_number || "Assigning..."}
                            </span>
                          </div>

                          {/* Driver */}
                          <div>
                            <span className="block font-bold text-slate-400 text-[10px] uppercase">Driver Name</span>
                            <span className="block font-extrabold text-slate-800 mt-0.5">
                              {booking.driver_name || "Assigning..."}
                            </span>
                          </div>

                          {/* Driver Contact */}
                          <div>
                            <span className="block font-bold text-slate-400 text-[10px] uppercase">Driver Phone</span>
                            {booking.driver_phone ? (
                              <a 
                                href={`tel:${booking.driver_phone}`} 
                                className="block font-extrabold text-primary-700 hover:underline mt-0.5"
                              >
                                {booking.driver_phone}
                              </a>
                            ) : (
                              <span className="block text-slate-400 mt-0.5">Assigning...</span>
                            )}
                          </div>
                        </div>

                        {/* Cancellation Reason if cancelled */}
                        {booking.status === "cancelled" && booking.cancellation_reason && (
                          <div className="mt-3 p-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-semibold flex gap-1.5">
                            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="block text-[9px] uppercase tracking-wider text-red-500 font-bold">Cancellation Reason</span>
                              <span className="block italic">"{booking.cancellation_reason}"</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="px-5 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-2.5 justify-between items-center">
                      <Link
                        href={`/track/${booking.inquiry_code}`}
                        className="flex items-center gap-1 text-[11px] font-extrabold text-primary-800 hover:text-accent-600 transition-colors uppercase tracking-wider"
                      >
                        Live Tracking <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex gap-2">
                        {/* Cancel Button: Only visible if pending */}
                        {booking.status === "pending" && (
                          <button
                            onClick={() => handleCancelClick(booking.inquiry_code)}
                            className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all"
                          >
                            Cancel Ride
                          </button>
                        )}
                        
                        {/* WhatsApp Helpline for booking */}
                        <a
                          href={`https://wa.me/917071634535?text=${encodeURIComponent(
                            `Hello, I want to inquire about status for booking ID: ${booking.inquiry_code}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5" /> Chat Helpline
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Cancel Booking Modal */}
      {cancellingCode && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-extrabold text-lg text-primary-800">
                  Cancel Booking {cancellingCode}?
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Are you sure you want to cancel this booking? This will inform Rohit to stop vehicle assignment. Please provide a reason below.
                </p>
              </div>
            </div>

            <form onSubmit={handleCancelSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Cancellation
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Plans changed, booked another service, or date modified..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none rounded-xl text-xs font-semibold transition-all resize-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingCode(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  disabled={submitCancelLoading || !cancelReason.trim()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitCancelLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    "Confirm Cancellation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs font-bold text-slate-400 print:hidden">
        © {new Date().getFullYear()} Krishna Transport & Travel Management. Varanasi, UP.
      </footer>
    </div>
  );
}
