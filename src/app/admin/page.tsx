"use client";

import React, { useState, useEffect, useTransition, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { 
  getInquiries, 
  updateInquiryOperations, 
  deleteInquiry, 
  submitInquiry,
  getAdminReviews,
  toggleReviewApproval,
  deleteReview,
  submitCustomerReview,
  getPricingSettings,
  updatePricingSettings,
  PricingRecord,
  getDriversList,
  createDriverRecord,
  updateDriverStatusRecord,
  deleteDriverRecord,
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
  HelpCircle,
  ArrowRight,
  Sparkles,
  Sliders,
  PhoneCall,
  Activity,
  Layers,
  ChevronRight,
  Filter,
  IndianRupee,
  Star,
  MessageSquare,
  Image as ImageIcon,
  Edit3,
  Globe,
  Copy
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

// Type definitions
type AdminTab = "dashboard" | "orders" | "drivers" | "rates" | "cms" | "settings";

interface DriverItem {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: "available" | "on_duty";
}

interface VehicleRateConfig {
  id: string;
  name: string;
  baseRate: number;
  perKm: number;
}

const DEFAULT_DRIVERS: DriverItem[] = [
  { id: "d1", name: "सोनू यादव", phone: "9838123456", vehicleType: "टाटा एस (छोटा हाथी)", vehicleNumber: "UP 65 BT 4512", status: "available" },
  { id: "d2", name: "विनोद कुमार", phone: "9450654321", vehicleType: "महिन्द्रा अल्फा (3W)", vehicleNumber: "UP 65 AT 8921", status: "available" },
  { id: "d3", name: "पप्पू सिंह", phone: "9919786543", vehicleType: "पियाजियो आपे टेम्पो", vehicleNumber: "UP 65 CT 3314", status: "on_duty" },
  { id: "d4", name: "राजेश मौर्या", phone: "9795129876", vehicleType: "महिन्द्रा बोलेरो पिकअप", vehicleNumber: "UP 65 ET 7720", status: "available" },
];

const DEFAULT_VEHICLES: VehicleRateConfig[] = [
  { id: "alfa", name: "महिंद्रा अल्फा (500 KG)", baseRate: 600, perKm: 20 },
  { id: "tata-ace", name: "टाटा एस छोटा हाथी (1.2 टन)", baseRate: 750, perKm: 26 },
  { id: "tempo", name: "पियाजियो आपे (750 KG)", baseRate: 650, perKm: 22 },
  { id: "pickup", name: "बोलेरो पिकअप (1.7 टन)", baseRate: 1000, perKm: 30 },
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

// Web Audio API Synthesizer (Zero asset dependency)
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
  const [reviews, setReviews] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [refreshLoading, setRefreshLoading] = useState(false);

  // Sound alert state (Controlled exclusively via Settings tab)
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

  // Drivers Fleet Directory State (persisted in Supabase & local cache)
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriverName, setNewDriverName] = useState("");
  const [newDriverPhone, setNewDriverPhone] = useState("");
  const [newDriverVehicle, setNewDriverVehicle] = useState("टाटा एस (छोटा हाथी)");
  const [newDriverPlate, setNewDriverPlate] = useState("");

  // Dynamic Pricing Rates State (Configurable by Rohit Singh)
  const [vehicleRates, setVehicleRates] = useState<VehicleRateConfig[]>(DEFAULT_VEHICLES);
  const [rateHelperCharge, setRateHelperCharge] = useState(350);

  // Quick New Direct Booking Modal State
  const [showNewBookingModal, setShowNewBookingModal] = useState(false);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");
  const [newPickup, setNewPickup] = useState("");
  const [newDrop, setNewDrop] = useState("");
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);
  const [newTime, setNewTime] = useState("10:00 AM");
  const [newGoods, setNewGoods] = useState("दुकान / घर का सामान");
  const [newNotes, setNewNotes] = useState("");
  const [creatingBooking, setCreatingBooking] = useState(false);

  // Add Direct Review Modal State (Admin CMS)
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [revCustName, setRevCustName] = useState("");
  const [revCustPhone, setRevCustPhone] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState("");
  const [savingReview, setSavingReview] = useState(false);

  // Rate calculator in-tab state (Dynamic & Editable by Rohit Singh)
  const [calcMode, setCalcMode] = useState<"hub" | "custom">("hub");
  const [calcPickup, setCalcPickup] = useState("salarpur");
  const [calcDrop, setCalcDrop] = useState("lanka");
  const [calcCustomKm, setCalcCustomKm] = useState(15);
  const [calcVehicle, setCalcVehicle] = useState("tata-ace");
  const [customBaseRate, setCustomBaseRate] = useState<number>(750);
  const [customPerKm, setCustomPerKm] = useState<number>(26);
  const [calcHelpers, setCalcHelpers] = useState(1);
  const [customHelperCharge, setCustomHelperCharge] = useState(350);
  const [calcExtraCharges, setCalcExtraCharges] = useState(0);
  const [calcExtraReason, setCalcExtraReason] = useState("");
  const [calcIsRoundTrip, setCalcIsRoundTrip] = useState(false);
  const [calcPhone, setCalcPhone] = useState("");
  const [rateSavedMessage, setRateSavedMessage] = useState("");
  const [copiedQuote, setCopiedQuote] = useState(false);

  // Load sound, drivers & vehicle rates from localStorage
  useEffect(() => {
    const mutedPref = localStorage.getItem("krishna_admin_sound_muted");
    if (mutedPref === "true") setIsSoundMuted(true);

    const savedDrivers = localStorage.getItem("krishna_admin_drivers_list");
    if (savedDrivers !== null) {
      try {
        const parsed = JSON.parse(savedDrivers);
        if (Array.isArray(parsed)) setDrivers(parsed);
      } catch (e) {
        console.error("Error loading drivers:", e);
      }
    }

    const savedRates = localStorage.getItem("krishna_admin_vehicle_rates");
    if (savedRates) {
      try {
        const parsedRates = JSON.parse(savedRates);
        if (Array.isArray(parsedRates) && parsedRates.length > 0) setVehicleRates(parsedRates);
      } catch (e) {
        console.error("Error loading vehicle rates:", e);
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
        
        // Fetch inquiries
        const result = await getInquiries(accessToken);
        if (result.success && result.inquiries) {
          setInquiries(result.inquiries);
          setIsAuthorized(true);
        } else {
          setError(result.error || "Failed to load inquiries.");
        }

        // Fetch customer reviews
        const revResult = await getAdminReviews(accessToken);
        if (revResult.success && revResult.reviews) {
          setReviews(revResult.reviews);
        }

        // Fetch vehicle pricing settings from Supabase
        const priceResult = await getPricingSettings();
        if (priceResult.success && priceResult.pricing && priceResult.pricing.length > 0) {
          const mapped: VehicleRateConfig[] = priceResult.pricing.map((p) => ({
            id: p.id,
            name: p.vehicle_name,
            baseRate: Number(p.base_fare),
            perKm: Number(p.per_km_rate),
          }));
          setVehicleRates(mapped);
          if (priceResult.pricing[0]?.helper_rate) {
            setRateHelperCharge(Number(priceResult.pricing[0].helper_rate));
            setCustomHelperCharge(Number(priceResult.pricing[0].helper_rate));
          }
          const defaultV = mapped.find((v) => v.id === "tata-ace") || mapped[0];
          if (defaultV) {
            setCustomBaseRate(defaultV.baseRate);
            setCustomPerKm(defaultV.perKm);
          }
        }

        // Fetch drivers fleet from Supabase PostgreSQL
        const driverRes = await getDriversList();
        if (driverRes.success && driverRes.drivers) {
          setDrivers(driverRes.drivers);
          localStorage.setItem("krishna_admin_drivers_list", JSON.stringify(driverRes.drivers));
        }
      } catch (err) {
        console.error("Admin verification exception:", err);
        setError("Connection error. Please refresh or re-login.");
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
    const revResult = await getAdminReviews(token);
    if (revResult.success && revResult.reviews) {
      setReviews(revResult.reviews);
    }
    const priceRes = await getPricingSettings();
    if (priceRes.success && priceRes.pricing && priceRes.pricing.length > 0) {
      const mapped: VehicleRateConfig[] = priceRes.pricing.map((p) => ({
        id: p.id,
        name: p.vehicle_name,
        baseRate: Number(p.base_fare),
        perKm: Number(p.per_km_rate),
      }));
      setVehicleRates(mapped);
    }
    const driverRes = await getDriversList();
    if (driverRes.success && driverRes.drivers) {
      setDrivers(driverRes.drivers);
      localStorage.setItem("krishna_admin_drivers_list", JSON.stringify(driverRes.drivers));
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
    if (window.confirm("Are you sure you want to delete this booking lead?")) {
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

  // Add new driver to database & local fleet directory
  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName || !newDriverPhone) {
      alert("Please enter driver name and phone number.");
      return;
    }
    const payload = {
      name: newDriverName.trim(),
      phone: newDriverPhone.trim(),
      vehicleType: newDriverVehicle,
      vehicleNumber: newDriverPlate.trim() || "UP 65 BT ----",
      status: "available" as const,
    };

    const res = await createDriverRecord(payload, token);
    const newEntry: DriverItem = res.success && res.driver ? res.driver : {
      id: `d-${Date.now()}`,
      ...payload,
    };

    const updated = [newEntry, ...drivers];
    setDrivers(updated);
    localStorage.setItem("krishna_admin_drivers_list", JSON.stringify(updated));
    setNewDriverName("");
    setNewDriverPhone("");
    setNewDriverPlate("");
    setShowAddDriverModal(false);
  };

  const toggleDriverStatus = async (id: string) => {
    const target = drivers.find((d) => d.id === id);
    if (!target) return;
    const nextStatus = target.status === "available" ? ("on_duty" as const) : ("available" as const);

    const updated = drivers.map((d) => 
      d.id === id ? { ...d, status: nextStatus } : d
    );
    setDrivers(updated);
    localStorage.setItem("krishna_admin_drivers_list", JSON.stringify(updated));

    await updateDriverStatusRecord(id, nextStatus, token);
  };

  const deleteDriver = async (id: string) => {
    if (window.confirm("क्या आप वाकई इस ड्राइवर को फ्लीट लिस्ट से हमेशा के लिए हटाना चाहते हैं?")) {
      const updated = drivers.filter((d) => d.id !== id);
      setDrivers(updated);
      localStorage.setItem("krishna_admin_drivers_list", JSON.stringify(updated));
      await deleteDriverRecord(id, token);
    }
  };

  // Create Manual Phone Booking from Admin
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName || !newCustPhone || !newPickup || !newDrop) {
      alert("Please fill customer name, phone, pickup, and drop destination.");
      return;
    }

    setCreatingBooking(true);
    const result = await submitInquiry({
      fullName: newCustName.trim(),
      phoneNumber: newCustPhone.trim(),
      pickupLocation: newPickup.trim(),
      dropLocation: newDrop.trim(),
      bookingDate: newDate,
      bookingTime: newTime,
      goodsType: newGoods.trim(),
      notes: newNotes.trim() || "Phone booking taken by Rohit Singh",
    });

    if (result.success) {
      setShowNewBookingModal(false);
      setNewCustName("");
      setNewCustPhone("");
      setNewPickup("");
      setNewDrop("");
      setNewNotes("");
      await handleRefresh();
    } else {
      alert(`Error: ${result.error}`);
    }
    setCreatingBooking(false);
  };

  // Dynamic vehicle selection for calculator
  const handleSelectVehicleForCalc = (vehId: string) => {
    setCalcVehicle(vehId);
    const found = vehicleRates.find((v) => v.id === vehId);
    if (found) {
      setCustomBaseRate(found.baseRate);
      setCustomPerKm(found.perKm);
    }
  };

  // Save current calculator rates as permanent default for the selected vehicle
  const handleSaveCurrentAsDefault = async () => {
    if (!customBaseRate || !customPerKm) return;
    const currentVeh = vehicleRates.find((v) => v.id === calcVehicle);
    if (!currentVeh) return;

    const updatedRates = vehicleRates.map((v) =>
      v.id === calcVehicle
        ? { ...v, baseRate: Number(customBaseRate), perKm: Number(customPerKm) }
        : v
    );
    setVehicleRates(updatedRates);
    localStorage.setItem("krishna_admin_vehicle_rates", JSON.stringify(updatedRates));

    const payload: PricingRecord[] = updatedRates.map((v) => ({
      id: v.id,
      vehicle_name: v.name,
      base_fare: v.baseRate,
      per_km_rate: v.perKm,
      helper_rate: customHelperCharge || rateHelperCharge,
    }));

    const res = await updatePricingSettings(payload, token);
    if (res.success) {
      setRateSavedMessage(`✓ ${currentVeh.name} की डिफॉल्ट दर सेव हो गई (बेस: ₹${customBaseRate}, ₹${customPerKm}/KM)`);
    } else {
      setRateSavedMessage(`✓ लोकल सेव हो गया`);
    }
    setTimeout(() => setRateSavedMessage(""), 4500);
  };

  // Save Pricing Changes (CMS Tab)
  const handleSaveVehicleRates = async (updatedRates: VehicleRateConfig[]) => {
    setVehicleRates(updatedRates);
    localStorage.setItem("krishna_admin_vehicle_rates", JSON.stringify(updatedRates));
    
    const payload: PricingRecord[] = updatedRates.map((v) => ({
      id: v.id,
      vehicle_name: v.name,
      base_fare: v.baseRate,
      per_km_rate: v.perKm,
      helper_rate: rateHelperCharge,
    }));

    const res = await updatePricingSettings(payload, token);
    if (res.success) {
      alert("वाहनों की नई दरें वेबसाइट और सिस्टम में लाइव सेव हो गई हैं!");
    } else {
      alert("दरें लोकल सेव हो गईं। (डेटाबेस सूचना: " + (res.error || "ok") + ")");
    }
  };

  const handleCopyQuote = (text: string) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedQuote(true);
      setTimeout(() => setCopiedQuote(false), 2500);
    }
  };

  // Review CMS actions
  const handleToggleReviewStatus = async (reviewId: string, currentStatus: boolean) => {
    const result = await toggleReviewApproval(reviewId, !currentStatus, token);
    if (result.success) {
      setReviews((prev) => 
        prev.map((r) => r.id === reviewId ? { ...r, is_approved: !currentStatus } : r)
      );
    } else {
      alert("Failed to update review status.");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm("Delete this customer review?")) {
      const result = await deleteReview(reviewId, token);
      if (result.success) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      } else {
        alert("Failed to delete review.");
      }
    }
  };

  const handleAddDirectReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revCustName || !revComment) {
      alert("Please provide customer name and review comment.");
      return;
    }
    setSavingReview(true);
    const res = await submitCustomerReview({
      customerName: revCustName.trim(),
      customerPhone: revCustPhone.trim() || undefined,
      rating: revRating,
      comment: revComment.trim(),
    });
    if (res.success) {
      setShowAddReviewModal(false);
      setRevCustName("");
      setRevCustPhone("");
      setRevComment("");
      await handleRefresh();
    } else {
      alert(`Failed to add review: ${res.error}`);
    }
    setSavingReview(false);
  };

  // WhatsApp helpers
  const getCustomerWhatsAppUrl = (inquiry: any) => {
    const cleanPhone = inquiry.phone_number.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const msg = `नमस्ते ${inquiry.full_name} जी!
मैं कृष्णा ट्रांसपोर्ट वाराणसी से रोहित सिंह बात कर रहा हूँ।

आपकी बुकिंग (${inquiry.inquiry_code}) हमें प्राप्त हुई है:
📍 पिकअप: ${inquiry.pickup_location}
🏁 ड्रॉप: ${inquiry.drop_location}
📅 तारीख: ${inquiry.booking_date} (${inquiry.booking_time})
📦 सामान: ${inquiry.goods_type}

किराया तय करने और गाड़ी फाइनल करने के लिए कृपया बताएं।`;
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
📞 *फोन:* ${inquiry.phone_number}
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

  // Aggregate Metrics for Stripe-style KPI widgets
  const stats = useMemo(() => {
    const total = inquiries.length;
    const pending = inquiries.filter((i) => i.status === "pending").length;
    const contacted = inquiries.filter((i) => i.status === "contacted").length;
    const assigned = inquiries.filter((i) => i.status === "assigned").length;
    const completed = inquiries.filter((i) => i.status === "completed").length;
    const totalQuoted = inquiries.reduce((sum, item) => sum + (Number(item.quoted_amount) || 0), 0);
    return { total, pending, contacted, assigned, completed, totalQuoted };
  }, [inquiries]);

  // Dynamic Rate Calculator computation (uses custom on-the-spot rates + custom/hub distance + surcharges)
  const calcResult = useMemo(() => {
    const vehObj = vehicleRates.find((v) => v.id === calcVehicle) || vehicleRates[1] || DEFAULT_VEHICLES[1];

    let distance = 10;
    let pickupName = "सलारपुर (HQ डिपो)";
    let dropName = "लंका / बीएचयू";

    if (calcMode === "custom") {
      distance = Math.max(1, calcCustomKm || 10);
      pickupName = "कस्टम पिकअप स्थान";
      dropName = "कस्टम ड्रॉप स्थान";
    } else {
      const pickupObj = LOCATIONS_FOR_CALC.find((l) => l.id === calcPickup) || LOCATIONS_FOR_CALC[0];
      const dropObj = LOCATIONS_FOR_CALC.find((l) => l.id === calcDrop) || LOCATIONS_FOR_CALC[1];
      distance = Math.abs(pickupObj.km - dropObj.km);
      if (distance === 0) distance = 5;
      pickupName = pickupObj.name;
      dropName = dropObj.name;
    }

    if (calcIsRoundTrip) distance = distance * 2;

    const baseCost = Number(customBaseRate) || vehObj.baseRate;
    const perKm = Number(customPerKm) || vehObj.perKm;
    const distanceCost = Math.round(distance * perKm);
    const helperUnit = Number(customHelperCharge) || rateHelperCharge;
    const helperCost = calcHelpers * helperUnit;
    const extraCost = Number(calcExtraCharges) || 0;
    const totalEstimated = baseCost + distanceCost + helperCost + extraCost;

    return {
      distance,
      perKm,
      baseCost,
      distanceCost,
      helperUnit,
      helperCost,
      extraCost,
      totalEstimated,
      vehicleName: vehObj.name,
      pickupName,
      dropName,
    };
  }, [
    calcMode,
    calcPickup,
    calcDrop,
    calcCustomKm,
    calcVehicle,
    customBaseRate,
    customPerKm,
    calcHelpers,
    customHelperCharge,
    calcExtraCharges,
    calcIsRoundTrip,
    vehicleRates,
    rateHelperCharge,
  ]);

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-400">
        <div className="w-9 h-9 border-2 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono font-medium tracking-wider uppercase text-slate-400">
          Connecting to Admin Portal...
        </p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 px-4 text-center">
        <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Access Restricted</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">
          This portal is reserved exclusively for Rohit Singh (Business Owner).
        </p>
        <Link
          href="/login"
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    // STRICT ENTERPRISE APP SHELL: 100vh locked viewport, Zero window jump or scroll
    <div className="h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-900 flex antialiased">
      
      {/* 1. LEFT SIDEBAR: Pinned permanently to left, NEVER scrolls up or lifts */}
      <aside className="hidden lg:flex w-64 h-full bg-slate-950 text-slate-300 border-r border-slate-800/80 flex-col shrink-0 z-40 select-none overflow-hidden">
        
        {/* Brand / Header (NO green blink dot per instruction) */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-inner">
              KT
            </div>
            <div>
              <span className="block font-bold text-xs tracking-tight text-white leading-tight">
                Krishna Transport
              </span>
              <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Varanasi Command
              </span>
            </div>
          </div>
        </div>

        {/* Super Admin Identity Badge */}
        <div className="px-4 py-3 border-b border-slate-900 bg-slate-900/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-200 border border-slate-700 flex items-center justify-center text-xs font-bold">
              RS
            </div>
            <div className="overflow-hidden">
              <span className="block text-xs font-semibold text-slate-200 truncate">
                Rohit Singh
              </span>
              <span className="block text-[10px] text-slate-400 font-mono truncate">
                Super Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Linear-Style Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Operations
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "dashboard"
                ? "bg-slate-800/90 text-white border border-slate-700/60 shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Dashboard</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
              1
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "orders"
                ? "bg-slate-800/90 text-white border border-slate-700/60 shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4 text-amber-400" />
              <span>Orders & Trips</span>
            </div>
            {stats.pending > 0 ? (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full animate-pulse">
                {stats.pending} new
              </span>
            ) : (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                {inquiries.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("drivers")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "drivers"
                ? "bg-slate-800/90 text-white border border-slate-700/60 shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Fleet & Drivers</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
              {drivers.length} Drivers
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rates")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "rates"
                ? "bg-slate-800/90 text-white border border-slate-700/60 shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calculator className="w-4 h-4 text-indigo-400" />
              <span>Fare Calculator</span>
            </div>
          </button>

          <div className="px-2 pt-3 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
            Website Control
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("cms")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "cms"
                ? "bg-slate-800/90 text-white border border-slate-700/60 shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>Website CMS</span>
            </div>
            {reviews.length > 0 && (
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded border border-cyan-500/20">
                {reviews.length} Reviews
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === "settings"
                ? "bg-slate-800/90 text-white border border-slate-700/60 shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Settings</span>
            </div>
          </button>
        </nav>

        {/* Clean Sidebar Footer (NO sound bell clutter here per instruction) */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Varanasi, UP
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="px-2.5 py-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT MAIN WORKSPACE: Isolated scroll container */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
        
        {/* Pinned Top Navbar (NO sound bell clutter here per instruction) */}
        <header className="h-16 shrink-0 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-30 shadow-xs select-none">
          
          {/* Breadcrumb / Title */}
          <div className="flex items-center gap-3">
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                KT
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="hidden sm:inline">Operations</span>
                <ChevronRight className="w-3 h-3 hidden sm:inline text-slate-400" />
                <span className="font-semibold text-slate-900 capitalize">
                  {activeTab === "cms" ? "Website CMS" : activeTab}
                </span>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Phone Booking Button */}
            <button
              type="button"
              onClick={() => setShowNewBookingModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${refreshLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <Link
              href="/?view=website"
              onClick={() => {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("krishna_allow_website_view", "true");
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
              title="Open website preview mode"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>वेबसाइट देखें</span>
            </Link>
          </div>
        </header>

        {/* WORKSPACE CONTENT SCROLL CONTAINER */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12">

          {/* Realtime Floating Notification Banner */}
          {newOrderAlert && (
            <div className="p-3.5 bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">New Booking Received</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {newOrderAlert.inquiry_code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {newOrderAlert.full_name} • {newOrderAlert.pickup_location} → {newOrderAlert.drop_location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <a
                  href={`tel:${newOrderAlert.phone_number}`}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3 h-3" /> Call
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("orders");
                    setNewOrderAlert(null);
                  }}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  View Order
                </button>
                <button
                  type="button"
                  onClick={() => setNewOrderAlert(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Stripe-Style Metric Widgets (Clean IndianRupee icon per instruction) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Metric 1 */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    <span>Pending Leads</span>
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                      {stats.pending}
                    </span>
                    {stats.pending > 0 && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                        Action Needed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Awaiting call or quote confirmation
                  </p>
                </div>

                {/* Metric 2 */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    <span>Contacted / Active</span>
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                      {stats.contacted + stats.assigned}
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                      In Discussion
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Fare quoted or vehicle scheduled
                  </p>
                </div>

                {/* Metric 3 */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    <span>Completed Trips</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                      {stats.completed}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Fulfilled
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Safely delivered across Varanasi
                  </p>
                </div>

                {/* Metric 4 (IndianRupee icon replaces $) */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-4 sm:p-5 shadow-xs hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    <span>Total Booked Fare</span>
                    <IndianRupee className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-mono">
                      ₹{stats.totalQuoted.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Gross revenue pipeline
                  </p>
                </div>

              </div>

              {/* Main Dashboard Rows */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Pending & Recent Bookings List (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Urgent Pending List */}
                  {stats.pending > 0 && (
                    <div className="bg-white border border-amber-200/80 rounded-xl shadow-xs overflow-hidden">
                      <div className="px-5 py-3.5 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                          <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                            Urgent Pending Leads ({stats.pending})
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setOrderFilter("pending");
                            setActiveTab("orders");
                          }}
                          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                        >
                          Manage All <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="divide-y divide-amber-100/60">
                        {inquiries.filter((i) => i.status === "pending").map((inquiry) => (
                          <div key={inquiry.id} className="p-4 hover:bg-amber-50/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-white border border-amber-200 text-amber-900">
                                  {inquiry.inquiry_code}
                                </span>
                                <span className="text-xs font-bold text-slate-900">{inquiry.full_name}</span>
                                <span className="text-xs text-slate-500 font-mono">({inquiry.phone_number})</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-600">
                                <span className="font-semibold text-slate-800">{inquiry.pickup_location}</span>
                                <span className="text-slate-400">→</span>
                                <span className="font-semibold text-slate-800">{inquiry.drop_location}</span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">{inquiry.goods_type}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={`tel:${inquiry.phone_number}`}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1.5 transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-blue-600" /> Call
                              </a>
                              <a
                                href={getCustomerWhatsAppUrl(inquiry)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                              >
                                <WhatsAppIcon className="w-3.5 h-3.5 fill-current" /> WhatsApp
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Operations Activity */}
                  <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">Recent Booking & Dispatch Activity</h2>
                        <p className="text-xs text-slate-500">Live operational ledger across Varanasi & highways.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOrderFilter("all");
                          setActiveTab("orders");
                        }}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        All Orders ({inquiries.length}) <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {inquiries.slice(0, 6).map((inquiry) => {
                        const isPendingNew = inquiry.status === "pending";
                        return (
                          <div 
                            key={inquiry.id} 
                            className={`p-4 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                              isPendingNew 
                                ? "bg-amber-50/70 hover:bg-amber-100/60 border-l-4 border-l-amber-500" 
                                : "hover:bg-slate-50/70"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                                  {inquiry.inquiry_code}
                                </span>
                                <span className="text-xs font-bold text-slate-900">{inquiry.full_name}</span>
                                
                                {isPendingNew && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse shadow-xs">
                                    <BellRing className="w-2.5 h-2.5" />
                                    नया ऑर्डर (NEW)
                                  </span>
                                )}

                                {/* Status Chip */}
                                <span className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold border ${
                                  inquiry.status === "completed"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : inquiry.status === "contacted"
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : inquiry.status === "assigned"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : inquiry.status === "cancelled"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-amber-100 text-amber-800 border-amber-300 font-bold"
                                }`}>
                                  <span className="w-1 h-1 rounded-full bg-current" />
                                  <span className="capitalize">{inquiry.status}</span>
                                </span>
                              </div>

                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <span className="font-medium text-slate-800">{inquiry.pickup_location}</span>
                              <span className="text-slate-400">→</span>
                              <span className="font-medium text-slate-800">{inquiry.drop_location}</span>
                              {inquiry.quoted_amount && (
                                <>
                                  <span className="text-slate-400">•</span>
                                  <span className="font-mono font-bold text-slate-900">₹{inquiry.quoted_amount}</span>
                                </>
                              )}
                              {inquiry.driver_name && (
                                <>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-slate-500 font-medium">Driver: {inquiry.driver_name}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`tel:${inquiry.phone_number}`}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-xs transition-colors"
                              title="Call Customer"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                            <Link
                              href={`/track/${inquiry.inquiry_code}`}
                              target="_blank"
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1 transition-colors"
                            >
                              <span>Tracking</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    </div>
                  </div>

                </div>

                {/* Fleet Availability Widget (1 col) */}
                <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">Fleet Status</h2>
                        <p className="text-xs text-slate-500">Drivers stationed in Varanasi</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("drivers")}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="p-4 space-y-3">
                      {drivers.map((driver) => (
                        <div key={driver.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{driver.name}</span>
                              <span className={`inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                                driver.status === "available"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {driver.status === "available" ? "Available" : "On Duty"}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                              {driver.vehicleType} • {driver.vehicleNumber}
                            </span>
                          </div>
                          <a
                            href={`tel:${driver.phone}`}
                            className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                            title="Call Driver"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calculator CTA Card */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                      type="button"
                      onClick={() => setActiveTab("rates")}
                      className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <Calculator className="w-4 h-4 text-indigo-600" />
                      <span>Open Fare Estimator</span>
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: ORDERS & TRIPS */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              
              {/* Controls Bar */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
                
                {/* Search Input */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by code, customer, phone, location..."
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none rounded-lg text-xs transition-all font-medium"
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

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/70 overflow-x-auto w-full md:w-auto">
                  {[
                    { id: "all", label: "All", count: inquiries.length },
                    { id: "pending", label: "नए ऑर्डर्स (New)", count: stats.pending },
                    { id: "contacted", label: "Contacted", count: stats.contacted },
                    { id: "assigned", label: "Assigned", count: stats.assigned },
                    { id: "completed", label: "Completed", count: stats.completed },
                    { id: "cancelled", label: "Cancelled", count: inquiries.filter((i) => i.status === "cancelled").length },
                  ].map((tab) => {
                    const isTabPending = tab.id === "pending" && tab.count > 0;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setOrderFilter(tab.id)}
                        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                          orderFilter === tab.id
                            ? isTabPending
                              ? "bg-amber-500 text-white shadow-xs font-bold"
                              : "bg-white text-slate-900 shadow-xs font-semibold"
                            : isTabPending
                            ? "bg-amber-100 text-amber-800 font-bold border border-amber-300 animate-pulse"
                            : "text-slate-500 hover:text-slate-800"
                        }`}
                      >
                        {isTabPending && <BellRing className="w-3 h-3 text-current" />}
                        <span>{tab.label}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          orderFilter === tab.id 
                            ? "bg-black/15 text-current" 
                            : isTabPending
                            ? "bg-amber-200 text-amber-900 font-bold"
                            : "bg-slate-200/60 text-slate-500"
                        }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>

              {/* Inquiries List */}
              <div className="space-y-3">
                {filteredInquiries.map((inquiry) => {
                  const state = formStates[inquiry.id] || {
                    quoted_amount: inquiry.quoted_amount ? String(inquiry.quoted_amount) : "",
                    driver_name: inquiry.driver_name || "",
                    driver_phone: inquiry.driver_phone || "",
                    vehicle_number: inquiry.vehicle_number || "",
                    status: inquiry.status || "pending",
                    cancellation_reason: inquiry.cancellation_reason || "",
                  };

                  const isNewOrder = state.status === "pending";
                  const isSaved = savedSuccessId === inquiry.id;
                  const isUpdating = updatingId === inquiry.id;

                  return (
                    <div
                      key={inquiry.id}
                      className={
                        isNewOrder
                          ? "bg-amber-50/25 border-2 border-amber-400 ring-2 ring-amber-300/30 rounded-xl shadow-md transition-all overflow-hidden"
                          : "bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl shadow-xs transition-colors overflow-hidden"
                      }
                    >
                      {/* Card Header Strip */}
                      <div className={
                        isNewOrder
                          ? "px-4 py-3 bg-amber-100/75 border-b border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                          : "px-4 py-3 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs"
                      }>
                        <div className="flex items-center gap-2">
                          {isNewOrder && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-xs animate-pulse">
                              <BellRing className="w-3 h-3" />
                              🔔 नया बुकिंग ऑर्डर (NEW)
                            </span>
                          )}
                          <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-xs">
                            {inquiry.inquiry_code}
                          </span>
                          <span className="text-slate-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(inquiry.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit"
                            })}
                          </span>
                        </div>

                        {/* Status Chip */}
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            state.status === "completed"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : state.status === "assigned"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : state.status === "contacted"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : state.status === "cancelled"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              state.status === "completed"
                                ? "bg-emerald-500"
                                : state.status === "cancelled"
                                ? "bg-rose-500"
                                : "bg-amber-500 animate-pulse"
                            }`} />
                            <span className="capitalize">{state.status}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDelete(inquiry.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Main Card Body */}
                      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        
                        {/* Column 1: Customer & Route */}
                        <div className="lg:col-span-5 space-y-3">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <h3 className="font-bold text-slate-900 text-sm">{inquiry.full_name}</h3>
                              <a
                                href={`tel:${inquiry.phone_number}`}
                                className="text-xs font-mono font-medium text-blue-600 hover:underline"
                              >
                                {inquiry.phone_number}
                              </a>
                            </div>
                            {inquiry.email && (
                              <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
                                {inquiry.email}
                              </span>
                            )}
                          </div>

                          {/* Route Flow */}
                          <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-1.5 py-0.5">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold block">
                                Pickup Point
                              </span>
                              <span className="text-xs font-medium text-slate-800">
                                {inquiry.pickup_location}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold block">
                                Drop Destination
                              </span>
                              <span className="text-xs font-medium text-slate-800">
                                {inquiry.drop_location}
                              </span>
                            </div>
                          </div>

                          {/* Shipment details */}
                          <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-1">
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                              📦 {inquiry.goods_type}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                              📅 {inquiry.booking_date} ({inquiry.booking_time})
                            </span>
                          </div>

                          {inquiry.notes && (
                            <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                              "{inquiry.notes}"
                            </p>
                          )}
                        </div>

                        {/* Column 2: Driver & Assignment */}
                        <div className={`lg:col-span-4 space-y-3 p-3.5 rounded-xl border ${
                          isNewOrder 
                            ? "bg-amber-50/80 border-amber-200" 
                            : "bg-slate-50/70 border-slate-200/60"
                        }`}>
                          {isNewOrder && (
                            <div className="p-2 rounded-lg bg-amber-100/90 border border-amber-300 text-amber-900 text-[11px] font-bold flex items-center gap-1.5 shadow-xs">
                              <BellRing className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-bounce" />
                              <span>नया ऑर्डर - ग्राहक से बात करके तय किराया व ड्राइवर डालें</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                              Driver & Fare Control
                            </span>
                            <span className="text-[10px] text-slate-400">Preset selector</span>
                          </div>

                          {/* Driver Quick Preset Dropdown */}
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                              Select from Fleet Phonebook:
                            </label>
                            <select
                              onChange={(e) => {
                                if (e.target.value) handleAssignDriverPreset(inquiry.id, e.target.value);
                              }}
                              defaultValue=""
                              className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 outline-none focus:border-blue-500"
                            >
                              <option value="">-- Choose Driver --</option>
                              {drivers.map((d) => (
                                <option key={d.id} value={d.id}>
                                  {d.name} ({d.vehicleType})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* In-place Driver Inputs */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                                Driver Name
                              </label>
                              <input
                                type="text"
                                value={state.driver_name}
                                onChange={(e) => handleFormChange(inquiry.id, "driver_name", e.target.value)}
                                placeholder="Driver Name"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                                Driver Phone
                              </label>
                              <input
                                type="text"
                                value={state.driver_phone}
                                onChange={(e) => handleFormChange(inquiry.id, "driver_phone", e.target.value)}
                                placeholder="10 Digits"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono"
                              />
                            </div>
                          </div>

                          {/* Quoted Fare & Vehicle Number */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                                Quoted Fare (₹)
                              </label>
                              <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">₹</span>
                                <input
                                  type="number"
                                  value={state.quoted_amount}
                                  onChange={(e) => handleFormChange(inquiry.id, "quoted_amount", e.target.value)}
                                  placeholder="0.00"
                                  className="w-full pl-5 pr-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-slate-900"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                                Vehicle Plate
                              </label>
                              <input
                                type="text"
                                value={state.vehicle_number}
                                onChange={(e) => handleFormChange(inquiry.id, "vehicle_number", e.target.value)}
                                placeholder="UP 65 BT 1234"
                                className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono uppercase"
                              />
                            </div>
                          </div>

                          {/* Status Dropdown */}
                          <div>
                            <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                              Booking Lifecycle Status
                            </label>
                            <select
                              value={state.status}
                              onChange={(e) => handleFormChange(inquiry.id, "status", e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800"
                            >
                              <option value="pending">Pending (शुरुआती लीड)</option>
                              <option value="contacted">Contacted (बातचीत जारी)</option>
                              <option value="assigned">Assigned (गाड़ी तय)</option>
                              <option value="completed">Completed (काम पूरा)</option>
                              <option value="cancelled">Cancelled (रद्द)</option>
                            </select>
                          </div>
                        </div>

                        {/* Column 3: Actions & WhatsApp Dispatch */}
                        <div className="lg:col-span-3 space-y-2 flex flex-col justify-between h-full">
                          
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
                              1-Tap Dispatch & Contact
                            </span>

                            {/* Customer Call */}
                            <a
                              href={`tel:${inquiry.phone_number}`}
                              className="w-full py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-blue-600" />
                              <span>Call Customer</span>
                            </a>

                            {/* Customer WhatsApp */}
                            <a
                              href={getCustomerWhatsAppUrl(inquiry)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-1.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                              <span>WhatsApp Customer</span>
                            </a>

                            {/* Driver Duty WhatsApp Forwarder */}
                            {state.driver_phone ? (
                              <a
                                href={getDriverWhatsAppUrl(inquiry, state.driver_phone, state.quoted_amount)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Send className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Duty Ticket to Driver</span>
                              </a>
                            ) : (
                              <button
                                type="button"
                                disabled
                                className="w-full py-1.5 px-3 bg-slate-100 text-slate-400 text-xs font-medium rounded-lg border border-slate-200 cursor-not-allowed flex items-center justify-center gap-1.5"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>Assign Driver First</span>
                              </button>
                            )}

                            {/* Tracking Public Link */}
                            <Link
                              href={`/track/${inquiry.inquiry_code}`}
                              target="_blank"
                              className="w-full py-1 px-2 text-center text-[11px] font-medium text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1 transition-colors"
                            >
                              <span>Customer Tracking View</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>

                          {/* Save Changes Button */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => handleSaveDetails(inquiry.id)}
                              disabled={isUpdating}
                              className={`w-full py-2 px-3 text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all ${
                                isSaved
                                  ? "bg-emerald-600 text-white"
                                  : "bg-blue-600 hover:bg-blue-500 text-white"
                              }`}
                            >
                              {isUpdating ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : isSaved ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                              ) : (
                                <Save className="w-3.5 h-3.5" />
                              )}
                              <span>{isSaved ? "Saved Successfully" : isUpdating ? "Saving..." : "Save Changes"}</span>
                            </button>
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                })}

                {filteredInquiries.length === 0 && (
                  <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center shadow-xs">
                    <Truck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-900">No Inquiries Found</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      No bookings matching "{searchTerm || orderFilter}". Try changing your search query or filter chip.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: FLEET & DRIVERS DIRECTORY */}
          {activeTab === "drivers" && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Fleet Directory & Drivers</h2>
                  <p className="text-xs text-slate-500">
                    Manage active drivers and vehicles in Varanasi. Assigned directly to bookings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDriverModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add Driver
                </button>
              </div>

              {/* Drivers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-4 shadow-xs transition-colors flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                            {driver.name.slice(0, 2)}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900">{driver.name}</h3>
                            <a
                              href={`tel:${driver.phone}`}
                              className="text-xs font-mono text-blue-600 hover:underline"
                            >
                              +91 {driver.phone}
                            </a>
                          </div>
                        </div>

                        {/* Availability Toggle */}
                        <button
                          type="button"
                          onClick={() => toggleDriverStatus(driver.id)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                            driver.status === "available"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                          }`}
                        >
                          {driver.status === "available" ? "● Available" : "● On Duty"}
                        </button>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-[11px] text-slate-400">Vehicle Type:</span>
                          <span className="font-medium text-slate-800">{driver.vehicleType}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span className="text-[11px] text-slate-400">Reg Plate:</span>
                          <span className="font-mono font-bold text-slate-800">{driver.vehicleNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-1">
                        <a
                          href={`tel:${driver.phone}`}
                          className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3 text-blue-600" /> Call
                        </a>
                        <a
                          href={`https://wa.me/91${driver.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                        >
                          <WhatsAppIcon className="w-3 h-3 fill-current" /> WhatsApp
                        </a>
                      </div>

                      <button
                        type="button"
                        onClick={() => deleteDriver(driver.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove Driver"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* Add Driver Modal */}
              {showAddDriverModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">Add New Fleet Driver</h3>
                      <button
                        type="button"
                        onClick={() => setShowAddDriverModal(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddDriver} className="space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Driver Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newDriverName}
                          onChange={(e) => setNewDriverName(e.target.value)}
                          placeholder="e.g. Ramesh Yadav"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Mobile Number (10 Digits) *
                        </label>
                        <input
                          type="tel"
                          required
                          value={newDriverPhone}
                          onChange={(e) => setNewDriverPhone(e.target.value.replace(/\D/g, ""))}
                          placeholder="e.g. 9838000000"
                          maxLength={10}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Vehicle Assigned
                        </label>
                        <select
                          value={newDriverVehicle}
                          onChange={(e) => setNewDriverVehicle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-blue-500"
                        >
                          <option value="टाटा एस (छोटा हाथी)">टाटा एस (छोटा हाथी - 1.2 Ton)</option>
                          <option value="महिन्द्रा अल्फा (3W)">महिन्द्रा अल्फा (3W - 500 KG)</option>
                          <option value="पियाजियो आपे टेम्पो">पियाजियो आपे टेम्पो (750 KG)</option>
                          <option value="महिन्द्रा बोलेरो पिकअप">महिन्द्रा बोलेरो पिकअप (1.7 Ton)</option>
                          <option value="आयशर 14 फीट">आयशर 14 फीट (4 Ton)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Vehicle Registration Number
                        </label>
                        <input
                          type="text"
                          value={newDriverPlate}
                          onChange={(e) => setNewDriverPlate(e.target.value)}
                          placeholder="e.g. UP 65 BT 9999"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono uppercase outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setShowAddDriverModal(false)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          Save Driver
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: DYNAMIC FARE CALCULATOR */}
          {activeTab === "rates" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Dynamic Rate Estimator & Custom Pricing Controls */}
                <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-5">
                  <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">किराया कैलकुलेटर (Fare Calculator)</h2>
                      <p className="text-xs text-slate-500">
                        गाड़ी चुनें, अपने हिसाब से बेस व प्रति KM दर बदलें और तुरंत कोटेशन निकालें।
                      </p>
                    </div>
                    {/* Calculation Mode Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setCalcMode("hub")}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                          calcMode === "hub" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                        }`}
                      >
                        वाराणसी हब
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcMode("custom")}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                          calcMode === "custom" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600"
                        }`}
                      >
                        कस्टम KM
                      </button>
                    </div>
                  </div>

                  {/* 1. Vehicle Selection */}
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                      1. वाहन चुनें (Select Vehicle)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {vehicleRates.map((veh) => (
                        <button
                          key={veh.id}
                          type="button"
                          onClick={() => handleSelectVehicleForCalc(veh.id)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            calcVehicle === veh.id
                              ? "border-blue-600 bg-blue-50/50 text-blue-900 ring-1 ring-blue-600 shadow-xs"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span className="block text-xs font-bold truncate">{veh.name}</span>
                          <span className="block text-[10px] text-slate-500 font-mono mt-0.5">
                            ₹{veh.baseRate} बेस • ₹{veh.perKm}/KM
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. On-the-fly Rate Adjustment (Rohit Singh's Custom Pricing Input) */}
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                        2. किराया दरें बदलें (Edit Rates for this Trip)
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        अपने हिसाब से रेट टाइप करें
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          बेस किराया (Base Fare ₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            value={customBaseRate}
                            onChange={(e) => setCustomBaseRate(Number(e.target.value) || 0)}
                            className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">शुरुआती पिकअप/लोडिंग चार्ज</span>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          प्रति किलोमीटर दर (Rate Per KM ₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            value={customPerKm}
                            onChange={(e) => setCustomPerKm(Number(e.target.value) || 0)}
                            className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">दूरी का रनिंग भाड़ा प्रति KM</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-blue-100">
                      <button
                        type="button"
                        onClick={handleSaveCurrentAsDefault}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 shadow-xs transition-colors self-start"
                      >
                        <Save className="w-3 h-3 text-blue-600" />
                        इस वाहन में डिफॉल्ट सेव करें (Save as Vehicle Default)
                      </button>

                      {rateSavedMessage && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {rateSavedMessage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. Distance & Route */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      3. सफर का रूट व दूरी (Route & Distance)
                    </label>

                    {calcMode === "hub" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                            पिकअप हब (Varanasi Pickup)
                          </label>
                          <select
                            value={calcPickup}
                            onChange={(e) => setCalcPickup(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                          >
                            {LOCATIONS_FOR_CALC.map((l) => (
                              <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                            ड्रॉप हब (Drop Location)
                          </label>
                          <select
                            value={calcDrop}
                            onChange={(e) => setCalcDrop(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                          >
                            {LOCATIONS_FOR_CALC.map((l) => (
                              <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="1"
                            max="250"
                            value={calcCustomKm}
                            onChange={(e) => setCalcCustomKm(Number(e.target.value))}
                            className="flex-1 accent-blue-600"
                          />
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="1"
                              max="1000"
                              value={calcCustomKm}
                              onChange={(e) => setCalcCustomKm(Number(e.target.value) || 1)}
                              className="w-20 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-center"
                            />
                            <span className="text-xs font-mono font-semibold text-slate-500">KM</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">दोतरफा फेरा (Round Trip)</span>
                        <span className="text-[10px] text-slate-500 block">दूरी दोगुनी हो जाएगी ({calcResult.distance} KM)</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={calcIsRoundTrip}
                        onChange={(e) => setCalcIsRoundTrip(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* 4. Helpers & Labour Cost */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        4. लेबर / हेल्पर की संख्या
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2, 3, 4].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setCalcHelpers(num)}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-bold transition-colors ${
                              calcHelpers === num
                                ? "bg-slate-900 text-white border-slate-900"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            {num === 0 ? "0" : `${num}`}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                        प्रति हेल्पर चार्ज (₹ Helper Rate)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                        <input
                          type="number"
                          value={customHelperCharge}
                          onChange={(e) => setCustomHelperCharge(Number(e.target.value) || 0)}
                          className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Extra Local Charges (Mandi / Alleyways / No-Entry) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        5. अतिरिक्त लोकल चार्ज (Extra Surcharges)
                      </label>
                      <span className="text-[10px] text-slate-400">मंडी, तंग गली, नो-एंट्री परमिट</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">₹</span>
                          <input
                            type="number"
                            value={calcExtraCharges}
                            onChange={(e) => setCalcExtraCharges(Number(e.target.value) || 0)}
                            placeholder="0"
                            className="w-full pl-7 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          value={calcExtraReason}
                          onChange={(e) => setCalcExtraReason(e.target.value)}
                          placeholder="कारण (उदा: गोदौलिया तंग गली / मंडी पर्ची)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Quick Preset Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {[
                        { label: "+₹200 तंग गली (चौक/गोदौलिया)", amount: 200, reason: "चौक/गोदौलिया तंग गली" },
                        { label: "+₹300 नो-एंट्री परमिट", amount: 300, reason: "नो-एंट्री परमिट" },
                        { label: "+₹150 मंडी प्रवेश पर्ची", amount: 150, reason: "मंडी गेट पर्ची" },
                        { label: "+₹250 वेटिंग चार्ज (>2 घंटा)", amount: 250, reason: "2 घंटे से अधिक वेटिंग" },
                      ].map((chip, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCalcExtraCharges(chip.amount);
                            setCalcExtraReason(chip.reason);
                          }}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded text-[10px] font-medium text-slate-600 transition-colors"
                        >
                          {chip.label}
                        </button>
                      ))}
                      {calcExtraCharges > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setCalcExtraCharges(0);
                            setCalcExtraReason("");
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold text-rose-600 hover:underline"
                        >
                          हटाएं (Clear)
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Calculation Receipt Card & Direct WhatsApp Quote Generator */}
                <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-5">
                  <div className="space-y-4">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider flex items-center gap-1.5">
                        <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                        किराया पर्ची (Fare Summary)
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Live Quote
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>रूट:</span>
                        <span className="font-semibold text-slate-900 text-right">
                          {calcResult.pickupName} → {calcResult.dropName}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>दूरी:</span>
                        <span className="font-mono font-semibold text-slate-900">
                          {calcResult.distance} KM {calcIsRoundTrip ? "(दोतरफा)" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>वाहन:</span>
                        <span className="font-semibold text-slate-800">{calcResult.vehicleName}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="flex justify-between text-slate-600">
                          <span>बेस किराया:</span>
                          <span className="font-mono font-semibold text-slate-800">₹{calcResult.baseCost}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>रनिंग भाड़ा ({calcResult.distance} KM × ₹{calcResult.perKm}/KM):</span>
                          <span className="font-mono font-semibold text-slate-800">₹{calcResult.distanceCost}</span>
                        </div>
                        {calcResult.helperCost > 0 && (
                          <div className="flex justify-between text-slate-600">
                            <span>हेल्पर / लेबर ({calcHelpers} व्यक्ति × ₹{calcResult.helperUnit}):</span>
                            <span className="font-mono font-semibold text-slate-800">₹{calcResult.helperCost}</span>
                          </div>
                        )}
                        {calcResult.extraCost > 0 && (
                          <div className="flex justify-between text-amber-700 bg-amber-50/60 px-2 py-1 rounded">
                            <span>अतिरिक्त चार्ज {calcExtraReason ? `(${calcExtraReason})` : ""}:</span>
                            <span className="font-mono font-bold">₹{calcResult.extraCost}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-200/80 flex items-baseline justify-between bg-slate-50/80 p-3 rounded-lg">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">कुल तय किराया (Total)</span>
                        <span className="text-[10px] text-slate-400">टोल व पार्किंग रसीद अनुसार अलग</span>
                      </div>
                      <span className="text-2xl font-bold font-mono text-blue-600">
                        ₹{calcResult.totalEstimated}
                      </span>
                    </div>
                  </div>

                  {/* Actions & WhatsApp Sharing */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                        ग्राहक का WhatsApp नंबर (वैकल्पिक)
                      </label>
                      <input
                        type="tel"
                        value={calcPhone}
                        onChange={(e) => setCalcPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="10 अंकों का मोबाइल नंबर (उदा: 9838000000)"
                        maxLength={10}
                        className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono outline-none focus:border-blue-500"
                      />
                    </div>

                    {(() => {
                      const quoteMessage = `🚚 *कृष्णा ट्रांसपोर्ट - किराया कोटेशन*\nरूट: ${calcResult.pickupName} से ${calcResult.dropName} (${calcResult.distance} KM${calcIsRoundTrip ? " दोतरफा" : ""})\nगाड़ी: ${calcResult.vehicleName}\n\n• बेस किराया: ₹${calcResult.baseCost}\n• रनिंग भाड़ा (${calcResult.distance} KM × ₹${calcResult.perKm}/KM): ₹${calcResult.distanceCost}\n${calcResult.helperCost > 0 ? `• हेल्पर/लेबर चार्ज (${calcHelpers} व्यक्ति): ₹${calcResult.helperCost}\n` : ""}${calcResult.extraCost > 0 ? `• अतिरिक्त चार्ज${calcExtraReason ? ` (${calcExtraReason})` : ""}: ₹${calcResult.extraCost}\n` : ""}\n💰 *कुल तय किराया: ₹${calcResult.totalEstimated}*\n(टोल टैक्स व पार्किंग वास्तविक रसीद अनुसार अलग)\n\nरोहित सिंह (कृष्णा ट्रांसपोर्ट, सलारपुर वाराणसी)\n📞 +91 70803 60217`;
                      
                      const cleanPhone = calcPhone.trim().replace(/\D/g, "");
                      const targetUrl = cleanPhone.length === 10
                        ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(quoteMessage)}`
                        : `https://wa.me/?text=${encodeURIComponent(quoteMessage)}`;

                      return (
                        <div className="space-y-2">
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors"
                          >
                            <WhatsAppIcon className="w-4 h-4 fill-current" />
                            <span>
                              {cleanPhone.length === 10
                                ? `Send Quote to +91 ${cleanPhone}`
                                : "Send Quote via WhatsApp"}
                            </span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyQuote(quoteMessage)}
                            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedQuote ? "✓ कोटेशन कॉपी हो गया!" : "कोटेशन कॉपी करें (Copy Quote)"}</span>
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                </div>

              </div>

              {/* Standard Highway Corridors Table */}
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Standard Purvanchal Highway Corridors</h3>
                    <p className="text-xs text-slate-500">Benchmark rates from Salarpur HQ Depot to adjoining districts.</p>
                  </div>
                  <span className="text-xs font-mono text-slate-500">Same-Day Delivery</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-mono text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Highway Destination</th>
                        <th className="py-3 px-4">Approx Distance</th>
                        <th className="py-3 px-4">Tata Ace (1.2T)</th>
                        <th className="py-3 px-4">Bolero Pickup (1.7T)</th>
                        <th className="py-3 px-4">Eicher 14ft (4T)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { dest: "चंदौली / मुगलसराय (NH 19)", km: "32 KM", ace: "₹1,400", pickup: "₹1,800", eicher: "₹3,500" },
                        { dest: "भदोही (कालीन नगरी)", km: "48 KM", ace: "₹1,900", pickup: "₹2,400", eicher: "₹4,200" },
                        { dest: "मिर्ज़ापुर / विंध्याचल", km: "65 KM", ace: "₹2,400", pickup: "₹3,100", eicher: "₹5,200" },
                        { dest: "जौनपुर (NH 31)", km: "62 KM", ace: "₹2,300", pickup: "₹3,000", eicher: "₹5,000" },
                        { dest: "गाज़ीपुर (NH 31)", km: "78 KM", ace: "₹2,800", pickup: "₹3,600", eicher: "₹6,000" },
                        { dest: "आज़मगढ़ (पूर्वांचल लिंक)", km: "104 KM", ace: "₹3,500", pickup: "₹4,500", eicher: "₹7,800" },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900">{row.dest}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{row.km}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{row.ace}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{row.pickup}</td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-800">{row.eicher}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: WEBSITE CMS (Reviews & Vehicle Pricing CMS) */}
          {activeTab === "cms" && (
            <div className="space-y-6">
              
              {/* Section 1: Customer Reviews & Feedbacks CMS */}
              <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <h2 className="text-sm font-bold text-slate-900">Customer Reviews & Feedback CMS</h2>
                    </div>
                    <p className="text-xs text-slate-500">
                      Reviews submitted by customers on the tracking portal and customer dashboard.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddReviewModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Customer Review
                  </button>
                </div>

                <div className="divide-y divide-slate-100">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{rev.customer_name}</span>
                          {rev.inquiry_code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-600">
                              {rev.inquiry_code}
                            </span>
                          )}
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                            rev.is_approved
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}>
                            {rev.is_approved ? "Approved (Live)" : "Hidden"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 italic">
                          "{rev.comment}"
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Submitted on {new Date(rev.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleReviewStatus(rev.id, rev.is_approved)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            rev.is_approved
                              ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          }`}
                        >
                          {rev.is_approved ? "Hide from Site" : "Approve & Show"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {reviews.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      <p className="text-xs">No customer reviews yet. Click "+ Add Customer Review" to add testimonials.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Vehicle Pricing Rate Configuration */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Vehicle Base Fares & Per-KM Pricing CMS</h2>
                    <p className="text-xs text-slate-500">
                      Edit rate cards for all transport vehicles. Updates live across the fare calculator and customer estimates.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                    Varanasi Rates
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {vehicleRates.map((veh, idx) => (
                    <div key={veh.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{veh.name}</span>
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                            Base Fare (₹)
                          </label>
                          <input
                            type="number"
                            value={veh.baseRate}
                            onChange={(e) => {
                              const updated = [...vehicleRates];
                              updated[idx].baseRate = Number(e.target.value) || 0;
                              setVehicleRates(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-0.5">
                            Rate Per Kilometer (₹/KM)
                          </label>
                          <input
                            type="number"
                            value={veh.perKm}
                            onChange={(e) => {
                              const updated = [...vehicleRates];
                              updated[idx].perKm = Number(e.target.value) || 0;
                              setVehicleRates(updated);
                            }}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Helper / Labour Charge:</span>
                    <input
                      type="number"
                      value={rateHelperCharge}
                      onChange={(e) => setRateHelperCharge(Number(e.target.value) || 350)}
                      className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold"
                    />
                    <span className="text-xs text-slate-400">₹ per helper</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSaveVehicleRates(vehicleRates)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    Save All Pricing Changes
                  </button>
                </div>
              </div>

              {/* Add Direct Review Modal */}
              {showAddReviewModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">Add Customer Review / Testimonial</h3>
                      <button
                        type="button"
                        onClick={() => setShowAddReviewModal(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddDirectReview} className="space-y-3 text-xs">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Customer Name *</label>
                        <input
                          type="text"
                          required
                          value={revCustName}
                          onChange={(e) => setRevCustName(e.target.value)}
                          placeholder="e.g. Ramesh Chandra (Sigra)"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Customer Phone (Optional)</label>
                        <input
                          type="text"
                          value={revCustPhone}
                          onChange={(e) => setRevCustPhone(e.target.value)}
                          placeholder="e.g. 9838000000"
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Rating (1 to 5 Stars)</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setRevRating(s)}
                              className={`p-1.5 rounded-lg border flex items-center justify-center transition-colors ${
                                revRating >= s ? "border-amber-300 bg-amber-50 text-amber-500" : "border-slate-200 text-slate-300"
                              }`}
                            >
                              <Star className="w-4 h-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">Review Feedback Comment *</label>
                        <textarea
                          required
                          rows={3}
                          value={revComment}
                          onChange={(e) => setRevComment(e.target.value)}
                          placeholder="e.g. बहुत बढ़िया सर्विस, समय पर सामान लंका से गोदौलिया पहुंच गया।"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium resize-none"
                        />
                      </div>

                      <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setShowAddReviewModal(false)}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={savingReview}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs"
                        >
                          {savingReview ? "Saving..." : "Publish Review"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: SETTINGS (Sound Bell Controls Sole Location + Admin Profile) */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Admin Profile Details */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Administrator Profile</h2>
                      <p className="text-xs text-slate-500">Business credentials & contact desk.</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Super Administrator
                      </span>
                      <span className="text-sm font-bold text-slate-900">Rohit Singh</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Email Account
                      </span>
                      <span className="font-mono text-slate-700">rohitsingh0641346@gmail.com</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Calling Hotline
                      </span>
                      <span className="font-mono text-slate-700">+91 70803 60217</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        WhatsApp Desk
                      </span>
                      <span className="font-mono text-slate-700">+91 70716 34535</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Operating Base & Depot
                      </span>
                      <span className="text-slate-700">सलारपुर HQ डिपो / लंका चौराहा, वाराणसी</span>
                    </div>
                  </div>
                </div>

                {/* Sound & Alert Controls (ONLY Location for Sound Bell per instruction) */}
                <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="border-b border-slate-100 pb-3">
                      <h2 className="text-sm font-bold text-slate-900">Sound & Order Ringtone Alert</h2>
                      <p className="text-xs text-slate-500">
                        Plays a high-pitch synthetic audio chime whenever a customer submits a new booking.
                      </p>
                    </div>

                    <div className="py-4 space-y-4">
                      <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-200/60">
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">Sound Bell Status</span>
                          <span className="text-[11px] text-slate-500">
                            {isSoundMuted ? "Audio chime is currently muted" : "Audio chime is actively ringing on new bookings"}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={toggleSoundMute}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                            isSoundMuted
                              ? "bg-slate-200 text-slate-600 border-slate-300"
                              : "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          }`}
                        >
                          {isSoundMuted ? "Sound Off (Muted)" : "Sound On (Active)"}
                        </button>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/60 text-xs text-slate-600 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block">Test Notification Ringtone</span>
                          <span className="text-[11px] text-slate-500">Verify audio output on this device</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleTestSound}
                          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                        >
                          Play Chime
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Preferences are saved automatically in your browser's local memory.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

      {/* 3. DIRECT PHONE BOOKING MODAL */}
      {showNewBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Direct Phone Booking Entry</h3>
                <p className="text-xs text-slate-500">Record a booking received over phone call or WhatsApp.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewBookingModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualBooking} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustName}
                    onChange={(e) => setNewCustName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="9838000000"
                    maxLength={10}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Pickup Location (Varanasi) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPickup}
                    onChange={(e) => setNewPickup(e.target.value)}
                    placeholder="e.g. लंका चौराहा"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Drop Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDrop}
                    onChange={(e) => setNewDrop(e.target.value)}
                    placeholder="e.g. सिगरा / कैंट स्टेशन"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="10:00 AM"
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">Cargo Type</label>
                  <input
                    type="text"
                    required
                    value={newGoods}
                    onChange={(e) => setNewGoods(e.target.value)}
                    placeholder="Household / Shop"
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Notes / Instructions</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. 1 हेल्पर चाहिए, पहली मंजिल पर चढ़ाना है"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewBookingModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBooking}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5"
                >
                  {creatingBooking ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Booking</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. MOBILE ERGONOMIC BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1 shadow-lg flex items-center justify-around select-none">
        
        <button
          type="button"
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
            activeTab === "dashboard" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
            activeTab === "orders" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Orders</span>
          {stats.pending > 0 && (
            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("drivers")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
            activeTab === "drivers" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Fleet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rates")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
            activeTab === "rates" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Rates</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cms")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
            activeTab === "cms" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <Globe className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">CMS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
            activeTab === "settings" ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900 font-medium"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-[9px] mt-0.5">Settings</span>
        </button>

      </nav>

    </div>
  );
}
