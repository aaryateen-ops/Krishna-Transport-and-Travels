"use client";

import React, { useState, useEffect, useRef } from "react";
import { submitInquiry, InquiryData } from "@/app/actions";
import { 
  Send, 
  PhoneCall, 
  CheckCircle,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Package,
  Scale,
  FileText,
  ChevronDown,
  Navigation
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { supabase } from "@/lib/supabase";

interface InquiryFormProps {
  initialService?: string;
  lang?: "hi" | "en";
}

export default function InquiryForm({ initialService = "", lang = "hi" }: InquiryFormProps) {
  const [formData, setFormData] = useState<InquiryData>({
    fullName: "",
    phoneNumber: "",
    pickupLocation: "",
    dropLocation: "",
    bookingDate: "",
    bookingTime: "Morning (6 AM - 12 PM)",
    goodsType: initialService || "",
    weight: "",
    notes: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; error?: string }>({});
  const [inquiryCode, setInquiryCode] = useState("");
  const [redirectCount, setRedirectCount] = useState<number | null>(null);

  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearInterval(redirectTimerRef.current);
      }
    };
  }, []);

  // Load session or query parameters to prefill form
  useEffect(() => {
    async function prefillForm() {
      // 1. Try URL parameters first
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get("name");
      const urlPhone = params.get("phone");
      const urlEmail = params.get("email");

      let prefilledName = urlName || "";
      let prefilledPhone = urlPhone || "";
      let prefilledEmail = urlEmail || "";

      // 2. If URL parameters are missing, try Supabase session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const metadata = session.user.user_metadata || {};
          if (!prefilledName) prefilledName = metadata.full_name || "";
          if (!prefilledPhone) prefilledPhone = metadata.phone_number || "";
          if (!prefilledEmail) prefilledEmail = session.user.email || "";
        }
      } catch (err) {
        console.error("InquiryForm prefill session error:", err);
      }

      setFormData((prev) => ({
        ...prev,
        fullName: prefilledName,
        phoneNumber: prefilledPhone,
        email: prefilledEmail,
      }));
    }

    prefillForm();
  }, []);

  useEffect(() => {
    if (initialService) {
      setFormData((prev) => ({ ...prev, goodsType: initialService }));
    }
  }, [initialService]);

  // Set min date to today's date
  const [minDate, setMinDate] = useState("");
  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({});

    const result = await submitInquiry(formData);

    if (result.success && result.redirectUrl) {
      if (result.inquiryCode) {
        setInquiryCode(result.inquiryCode);
      }
      setStatus({ success: true });
      setLoading(false);
      
      // Start a 3-second countdown to WhatsApp redirect
      let count = 3;
      setRedirectCount(count);
      const timer = setInterval(() => {
        count -= 1;
        setRedirectCount(count);
        if (count <= 0) {
          clearInterval(timer);
          window.location.href = result.redirectUrl as string;
        }
      }, 1000);
      redirectTimerRef.current = timer;
    } else {
      setStatus({ error: result.error || (lang === "hi" ? "बुकिंग दर्ज करने में समस्या आई। कृपया फिर से कोशिश करें।" : "Submission failed. Please try again.") });
      setLoading(false);
    }
  };

  const labels = {
    hi: {
      title: "गाड़ी का किराया जानें",
      linked: "बुकिंग आपके खाते से लिंक है",
      subtitle: "नीचे अपनी डिटेल्स भरें। फॉर्म भेजने के बाद रोहित भैया आपसे सीधे व्हाट्सएप या कॉल पर किराया तय कर लेंगे।",
      submitting: "बुकिंग दर्ज हो रही है...",
      submitBtn: "बुकिंग करें और व्हाट्सएप पर किराया जानें",
      minBooking: "किराया कम से कम ₹600 से शुरू",
      coverage: "वाराणसी और आस-पास के 10+ जिलों में सर्विस",
      successTitle: "बुकिंग रिक्वेस्ट दर्ज हो गई है!",
      successDesc: "आपकी जानकारी हमारे पास सुरक्षित दर्ज हो गई है।",
      bookingId: "बुकिंग आईडी (ID)",
      service: "सर्विस",
      phone: "फ़ोन",
      route: "रूट (कहाँ से कहाँ)",
      redirecting: "किराया तय करने के लिए आपको सीधे रोहित भैया के व्हाट्सएप पर ले जा रहे हैं...",
      whatsappIn: "व्हाट्सएप {seconds} सेकंड में...",
      trackDirectly: "या सीधे ट्रैकिंग स्टेटस शीट देखें →",
      whatsappFail: "अगर व्हाट्सएप अपने आप नहीं खुलता है, तो हमें 7080360217 पर फोन करें।",
      custDetails: "👤 ग्राहक की जानकारी (Customer Details)",
      fullName: "आपका पूरा नाम *",
      fullNamePlaceholder: "अपना नाम दर्ज करें",
      phoneLabel: "व्हाट्सएप मोबाइल नंबर *",
      phonePlaceholder: "10 अंकों का मोबाइल नंबर",
      routeDetails: "📍 कहाँ से कहाँ जाना है (Route)",
      pickupLabel: "सामान कहाँ से उठाना है (पिकअप) *",
      pickupPlaceholder: "जैसे: सिगरा, Varanasi",
      dropLabel: "सामान कहाँ पहुँचाना है (ड्रॉप) *",
      dropPlaceholder: "जैसे: सालरपुर, Varanasi या आज़मगढ़",
      cargoDetails: "📦 गाड़ी और सामान की जानकारी",
      serviceType: "कैसी गाड़ी/सर्विस चाहिए *",
      servicePlaceholder: "सर्विस का प्रकार चुनें",
      weightLabel: "लगभग कितना वजन है? (ऑप्शनल)",
      weightPlaceholder: "जैसे: 500kg, 1 टन",
      dateLabel: "बुकिंग की तारीख *",
      timeLabel: "सामान भेजने का समय *",
      notesLabel: "सामान की लिस्ट या कोई जरूरी बात (ऑप्शनल)",
      notesPlaceholder: "सामान की लिस्ट लिखें (जैसे: बेड, फ्रिज, 10 कार्टन) या लोडिंग की जानकारी...",
      voiceNoteTip: "💡 सलाह: व्हाट्सएप खुलने पर आप रोहित भैया को बोलकर (वॉइस नोट भेजकर) भी किराया फाइनल कर सकते हैं।",
    },
    en: {
      title: "Get Instant Free Quote",
      linked: "Booking linked to your account",
      subtitle: "Fill in details. Rohit will coordinate best rates manually on WhatsApp!",
      submitting: "Submitting Inquiry...",
      submitBtn: "Book & Get Price On WhatsApp",
      minBooking: "Min. booking from ₹600",
      coverage: "Varanasi & 10+ Districts",
      successTitle: "Inquiry Registered!",
      successDesc: "Your request has been saved in our booking log.",
      bookingId: "Booking ID",
      service: "Service",
      phone: "Phone",
      route: "Route",
      redirecting: "Redirecting to WhatsApp to coordinate pricing with Rohit Kumar Singh...",
      whatsappIn: "WhatsApp in {seconds}s...",
      trackDirectly: "Or, view live tracking status sheet directly →",
      whatsappFail: "If WhatsApp does not open automatically, contact us at 7080360217.",
      custDetails: "👤 Customer Details",
      fullName: "Full Name *",
      fullNamePlaceholder: "Enter your name",
      phoneLabel: "WhatsApp Phone Number *",
      phonePlaceholder: "10 digit mobile number",
      routeDetails: "📍 Route details",
      pickupLabel: "Pickup Location *",
      pickupPlaceholder: "e.g., Sigra, Varanasi",
      dropLabel: "Drop Location *",
      dropPlaceholder: "e.g., Salarpur, Varanasi or Azamgarh",
      cargoDetails: "📦 Schedule & Cargo Details",
      serviceType: "Type of Service *",
      servicePlaceholder: "Select service type",
      weightLabel: "Estimated Weight (Optional)",
      weightPlaceholder: "e.g., 500kg, 1 Ton",
      dateLabel: "Booking Date *",
      timeLabel: "Preferred Transit Time *",
      notesLabel: "Special Instructions / Goods List (Optional)",
      notesPlaceholder: "List items to shift (e.g. Bed, Fridge, 10 Cartons) or loading details...",
      voiceNoteTip: "💡 Tip: Once WhatsApp opens, you can also send a voice note to negotiate prices.",
    }
  };

  const t = lang === "hi" ? labels.hi : labels.en;

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

  if (status.success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100 text-center flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">{t.successTitle}</h3>
        <p className="text-sm text-slate-500 mb-6">{t.successDesc}</p>
        
        {/* Booking Slip Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full max-w-sm mb-6 text-left flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-800 text-white flex items-center justify-center translate-x-6 -translate-y-6 rotate-45 font-bold text-[8px] uppercase tracking-widest pt-5">
            LOG
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">{t.bookingId}</span>
            <span className="block font-mono font-extrabold text-lg text-primary-800">{inquiryCode}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-xs">
            <div>
              <span className="block font-semibold text-slate-400 text-[10px] uppercase">{t.service}</span>
              <span className="font-bold text-slate-700">
                {servicesMap[formData.goodsType] ? servicesMap[formData.goodsType][lang] : formData.goodsType}
              </span>
            </div>
            <div>
              <span className="block font-semibold text-slate-400 text-[10px] uppercase">{t.phone}</span>
              <span className="font-bold text-slate-700">{formData.phoneNumber}</span>
            </div>
          </div>
          <div className="text-xs border-t border-slate-200 pt-2">
            <span className="block font-semibold text-slate-400 text-[10px] uppercase">{t.route}</span>
            <span className="font-bold text-slate-700">{formData.pickupLocation} &rarr; {formData.dropLocation}</span>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 max-w-xs leading-relaxed">
          {t.redirecting}
        </p>

        <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 mb-6 max-w-xs font-semibold leading-relaxed">
          {t.voiceNoteTip}
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold rounded-xl shadow-lg transition-all duration-300 border-none">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {t.whatsappIn.replace("{seconds}", String(redirectCount))}
          </div>
          
          <a 
            href={`/track/${inquiryCode}`}
            className="text-xs text-primary-800 font-bold hover:underline"
          >
            {t.trackDirectly}
          </a>
        </div>

        <p className="text-[10px] text-slate-400 mt-6">
          {t.whatsappFail}
        </p>
      </div>
    );
  }

  const timeOptions = lang === "hi" ? [
    { value: "Morning (6 AM - 12 PM)", label: "सुबह (Morning)", sub: "6 AM - 12 PM", emoji: "🌅" },
    { value: "Afternoon (12 PM - 5 PM)", label: "दोपहर (Afternoon)", sub: "12 PM - 5 PM", emoji: "☀️" },
    { value: "Evening (5 PM - 9 PM)", label: "शाम (Evening)", sub: "5 PM - 9 PM", emoji: "🌇" },
    { value: "Night (9 PM - 6 AM)", label: "रात (Night)", sub: "9 PM - 6 AM", emoji: "🌙" },
  ] : [
    { value: "Morning (6 AM - 12 PM)", label: "Morning", sub: "6 AM - 12 PM", emoji: "🌅" },
    { value: "Afternoon (12 PM - 5 PM)", label: "Afternoon", sub: "12 PM - 5 PM", emoji: "☀️" },
    { value: "Evening (5 PM - 9 PM)", label: "Evening", sub: "5 PM - 9 PM", emoji: "🌇" },
    { value: "Night (9 PM - 6 AM)", label: "Night", sub: "9 PM - 6 AM", emoji: "🌙" },
  ];

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 sm:p-10 border border-slate-100 flex flex-col gap-6 relative overflow-hidden">
      {/* Decorative top border gradient line */}
      <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-primary-800 to-accent-500"></div>

      <div>
        <h3 className="text-2xl font-display font-extrabold text-primary-800 mb-1">{t.title}</h3>
        {formData.email ? (
          <p className="text-xs text-green-700 bg-green-50/50 border border-green-150 rounded-xl px-3 py-1.5 inline-flex items-center gap-1.5 mt-1 font-bold">
            <CheckCircle className="w-3.5 h-3.5 text-green-500 animate-pulse" /> {t.linked} ({formData.email})
          </p>
        ) : (
          <p className="text-xs sm:text-sm text-slate-500">{t.subtitle}</p>
        )}
      </div>

      {status.error && (
        <div className="bg-red-50 text-red-700 text-sm font-medium p-4 rounded-xl border border-red-100">
          {status.error}
        </div>
      )}

      {/* Group 1: Customer Details */}
      <div className="flex flex-col gap-4">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">{t.custDetails}</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-1">{t.fullName}</label>
            <div className="relative">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder={t.fullNamePlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-xs font-bold text-slate-700 mb-1">{t.phoneLabel}</label>
            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder={t.phonePlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Group 2: Route Details */}
      <div className="flex flex-col gap-4">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">{t.routeDetails}</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupLocation" className="block text-xs font-bold text-slate-700 mb-1">{t.pickupLabel}</label>
            <div className="relative">
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                placeholder={t.pickupPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="dropLocation" className="block text-xs font-bold text-slate-700 mb-1">{t.dropLabel}</label>
            <div className="relative">
              <input
                type="text"
                id="dropLocation"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleChange}
                required
                placeholder={t.dropPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <Navigation className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* Group 3: Schedule & Cargo Details */}
      <div className="flex flex-col gap-4">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">{t.cargoDetails}</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="goodsType" className="block text-xs font-bold text-slate-700 mb-1">{t.serviceType}</label>
            <div className="relative">
              <select
                id="goodsType"
                name="goodsType"
                value={formData.goodsType}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium appearance-none transition-all cursor-pointer"
              >
                <option value="" disabled>{t.servicePlaceholder}</option>
                {Object.keys(servicesMap).map((srvKey) => (
                  <option key={srvKey} value={srvKey}>
                    {servicesMap[srvKey][lang]}
                  </option>
                ))}
              </select>
              <Package className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="weight" className="block text-xs font-bold text-slate-700 mb-1">{t.weightLabel}</label>
            <div className="relative">
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder={t.weightPlaceholder}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <Scale className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <label htmlFor="bookingDate" className="block text-xs font-bold text-slate-700 mb-1">{t.dateLabel}</label>
          <div className="relative">
            <input
              type="date"
              id="bookingDate"
              name="bookingDate"
              value={formData.bookingDate}
              onChange={handleChange}
              required
              min={minDate}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-semibold transition-all cursor-pointer"
            />
            <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
          </div>
        </div>

        {/* Preferred Time Grid Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">{t.timeLabel}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {timeOptions.map((opt) => {
              const isSelected = formData.bookingTime === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, bookingTime: opt.value }))}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    isSelected 
                      ? "border-primary-600 bg-primary-50 text-primary-800 ring-2 ring-primary-100 font-semibold" 
                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 text-slate-600"
                  }`}
                >
                  <span className="text-base mb-0.5">{opt.emoji}</span>
                  <span className="block text-[11px] font-bold leading-none">{opt.label}</span>
                  <span className="block text-[8px] text-slate-400 mt-0.5">{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Group 4: Special Instructions */}
      <div>
        <label htmlFor="notes" className="block text-xs font-bold text-slate-700 mb-1">{t.notesLabel}</label>
        <div className="relative">
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder={t.notesPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
          />
          <FileText className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm sm:text-base rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-green-150/40 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 uppercase tracking-wide border-none"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {t.submitting}
          </>
        ) : (
          <>
            <WhatsAppIcon className="w-5 h-5" />
            {t.submitBtn}
          </>
        )}
      </button>

      {/* Footer Notice */}
      <div className="flex items-center justify-center gap-3 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-4 mt-1">
        <span>{t.minBooking}</span>
        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
        <span>{t.coverage}</span>
      </div>
    </form>
  );
}
