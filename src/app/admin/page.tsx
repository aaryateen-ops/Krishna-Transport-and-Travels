"use client";

import React, { useState, useEffect, useTransition } from "react";
import { getInquiries, updateInquiryOperations, deleteInquiry, OperationalUpdateData } from "@/app/actions";
import { 
  Lock, 
  Search, 
  Trash2, 
  CheckCircle, 
  Phone, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  LogOut,
  RefreshCw,
  TrendingUp,
  Save,
  ExternalLink,
  Truck,
  ChevronDown,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // 'all', 'pending', 'contacted', 'completed', 'cancelled'
  const [searchTerm, setSearchTerm] = useState("");
  
  // Track form values for each inquiry individually
  const [formStates, setFormStates] = useState<{[id: string]: {
    quoted_amount: string;
    driver_name: string;
    driver_phone: string;
    vehicle_number: string;
    status: string;
    cancellation_reason: string;
  }}>({});

  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Load password from localStorage if saved
  useEffect(() => {
    const savedPassword = localStorage.getItem("krishna_admin_password");
    if (savedPassword) {
      setPassword(savedPassword);
      handleLogin(savedPassword);
    }
  }, []);

  // Initialize input form states when inquiries list is fetched
  useEffect(() => {
    if (inquiries.length > 0) {
      const initialStates: any = {};
      inquiries.forEach((item) => {
        initialStates[item.id] = {
          quoted_amount: item.quoted_amount ? String(item.quoted_amount) : "",
          driver_name: item.driver_name || "",
          driver_phone: item.driver_phone || "",
          vehicle_number: item.vehicle_number || "",
          status: item.status || "pending",
          cancellation_reason: item.cancellation_reason || "",
        };
      });
      setFormStates(initialStates);
    }
  }, [inquiries]);

  const handleLogin = async (overridePassword?: string) => {
    const pwdToUse = overridePassword || password;
    if (!pwdToUse) return;

    setLoginLoading(true);
    setError("");

    const result = await getInquiries(pwdToUse);

    if (result.success && result.inquiries) {
      setInquiries(result.inquiries);
      setIsAuthorized(true);
      localStorage.setItem("krishna_admin_password", pwdToUse);
    } else {
      setError(result.error || "Authorization failed.");
      localStorage.removeItem("krishna_admin_password");
      setIsAuthorized(false);
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("krishna_admin_password");
    setPassword("");
    setInquiries([]);
    setIsAuthorized(false);
  };

  const handleRefresh = async () => {
    setRefreshLoading(true);
    const result = await getInquiries(password);
    if (result.success && result.inquiries) {
      setInquiries(result.inquiries);
    }
    setRefreshLoading(false);
  };

  const handleFormChange = (id: string, field: string, value: string) => {
    setFormStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      }
    }));
  };

  const handleSaveDetails = async (id: string) => {
    const data = formStates[id];
    if (!data) return;

    setUpdatingId(id);
    
    // Parse numeric fields safely
    const quotedAmount = data.quoted_amount.trim() === "" ? null : parseFloat(data.quoted_amount);
    
    const cancellationReason = data.status === "cancelled" 
      ? (data.cancellation_reason.trim() === "" ? "Cancelled by Admin" : data.cancellation_reason.trim())
      : null;
    
    const updatePayload: OperationalUpdateData = {
      quoted_amount: quotedAmount,
      driver_name: data.driver_name.trim() === "" ? null : data.driver_name.trim(),
      driver_phone: data.driver_phone.trim() === "" ? null : data.driver_phone.trim(),
      vehicle_number: data.vehicle_number.trim() === "" ? null : data.vehicle_number.trim(),
      status: data.status,
      cancellation_reason: cancellationReason,
    };

    const result = await updateInquiryOperations(id, updatePayload, password);

    if (result.success) {
      // Update our master list state as well
      setInquiries((prev) => 
        prev.map((item) => 
          item.id === id 
            ? { 
                ...item, 
                quoted_amount: quotedAmount,
                driver_name: updatePayload.driver_name,
                driver_phone: updatePayload.driver_phone,
                vehicle_number: updatePayload.vehicle_number,
                status: updatePayload.status,
                cancellation_reason: updatePayload.cancellation_reason
              } 
            : item
        )
      );
      alert("Details saved successfully!");
    } else {
      alert(`Error: ${result.error}`);
    }
    
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry? This cannot be undone.")) {
      startTransition(async () => {
        const result = await deleteInquiry(id, password);
        if (result.success) {
          setInquiries((prev) => prev.filter((item) => item.id !== id));
        } else {
          alert(`Error deleting inquiry: ${result.error}`);
        }
      });
    }
  };

  // Filter and search logic
  const filteredInquiries = inquiries.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    
    const codeString = item.inquiry_code || "";
    const nameString = item.full_name || "";
    const phoneString = item.phone_number || "";
    const pickupString = item.pickup_location || "";
    const dropString = item.drop_location || "";
    const goodsString = item.goods_type || "";

    const matchesSearch =
      codeString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nameString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phoneString.includes(searchTerm) ||
      pickupString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dropString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goodsString.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full border border-amber-100 uppercase tracking-wide">Pending</span>;
      case "contacted":
        return <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">Contacted</span>;
      case "completed":
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-wide">Completed</span>;
      case "cancelled":
        return <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full border border-red-100 uppercase tracking-wide">Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200 uppercase tracking-wide">{status}</span>;
    }
  };

  // Count stats
  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const contactedCount = inquiries.filter((i) => i.status === "contacted").length;
  const completedCount = inquiries.filter((i) => i.status === "completed").length;
  const cancelledCount = inquiries.filter((i) => i.status === "cancelled").length;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 relative overflow-hidden">
          {/* Top border gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary-800 to-accent-500"></div>

          <div className="flex flex-col items-center text-center gap-4 mb-6">
            <div className="w-14 h-14 bg-primary-50 text-primary-800 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-primary-800">Admin Area Gate</h1>
            <p className="text-sm text-slate-500">Enter the administration password to access lead logs.</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="flex flex-col gap-4"
          >
            {error && (
              <div className="bg-red-50 text-red-700 border border-red-100 p-3 rounded-xl text-sm font-semibold">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/50"
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 bg-primary-800 hover:bg-primary-900 text-white font-extrabold rounded-xl transition-all shadow-md shadow-primary-800/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Checking...
                </>
              ) : (
                "Unlock Dashboard"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Nav */}
      <header className="bg-white border-b border-slate-200/60 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-extrabold text-lg text-primary-800">Krishna Admin</span>
            <span className="text-xs px-2.5 py-0.5 bg-primary-50 text-primary-800 font-bold rounded-lg border border-primary-100/50">Leads Hub</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshLoading}
              className="p-2 text-slate-600 hover:text-primary-800 hover:bg-slate-50 rounded-xl transition-all border border-slate-200 cursor-pointer"
              title="Refresh leads list"
            >
              <RefreshCw className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        {/* Lead Stats Card Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow col-span-2 lg:col-span-1">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
              <span className="font-display font-extrabold text-2xl text-slate-800">{inquiries.length}</span>
            </div>
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
              <span className="font-display font-extrabold text-2xl text-amber-600">{pendingCount}</span>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 border border-amber-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contacted</span>
              <span className="font-display font-extrabold text-2xl text-blue-600">{contactedCount}</span>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
              <span className="font-display font-extrabold text-2xl text-emerald-600">{completedCount}</span>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cancelled</span>
              <span className="font-display font-extrabold text-2xl text-red-650">{cancelledCount}</span>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-650 border border-red-100">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Leads" },
              { id: "pending", label: `Pending (${pendingCount})` },
              { id: "contacted", label: `Contacted (${contactedCount})` },
              { id: "completed", label: `Completed (${completedCount})` },
              { id: "cancelled", label: `Cancelled (${cancelledCount})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  filter === t.id
                    ? "bg-primary-800 text-white border-primary-800"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-sm w-full">
            <input
              type="text"
              placeholder="Search by ID, name, phone, route..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent rounded-xl text-xs bg-slate-50/50"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        {/* Leads Listing */}
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center text-slate-400">
            No inquiries match the active filters or search terms.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredInquiries.map((inquiry) => {
              const localForm = formStates[inquiry.id] || {
                quoted_amount: "",
                driver_name: "",
                driver_phone: "",
                vehicle_number: "",
                status: "pending",
                cancellation_reason: "",
              };
              const isUpdating = updatingId === inquiry.id;

              // Border color based on status
              let statusBorderClass = "border-slate-200/60";
              if (inquiry.status === "pending") statusBorderClass = "border-l-4 border-l-amber-500 border-y-slate-200 border-r-slate-200";
              else if (inquiry.status === "contacted") statusBorderClass = "border-l-4 border-l-blue-500 border-y-slate-200 border-r-slate-200";
              else if (inquiry.status === "completed") statusBorderClass = "border-l-4 border-l-emerald-500 border-y-slate-200 border-r-slate-200";
              else if (inquiry.status === "cancelled") statusBorderClass = "border-l-4 border-l-red-500 border-y-slate-200 border-r-slate-200";

              return (
                <div 
                  key={inquiry.id} 
                  className={`bg-white p-6 sm:p-8 rounded-3xl border shadow-sm transition-all flex flex-col gap-6 ${statusBorderClass}`}
                >
                  {/* Top Row: Meta-data & Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono font-black text-primary-800 text-sm px-3 py-1 bg-primary-50 rounded-lg border border-primary-100/50 flex items-center gap-1.5">
                        {inquiry.inquiry_code || "NO CODE"}
                        <a 
                          href={`/track/${inquiry.inquiry_code}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          title="Open live tracking sheet"
                          className="text-slate-400 hover:text-primary-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </span>
                      {getStatusBadge(inquiry.status)}
                      <span className="text-xs text-slate-400 font-bold">
                        Logged: {new Date(inquiry.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a 
                        href={`tel:${inquiry.phone_number}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all border border-slate-200"
                      >
                        <Phone className="w-4 h-4 text-accent-500" />
                        Call
                      </a>
                      <a 
                        href={`https://wa.me/91${inquiry.phone_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-green-50 hover:text-green-700 text-slate-700 font-bold rounded-xl text-xs transition-all border border-slate-200"
                      >
                        <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                        WhatsApp
                      </a>
                      <button
                        onClick={() => handleDelete(inquiry.id)}
                        disabled={isPending}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-200 cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mid Layout: Inquiry Details vs Operational inputs */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Customer details: 6 Columns */}
                    <div className="lg:col-span-6 flex flex-col gap-4 justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <User className="w-5 h-5 text-primary-800 shrink-0" />
                          <span className="font-display font-extrabold text-slate-800 text-lg">{inquiry.full_name}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex flex-col gap-1">
                            <span className="block text-[8px] uppercase font-black text-slate-400 tracking-wider">📍 Route</span>
                            <span className="font-bold text-slate-800 break-words">{inquiry.pickup_location}</span>
                            <span className="text-[10px] text-slate-400 my-0.5">&darr; to &darr;</span>
                            <span className="font-bold text-slate-800 break-words">{inquiry.drop_location}</span>
                          </div>

                          <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex flex-col gap-1">
                            <span className="block text-[8px] uppercase font-black text-slate-400 tracking-wider">📅 Schedule</span>
                            <span className="font-bold text-slate-800">{inquiry.booking_date}</span>
                            <span className="text-slate-500 font-medium text-[10px] mt-1">{inquiry.booking_time}</span>
                          </div>

                          <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-2xl flex flex-col gap-1">
                            <span className="block text-[8px] uppercase font-black text-slate-400 tracking-wider">📦 Cargo</span>
                            <span className="font-bold text-slate-800">{inquiry.goods_type}</span>
                            {inquiry.weight ? (
                              <span className="text-primary-700 font-bold text-[10px] mt-1 bg-primary-50 px-1.5 py-0.5 rounded w-fit border border-primary-100/50">Wt: {inquiry.weight}</span>
                            ) : (
                              <span className="text-slate-400 text-[10px] mt-1 italic">Weight unspecified</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {inquiry.notes && (
                        <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs text-slate-600 font-mono leading-relaxed relative overflow-hidden mt-2">
                          <div className="absolute top-0 right-0 w-2 h-full bg-slate-200"></div>
                          <span className="font-bold text-slate-700 block mb-1 uppercase tracking-wider text-[9px]">Additional Notes:</span>
                          {inquiry.notes}
                        </div>
                      )}

                      {inquiry.status === "cancelled" && inquiry.cancellation_reason && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-2xl text-xs text-red-750 font-mono leading-relaxed relative overflow-hidden mt-2">
                          <div className="absolute top-0 right-0 w-2 h-full bg-red-250"></div>
                          <span className="font-bold text-red-800 block mb-1 uppercase tracking-wider text-[9px]">Cancellation Reason:</span>
                          {inquiry.cancellation_reason}
                        </div>
                      )}
                    </div>

                    {/* Operational controls inputs: 6 Columns */}
                    <div className="lg:col-span-6 bg-slate-50/40 border border-slate-200/80 rounded-3xl p-5 flex flex-col gap-4">
                      <span className="block text-[10px] font-black uppercase tracking-wider text-primary-800 border-b border-slate-150 pb-1">
                        Transit &amp; Pricing Operations (Customer sees live)
                      </span>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Final Price (₹)</label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="e.g. 1500"
                              value={localForm.quoted_amount}
                              onChange={(e) => handleFormChange(inquiry.id, "quoted_amount", e.target.value)}
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-600 bg-white font-semibold text-slate-800"
                            />
                            <span className="absolute left-3 top-2 text-slate-400 font-bold select-none text-[11px]">₹</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Transit Status</label>
                          <div className="relative">
                            <select
                              value={localForm.status}
                              onChange={(e) => handleFormChange(inquiry.id, "status", e.target.value)}
                              className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-600 bg-white font-semibold text-slate-800 appearance-none cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="contacted">Contacted / Quoted</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Driver Name</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Driver name"
                              value={localForm.driver_name}
                              onChange={(e) => handleFormChange(inquiry.id, "driver_name", e.target.value)}
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-600 bg-white font-medium text-slate-800"
                            />
                            <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Driver Phone</label>
                          <div className="relative">
                            <input
                              type="tel"
                              placeholder="10 digit phone"
                              value={localForm.driver_phone}
                              onChange={(e) => handleFormChange(inquiry.id, "driver_phone", e.target.value)}
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-600 bg-white font-medium text-slate-800"
                            />
                            <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          </div>
                        </div>

                        {localForm.status === "cancelled" && (
                          <div className="col-span-2">
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Cancellation Reason (ग्राहक के लिए)</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="e.g. Price too high / plan cancelled"
                                value={localForm.cancellation_reason}
                                onChange={(e) => handleFormChange(inquiry.id, "cancellation_reason", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white font-medium text-slate-800 text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs items-end">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-600 mb-1">Vehicle Plate No.</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="e.g. UP-65-AT-1234"
                              value={localForm.vehicle_number}
                              onChange={(e) => handleFormChange(inquiry.id, "vehicle_number", e.target.value)}
                              className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-600 bg-white font-bold text-slate-800 uppercase"
                            />
                            <Truck className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          </div>
                        </div>

                        <button
                          onClick={() => handleSaveDetails(inquiry.id)}
                          disabled={isUpdating}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-emerald-50 hover:shadow-emerald-100 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isUpdating ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save Updates
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
