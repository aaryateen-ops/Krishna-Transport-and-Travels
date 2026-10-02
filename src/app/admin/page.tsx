"use client";

import React, { useState, useEffect, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  getInquiries, 
  updateInquiryOperations, 
  deleteInquiry, 
  OperationalUpdateData 
} from "@/app/actions";
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
  AlertTriangle,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Share2,
  CheckCircle2,
  Smartphone,
  Check,
  Send,
  X
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

// Web Audio API Synthesizer for high-pitch, crisp order notification chime
const playBookingSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const playChimeTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // First sequence
    playChimeTone(784, 0, 0.25);    // G5
    playChimeTone(1046, 0.15, 0.25); // C6
    playChimeTone(1318, 0.3, 0.3);  // E6
    playChimeTone(1568, 0.45, 0.5); // G6

    // Urgent repeat sequence
    playChimeTone(784, 0.75, 0.25);
    playChimeTone(1046, 0.9, 0.25);
    playChimeTone(1318, 1.05, 0.3);
    playChimeTone(1568, 1.2, 0.6);
  } catch (err) {
    console.error("Audio chime error:", err);
  }
};

export default function AdminDashboard() {
  const router = useRouter();

  // Core state
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Filters & Search
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Sound & Realtime notification state
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState<any | null>(null);
  const [showPwaBanner, setShowPwaBanner] = useState(true);

  // In-place form states
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
  const [savedSuccessId, setSavedSuccessId] = useState<string | null>(null);

  // Load sound preference from localStorage
  useEffect(() => {
    const mutedPref = localStorage.getItem("krishna_admin_sound_muted");
    if (mutedPref === "true") {
      setIsSoundMuted(true);
    }
  }, []);

  const toggleSoundMute = () => {
    setIsSoundMuted((prev) => {
      const next = !prev;
      localStorage.setItem("krishna_admin_sound_muted", String(next));
      if (!next) {
        // Play a test chirp when unmuting
        playBookingSound();
      }
      return next;
    });
  };

  const handleTestSound = () => {
    playBookingSound();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  // 1. Session verification & Persistent Login
  useEffect(() => {
    async function verifyAdminSession() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session || !session.user) {
          router.push("/login");
          return;
        }

        const userEmail = session.user.email;
        if (userEmail !== "rohitsingh0641346@gmail.com") {
          router.push("/dashboard");
          return;
        }

        const accessToken = session.access_token;
        setToken(accessToken);
        localStorage.setItem("krishna_admin_session_token", accessToken);
        
        // Fetch inquiries using access token
        const result = await getInquiries(accessToken);
        if (result.success && result.inquiries) {
          setInquiries(result.inquiries);
          setIsAuthorized(true);
        } else {
          setError(result.error || "Failed to load inquiries.");
        }
      } catch (err) {
        console.error("Admin verification exception:", err);
        setError("Connection error. Please try logging in again.");
      } finally {
        setCheckingSession(false);
      }
    }

    verifyAdminSession();
  }, [router]);

  // 2. Setup Realtime Listener on public:inquiries
  useEffect(() => {
    if (!isAuthorized) return;

    const channel = supabase
      .channel("admin-inquiries-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "inquiries",
        },
        (payload) => {
          const newRow = payload.new;
          
          // Prepend new inquiry to list
          setInquiries((prev) => [newRow, ...prev.filter((i) => i.id !== newRow.id)]);

          // Initialize form state for new item
          setFormStates((prev) => ({
            ...prev,
            [newRow.id]: {
              quoted_amount: newRow.quoted_amount ? String(newRow.quoted_amount) : "",
              driver_name: newRow.driver_name || "",
              driver_phone: newRow.driver_phone || "",
              vehicle_number: newRow.vehicle_number || "",
              status: newRow.status || "pending",
              cancellation_reason: newRow.cancellation_reason || "",
            }
          }));

          // Trigger Loud Audio Alert & Phone Vibration
          if (!isSoundMuted) {
            playBookingSound();
          }
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([400, 200, 400, 200, 600]);
          }

          // Show flashing top alert modal
          setNewOrderAlert(newRow);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "inquiries",
        },
        (payload) => {
          const updatedRow = payload.new;
          setInquiries((prev) =>
            prev.map((item) => (item.id === updatedRow.id ? updatedRow : item))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthorized, isSoundMuted]);

  // 3. Initialize input form states when inquiries list is loaded
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

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("krishna_admin_session_token");
      localStorage.removeItem("krishna_admin_password");
      setToken("");
      setInquiries([]);
      setIsAuthorized(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout exception:", err);
    }
  };

  const handleRefresh = async () => {
    if (!token) return;
    setRefreshLoading(true);
    const result = await getInquiries(token);
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

    const result = await updateInquiryOperations(id, updatePayload, token);

    if (result.success) {
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
      setSavedSuccessId(id);
      setTimeout(() => setSavedSuccessId(null), 2500);
    } else {
      alert(`Error: ${result.error}`);
    }
    
    setUpdatingId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("क्या आप वाकई इस लीड को हटाना चाहते हैं? यह वापस नहीं आएगा।")) {
      startTransition(async () => {
        const result = await deleteInquiry(id, token);
        if (result.success) {
          setInquiries((prev) => prev.filter((item) => item.id !== id));
        } else {
          alert(`Error deleting inquiry: ${result.error}`);
        }
      });
    }
  };

  // Helper to construct WhatsApp message to Customer
  const getCustomerWhatsAppUrl = (inquiry: any) => {
    const cleanPhone = inquiry.phone_number.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `नमस्ते ${inquiry.full_name} जी!
मैं कृष्णा ट्रांसपोर्ट वाराणसी से रोहित बोल रहा हूँ।

आपकी बुकिंग (${inquiry.inquiry_code}) हमें प्राप्त हुई है:
📍 पिकअप: ${inquiry.pickup_location}
🏁 ड्रॉप: ${inquiry.drop_location}
📅 तारीख: ${inquiry.booking_date} (${inquiry.booking_time})
📦 सामान: ${inquiry.goods_type}

किराया फाइनल करने और गाड़ी पक्की करने के लिए कृपया बात करें।`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Helper to construct WhatsApp Duty Ticket to Driver
  const getDriverWhatsAppUrl = (inquiry: any, driverPhone: string, quotedAmount: string) => {
    const cleanPhone = driverPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const trackingUrl = `https://www.krishnatransports.com/track/${inquiry.inquiry_code}`;
    
    const msg = `🚚 *कृष्णा ट्रांसपोर्ट - नई ड्यूटी पर्ची*
बुकिंग कोड: ${inquiry.inquiry_code}

📍 *पिकअप पता:* ${inquiry.pickup_location}
🏁 *ड्रॉप पता:* ${inquiry.drop_location}
📅 *तारीख व समय:* ${inquiry.booking_date} (${inquiry.booking_time})

👤 *ग्राहक:* ${inquiry.full_name}
📞 *ग्राहक फोन:* ${inquiry.phone_number}
📦 *सामान:* ${inquiry.goods_type}${inquiry.weight ? ` (वजन: ${inquiry.weight})` : ""}
${inquiry.notes ? `📝 *नोट:* ${inquiry.notes}\n` : ""}
💰 *तय किराया:* ₹${quotedAmount || "तय होना बाकी"}
🔗 *लाइव ट्रैकिंग पर्ची:* ${trackingUrl}

ड्राइवर भैया समय पर पिकअप लोकेशन पर पहुँचें।`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
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

  // Count stats
  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const contactedCount = inquiries.filter((i) => i.status === "contacted").length;
  const assignedCount = inquiries.filter((i) => i.status === "assigned" || i.status === "in_transit").length;
  const completedCount = inquiries.filter((i) => i.status === "completed").length;
  const cancelledCount = inquiries.filter((i) => i.status === "cancelled").length;

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="mt-4 text-sm font-bold text-slate-300">रोहित भैया का एडमिन सेशन लोड हो रहा है...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl max-w-md w-full border border-slate-200 text-center">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-slate-900 mb-2">एडमिन एक्सेस आवश्यक</h1>
          <p className="text-sm text-slate-500 mb-6">{error || "कृपया अधिकृत एडमिन खाते (rohitsingh0641346@gmail.com) से लॉगिन करें।"}</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer"
          >
            लॉगिन पेज पर जाएँ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 pb-20">
      
      {/* 🔴 Realtime New Booking Alert Banner / Pop-up */}
      {newOrderAlert && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-lg mx-auto bg-gradient-to-r from-orange-600 to-amber-600 text-white p-4.5 rounded-2xl shadow-2xl border-2 border-white/40 animate-bounce">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white text-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                <BellRing className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                  🔔 नई बुकिंग अभी आई!
                </span>
                <h4 className="font-display font-black text-base mt-0.5">
                  {newOrderAlert.full_name} ({newOrderAlert.inquiry_code})
                </h4>
                <p className="text-xs text-orange-100 font-medium">
                  📍 {newOrderAlert.pickup_location} ➔ {newOrderAlert.drop_location}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setNewOrderAlert(null)}
              className="text-white/80 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-white/20">
            <a
              href={`tel:${newOrderAlert.phone_number}`}
              className="flex-1 py-2 bg-white text-orange-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>कॉल करें ({newOrderAlert.phone_number})</span>
            </a>
            <a
              href={getCustomerWhatsAppUrl(newOrderAlert)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 bg-[#25D366] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span>व्हाट्सएप</span>
            </a>
          </div>
        </div>
      )}

      {/* Admin Mobile Top Header */}
      <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md">
              KT
            </div>
            <div>
              <h1 className="font-display font-extrabold text-sm sm:text-base leading-tight">
                कृष्णा एडमिन कमांड
              </h1>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                लाइव रीयल-टाइम एक्टिव
              </span>
            </div>
          </div>

          {/* Header Controls: Sound Bell, Refresh, Signout */}
          <div className="flex items-center gap-2">
            
            {/* Audio Toggle Button */}
            <button
              onClick={toggleSoundMute}
              className={`p-2 rounded-xl transition-all border cursor-pointer ${
                isSoundMuted 
                  ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700" 
                  : "bg-orange-500/20 text-orange-400 border-orange-500/40 hover:bg-orange-500/30"
              }`}
              title={isSoundMuted ? "साउंड बंद है (Unmute)" : "साउंड चालू है (Mute)"}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Test Sound Button */}
            <button
              onClick={handleTestSound}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
              title="घंटी बजाकर चेक करें"
            >
              <Bell className="w-3.5 h-3.5 text-orange-400" />
              <span>टेस्ट घंटी</span>
            </button>

            {/* Manual Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshLoading}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 cursor-pointer"
              title="रीफ्रेश करें"
            >
              <RefreshCw className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`} />
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-300 hover:text-red-400 bg-slate-800 hover:bg-red-950/40 rounded-xl transition-all border border-slate-700 cursor-pointer"
              title="लॉगआउट"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* PWA Phone Install Guide Banner */}
      {showPwaBanner && (
        <div className="bg-blue-900 text-white px-4 py-2.5 text-xs font-medium border-b border-blue-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-3xl">
            <Smartphone className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              <strong>रोहित भैया के फोन के लिए:</strong> ब्राउज़र मेनू (⋮ या शेयर) दबाकर <strong>&apos;Add to Home Screen&apos;</strong> करें। यह ऐप जैसा खुल जाएगा और कभी लॉगआउट नहीं होगा!
            </span>
          </div>
          <button 
            onClick={() => setShowPwaBanner(false)}
            className="text-blue-300 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
        
        {/* Real-time Status Metric Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between col-span-2 lg:col-span-1">
            <div>
              <span className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">कुल बुकिंग्स</span>
              <span className="font-display font-black text-2xl text-slate-900">{inquiries.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
              📊
            </div>
          </div>

          <div 
            onClick={() => setFilter("pending")}
            className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              filter === "pending" ? "bg-amber-100 border-amber-400 ring-2 ring-amber-400" : "bg-white border-slate-200"
            }`}
          >
            <div>
              <span className="block text-[10px] font-black uppercase text-amber-700 tracking-wider">नई / पेंडिंग</span>
              <span className="font-display font-black text-2xl text-amber-600">{pendingCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div 
            onClick={() => setFilter("contacted")}
            className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              filter === "contacted" ? "bg-blue-100 border-blue-400 ring-2 ring-blue-400" : "bg-white border-slate-200"
            }`}
          >
            <div>
              <span className="block text-[10px] font-black uppercase text-blue-700 tracking-wider">कॉल हुई</span>
              <span className="font-display font-black text-2xl text-blue-700">{contactedCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold border border-blue-200">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div 
            onClick={() => setFilter("completed")}
            className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              filter === "completed" ? "bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400" : "bg-white border-slate-200"
            }`}
          >
            <div>
              <span className="block text-[10px] font-black uppercase text-emerald-700 tracking-wider">सफल डिलीवरी</span>
              <span className="font-display font-black text-2xl text-emerald-700">{completedCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold border border-emerald-200">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div 
            onClick={() => setFilter("cancelled")}
            className={`p-4 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
              filter === "cancelled" ? "bg-red-100 border-red-400 ring-2 ring-red-400" : "bg-white border-slate-200"
            }`}
          >
            <div>
              <span className="block text-[10px] font-black uppercase text-red-700 tracking-wider">रद्द</span>
              <span className="font-display font-black text-2xl text-red-600">{cancelledCount}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold border border-red-200">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: `सभी (${inquiries.length})` },
              { id: "pending", label: `पेंडिंग (${pendingCount})` },
              { id: "contacted", label: `कॉल हुई (${contactedCount})` },
              { id: "completed", label: `डिलीवर (${completedCount})` },
              { id: "cancelled", label: `रद्द (${cancelledCount})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setFilter(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  filter === t.id
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:max-w-xs">
            <input
              type="text"
              placeholder="नाम, फोन, कोड या पता खोजें..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-slate-50 text-slate-800 placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Inquiries Cards Feed */}
        {filteredInquiries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
            कोई बुकिंग मैच नहीं हुई।
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
              const isSaved = savedSuccessId === inquiry.id;

              // Border indicator based on status
              let statusBorder = "border-l-[6px] border-l-amber-500";
              if (inquiry.status === "contacted") statusBorder = "border-l-[6px] border-l-blue-600";
              else if (inquiry.status === "completed") statusBorder = "border-l-[6px] border-l-emerald-600";
              else if (inquiry.status === "cancelled") statusBorder = "border-l-[6px] border-l-red-600";

              return (
                <div
                  key={inquiry.id}
                  className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 transition-all flex flex-col gap-4 ${statusBorder}`}
                >
                  {/* Card Header: Code, Badges, Timestamp & Action Links */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs px-2.5 py-1 bg-slate-100 text-slate-900 rounded-lg border border-slate-200 flex items-center gap-1.5">
                        {inquiry.inquiry_code}
                        <a 
                          href={`/track/${inquiry.inquiry_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="पर्ची खोलें"
                          className="text-slate-400 hover:text-slate-800"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </span>

                      {/* Status Chip */}
                      <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider ${
                        inquiry.status === "pending" ? "bg-amber-100 text-amber-800" :
                        inquiry.status === "contacted" ? "bg-blue-100 text-blue-800" :
                        inquiry.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {inquiry.status === "pending" ? "नया पेंडिंग" :
                         inquiry.status === "contacted" ? "संपर्क हुआ" :
                         inquiry.status === "completed" ? "डिलीवर" : "रद्द"}
                      </span>

                      <span className="text-[11px] text-slate-400 font-medium">
                        {new Date(inquiry.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                      </span>
                    </div>

                    {/* Delete inquiry button */}
                    <button
                      onClick={() => handleDelete(inquiry.id)}
                      disabled={isPending}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="डिलीट करें"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Customer Information & 1-Tap Golden Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-blue-900 text-white font-extrabold flex items-center justify-center shrink-0 text-sm shadow-sm">
                        {inquiry.full_name ? inquiry.full_name.slice(0, 2) : "KT"}
                      </div>
                      <div>
                        <h3 className="font-display font-extrabold text-base text-slate-900 leading-tight">
                          {inquiry.full_name}
                        </h3>
                        <span className="text-xs text-slate-600 font-bold block mt-0.5">
                          📞 {inquiry.phone_number}
                        </span>
                      </div>
                    </div>

                    {/* Golden Action Buttons (Direct Call & WhatsApp) */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${inquiry.phone_number}`}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>कॉल करें</span>
                      </a>

                      <a
                        href={getCustomerWhatsAppUrl(inquiry)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                        <span>व्हाट्सएप</span>
                      </a>
                    </div>
                  </div>

                  {/* Route & Cargo Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                        📍 रूट (Route)
                      </span>
                      <p className="font-bold text-slate-900">
                        <span className="text-emerald-700">पिकअप:</span> {inquiry.pickup_location}
                      </p>
                      <p className="font-bold text-slate-900 mt-1">
                        <span className="text-red-600">ड्रॉप:</span> {inquiry.drop_location}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                        📅 समय व तारीख
                      </span>
                      <p className="font-bold text-slate-900">{inquiry.booking_date}</p>
                      <p className="text-slate-600 font-medium mt-0.5">{inquiry.booking_time}</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                        📦 सामान का प्रकार
                      </span>
                      <p className="font-bold text-slate-900">{inquiry.goods_type}</p>
                      {inquiry.weight ? (
                        <p className="text-blue-800 font-bold mt-0.5">वजन: {inquiry.weight}</p>
                      ) : (
                        <p className="text-slate-400 italic mt-0.5">वजन तय नहीं</p>
                      )}
                    </div>
                  </div>

                  {inquiry.notes && (
                    <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-900 font-medium">
                      <strong>📝 कस्टमर का नोट:</strong> {inquiry.notes}
                    </div>
                  )}

                  {inquiry.status === "cancelled" && inquiry.cancellation_reason && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-800 font-medium">
                      <strong>🛑 कैंसलेशन कारण:</strong> {inquiry.cancellation_reason}
                    </div>
                  )}

                  {/* Operational Controls: Driver, Fare, Status & Forward */}
                  <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200 flex flex-col gap-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 border-b border-slate-200 pb-1 flex items-center justify-between">
                      <span>🚚 ड्राइवर और किराया तय करें (कस्टमर को तुरंत दिखेगा)</span>
                      {isSaved && (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          अपडेट सुरक्षित हुआ!
                        </span>
                      )}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                      {/* Quoted Fare */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">तय किराया (₹)</label>
                        <input
                          type="number"
                          placeholder="उदा. 800"
                          value={localForm.quoted_amount}
                          onChange={(e) => handleFormChange(inquiry.id, "quoted_amount", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white font-bold text-slate-900 text-sm"
                        />
                      </div>

                      {/* Status */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">बुकिंग स्थिति (Status)</label>
                        <select
                          value={localForm.status}
                          onChange={(e) => handleFormChange(inquiry.id, "status", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white font-bold text-slate-900 text-xs"
                        >
                          <option value="pending">पेंडिंग (Pending)</option>
                          <option value="contacted">बातचीत हुई (Contacted)</option>
                          <option value="assigned">गाड़ी तय (Assigned)</option>
                          <option value="in_transit">रास्ते में (In Transit)</option>
                          <option value="completed">डिलीवर पूरा (Completed)</option>
                          <option value="cancelled">रद्द (Cancelled)</option>
                        </select>
                      </div>

                      {/* Driver Name */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">ड्राइवर का नाम</label>
                        <input
                          type="text"
                          placeholder="उदा. सोनू भैया"
                          value={localForm.driver_name}
                          onChange={(e) => handleFormChange(inquiry.id, "driver_name", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white font-medium text-slate-900"
                        />
                      </div>

                      {/* Driver Phone */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">ड्राइवर का फोन नंबर</label>
                        <input
                          type="tel"
                          placeholder="10 अंकों का फोन"
                          value={localForm.driver_phone}
                          onChange={(e) => handleFormChange(inquiry.id, "driver_phone", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white font-medium text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end pt-1">
                      {/* Vehicle Number */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 mb-1">गाड़ी का नंबर प्लेट</label>
                        <input
                          type="text"
                          placeholder="उदा. UP 65 BT 1234"
                          value={localForm.vehicle_number}
                          onChange={(e) => handleFormChange(inquiry.id, "vehicle_number", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white font-bold text-slate-900 uppercase"
                        />
                      </div>

                      {/* Send Duty Ticket to Driver Button */}
                      {localForm.driver_phone ? (
                        <a
                          href={getDriverWhatsAppUrl(inquiry, localForm.driver_phone, localForm.quoted_amount)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                          title="ड्राइवर के व्हाट्सएप पर पर्ची भेजें"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>ड्राइवर को व्हाट्सएप भेजें</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2.5 px-3 bg-slate-200 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>ड्राइवर फोन डालें</span>
                        </button>
                      )}

                      {/* Save Changes Button */}
                      <button
                        onClick={() => handleSaveDetails(inquiry.id)}
                        disabled={isUpdating}
                        className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>अपडेट सेव करें</span>
                      </button>
                    </div>

                    {localForm.status === "cancelled" && (
                      <div className="mt-2">
                        <label className="block text-[10px] font-bold text-red-600 mb-1">कैंसलेशन का कारण लिखें</label>
                        <input
                          type="text"
                          placeholder="उदा. ग्राहक ने मना किया / गाड़ी उपलब्ध नहीं"
                          value={localForm.cancellation_reason}
                          onChange={(e) => handleFormChange(inquiry.id, "cancellation_reason", e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-red-200 focus:outline-none focus:ring-1 focus:ring-red-500 bg-white text-xs font-medium text-slate-900"
                        />
                      </div>
                    )}
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
