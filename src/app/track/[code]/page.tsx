"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getInquiryByCode, cancelBooking } from "@/app/actions";
import { 
  ArrowLeft, 
  Printer, 
  Phone, 
  User, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  CheckCircle2, 
  Truck,
  RotateCw,
  Coins,
  XCircle,
  AlertTriangle
} from "lucide-react";

export default function TrackingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params.code === "string" ? params.code : "";

  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pollingCount, setPollingCount] = useState(0);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReasonOption, setCancelReasonOption] = useState("");
  const [otherReasonDetails, setOtherReasonDetails] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const handleCancelBooking = async () => {
    if (!cancelReasonOption) {
      setCancelError("Please select a reason for cancellation.");
      return;
    }

    let finalReason = cancelReasonOption;
    if (cancelReasonOption === "Other Reason / कोई अन्य कारण") {
      if (!otherReasonDetails.trim()) {
        setCancelError("Please specify your reason in the notes.");
        return;
      }
      finalReason = `Other: ${otherReasonDetails.trim()}`;
    }

    setCancelLoading(true);
    setCancelError("");

    const result = await cancelBooking(code, finalReason);
    if (result.success) {
      setInquiry((prev: any) => prev ? {
        ...prev,
        status: "cancelled",
        cancellation_reason: finalReason
      } : null);
      setShowCancelModal(false);
    } else {
      setCancelError(result.error || "Failed to cancel booking. Please try again.");
    }
    setCancelLoading(false);
  };

  const fetchInquiry = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    const result = await getInquiryByCode(code);
    if (result.success && result.inquiry) {
      setInquiry(result.inquiry);
      setError("");
    } else {
      setError(result.error || "Failed to load tracking data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (code) {
      fetchInquiry(true);

      // Poll database every 15 seconds for live admin updates
      const interval = setInterval(() => {
        setPollingCount((prev) => prev + 1);
        fetchInquiry(false);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [code]);

  const handlePrint = () => {
    window.print();
  };

  const getStepStatusClass = (stepName: string, currentStatus: string) => {
    const statuses = ["pending", "contacted", "completed"];
    const currentIdx = statuses.indexOf(currentStatus);
    
    // Map custom step names
    if (stepName === "submitted") {
      return "bg-emerald-600 text-white border-emerald-600";
    }
    
    if (stepName === "quoted") {
      if (inquiry.quoted_amount) {
        return "bg-emerald-600 text-white border-emerald-600";
      }
      return currentStatus !== "pending" 
        ? "bg-emerald-600 text-white border-emerald-600" 
        : "bg-white text-slate-400 border-slate-200";
    }

    if (stepName === "confirmed") {
      return (currentStatus === "contacted" && inquiry.driver_name) || currentStatus === "completed"
        ? "bg-emerald-600 text-white border-emerald-600"
        : "bg-white text-slate-400 border-slate-200";
    }

    if (stepName === "completed") {
      return currentStatus === "completed"
        ? "bg-emerald-600 text-white border-emerald-600"
        : "bg-white text-slate-400 border-slate-200";
    }

    return "bg-white text-slate-400 border-slate-200";
  };

  const getStepProgressLineClass = (afterStep: string, currentStatus: string) => {
    // Determine active line color
    if (afterStep === "submitted") {
      return currentStatus !== "pending" || inquiry.quoted_amount ? "bg-emerald-600" : "bg-slate-200";
    }
    if (afterStep === "quoted") {
      return (currentStatus === "contacted" && inquiry.driver_name) || currentStatus === "completed" ? "bg-emerald-600" : "bg-slate-200";
    }
    if (afterStep === "confirmed") {
      return currentStatus === "completed" ? "bg-emerald-600" : "bg-slate-200";
    }
    return "bg-slate-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-600">Retrieving booking status...</span>
        </div>
      </div>
    );
  }

  if (error || !inquiry) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <header className="bg-white border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
              <span className="font-display font-extrabold text-sm text-primary-800 uppercase">Krishna Transport</span>
            </Link>
            <Link href="/track" className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Tracking Search
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="font-display font-extrabold text-xl text-primary-800">Tracking Code Not Found</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              We couldn't find any inquiries logged under code <span className="font-mono font-bold text-red-600">{code}</span>. Please verify the code and try again.
            </p>
            <Link href="/track" className="w-full py-3 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider mt-2">
              Back to Search
            </Link>
          </div>
        </main>

        <footer className="py-6 border-t border-slate-200 bg-white text-center">
          <span className="text-[10px] text-slate-400 font-medium">© 2026 Krishna Transport & Travel Management.</span>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between print:bg-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
            <div>
              <span className="block font-display font-extrabold text-sm text-primary-800 leading-tight">
                Krishna Transport
              </span>
              <span className="block font-sans font-medium text-[9px] text-slate-500 uppercase tracking-widest">
                & Travel Management
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200"
            >
              <Printer className="w-4 h-4" /> Print Slip
            </button>
            <Link href="/track" className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-primary-800 text-xs font-bold transition-all">
              <ArrowLeft className="w-4 h-4" /> Exit
            </Link>
          </div>
        </div>
      </header>

      {/* Main Track Sheet */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 print:p-0">
        
        {/* Status Stepper Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm print:hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Live Status Tracker</span>
              <h2 className="text-lg font-extrabold text-primary-800 flex items-center gap-2">
                Booking ID: <span className="font-mono font-black text-accent-500">{code}</span>
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              Auto refreshing (updates live)
            </span>
          </div>

          {/* Progress Stepper Visual */}
          {inquiry.status === "cancelled" ? (
            <div className="my-6 p-5 bg-red-50 border border-red-100 rounded-2xl text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-red-100 text-red-650 rounded-full flex items-center justify-center border border-red-200">
                <XCircle className="w-6 h-6 text-red-650" />
              </div>
              <h3 className="font-display font-extrabold text-base text-red-800 uppercase tracking-wide">Booking Cancelled</h3>
              <p className="text-xs text-red-650 max-w-md">
                This booking has been cancelled. If you need any assistance, please contact customer support.
              </p>
            </div>
          ) : (
            <div className="relative flex items-center justify-between mt-8 mb-4 max-w-2xl mx-auto px-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${getStepStatusClass("submitted", inquiry.status)}`}>
                  1
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center">Submitted</span>
              </div>
              <div className={`flex-1 h-0.5 transition-all ${getStepProgressLineClass("submitted", inquiry.status)}`}></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${getStepStatusClass("quoted", inquiry.status)}`}>
                  2
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center">Price Quoted</span>
              </div>
              <div className={`flex-1 h-0.5 transition-all ${getStepProgressLineClass("quoted", inquiry.status)}`}></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${getStepStatusClass("confirmed", inquiry.status)}`}>
                  3
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center">Confirmed</span>
              </div>
              <div className={`flex-1 h-0.5 transition-all ${getStepProgressLineClass("confirmed", inquiry.status)}`}></div>

              {/* Step 4 */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${getStepStatusClass("completed", inquiry.status)}`}>
                  4
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center">Completed</span>
              </div>
            </div>
          )}
          
          {/* Status Context Alerts */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-xs mt-6">
            {inquiry.status === "pending" && (
              <p className="text-slate-600">
                🟠 <strong>Status: Inquiry Logged.</strong> Rohit Kumar Singh will call you shortly to discuss pricing & vehicle availability.
              </p>
            )}
            {inquiry.status === "contacted" && !inquiry.driver_name && (
              <p className="text-primary-800 font-semibold">
                🔵 <strong>Status: Price Quoted.</strong> Rohit has contacted you. Finalized booking amount: <span className="text-accent-500 font-bold text-sm">₹{inquiry.quoted_amount || "TBD"}</span>. Awaiting vehicle/driver assignment.
              </p>
            )}
            {inquiry.status === "contacted" && inquiry.driver_name && (
              <p className="text-emerald-700 font-semibold">
                🟢 <strong>Status: Booking Confirmed.</strong> Driver details have been assigned. See details below. Ready for transit!
              </p>
            )}
            {inquiry.status === "completed" && (
              <p className="text-emerald-700 font-semibold">
                ✅ <strong>Status: Trip Completed.</strong> Maal safely delivered. Thank you for choosing Krishna Transport & Travel Management!
              </p>
            )}
            {inquiry.status === "cancelled" && (
              <div className="text-slate-600">
                <p className="font-semibold text-red-700">❌ <strong>Status: Cancelled.</strong> This booking is no longer active.</p>
                {inquiry.cancellation_reason && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    Reason: <span className="font-mono bg-white px-2 py-0.5 border border-slate-200 rounded font-semibold text-slate-700">{inquiry.cancellation_reason}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Digital Booking Receipt (Left Side) */}
          <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden print:border-none print:shadow-none print:p-0">
            {/* Stamp Logo Overlay */}
            <div className="absolute top-4 right-4 w-24 h-24 border-4 border-dashed border-primary-100 rounded-full flex items-center justify-center rotate-12 select-none pointer-events-none opacity-40">
              <span className="font-display font-extrabold text-[10px] text-primary-800 uppercase tracking-widest text-center">
                Krishna <br /> Logged
              </span>
            </div>

            <div className="flex justify-between items-start border-b border-dashed border-slate-200 pb-6">
              <div>
                <h1 className="font-display font-extrabold text-xl text-primary-800">Booking Receipt</h1>
                <span className="text-[10px] font-bold text-slate-400">Krishna Transport & Travel Management</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Booking ID</span>
                <span className="font-mono font-extrabold text-primary-800 text-base">{code}</span>
              </div>
            </div>

            {/* Core Route Detail Banner */}
            <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-4 flex justify-between items-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary-600 shrink-0" />
                <div>
                  <span className="block text-[9px] uppercase font-bold text-slate-400 leading-tight">Pickup</span>
                  <span className="text-slate-800">{inquiry.pickup_location}</span>
                </div>
              </div>
              <div className="text-slate-400 font-bold text-base tracking-widest">&rarr;</div>
              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col items-end">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 leading-tight">Drop Point</span>
                  <span className="text-slate-800">{inquiry.drop_location}</span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Customer Name</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" /> {inquiry.full_name}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Phone Number</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> {inquiry.phone_number}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Booking Date</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" /> {inquiry.booking_date}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Preferred Time</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> {inquiry.booking_time}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Service Type</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-slate-400" /> {inquiry.goods_type}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">Est. Weight</span>
                <span className="font-bold text-slate-800">
                  {inquiry.weight || "Not specified"}
                </span>
              </div>
            </div>

            {inquiry.notes && (
              <div className="border-t border-slate-100 pt-5">
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Goods Description / Instructions</span>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs text-slate-600 leading-relaxed font-mono">
                  {inquiry.notes}
                </div>
              </div>
            )}

            {/* Terms and Signatures */}
            <div className="border-t border-dashed border-slate-200 pt-6 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="text-[10px] text-slate-400 max-w-sm flex flex-col gap-1">
                <span className="font-bold uppercase text-slate-500">Receipt Notes & Terms:</span>
                <span>• Pricing is subject to actual distance, road tolls, and labor requested.</span>
                <span>• Minimum cancellation charges of ₹200 apply once driver is dispatched.</span>
                <span>• Please verify your items checklist before loading with the driver.</span>
              </div>
              <div className="border-t border-slate-200 pt-2 w-36 text-center">
                <span className="block text-[8px] uppercase tracking-widest text-slate-400">Authorized Sign</span>
                <span className="font-display font-black text-xs text-primary-800 uppercase tracking-widest leading-none">KRISHNA LOGISTICS</span>
              </div>
            </div>
          </div>

          {/* Pricing & Driver Assignment Details (Right Side) */}
          <div className="md:col-span-4 flex flex-col gap-6 print:hidden">
            {inquiry.status === "cancelled" ? (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center gap-3 py-8">
                <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100">
                  <XCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Booking Cancelled</h4>
                <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                  This transaction has been terminated. No driver or transit will be dispatched for this booking code.
                </p>
              </div>
            ) : (
              <>
                {/* Price Quote Panel */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Negotiated Amount</span>
                  <div className="bg-slate-50 border border-slate-150 py-5 rounded-2xl flex flex-col items-center justify-center">
                    {inquiry.quoted_amount ? (
                      <>
                        <span className="text-3xl font-extrabold text-primary-800 flex items-center justify-center gap-1">
                          <Coins className="w-7 h-7 text-accent-500" /> ₹{inquiry.quoted_amount}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1">Confirmed Rate</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-slate-400">₹ Price Pending</span>
                        <span className="text-[10px] text-slate-400 mt-1 px-4">Manual price quote is discussed over call.</span>
                      </>
                    )}
                  </div>
                  <a 
                    href="tel:7080360217"
                    className="w-full py-2.5 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Owner to Negotiate
                  </a>
                </div>

                {/* Driver Assignment Card */}
                {inquiry.driver_name ? (
                  <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm flex flex-col gap-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <Truck className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <span className="block text-[8px] uppercase font-bold text-slate-400">Assigned Transit</span>
                        <span className="block text-sm font-extrabold text-slate-800">Driver & Vehicle</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Driver Name</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400" /> {inquiry.driver_name}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">Vehicle Number</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-slate-400" /> {inquiry.vehicle_number || "UP-65-XXXX"}
                        </span>
                      </div>
                    </div>

                    <a 
                      href={`tel:${inquiry.driver_phone}`}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-50"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Driver
                    </a>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center gap-3 py-8">
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">Driver Details Awaiting</h4>
                    <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                      Once your booking is confirmed, Rohit will assign a driver. Driver name and phone will appear here live.
                    </p>
                  </div>
                )}

                {/* Cancel Booking Button */}
                {inquiry.status !== "completed" && inquiry.status !== "cancelled" && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-red-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-red-50/50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center print:hidden">
        <span className="text-[10px] text-slate-400 font-medium">
          © 2026 Krishna Transport & Travel Management. Varanasi, 221007.
        </span>
      </footer>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-md w-full p-6 sm:p-8 flex flex-col gap-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h3 className="font-display font-extrabold text-xl text-primary-800">Cancel Booking</h3>
              <p className="text-xs text-slate-500 mt-1">Please tell us why you are cancelling your booking. Your feedback helps us improve.</p>
            </div>

            {cancelError && (
              <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-xs font-semibold">
                {cancelError}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {[
                { id: "pricing", label: "Price is too high / किराया ज़्यादा है" },
                { id: "delay", label: "Delay in response / रिस्पॉन्स में देरी" },
                { id: "competitor", label: "Found another option / दूसरा साधन मिल गया" },
                { id: "plan_changed", label: "Plan changed / बुकिंग की ज़रूरत नहीं है" },
                { id: "other", label: "Other Reason / कोई अन्य कारण" }
              ].map((option) => (
                <label 
                  key={option.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                    cancelReasonOption === option.label 
                      ? "border-primary-800 bg-primary-50/30 font-semibold" 
                      : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={option.label}
                    checked={cancelReasonOption === option.label}
                    onChange={(e) => {
                      setCancelReasonOption(e.target.value);
                      setCancelError("");
                    }}
                    className="w-4 h-4 text-primary-800 border-slate-300 focus:ring-primary-600 cursor-pointer"
                  />
                  <span className="text-xs text-slate-700">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Other details field */}
            {cancelReasonOption === "Other Reason / कोई अन्य कारण" && (
              <div className="flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Specify Reason</label>
                <textarea
                  placeholder="Explain your problem here... (आपकी समस्या यहाँ लिखें)"
                  value={otherReasonDetails}
                  onChange={(e) => {
                    setOtherReasonDetails(e.target.value);
                    setCancelError("");
                  }}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 text-xs bg-slate-50/50 font-sans font-medium"
                />
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReasonOption("");
                  setOtherReasonDetails("");
                  setCancelError("");
                }}
                disabled={cancelLoading}
                className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer text-center disabled:opacity-50"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer shadow-md shadow-red-50 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {cancelLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancel"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
