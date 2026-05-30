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
import { useLanguage } from "@/lib/useLanguage";

export default function TrackingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params.code === "string" ? params.code : "";

  const [lang, setLang] = useLanguage();
  const [inquiry, setInquiry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pollingCount, setPollingCount] = useState(0);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReasonOption, setCancelReasonOption] = useState("");
  const [otherReasonDetails, setOtherReasonDetails] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const t = {
    hi: {
      loadingText: "बुकिंग की स्थिति लोड हो रही है...",
      notFoundTitle: "बुकिंग कोड नहीं मिला",
      notFoundDesc: "हमें कोड {code} के तहत कोई बुकिंग नहीं मिली। कृपया कोड चेक करें और फिर से कोशिश करें।",
      backSearch: "सर्च पेज पर वापस जाएँ",
      printSlip: "पर्ची प्रिंट करें",
      exit: "बाहर निकलें",
      liveTracker: "लाइव स्टेटस ट्रैकर",
      bookingId: "बुकिंग आईडी (ID):",
      autoRefresh: "अपडेट हो रहा है (ऑटो रिफ्रेश)",
      cancelledTitle: "बुकिंग रद्द हो गई है",
      cancelledDesc: "यह बुकिंग रद्द कर दी गई है। सहायता के लिए कस्टमर सपोर्ट से संपर्क करें।",
      submitted: "बुकिंग दर्ज",
      quoted: "किराया तय",
      confirmed: "गाड़ी तय",
      completedStep: "सामान पहुँचा",
      receiptTitle: "बुकिंग रसीद (Booking Receipt)",
      pickupLabel: "सामान कहाँ से उठाना है (Pickup)",
      dropLabel: "सामान कहाँ पहुँचाना है (Drop)",
      custName: "ग्राहक का नाम",
      phone: "मोबाइल नंबर",
      date: "बुकिंग की तारीख",
      time: "पसंदीदा समय",
      srvType: "सर्विस का प्रकार",
      weight: "लगभग वजन",
      notSpecified: "तय नहीं है",
      notesLabel: "सामान की लिस्ट / जरूरी निर्देश",
      receiptTermsTitle: "रसीद के नियम व शर्तें (Notes):",
      termsList: [
        "• किराया तय दूरी, टोल टैक्स और लेबर के हिसाब से बदल सकता है।",
        "• गाड़ी अलॉट होने के बाद बुकिंग रद्द करने पर ₹200 चार्ज लगेगा।",
        "• सामान लोड करने से पहले ड्राइवर के साथ लिस्ट जरूर मिला लें।"
      ],
      authSign: "अधिकृत हस्ताक्षर",
      cancelStatus: "यह बुकिंग रद्द हो चुकी है और अब चालू नहीं है।",
      pricingTitle: "तय किराया (Amount)",
      priceConfirmed: "किराया पक्का हो गया है",
      pricePending: "किराया पेंडिंग है",
      pricePendingDesc: "रोहित भैया से फोन पर किराया तय करें।",
      callOwner: "किराया तय करने के लिए कॉल करें",
      assignedTransit: "गाड़ी और ड्राइवर",
      driverVehicle: "ड्राइवर की जानकारी",
      driverName: "ड्राइवर का नाम",
      vehicleNumber: "गाड़ी का नंबर",
      callDriver: "ड्राइवर को कॉल करें",
      driverAwaiting: "ड्राइवर की जानकारी पेंडिंग है",
      driverAwaitingDesc: "बुकिंग पक्की होने पर रोहित भैया यहाँ ड्राइवर और गाड़ी की जानकारी अपडेट कर देंगे।",
      cancelBtn: "बुकिंग रद्द करें",
      modalTitle: "बुकिंग रद्द करें",
      modalDesc: "कृपया बुकिंग रद्द करने का कारण चुनें। इससे हमें अपनी सर्विस सुधारने में मदद मिलती है।",
      specifyReason: "कृपया कारण स्पष्ट करें",
      explainPlaceholder: "अपनी समस्या यहाँ लिखें...",
      modalBack: "पीछे जाएँ",
      modalConfirm: "रद्द करना पक्का करें",
      modalCancelling: "रद्द हो रहा है...",
      selectReasonError: "कृपया बुकिंग रद्द करने का कारण चुनें।",
      specifyReasonError: "कृपया खाली स्थान में कारण लिखें।",
      cancelFailError: "बुकिंग रद्द करने में समस्या आई। फिर से प्रयास करें।"
    },
    en: {
      loadingText: "Retrieving booking status...",
      notFoundTitle: "Tracking Code Not Found",
      notFoundDesc: "We couldn't find any inquiries logged under code {code}. Please verify the code and try again.",
      backSearch: "Back to Search",
      printSlip: "Print Slip",
      exit: "Exit",
      liveTracker: "Live Status Tracker",
      bookingId: "Booking ID:",
      autoRefresh: "Auto refreshing (updates live)",
      cancelledTitle: "Booking Cancelled",
      cancelledDesc: "This booking has been cancelled. If you need any assistance, please contact customer support.",
      submitted: "Submitted",
      quoted: "Price Quoted",
      confirmed: "Confirmed",
      completedStep: "Completed",
      receiptTitle: "Booking Receipt",
      pickupLabel: "Pickup",
      dropLabel: "Drop Point",
      custName: "Customer Name",
      phone: "Phone Number",
      date: "Booking Date",
      time: "Preferred Time",
      srvType: "Service Type",
      weight: "Est. Weight",
      notSpecified: "Not specified",
      notesLabel: "Goods Description / Instructions",
      receiptTermsTitle: "Receipt Notes & Terms:",
      termsList: [
        "• Pricing is subject to actual distance, road tolls, and labor requested.",
        "• Minimum cancellation charges of ₹200 apply once driver is dispatched.",
        "• Please verify your items checklist before loading with the driver."
      ],
      authSign: "Authorized Sign",
      cancelStatus: "This booking is no longer active.",
      pricingTitle: "Negotiated Amount",
      priceConfirmed: "Confirmed Rate",
      pricePending: "₹ Price Pending",
      pricePendingDesc: "Manual price quote is discussed over call.",
      callOwner: "Call Owner to Negotiate",
      assignedTransit: "Assigned Transit",
      driverVehicle: "Driver & Vehicle",
      driverName: "Driver Name",
      vehicleNumber: "Vehicle Number",
      callDriver: "Call Driver",
      driverAwaiting: "Driver Details Awaiting",
      driverAwaitingDesc: "Once your booking is confirmed, Rohit will assign a driver. Driver name and phone will appear here live.",
      cancelBtn: "Cancel Booking",
      modalTitle: "Cancel Booking",
      modalDesc: "Please tell us why you are cancelling your booking. Your feedback helps us improve.",
      specifyReason: "Specify Reason",
      explainPlaceholder: "Explain your problem here...",
      modalBack: "Go Back",
      modalConfirm: "Confirm Cancel",
      modalCancelling: "Cancelling...",
      selectReasonError: "Please select a reason for cancellation.",
      specifyReasonError: "Please specify your reason in the notes.",
      cancelFailError: "Failed to cancel booking. Please try again."
    }
  }[lang];

  const servicesMap: { [key: string]: { hi: string; en: string } } = {
    "Pickup Service": { hi: "पिकअप सर्विस (लोकल भाड़ा)", en: "Pickup Service" },
    "Goods Transport": { hi: "व्यापारिक माल ट्रांसपोर्ट", en: "Goods Transport" },
    "Household Shifting": { hi: "घर का सामान बदलना (Shifting)", en: "Household Shifting" },
    "Furniture Shifting": { hi: "फर्नीचर शिफ्टिंग", en: "Furniture Shifting" },
    "Parcel Delivery": { hi: "पार्सल डिलीवरी (बल्क सामान)", en: "Parcel Delivery" },
    "Local Transport": { hi: "लोकल ट्रांसपोर्ट (वाराणसी)", en: "Local Transport" },
    "Intercity Transport": { hi: "बाहर जिलों के लिए ट्रांसपोर्ट", en: "Intercity Transport" },
    "Tempo Booking": { hi: "टेम्पो बुकिंग", en: "Tempo Booking" },
    "Sabji Mandi Logistics": { hi: "सब्जी मंडी माल सप्लाई", en: "Sabji Mandi Logistics" },
  };

  const handleCancelBooking = async () => {
    if (!cancelReasonOption) {
      setCancelError(t.selectReasonError);
      return;
    }

    let finalReason = cancelReasonOption;
    if (cancelReasonOption === "Other Reason / कोई अन्य कारण") {
      if (!otherReasonDetails.trim()) {
        setCancelError(t.specifyReasonError);
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
      setCancelError(result.error || t.cancelFailError);
    }
    setCancelLoading(false);
  };

  const fetchInquiry = async (showLoader = false) => {
    if (showLoader) setLoading(true);
    try {
      const result = await getInquiryByCode(code);
      if (result.success && result.inquiry) {
        setInquiry(result.inquiry);
        setError("");
      } else {
        setError(result.error || "Failed to load tracking data.");
      }
    } catch (err: any) {
      console.error("Fetch inquiry error:", err);
      setError("Server connection failed. Make sure you redeployed Vercel after adding Env Variables.");
    } finally {
      setLoading(false);
    }
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
          <span className="text-sm font-semibold text-slate-600">{t.loadingText}</span>
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
              <ArrowLeft className="w-4 h-4" /> {t.backSearch}
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center border border-red-100">
              <Package className="w-6 h-6" />
            </div>
            <h1 className="font-display font-extrabold text-xl text-primary-800">{t.notFoundTitle}</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              {t.notFoundDesc.replace("{code}", code)}
            </p>
            <Link href="/track" className="w-full py-3 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider mt-2 border-none">
              {t.backSearch}
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
              onClick={() => setLang(lang === "hi" ? "en" : "hi")}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 transition-all cursor-pointer"
            >
              🌐 {lang === "hi" ? "English" : "हिन्दी"}
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> {t.printSlip}
            </button>
            <Link href="/track" className="flex items-center gap-1 px-3 py-2 text-slate-500 hover:text-primary-800 text-xs font-bold transition-all">
              <ArrowLeft className="w-4 h-4" /> {t.exit}
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
              <span className="text-[10px] uppercase font-bold text-slate-400">{t.liveTracker}</span>
              <h2 className="text-lg font-extrabold text-primary-800 flex items-center gap-2">
                {t.bookingId} <span className="font-mono font-black text-accent-500">{code}</span>
              </h2>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              {t.autoRefresh}
            </span>
          </div>

          {/* Progress Stepper Visual */}
          {inquiry.status === "cancelled" ? (
            <div className="my-6 p-5 bg-red-50 border border-red-100 rounded-2xl text-center flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-red-100 text-red-650 rounded-full flex items-center justify-center border border-red-200">
                <XCircle className="w-6 h-6 text-red-650" />
              </div>
              <h3 className="font-display font-extrabold text-base text-red-800 uppercase tracking-wide">{t.cancelledTitle}</h3>
              <p className="text-xs text-red-650 max-w-md">
                {t.cancelledDesc}
              </p>
            </div>
          ) : (
            <div className="relative flex items-center justify-between mt-8 mb-4 max-w-2xl mx-auto px-4">
              {/* Step 1 */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${getStepStatusClass("submitted", inquiry.status)}`}>
                  1
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center">{t.submitted}</span>
              </div>
              <div className={`flex-1 h-0.5 transition-all ${getStepProgressLineClass("submitted", inquiry.status)}`}></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${getStepStatusClass("quoted", inquiry.status)}`}>
                  2
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center">{t.quoted}</span>
              </div>
              <div className={`flex-1 h-0.5 transition-all ${getStepProgressLineClass("quoted", inquiry.status)}`}></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${getStepStatusClass("confirmed", inquiry.status)}`}>
                  3
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center">{t.confirmed}</span>
              </div>
              <div className={`flex-1 h-0.5 transition-all ${getStepProgressLineClass("confirmed", inquiry.status)}`}></div>

              {/* Step 4 */}
              <div className="flex flex-col items-center z-10">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all ${getStepStatusClass("completed", inquiry.status)}`}>
                  4
                </div>
                <span className="text-[10px] font-bold text-slate-600 mt-2 text-center">{t.completedStep}</span>
              </div>
            </div>
          )}
          
          {/* Status Context Alerts */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-center text-xs mt-6">
            {inquiry.status === "pending" && (
              <p className="text-slate-600">
                🟠 <strong>{lang === "hi" ? "स्थिति: बुकिंग दर्ज हो गई है।" : "Status: Inquiry Logged."}</strong> {lang === "hi" ? "रोहित भैया जल्दी ही आपको फ़ोन करके किराया और गाड़ी तय करेंगे।" : "Rohit Kumar Singh will call you shortly to discuss pricing & vehicle availability."}
              </p>
            )}
            {inquiry.status === "contacted" && !inquiry.driver_name && (
              <p className="text-primary-800 font-semibold">
                🔵 <strong>{lang === "hi" ? "स्थिति: किराया तय हो गया है।" : "Status: Price Quoted."}</strong> {lang === "hi" ? `रोहित भैया ने आपसे बात कर ली है। फाइनल किराया: ` : `Rohit has contacted you. Finalized booking amount: `}<span className="text-accent-500 font-bold text-sm">₹{inquiry.quoted_amount || "TBD"}</span>{lang === "hi" ? `। गाड़ी और ड्राइवर अलॉट होना बाकी है।` : `. Awaiting vehicle/driver assignment.`}
              </p>
            )}
            {inquiry.status === "contacted" && inquiry.driver_name && (
              <p className="text-emerald-700 font-semibold">
                🟢 <strong>{lang === "hi" ? "स्थिति: बुकिंग पक्की हो गई है।" : "Status: Booking Confirmed."}</strong> {lang === "hi" ? "ड्राइवर और गाड़ी तय हो चुकी है। डिटेल्स नीचे देखें। सामान भेजने के लिए तैयार रखें!" : "Driver details have been assigned. See details below. Ready for transit!"}
              </p>
            )}
            {inquiry.status === "completed" && (
              <p className="text-emerald-700 font-semibold">
                ✅ <strong>{lang === "hi" ? "स्थिति: ट्रिप पूरा हो गया है।" : "Status: Trip Completed."}</strong> {lang === "hi" ? "सामान सुरक्षित रूप से पहुँचा दिया गया है। कृष्णा ट्रांसपोर्ट चुनने के लिए धन्यवाद!" : "Maal safely delivered. Thank you for choosing Krishna Transport & Travel Management!"}
              </p>
            )}
            {inquiry.status === "cancelled" && (
              <div className="text-slate-600">
                <p className="font-semibold text-red-700">❌ <strong>{lang === "hi" ? "स्थिति: बुकिंग रद्द है।" : "Status: Cancelled."}</strong> {t.cancelStatus}</p>
                {inquiry.cancellation_reason && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    {lang === "hi" ? "कारण:" : "Reason:"} <span className="font-mono bg-white px-2 py-0.5 border border-slate-200 rounded font-semibold text-slate-700">{inquiry.cancellation_reason}</span>
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
                <h1 className="font-display font-extrabold text-xl text-primary-800">{t.receiptTitle}</h1>
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
                  <span className="block text-[9px] uppercase font-bold text-slate-400 leading-tight">{t.pickupLabel}</span>
                  <span className="text-slate-800">{inquiry.pickup_location}</span>
                </div>
              </div>
              <div className="text-slate-400 font-bold text-base tracking-widest">&rarr;</div>
              <div className="flex items-center gap-2 text-right">
                <div className="flex flex-col items-end">
                  <span className="block text-[9px] uppercase font-bold text-slate-400 leading-tight">{t.dropLabel}</span>
                  <span className="text-slate-800">{inquiry.drop_location}</span>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 text-sm">
              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.custName}</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" /> {inquiry.full_name}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.phone}</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" /> {inquiry.phone_number}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.date}</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" /> {inquiry.booking_date}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.time}</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> {inquiry.booking_time}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.srvType}</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-slate-400" />
                  {servicesMap[inquiry.goods_type] ? servicesMap[inquiry.goods_type][lang] : inquiry.goods_type}
                </span>
              </div>

              <div>
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.weight}</span>
                <span className="font-bold text-slate-800">
                  {inquiry.weight || t.notSpecified}
                </span>
              </div>
            </div>

            {inquiry.notes && (
              <div className="border-t border-slate-100 pt-5">
                <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">{t.notesLabel}</span>
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs text-slate-600 leading-relaxed font-mono">
                  {inquiry.notes}
                </div>
              </div>
            )}

            {/* Terms and Signatures */}
            <div className="border-t border-dashed border-slate-200 pt-6 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div className="text-[10px] text-slate-400 max-w-sm flex flex-col gap-1">
                <span className="font-bold uppercase text-slate-500">{t.receiptTermsTitle}</span>
                {t.termsList.map((term, i) => (
                  <span key={i}>{term}</span>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-2 w-36 text-center">
                <span className="block text-[8px] uppercase tracking-widest text-slate-400">{t.authSign}</span>
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
                <h4 className="font-bold text-slate-700 text-sm">{t.cancelledTitle}</h4>
                <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                  {t.cancelledDesc}
                </p>
              </div>
            ) : (
              <>
                {/* Price Quote Panel */}
                <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col gap-4 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{t.pricingTitle}</span>
                  <div className="bg-slate-50 border border-slate-150 py-5 rounded-2xl flex flex-col items-center justify-center">
                    {inquiry.quoted_amount ? (
                      <>
                        <span className="text-3xl font-extrabold text-primary-800 flex items-center justify-center gap-1">
                          <Coins className="w-7 h-7 text-accent-500" /> ₹{inquiry.quoted_amount}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase mt-1">{t.priceConfirmed}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-slate-400">{t.pricePending}</span>
                        <span className="text-[10px] text-slate-400 mt-1 px-4">{t.pricePendingDesc}</span>
                      </>
                    )}
                  </div>
                  <a 
                    href="tel:7080360217"
                    className="w-full py-2.5 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" /> {t.callOwner}
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
                        <span className="block text-[8px] uppercase font-bold text-slate-400">{t.assignedTransit}</span>
                        <span className="block text-sm font-extrabold text-slate-800">{t.driverVehicle}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs">
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">{t.driverName}</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <User className="w-4 h-4 text-slate-400" /> {inquiry.driver_name}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase font-bold text-slate-400 mb-0.5">{t.vehicleNumber}</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-slate-400" /> {inquiry.vehicle_number || "UP-65-XXXX"}
                        </span>
                      </div>
                    </div>

                    <a 
                      href={`tel:${inquiry.driver_phone}`}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-50"
                    >
                      <Phone className="w-3.5 h-3.5" /> {t.callDriver}
                    </a>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center gap-3 py-8">
                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100">
                      <Truck className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-slate-700 text-sm">{t.driverAwaiting}</h4>
                    <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                      {t.driverAwaitingDesc}
                    </p>
                  </div>
                )}

                {/* Cancel Booking Button */}
                {inquiry.status !== "completed" && inquiry.status !== "cancelled" && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-red-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-red-50/50"
                  >
                    <XCircle className="w-3.5 h-3.5" /> {t.cancelBtn}
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
              <h3 className="font-display font-extrabold text-xl text-primary-800">{t.modalTitle}</h3>
              <p className="text-xs text-slate-500 mt-1">{t.modalDesc}</p>
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
                <label className="text-[10px] font-bold text-slate-500 uppercase">{t.specifyReason}</label>
                <textarea
                  placeholder={t.explainPlaceholder}
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
                {t.modalBack}
              </button>
              <button
                type="button"
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wide transition-all cursor-pointer shadow-md shadow-red-50 flex items-center justify-center gap-1.5 disabled:opacity-50 border-none"
              >
                {cancelLoading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {t.modalCancelling}
                  </>
                ) : (
                  t.modalConfirm
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
