"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
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
  Send,
  X,
  LayoutDashboard,
  ClipboardList,
  Users,
  Calculator,
  Settings,
  Plus,
  CheckCircle2,
  Smartphone,
  Navigation,
  ShieldCheck,
  Building2,
  HelpCircle
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

// Type definitions
type AdminTab = "dashboard" | "orders" | "drivers" | "rates" | "settings";

interface DriverItem {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: "available" | "on_duty";
}

const DEFAULT_DRIVERS: DriverItem[] = [
  { id: "d1", name: "सोनू यादव", phone: "9838123456", vehicleType: "टाटा एस (छोटा हाथी)", vehicleNumber: "UP 65 BT 4512", status: "available" },
  { id: "d2", name: "विनोद कुमार", phone: "9450654321", vehicleType: "महिन्द्रा अल्फा (3W)", vehicleNumber: "UP 65 AT 8921", status: "available" },
  { id: "d3", name: "पप्पू सिंह", phone: "9919786543", vehicleType: "पियाजियो आपे टेम्पो", vehicleNumber: "UP 65 CT 3314", status: "on_duty" },
  { id: "d4", name: "राजेश मौर्या", phone: "9795129876", vehicleType: "महिन्द्रा बोलेरो पिकअप", vehicleNumber: "UP 65 ET 7720", status: "available" },
];

const LOCATIONS_FOR_CALC = [
  { id: "salarpur", name: "सलारपुर (HQ डिपो)", km: 0 },
  { id: "lanka", name: "लंका / बीएचयू", km: 14 },
  { id: "sigra", name: "सिगरा / रथयात्रा", km: 8 },
  { id: "cantt", name: "कैंट रेलवे स्टेशन", km: 6 },
  { id: "godowlia", name: "गोदौलिया / चौक", km: 10 },
  { id: "shivpur", name: "शिवपुर / तरना", km: 7 },
  { id: "pandeypur", name: "पांडेयपुर / पहड़िया", km: 4 },
  { id: "ramnagar", name: "रामनगर / पड़ाव", km: 16 },
  { id: "babatpur", name: "बाबतपुर एयरपोर्ट", km: 24 },
  { id: "chandauli", name: "चंदौली / मुगलसराय", km: 32 },
  { id: "mirzapur", name: "मिर्ज़ापुर", km: 65 },
  { id: "jaunpur", name: "जौनपुर", km: 62 },
  { id: "bhadohi", name: "भदोही", km: 48 },
  { id: "azamgarh", name: "आज़मगढ़", km: 104 },
  { id: "ghazipur", name: "गाज़ीपुर", km: 78 },
  { id: "mau", name: "मऊ", km: 98 },
];

const VEHICLES_FOR_CALC = [
  { id: "alfa", name: "महिंद्रा अल्फा (500 KG)", baseRate: 600, perKm: 20 },
  { id: "tata-ace", name: "टाटा एस छोटा हाथी (1.2 टन)", baseRate: 750, perKm: 26 },
  { id: "tempo", name: "पियाजियो आपे (750 KG)", baseRate: 650, perKm: 22 },
  { id: "pickup", name: "बोलेरो पिकअप (1.7 टन)", baseRate: 1000, perKm: 30 },
];

// Web Audio API Synthesizer for high-pitch order notification chime
const playBookingSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") ctx.resume();

    const playChimeTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    playChimeTone(784, 0, 0.22);
    playChimeTone(1046, 0.14, 0.22);
    playChimeTone(1318, 0.28, 0.28);
    playChimeTone(1568, 0.42, 0.45);
    playChimeTone(784, 0.7, 0.22);
    playChimeTone(1046, 0.84, 0.22);
    playChimeTone(1318, 0.98, 0.28);
    playChimeTone(1568, 1.12, 0.55);
  } catch (err) {
    console.error("Audio error:", err);
  }
};

export default function AdminDashboard() {
  const router = useRouter();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Core auth & data states
  const [token, setToken] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Sound & alert states
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState<any | null>(null);

  // Orders Filter and Search
  const [orderFilter, setOrderFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Drivers Fleet Directory State (persisted locally)
  const [drivers, setDrivers] = useState<DriverItem[]>(DEFAULT_DRIVERS);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");
  const [newDriverVehicle, setNewDriverVehicle] = useState("टाटा एस (छोटा हाथी)");
  const [newDriverPlate, setNewDriverPlate] = useState("");

  // Rate calculator in-tab state
  const [calcPickup, setCalcPickup] = useState("salarpur");
  const [calcDrop, setCalcDrop] = useState("lanka");
  const [calcVehicle, setCalcVehicle] = useState("tata-ace");

  // Load sound & drivers from localStorage
  useEffect(() => {
    const mutedPref = localStorage.getItem("krishna_admin_sound_muted");
    if (mutedPref === "true") setIsSoundMuted(true);

    const savedDrivers = localStorage.getItem("krishna_admin_drivers_list");
    if (savedDrivers) {
      try {
        const parsed = JSON.parse(savedDrivers);
        if (Array.isArray(parsed) && parsed.length > 0) setDrivers(parsed);
      } catch (e) {
        console.error("Error loading drivers:", e);
      }
    }
  }, []);

  const toggleSoundMute = () => {
    setIsSoundMuted((prev) => {
      const next = !prev;
      localStorage.setItem("krishna_admin_sound_muted", String(next));
      if (!next) playBookingSound();
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
        
        const result = await getInquiries(accessToken);
        if (result.success && result.inquiries) {
          setInquiries(result.inquiries);
          setIsAuthorized(true);
        } else {
          setError(result.error || "इन्क्वायरी लोड करने में समस्या आई।");
        }
      } catch (err) {
        console.error("Admin verification exception:", err);
        setError("कनेक्शन त्रुटि। कृपया दोबारा लॉगिन करें।");
      } finally {
        setCheckingSession(false);
      }
    }

    verifyAdminSession();
  }, [router]);

  // 2. Realtime Listener on public:inquiries
  useEffect(() => {
    if (!isAuthorized) return;

    const channel = supabase
      .channel("admin-inquiries-live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "inquiries" },
        (payload) => {
          const newRow = payload.new;
          setInquiries((prev) => [newRow, ...prev.filter((i) => i.id !== newRow.id)]);
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

          if (!isSoundMuted) playBookingSound();
          if (typeof navigator !== "undefined" && navigator.vibrate) {
            navigator.vibrate([400, 200, 400, 200, 600]);
          }
          setNewOrderAlert(newRow);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "inquiries" },
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

  // 3. Initialize input form states when inquiries change
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

  // Quick auto-fill driver from fleet list
  const handleAssignDriverPreset = (inquiryId: string, driverId: string) => {
    const selected = drivers.find((d) => d.id === driverId);
    if (!selected) return;

    setFormStates((prev) => ({
      ...prev,
      [inquiryId]: {
        ...prev[inquiryId],
        driver_name: selected.name,
        driver_phone: selected.phone,
        vehicle_number: selected.vehicleNumber,
        status: prev[inquiryId]?.status === "pending" ? "assigned" : prev[inquiryId]?.status,
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
    if (window.confirm("क्या आप वाकई इस लीड को हटाना चाहते हैं?")) {
      startTransition(async () => {
        const result = await deleteInquiry(id, token);
        if (result.success) {
          setInquiries((prev) => prev.filter((item) => item.id !== id));
        } else {
          alert(`Error: ${result.error}`);
        }
      });
    }
  };

  // Add new driver to local fleet directory
  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName || !newDriverPhone) {
      alert("कृपया नाम और फोन नंबर दर्ज करें।");
      return;
    }
    const newEntry: DriverItem = {
      id: `d-${Date.now()}`,
      name: newDriverName.trim(),
      phone: newDriverPhone.trim(),
      vehicleType: newDriverVehicle,
      vehicleNumber: newDriverPlate.trim() || "UP 65 BT ----",
      status: "available",
    };
    const updated = [newEntry, ...drivers];
    setDrivers(updated);
    localStorage.setItem("krishna_admin_drivers_list", JSON.stringify(updated));
    setNewDriverName("");
    setNewDriverPhone("");
    setNewDriverPlate("");
    setShowAddDriverModal(false);
  };

  const toggleDriverStatus = (id: string) => {
    const updated = drivers.map((d) => 
      d.id === id ? { ...d, status: d.status === "available" ? "on_duty" as const : "available" as const } : d
    );
    setDrivers(updated);
    localStorage.setItem("krishna_admin_drivers_list", JSON.stringify(updated));
  };

  const deleteDriver = (id: string) => {
    if (window.confirm("ड्राइवर को लिस्ट से हटाना है?")) {
      const updated = drivers.filter((d) => d.id !== id);
      setDrivers(updated);
      localStorage.setItem("krishna_admin_drivers_list", JSON.stringify(updated));
    }
  };

  // WhatsApp helpers
  const getCustomerWhatsAppUrl = (inquiry: any) => {
    const cleanPhone = inquiry.phone_number.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `नमस्ते ${inquiry.full_name} जी!
मैं कृष्णा ट्रांसपोर्ट वाराणसी से रोहित सिंह बोल रहा हूँ।

आपकी बुकिंग (${inquiry.inquiry_code}) हमें प्राप्त हुई है:
📍 पिकअप: ${inquiry.pickup_location}
🏁 ड्रॉप: ${inquiry.drop_location}
📅 तारीख: ${inquiry.booking_date} (${inquiry.booking_time})
📦 सामान: ${inquiry.goods_type}

किराया फाइनल करने और गाड़ी पक्की करने के लिए कृपया संपर्क करें।`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  const getDriverWhatsAppUrl = (inquiry: any, driverPhone: string, quotedAmount: string) => {
    const cleanPhone = driverPhone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const trackingUrl = `https://www.krishnatransports.com/track/${inquiry.inquiry_code}`;
    const msg = `🚚 *कृष्णा ट्रांसपोर्ट - ड्यूटी पर्ची*
बुकिंग कोड: ${inquiry.inquiry_code}

📍 *पिकअप:* ${inquiry.pickup_location}
🏁 *ड्रॉप:* ${inquiry.drop_location}
📅 *तारीख व समय:* ${inquiry.booking_date} (${inquiry.booking_time})

👤 *ग्राहक:* ${inquiry.full_name}
📞 *ग्राहक फोन:* ${inquiry.phone_number}
📦 *सामान:* ${inquiry.goods_type}${inquiry.weight ? ` (वजन: ${inquiry.weight})` : ""}
${inquiry.notes ? `📝 *नोट:* ${inquiry.notes}\n` : ""}
💰 *तय किराया:* ₹${quotedAmount || "तय होना बाकी"}
🔗 *लाइव ट्रैकिंग:* ${trackingUrl}

रोहित सिंह (कृष्णा ट्रांसपोर्ट)`;
    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesFilter = orderFilter === "all" || item.status === orderFilter;
      const codeString = item.inquiry_code || "";
      const nameString = item.full_name || "";
      const phoneString = item.phone_number || "";
      const pickupString = item.pickup_location || "";
      const dropString = item.drop_location || "";
      const goodsString = item.goods_type || "";

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        codeString.toLowerCase().includes(term) ||
        nameString.toLowerCase().includes(term) ||
        phoneString.includes(term) ||
        pickupString.toLowerCase().includes(term) ||
        dropString.toLowerCase().includes(term) ||
        goodsString.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [inquiries, orderFilter, searchTerm]);

  // Statistics
  const pendingCount = inquiries.filter((i) => i.status === "pending").length;
  const contactedCount = inquiries.filter((i) => i.status === "contacted").length;
  const assignedCount = inquiries.filter((i) => i.status === "assigned" || i.status === "in_transit").length;
  const completedCount = inquiries.filter((i) => i.status === "completed").length;
  const cancelledCount = inquiries.filter((i) => i.status === "cancelled").length;

  const totalQuotedAmount = useMemo(() => {
    return inquiries.reduce((sum, item) => {
      const amt = item.quoted_amount ? Number(item.quoted_amount) : 0;
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
  }, [inquiries]);

  // Fare estimation calculation for Rates Tab
  const calculatedFare = useMemo(() => {
    const pLoc = LOCATIONS_FOR_CALC.find((l) => l.id === calcPickup) || LOCATIONS_FOR_CALC[0];
    const dLoc = LOCATIONS_FOR_CALC.find((l) => l.id === calcDrop) || LOCATIONS_FOR_CALC[1];
    const veh = VEHICLES_FOR_CALC.find((v) => v.id === calcVehicle) || VEHICLES_FOR_CALC[0];

    let distance = Math.abs(pLoc.km - dLoc.km);
    if (distance === 0) distance = 4;
    else distance = Math.max(distance, 5);

    const min = veh.baseRate;
    const est = veh.baseRate + Math.round(distance * veh.perKm);
    return {
      distance,
      minFare: Math.round(min / 50) * 50,
      estFare: Math.round(est / 50) * 50,
      vehicleName: veh.name,
      pickupName: pLoc.name,
      dropName: dLoc.name,
    };
  }, [calcPickup, calcDrop, calcVehicle]);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="mt-4 text-sm font-bold text-slate-300">एडमिन सेशन लोड हो रहा है...</p>
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
          <p className="text-sm text-slate-500 mb-6">{error || "कृपया रोहित सिंह के ईमेल (rohitsingh0641346@gmail.com) से लॉगिन करें।"}</p>
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
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col lg:flex-row">
      
      {/* 🔴 Realtime New Booking Alert Toast / Modal */}
      {newOrderAlert && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-lg mx-auto bg-slate-900 text-white p-4.5 rounded-2xl shadow-2xl border-2 border-orange-500 animate-bounce">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
                <BellRing className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                  नई बुकिंग प्राप्त हुई!
                </span>
                <h4 className="font-display font-black text-sm sm:text-base mt-0.5">
                  {newOrderAlert.full_name} ({newOrderAlert.inquiry_code})
                </h4>
                <p className="text-xs text-slate-300 font-medium">
                  📍 {newOrderAlert.pickup_location} ➔ {newOrderAlert.drop_location}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setNewOrderAlert(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-800">
            <a
              href={`tel:${newOrderAlert.phone_number}`}
              className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>कॉल ({newOrderAlert.phone_number})</span>
            </a>
            <a
              href={getCustomerWhatsAppUrl(newOrderAlert)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span>व्हाट्सएप</span>
            </a>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. DESKTOP SIDEBAR NAVIGATION (Hidden on mobile)         */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col justify-between shrink-0 p-4 sticky top-0 h-screen border-r border-slate-800 z-30">
        <div className="flex flex-col gap-6">
          {/* Brand & Admin Identity */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-base shadow-md">
              KT
            </div>
            <div>
              <span className="font-display font-extrabold text-sm text-white block leading-tight">
                कृष्णा ट्रांसपोर्ट
              </span>
              <span className="text-[11px] text-slate-400 font-semibold block">
                रोहित सिंह (एडमिन)
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: "dashboard", label: "डैशबोर्ड", icon: LayoutDashboard },
              { id: "orders", label: "ऑर्डर्स & बुकिंग्स", icon: ClipboardList, badge: pendingCount > 0 ? pendingCount : null },
              { id: "drivers", label: "ड्राइवर्स & गाड़ियां", icon: Truck },
              { id: "rates", label: "किराया कैलकुलेटर", icon: Calculator },
              { id: "settings", label: "सेटिंग्स & प्रोफाइल", icon: Settings },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComp className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              लाइव सर्वर
            </span>
            <button
              onClick={toggleSoundMute}
              className={`p-1.5 rounded-lg border cursor-pointer ${
                isSoundMuted ? "bg-slate-800 text-slate-500 border-slate-700" : "bg-orange-500/20 text-orange-400 border-orange-500/40"
              }`}
              title={isSoundMuted ? "साउंड ऑन करें" : "साउंड म्यूट करें"}
            >
              {isSoundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3 bg-slate-800 hover:bg-red-950/40 hover:text-red-400 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>लॉगआउट</span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN CONTENT AREA (Responsive)                        */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-10">
        
        {/* Mobile & Desktop Header Top Bar */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Branding */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-xs shadow-sm">
                KT
              </div>
              <span className="font-display font-extrabold text-sm text-slate-900">
                कृष्णा एडमिन
              </span>
            </div>

            {/* Desktop Breadcrumb Heading */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-500">
              <span>एडमिन पैनल</span>
              <span>/</span>
              <span className="text-slate-900 capitalize font-extrabold">
                {activeTab === "dashboard" ? "डैशबोर्ड ओवरव्यू" :
                 activeTab === "orders" ? "ऑर्डर्स & बुकिंग्स" :
                 activeTab === "drivers" ? "ड्राइवर्स & गाड़ियां" :
                 activeTab === "rates" ? "किराया कैलकुलेटर" : "सेटिंग्स"}
              </span>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTestSound}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
              title="घंटी टेस्ट करें"
            >
              <Bell className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden sm:inline">टेस्ट घंटी</span>
            </button>

            <button
              onClick={toggleSoundMute}
              className={`p-2 rounded-xl transition-all border cursor-pointer lg:hidden ${
                isSoundMuted ? "bg-slate-100 text-slate-400 border-slate-200" : "bg-orange-50 text-orange-600 border-orange-200"
              }`}
            >
              {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleRefresh}
              disabled={refreshLoading}
              className="p-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200 cursor-pointer"
              title="रीफ्रेश करें"
            >
              <RefreshCw className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`} />
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 text-xs">
              <span className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-[10px]">
                RS
              </span>
              <span className="font-bold text-slate-800">रोहित सिंह</span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          
          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD (ओवरव्यू & त्वरित स्थिति)                  */}
          {/* ======================================================== */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-6">
              
              {/* Stat Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                <div 
                  onClick={() => { setActiveTab("orders"); setOrderFilter("pending"); }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-amber-500"
                >
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider block mb-1">
                    नई बुकिंग्स (पेंडिंग)
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-3xl text-slate-900">{pendingCount}</span>
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    तुरंत किराया व ड्राइवर तय करें
                  </span>
                </div>

                <div 
                  onClick={() => { setActiveTab("orders"); setOrderFilter("contacted"); }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-600"
                >
                  <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider block mb-1">
                    कॉल / बातचीत चालू
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-3xl text-slate-900">{contactedCount}</span>
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    ग्राहक से फोन पर बात हुई
                  </span>
                </div>

                <div 
                  onClick={() => { setActiveTab("orders"); setOrderFilter("completed"); }}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer border-l-4 border-l-emerald-600"
                >
                  <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block mb-1">
                    डिलीवर ट्रिप्स
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-3xl text-slate-900">{completedCount}</span>
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    सफल माल डिलीवरी
                  </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs border-l-4 border-l-slate-900">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-1">
                    कुल तय किराया (₹)
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                      ₹{totalQuotedAmount.toLocaleString("en-IN")}
                    </span>
                    <Package className="w-6 h-6 text-slate-700" />
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                    कुल {inquiries.length} बुकिंग्स का योग
                  </span>
                </div>
              </div>

              {/* Action Required: Urgent Pending Inquiries */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="font-display font-black text-base text-slate-900">
                      आवश्यक कार्रवाई (तुरंत अटेंड करें)
                    </h2>
                    <p className="text-xs text-slate-500">
                      वे बुकिंग्स जिनका किराया तय करना या ड्राइवर असाइन करना बाकी है।
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveTab("orders"); setOrderFilter("pending"); }}
                    className="text-xs font-bold text-blue-900 hover:underline"
                  >
                    सभी देखें ({pendingCount})
                  </button>
                </div>

                {inquiries.filter((i) => i.status === "pending").length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs font-medium">
                    🎉 बहुत बढ़िया! कोई पेंडिंग बुकिंग नहीं है। सभी बुकिंग्स अटेंड हो चुकी हैं।
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {inquiries.filter((i) => i.status === "pending").slice(0, 4).map((inquiry) => (
                      <div key={inquiry.id} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col justify-between gap-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono font-bold text-xs bg-white px-2 py-0.5 rounded border border-amber-200 text-amber-900">
                              {inquiry.inquiry_code}
                            </span>
                            <h3 className="font-display font-extrabold text-sm text-slate-900 mt-1">
                              {inquiry.full_name} ({inquiry.phone_number})
                            </h3>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(inquiry.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-amber-100">
                          <p><strong>पिकअप:</strong> {inquiry.pickup_location}</p>
                          <p><strong>ड्रॉप:</strong> {inquiry.drop_location}</p>
                          <p><strong>सामान:</strong> {inquiry.goods_type}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${inquiry.phone_number}`}
                            className="flex-1 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>कॉल करें</span>
                          </a>
                          <a
                            href={getCustomerWhatsAppUrl(inquiry)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                            <span>व्हाट्सएप</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Fleet Quick Status & Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <h3 className="font-display font-black text-sm text-slate-900">
                      ड्राइवर फ्लीट स्थिति ({drivers.length} गाड़ियां)
                    </h3>
                    <button onClick={() => setActiveTab("drivers")} className="text-xs font-bold text-blue-900 hover:underline">
                      मैनेज करें
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {drivers.slice(0, 3).map((driver) => (
                      <div key={driver.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{driver.name}</span>
                          <span className="text-slate-500 block text-[11px]">{driver.vehicleType} • {driver.vehicleNumber}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          driver.status === "available" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {driver.status === "available" ? "खाली है" : "ड्यूटी पर"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                  <h3 className="font-display font-black text-sm text-slate-900 mb-2">
                    त्वरित टूल्स (Quick Actions)
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => setActiveTab("rates")}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs font-bold text-slate-800 flex flex-col gap-1 cursor-pointer"
                    >
                      <Calculator className="w-5 h-5 text-orange-500" />
                      <span>किराया कैलकुलेटर</span>
                      <span className="text-[10px] text-slate-500 font-normal">रूट रेट पता करें</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("drivers")}
                      className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left text-xs font-bold text-slate-800 flex flex-col gap-1 cursor-pointer"
                    >
                      <Plus className="w-5 h-5 text-blue-900" />
                      <span>नया ड्राइवर जोड़ें</span>
                      <span className="text-[10px] text-slate-500 font-normal">फ्लीट डायरेक्टरी</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: ORDERS (ऑर्डर्स & सम्पूर्ण लाइफसाइकिल)             */}
          {/* ======================================================== */}
          {activeTab === "orders" && (
            <div className="flex flex-col gap-5">
              
              {/* Filter Tabs & Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: "all", label: `सभी (${inquiries.length})` },
                    { id: "pending", label: `पेंडिंग (${pendingCount})` },
                    { id: "contacted", label: `कॉल हुई (${contactedCount})` },
                    { id: "assigned", label: `गाड़ी तय (${assignedCount})` },
                    { id: "completed", label: `डिलीवर (${completedCount})` },
                    { id: "cancelled", label: `रद्द (${cancelledCount})` },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setOrderFilter(t.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        orderFilter === t.id
                          ? "bg-slate-900 text-white border-slate-900"
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
                    placeholder="कोड, नाम, फोन या रूट खोजें..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 rounded-xl text-xs bg-slate-50 text-slate-900 placeholder-slate-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Orders Listing */}
              {filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                  कोई बुकिंग नहीं मिली।
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

                    let statusBorder = "border-l-[6px] border-l-amber-500";
                    if (inquiry.status === "contacted") statusBorder = "border-l-[6px] border-l-blue-600";
                    else if (inquiry.status === "assigned" || inquiry.status === "in_transit") statusBorder = "border-l-[6px] border-l-purple-600";
                    else if (inquiry.status === "completed") statusBorder = "border-l-[6px] border-l-emerald-600";
                    else if (inquiry.status === "cancelled") statusBorder = "border-l-[6px] border-l-red-600";

                    return (
                      <div
                        key={inquiry.id}
                        className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 transition-all flex flex-col gap-4 ${statusBorder}`}
                      >
                        {/* Top Meta Line */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono font-black text-xs px-2.5 py-1 bg-slate-100 text-slate-900 rounded-lg border border-slate-200 flex items-center gap-1.5">
                              {inquiry.inquiry_code}
                              <a 
                                href={`/track/${inquiry.inquiry_code}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="लाइव ट्रैकिंग पर्ची खोलें"
                                className="text-slate-400 hover:text-slate-900"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            </span>

                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                              inquiry.status === "pending" ? "bg-amber-100 text-amber-800" :
                              inquiry.status === "contacted" ? "bg-blue-100 text-blue-800" :
                              inquiry.status === "assigned" ? "bg-purple-100 text-purple-800" :
                              inquiry.status === "in_transit" ? "bg-indigo-100 text-indigo-800" :
                              inquiry.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {inquiry.status === "pending" ? "पेंडिंग" :
                               inquiry.status === "contacted" ? "कॉल हुई" :
                               inquiry.status === "assigned" ? "गाड़ी तय" :
                               inquiry.status === "in_transit" ? "रास्ते में" :
                               inquiry.status === "completed" ? "डिलीवर" : "रद्द"}
                            </span>

                            <span className="text-[11px] text-slate-400 font-medium">
                              {new Date(inquiry.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            disabled={isPending}
                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="डिलीट करें"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Customer Row with 1-Tap Golden Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-extrabold flex items-center justify-center shrink-0 text-xs shadow-xs">
                              {inquiry.full_name ? inquiry.full_name.slice(0, 2) : "KT"}
                            </div>
                            <div>
                              <h3 className="font-display font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                                {inquiry.full_name}
                              </h3>
                              <span className="text-xs text-slate-600 font-bold block mt-0.5">
                                📞 {inquiry.phone_number}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${inquiry.phone_number}`}
                              className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>कॉल</span>
                            </a>

                            <a
                              href={getCustomerWhatsAppUrl(inquiry)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                              <span>व्हाट्सएप</span>
                            </a>
                          </div>
                        </div>

                        {/* Route & Cargo Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
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
                              📅 शेड्यूल
                            </span>
                            <p className="font-bold text-slate-900">{inquiry.booking_date}</p>
                            <p className="text-slate-600 font-medium mt-0.5">{inquiry.booking_time}</p>
                          </div>

                          <div className="bg-slate-50 border border-slate-150 p-3 rounded-xl">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">
                              📦 सामान व वजन
                            </span>
                            <p className="font-bold text-slate-900">{inquiry.goods_type}</p>
                            {inquiry.weight ? (
                              <p className="text-blue-900 font-bold mt-0.5">वजन: {inquiry.weight}</p>
                            ) : (
                              <p className="text-slate-400 italic mt-0.5">वजन तय नहीं</p>
                            )}
                          </div>
                        </div>

                        {inquiry.notes && (
                          <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl text-xs text-amber-900 font-medium">
                            <strong>नोट:</strong> {inquiry.notes}
                          </div>
                        )}

                        {/* Operational Edit Box: Fare, Driver, Status */}
                        <div className="bg-slate-150/60 rounded-2xl p-4 border border-slate-200 flex flex-col gap-3">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="text-[11px] font-extrabold text-slate-800">
                              किराया व ड्राइवर असाइनमेंट (ग्राहक लाइव देखता है)
                            </span>
                            {isSaved && (
                              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 animate-pulse">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                सेव हो गया!
                              </span>
                            )}
                          </div>

                          {/* Quick Auto-fill Driver Selector */}
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">
                              फ्लीट से ड्राइवर चुनें (ऑटो-फिल):
                            </label>
                            <select
                              onChange={(e) => {
                                if (e.target.value) handleAssignDriverPreset(inquiry.id, e.target.value);
                              }}
                              defaultValue=""
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                            >
                              <option value="">-- ड्राइवर लिस्ट से चुनें या नीचे टाइप करें --</option>
                              {drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.name} ({d.vehicleType} - {d.vehicleNumber}) [{d.status === "available" ? "उपलब्ध" : "ड्यूटी पर"}]
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">तय किराया (₹)</label>
                              <input
                                type="number"
                                placeholder="उदा. 800"
                                value={localForm.quoted_amount}
                                onChange={(e) => handleFormChange(inquiry.id, "quoted_amount", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">स्थिति (Status)</label>
                              <select
                                value={localForm.status}
                                onChange={(e) => handleFormChange(inquiry.id, "status", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                              >
                                <option value="pending">पेंडिंग (Pending)</option>
                                <option value="contacted">बातचीत हुई (Contacted)</option>
                                <option value="assigned">गाड़ी तय (Assigned)</option>
                                <option value="in_transit">रास्ते में (In Transit)</option>
                                <option value="completed">डिलीवर (Completed)</option>
                                <option value="cancelled">रद्द (Cancelled)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">ड्राइवर का नाम</label>
                              <input
                                type="text"
                                placeholder="उदा. सोनू यादव"
                                value={localForm.driver_name}
                                onChange={(e) => handleFormChange(inquiry.id, "driver_name", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-900"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">ड्राइवर फोन</label>
                              <input
                                type="tel"
                                placeholder="10 डिजिट नंबर"
                                value={localForm.driver_phone}
                                onChange={(e) => handleFormChange(inquiry.id, "driver_phone", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-900"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end pt-1">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">गाड़ी नंबर प्लेट</label>
                              <input
                                type="text"
                                placeholder="उदा. UP 65 BT 4512"
                                value={localForm.vehicle_number}
                                onChange={(e) => handleFormChange(inquiry.id, "vehicle_number", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 uppercase"
                              />
                            </div>

                            {/* Driver WhatsApp Forward Button */}
                            {localForm.driver_phone ? (
                              <a
                                href={getDriverWhatsAppUrl(inquiry, localForm.driver_phone, localForm.quoted_amount)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>ड्राइवर को पर्ची भेजें</span>
                              </a>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="w-full py-2.5 px-3 bg-slate-200 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                              >
                                <span>ड्राइवर फोन डालें</span>
                              </button>
                            )}

                            {/* Save Button */}
                            <button
                              onClick={() => handleSaveDetails(inquiry.id)}
                              disabled={isUpdating}
                              className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
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
                              <label className="block text-[10px] font-bold text-red-600 mb-1">कैंसलेशन कारण लिखें</label>
                              <input
                                type="text"
                                placeholder="उदा. ग्राहक का प्लान बदला"
                                value={localForm.cancellation_reason}
                                onChange={(e) => handleFormChange(inquiry.id, "cancellation_reason", e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-red-200 bg-white text-xs text-slate-900"
                              />
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: DRIVERS & FLEET (ड्राइवर्स & गाड़ियां)              */}
          {/* ======================================================== */}
          {activeTab === "drivers" && (
            <div className="flex flex-col gap-5">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display font-black text-lg text-slate-900">
                    फ्लीट एवं ड्राइवर डायरेक्टरी
                  </h2>
                  <p className="text-xs text-slate-500">
                    ड्राइवर्स की स्थिति ट्रैक करें और 1-क्लिक में कॉल या ड्यूटी असाइन करें।
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDriverModal(true)}
                  className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>नया ड्राइवर जोड़ें</span>
                </button>
              </div>

              {/* Drivers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center text-sm">
                            <Truck className="w-5 h-5 text-slate-700" />
                          </div>
                          <div>
                            <h3 className="font-display font-black text-sm text-slate-900">
                              {driver.name}
                            </h3>
                            <span className="text-xs text-slate-500 font-semibold block">
                              📞 {driver.phone}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteDriver(driver.id)}
                          className="text-slate-300 hover:text-red-600 p-1"
                          title="हटाएं"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs flex flex-col gap-1 mb-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">गाड़ी प्रकार:</span>
                          <span className="font-bold text-slate-800">{driver.vehicleType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-bold">नंबर प्लेट:</span>
                          <span className="font-bold text-slate-900 font-mono">{driver.vehicleNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">ड्यूटी स्थिति:</span>
                        <button
                          onClick={() => toggleDriverStatus(driver.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                            driver.status === "available"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                              : "bg-amber-100 text-amber-800 border border-amber-300"
                          }`}
                        >
                          {driver.status === "available" ? "🟢 उपलब्ध (खाली है)" : "🟡 ड्यूटी पर है"}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <a
                          href={`tel:${driver.phone}`}
                          className="py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>कॉल करें</span>
                        </a>

                        <a
                          href={`https://wa.me/91${driver.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                          <span>व्हाट्सएप</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Driver Modal */}
              {showAddDriverModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                      <h3 className="font-display font-black text-base text-slate-900">
                        नया ड्राइवर जोड़ें
                      </h3>
                      <button onClick={() => setShowAddDriverModal(false)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddDriver} className="flex flex-col gap-3.5 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">ड्राइवर का नाम *</label>
                        <input
                          type="text"
                          required
                          placeholder="उदा. रमेश कुमार"
                          value={newDriverName}
                          onChange={(e) => setNewDriverName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">मोबाइल नंबर *</label>
                        <input
                          type="tel"
                          required
                          placeholder="10 डिजिट फोन"
                          value={newDriverPhone}
                          onChange={(e) => setNewDriverPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">गाड़ी का प्रकार</label>
                        <select
                          value={newDriverVehicle}
                          onChange={(e) => setNewDriverVehicle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                        >
                          <option value="टाटा एस (छोटा हाथी)">टाटा एस (छोटा हाथी)</option>
                          <option value="महिन्द्रा अल्फा (3W)">महिन्द्रा अल्फा (3W लोडर)</option>
                          <option value="पियाजियो आपे टेम्पो">पियाजियो आपे टेम्पो</option>
                          <option value="महिन्द्रा बोलेरो पिकअप">महिन्द्रा बोलेरो पिकअप</option>
                          <option value="14-फीट आयशर">14-फीट आयशर</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">गाड़ी नंबर प्लेट</label>
                        <input
                          type="text"
                          placeholder="उदा. UP 65 BT 1234"
                          value={newDriverPlate}
                          onChange={(e) => setNewDriverPlate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setShowAddDriverModal(false)}
                          className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                        >
                          रद्द करें
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl"
                        >
                          सेव करें
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: RATES & FARE CALCULATOR (किराया चार्ट)            */}
          {/* ======================================================== */}
          {activeTab === "rates" && (
            <div className="flex flex-col gap-6">
              
              <div>
                <h2 className="font-display font-black text-lg text-slate-900">
                  किराया चार्ट एवं तुरंत रेट फाइंडर
                </h2>
                <p className="text-xs text-slate-500">
                  ग्राहक को फोन पर सही और पारदर्शी किराया बताने के लिए संदर्भ टूल।
                </p>
              </div>

              {/* In-App Quick Estimator */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-display font-black text-sm text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  तुरंत रेट कैलकुलेट करें (Varanasi Hubs)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-600 mb-1">पिकअप स्थान</label>
                    <select
                      value={calcPickup}
                      onChange={(e) => setCalcPickup(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-semibold"
                    >
                      {LOCATIONS_FOR_CALC.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">ड्रॉप स्थान</label>
                    <select
                      value={calcDrop}
                      onChange={(e) => setCalcDrop(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-semibold"
                    >
                      {LOCATIONS_FOR_CALC.map((l) => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-600 mb-1">गाड़ी का प्रकार</label>
                    <select
                      value={calcVehicle}
                      onChange={(e) => setCalcVehicle(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 font-semibold"
                    >
                      {VEHICLES_FOR_CALC.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Calculation Output Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">
                      दूरी: ~{calculatedFare.distance} KM | {calculatedFare.pickupName} ➔ {calculatedFare.dropName}
                    </span>
                    <h4 className="font-display font-black text-xl text-slate-900 mt-0.5">
                      अनुमानित किराया: ₹{calculatedFare.minFare} – ₹{calculatedFare.estFare}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      गाड़ी: {calculatedFare.vehicleName}
                    </span>
                  </div>

                  <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-center">
                    <span className="block text-[10px] text-slate-400 font-bold uppercase">हेल्पर के साथ (वैकल्पिक)</span>
                    <span className="font-bold text-slate-900 text-sm">
                      ₹{calculatedFare.estFare + 300} (+₹300/लेबर)
                    </span>
                  </div>
                </div>
              </div>

              {/* Standard Intercity Highway Corridors Table */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-display font-black text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100">
                  पूर्वांचल हाईवे मानक दरें (Standard Outstation Rates)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">रूट</th>
                        <th className="py-2.5">दूरी</th>
                        <th className="py-2.5">छोटा हाथी (टाटा एस)</th>
                        <th className="py-2.5">महिंद्रा पिकअप</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr>
                        <td className="py-2.5 font-bold">वाराणसी ➔ आज़मगढ़</td>
                        <td className="py-2.5">104 KM</td>
                        <td className="py-2.5 font-bold text-blue-900">₹2,400 – ₹2,800</td>
                        <td className="py-2.5 font-bold text-slate-900">₹3,200 – ₹3,600</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">वाराणसी ➔ मिर्ज़ापुर</td>
                        <td className="py-2.5">65 KM</td>
                        <td className="py-2.5 font-bold text-blue-900">₹1,600 – ₹1,950</td>
                        <td className="py-2.5 font-bold text-slate-900">₹2,200 – ₹2,600</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">वाराणसी ➔ चंदौली (मुगलसराय)</td>
                        <td className="py-2.5">32 KM</td>
                        <td className="py-2.5 font-bold text-blue-900">₹900 – ₹1,200</td>
                        <td className="py-2.5 font-bold text-slate-900">₹1,400 – ₹1,700</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">वाराणसी ➔ जौनपुर</td>
                        <td className="py-2.5">62 KM</td>
                        <td className="py-2.5 font-bold text-blue-900">₹1,600 – ₹1,900</td>
                        <td className="py-2.5 font-bold text-slate-900">₹2,200 – ₹2,500</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">वाराणसी ➔ गाज़ीपुर</td>
                        <td className="py-2.5">78 KM</td>
                        <td className="py-2.5 font-bold text-blue-900">₹1,900 – ₹2,300</td>
                        <td className="py-2.5 font-bold text-slate-900">₹2,600 – ₹3,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: SETTINGS & PROFILE (सेटिंग्स & प्रोफाइल)            */}
          {/* ======================================================== */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6 max-w-3xl">
              
              <div>
                <h2 className="font-display font-black text-lg text-slate-900">
                  सिस्टम सेटिंग्स एवं बिजनेस प्रोफाइल
                </h2>
                <p className="text-xs text-slate-500">
                  सूचनाएं, फोन ऐप इंस्टॉलेशन और एडमिन डिटेल्स प्रबंधित करें।
                </p>
              </div>

              {/* Profile Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-display font-black text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100">
                  मालिक व मुख्य कार्यालय प्रोफाइल
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">मालिक का नाम</span>
                    <span className="font-bold text-slate-900">रोहित सिंह</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">ईमेल पता</span>
                    <span className="font-bold text-slate-900">rohitsingh0641346@gmail.com</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">कॉलिंग हॉटलाइन</span>
                    <span className="font-bold text-slate-900">+91 70803 60217</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">व्हाट्सएप डेस्क</span>
                    <span className="font-bold text-slate-900">+91 70716 34535</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">मुख्य पता</span>
                    <span className="font-bold text-slate-900">सलारपुर, विद्या विहार इंटर कॉलेज के पीछे, वाराणसी - 221007</span>
                  </div>
                </div>
              </div>

              {/* Sound & Alert Preferences */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-display font-black text-sm text-slate-900 mb-3 pb-2 border-b border-slate-100">
                  ऑडियो अलर्ट व नोटिफिकेशन
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">नई बुकिंग ऑडियो घंटी</span>
                      <span className="text-[11px] text-slate-500">जब भी नई बुकिंग आए तो लाउड चाइम बजे</span>
                    </div>
                    <button
                      onClick={toggleSoundMute}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        isSoundMuted ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-emerald-100 text-emerald-800 border-emerald-300"
                      }`}
                    >
                      {isSoundMuted ? "बंद है" : "चालू है"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">घंटी टेस्ट करें</span>
                      <span className="text-[11px] text-slate-500">मोबाइल वॉल्यूम और वाइब्रेशन चेक करें</span>
                    </div>
                    <button
                      onClick={handleTestSound}
                      className="px-3 py-1.5 bg-blue-900 text-white rounded-xl text-xs font-bold"
                    >
                      बजाएं
                    </button>
                  </div>
                </div>
              </div>

              {/* PWA Phone Setup Instructions */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="font-display font-black text-sm text-slate-900 mb-2 pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-orange-500" />
                  <span>रोहित सिंह के फोन में ऐप सेट करने का तरीका (PWA)</span>
                </h3>
                <ol className="list-decimal list-inside text-xs text-slate-700 leading-relaxed flex flex-col gap-2">
                  <li>फोन के <strong>Chrome</strong> या <strong>Safari</strong> ब्राउज़र में इस एडमिन लिंक को खोलें।</li>
                  <li>ब्राउज़र के ऊपर दाईं ओर <strong>तीन बिंदुओं (⋮)</strong> या नीचे <strong>Share</strong> बटन पर टैप करें।</li>
                  <li>मेनू में <strong>&apos;Add to Home screen&apos; (होम स्क्रीन में जोड़ें)</strong> चुनें।</li>
                  <li>फोन के होम स्क्रीन पर <strong>&apos;कृष्णा एडमिन&apos;</strong> का ऐप आइकन आ जाएगा।</li>
                  <li>उस पर टैप करते ही यह बिना ब्राउज़र सर्च बार के असली ऐप की तरह फुल स्क्रीन में खुलेगा और कभी लॉगआउट नहीं होगा!</li>
                </ol>
              </div>

              {/* Logout Button */}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs rounded-xl border border-red-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>एडमिन पैनल से लॉगआउट करें</span>
                </button>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Hidden on desktop)       */}
      {/* ======================================================== */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg h-16 flex items-center justify-around px-2">
        {[
          { id: "dashboard", label: "डैशबोर्ड", icon: LayoutDashboard },
          { id: "orders", label: "ऑर्डर्स", icon: ClipboardList, badge: pendingCount > 0 ? pendingCount : null },
          { id: "drivers", label: "ड्राइवर्स", icon: Truck },
          { id: "rates", label: "किराया", icon: Calculator },
          { id: "settings", label: "सेटिंग्स", icon: Settings },
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 relative cursor-pointer ${
                isActive ? "text-orange-600 font-black" : "text-slate-500 font-medium"
              }`}
            >
              <div className="relative">
                <IconComp className={`w-5 h-5 ${isActive ? "scale-110" : ""}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-amber-500 text-slate-900 text-[9px] font-black flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 leading-none tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
