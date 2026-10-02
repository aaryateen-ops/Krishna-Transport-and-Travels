"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { getCustomerInquiries, cancelBooking, submitCustomerReview } from "@/app/actions";
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
  ShieldAlert,
  ArrowRight,
  PhoneCall,
  Activity,
  Layers,
  X,
  ShieldCheck,
  Star
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { useLanguage } from "@/lib/useLanguage";

export default function CustomerDashboard() {
  const router = useRouter();
  const [lang, setLang] = useLanguage();

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

  // Review & Feedback State
  const [reviewingInquiry, setReviewingInquiry] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

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
        setInquiries((prev) => 
          prev.map((item) => 
            item.inquiry_code === cancellingCode 
              ? { ...item, status: "cancelled", cancellation_reason: cancelReason.trim() } 
              : item
          )
        );
        setCancellingCode(null);
      } else {
        alert(`Failed to cancel booking: ${result.error}`);
      }
    } catch (err) {
      alert("Error occurred while cancelling booking.");
    } finally {
      setSubmitCancelLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingInquiry || !reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const result = await submitCustomerReview({
        inquiryCode: reviewingInquiry.inquiry_code,
        customerName: userMetadata.full_name || "Valued Customer",
        customerPhone: userMetadata.phone_number || undefined,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      if (result.success) {
        setReviewSuccessMsg("Thank you! Your feedback has been submitted to Rohit Singh.");
        setTimeout(() => {
          setReviewingInquiry(null);
          setReviewSuccessMsg("");
          setReviewComment("");
        }, 1800);
      } else {
        alert("Failed to submit review. Please try again.");
      }
    } catch (err) {
      alert("Error occurred while submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Status Badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Pending Quote
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            In Discussion
          </span>
        );
      case "assigned":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Vehicle Assigned
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Completed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-full">
            {status}
          </span>
        );
    }
  };

  // Filter & Search Logic
  const filteredInquiries = inquiries.filter((item) => {
    const matchesFilter = statusFilter === "all" || item.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      item.inquiry_code?.toLowerCase().includes(term) ||
      item.pickup_location?.toLowerCase().includes(term) ||
      item.drop_location?.toLowerCase().includes(term) ||
      item.goods_type?.toLowerCase().includes(term);
    return matchesFilter && matchesSearch;
  });

  const activeCount = inquiries.filter((i) => i.status === "pending" || i.status === "contacted" || i.status === "assigned").length;
  const completedCount = inquiries.filter((i) => i.status === "completed").length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="w-9 h-9 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
          Loading Customer Portal...
        </p>
      </div>
    );
  }

  // Pre-fill query param details for Book New Ride
  const nameQuery = userMetadata.full_name ? encodeURIComponent(userMetadata.full_name) : "";
  const phoneQuery = userMetadata.phone_number ? encodeURIComponent(userMetadata.phone_number) : "";
  const emailQuery = user?.email ? encodeURIComponent(user.email) : "";
  const bookNewRideUrl = `/#inquiry?name=${nameQuery}&phone=${phoneQuery}&email=${emailQuery}`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col antialiased">
      
      {/* 1. TOP NAVBAR */}
      <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          
          {/* Logo & Portal Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 shadow-xs shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image 
                src="/logo.png" 
                alt="Krishna Transport Logo" 
                fill 
                unoptimized
                className="object-cover scale-[1.3] origin-center"
              />
            </div>
            <div>
              <span className="block font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                Krishna Transport
              </span>
              <span className="block font-mono text-[9px] text-slate-400 uppercase tracking-wider">
                Customer Portal
              </span>
            </div>
          </Link>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLang(lang === "hi" ? "en" : "hi")}
              className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors"
            >
              🌐 {lang === "hi" ? "English" : "हिन्दी"}
            </button>

            {/* Customer Identity Pill */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-xs font-bold font-mono">
                {userMetadata.full_name ? userMetadata.full_name.slice(0, 2).toUpperCase() : "CU"}
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {userMetadata.full_name || "Valued Customer"}
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  {userMetadata.phone_number || user?.email}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors flex items-center gap-1.5"
              title="Logout from Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>

        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Customer Account Overview Card */}
        <section className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Namaste, {userMetadata.full_name || "Valued Customer"}!
                </h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Verified Client
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-xl">
                Track ongoing shipments, review quoted fares, and coordinate directly with Rohit Singh and our verified Varanasi driver fleet.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={refreshLoading}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 shadow-xs transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshLoading ? "animate-spin" : ""}`} />
                <span>Sync</span>
              </button>

              <Link
                href={bookNewRideUrl}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Book New Transport</span>
              </Link>
            </div>

          </div>

          {/* Metric Summary Strip */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Total Inquiries
              </span>
              <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                {inquiries.length}
              </span>
            </div>

            <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Active Trips
              </span>
              <span className="text-xl font-bold font-mono text-blue-600 mt-1 block">
                {activeCount}
              </span>
            </div>

            <div className="p-3 bg-slate-50/60 rounded-lg border border-slate-100">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Completed Deliveries
              </span>
              <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
                {completedCount}
              </span>
            </div>
          </div>
        </section>

        {/* Search & Linear Filter Segmented Strip */}
        <section className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Command Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, location, cargo..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg text-xs font-medium transition-all"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/70 overflow-x-auto w-full md:w-auto">
            {[
              { id: "all", label: "All Bookings", count: inquiries.length },
              { id: "pending", label: "Pending", count: inquiries.filter((i) => i.status === "pending").length },
              { id: "contacted", label: "In Discussion", count: inquiries.filter((i) => i.status === "contacted").length },
              { id: "completed", label: "Completed", count: completedCount },
              { id: "cancelled", label: "Cancelled", count: inquiries.filter((i) => i.status === "cancelled").length },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  statusFilter === f.id
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] font-mono px-1 py-0.2 rounded-full ${
                  statusFilter === f.id ? "bg-slate-100 text-slate-800" : "text-slate-400"
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

        </section>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Bookings List */}
        {filteredInquiries.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center shadow-xs">
            <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">
              {inquiries.length === 0 ? "No Transport Bookings Found" : "No Matches for Selected Filter"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {inquiries.length === 0
                ? "Book your first transport trip in Varanasi for household shifting, commercial cargo, or highway transit."
                : "Try resetting your search query or status filter to see other records."}
            </p>
            {inquiries.length === 0 && (
              <Link
                href={bookNewRideUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors mt-4"
              >
                <Plus className="w-3.5 h-3.5" /> Book Your First Ride
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInquiries.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl shadow-xs transition-colors flex flex-col justify-between overflow-hidden"
              >
                
                {/* Header Strip */}
                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                      {booking.inquiry_code}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">
                      Booked {new Date(booking.created_at).toLocaleDateString("en-IN", {
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

                {/* Body: Route & Cargo Flow */}
                <div className="p-4 space-y-3.5 flex-1">
                  
                  {/* Route Visualizer */}
                  <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-1 py-0.5">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold block">
                        Pickup Location
                      </span>
                      <span className="text-xs font-semibold text-slate-900 block mt-0.5">
                        {booking.pickup_location}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold block">
                        Drop Destination
                      </span>
                      <span className="text-xs font-semibold text-slate-900 block mt-0.5">
                        {booking.drop_location}
                      </span>
                    </div>
                  </div>

                  {/* Trip Details Grid */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 border-y border-slate-100 text-center text-xs">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">Date</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block">{booking.booking_date}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">Time</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block">{booking.booking_time}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">Cargo</span>
                      <span className="font-semibold text-slate-700 mt-0.5 block truncate px-1">{booking.goods_type}</span>
                    </div>
                  </div>

                  {/* Operations Details (Fare & Assigned Driver) */}
                  <div className="p-3 bg-slate-50/70 rounded-lg border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Agreed Fare:</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {booking.quoted_amount ? `₹${booking.quoted_amount}` : "Awaiting Quote"}
                      </span>
                    </div>

                    {booking.driver_name && (
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-mono">Assigned Driver:</span>
                          <span className="font-semibold text-slate-800">{booking.driver_name}</span>
                          {booking.vehicle_number && (
                            <span className="text-[10px] font-mono text-slate-500 block">
                              ({booking.vehicle_number})
                            </span>
                          )}
                        </div>
                        {booking.driver_phone && (
                          <a
                            href={`tel:${booking.driver_phone}`}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                          >
                            <Phone className="w-3 h-3 text-blue-600" /> Call Driver
                          </a>
                        )}
                      </div>
                    )}

                    {booking.status === "cancelled" && booking.cancellation_reason && (
                      <div className="pt-2 border-t border-slate-200/60 text-xs text-rose-700 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="italic">"{booking.cancellation_reason}"</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* Card Action Footer with Review & Feedback Button */}
                <div className="p-3.5 bg-slate-50/40 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/track/${booking.inquiry_code}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <span>Track Live</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    {/* Rate & Review Button for Customer */}
                    <button
                      type="button"
                      onClick={() => {
                        setReviewingInquiry(booking);
                        setReviewRating(5);
                        setReviewComment("");
                        setReviewSuccessMsg("");
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-lg transition-colors"
                    >
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>Review Trip</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Cancellation Trigger */}
                    {booking.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => handleCancelClick(booking.inquiry_code)}
                        className="px-2.5 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {/* WhatsApp Support Button */}
                    <a
                      href={`https://wa.me/917071634535?text=${encodeURIComponent(
                        `Hello Rohit Singh ji, I want to inquire about status for booking ID: ${booking.inquiry_code}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      <WhatsAppIcon className="w-3 h-3 fill-current" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      {/* Review & Feedback Modal */}
      {reviewingInquiry && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Rate Trip ({reviewingInquiry.inquiry_code})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Share your review for Rohit Singh and Krishna Transport.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReviewingInquiry(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-900">{reviewSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Your Rating (1 to 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`p-2 rounded-lg border transition-all ${
                          reviewRating >= star 
                            ? "bg-amber-50 border-amber-300 text-amber-500" 
                            : "bg-white border-slate-200 text-slate-300"
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Your Feedback / Comment *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Excellent service, timely arrival of Tata Ace, and careful handling of furniture..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 outline-none rounded-lg text-xs font-medium resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReviewingInquiry(null)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview || !reviewComment.trim()}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {submittingReview ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {cancellingCode && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-5 shadow-xl animate-in fade-in zoom-in-95 duration-150 space-y-4">
            
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Cancel Booking {cancellingCode}?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to cancel this booking? This will inform Rohit Singh to release any scheduled vehicle.
                </p>
              </div>
            </div>

            <form onSubmit={handleCancelSubmit} className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Reason for Cancellation *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Schedule changed, shifted date, or booked another carrier..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 outline-none rounded-lg text-xs font-medium transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCancellingCode(null)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={submitCancelLoading || !cancelReason.trim()}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitCancelLoading ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Confirm Cancellation</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-4 mt-8 text-center text-xs font-medium text-slate-400">
        © {new Date().getFullYear()} Krishna Transport & Travels • Operations HQ: Varanasi, UP
      </footer>

    </div>
  );
}
