"use client";

import React, { useState, useEffect } from "react";
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

interface InquiryFormProps {
  initialService?: string;
}

export default function InquiryForm({ initialService = "" }: InquiryFormProps) {
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
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; error?: string }>({});
  const [inquiryCode, setInquiryCode] = useState("");
  const [redirectCount, setRedirectCount] = useState<number | null>(null);

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
    } else {
      setStatus({ error: result.error || "Submission failed. Please try again." });
      setLoading(false);
    }
  };

  if (status.success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-emerald-100 text-center flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">Inquiry Registered!</h3>
        <p className="text-sm text-slate-500 mb-6">Your request has been saved in our booking log.</p>
        
        {/* Booking Slip Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full max-w-sm mb-6 text-left flex flex-col gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary-800 text-white flex items-center justify-center translate-x-6 -translate-y-6 rotate-45 font-bold text-[8px] uppercase tracking-widest pt-5">
            LOG
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Booking ID</span>
            <span className="block font-mono font-extrabold text-lg text-primary-800">{inquiryCode}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-xs">
            <div>
              <span className="block font-semibold text-slate-400 text-[10px] uppercase">Service</span>
              <span className="font-bold text-slate-700">{formData.goodsType}</span>
            </div>
            <div>
              <span className="block font-semibold text-slate-400 text-[10px] uppercase">Phone</span>
              <span className="font-bold text-slate-700">{formData.phoneNumber}</span>
            </div>
          </div>
          <div className="text-xs border-t border-slate-200 pt-2">
            <span className="block font-semibold text-slate-400 text-[10px] uppercase">Route</span>
            <span className="font-bold text-slate-700">{formData.pickupLocation} &rarr; {formData.dropLocation}</span>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-6 max-w-xs leading-relaxed">
          Redirecting to WhatsApp to coordinate pricing with Rohit Kumar Singh...
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold rounded-xl shadow-lg transition-all duration-300 border-none">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            WhatsApp in {redirectCount}s...
          </div>
          
          <a 
            href={`/track/${inquiryCode}`}
            className="text-xs text-primary-800 font-bold hover:underline"
          >
            Or, view live tracking status sheet directly &rarr;
          </a>
        </div>

        <p className="text-[10px] text-slate-400 mt-6">
          If WhatsApp does not open automatically, contact us at 7080360217.
        </p>
      </div>
    );
  }

  const timeOptions = [
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
        <h3 className="text-2xl font-display font-extrabold text-primary-800 mb-1">Get Instant Free Quote</h3>
        <p className="text-xs sm:text-sm text-slate-500">Fill in details. Rohit will coordinate best rates manually on WhatsApp!</p>
      </div>

      {status.error && (
        <div className="bg-red-50 text-red-700 text-sm font-medium p-4 rounded-xl border border-red-100">
          {status.error}
        </div>
      )}

      {/* Group 1: Customer Details */}
      <div className="flex flex-col gap-4">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">👤 Customer Details</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your name"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number *</label>
            <div className="relative">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="10 digit mobile number"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Group 2: Route Details */}
      <div className="flex flex-col gap-4">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">📍 Route details</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="pickupLocation" className="block text-xs font-bold text-slate-700 mb-1">Pickup Location *</label>
            <div className="relative">
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                required
                placeholder="e.g., Sigra, Varanasi"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>

          <div>
            <label htmlFor="dropLocation" className="block text-xs font-bold text-slate-700 mb-1">Drop Location *</label>
            <div className="relative">
              <input
                type="text"
                id="dropLocation"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleChange}
                required
                placeholder="e.g., Salarpur, Varanasi or Azamgarh"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <Navigation className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 rotate-45" />
            </div>
          </div>
        </div>
      </div>

      {/* Group 3: Schedule & Cargo Details */}
      <div className="flex flex-col gap-4">
        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1">📦 Schedule & Cargo Details</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="goodsType" className="block text-xs font-bold text-slate-700 mb-1">Type of Service *</label>
            <div className="relative">
              <select
                id="goodsType"
                name="goodsType"
                value={formData.goodsType}
                onChange={handleChange}
                required
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium appearance-none transition-all cursor-pointer"
              >
                <option value="" disabled>Select service type</option>
                <option value="Pickup Service">Pickup Service</option>
                <option value="Goods Transport">Goods Transport</option>
                <option value="Household Shifting">Household Shifting</option>
                <option value="Furniture Shifting">Furniture Shifting</option>
                <option value="Parcel Delivery">Parcel Delivery</option>
                <option value="Local Transport">Local Transport</option>
                <option value="Intercity Transport">Intercity Transport</option>
                <option value="Tempo Booking">Tempo Booking</option>
                <option value="Sabji Mandi Logistics">Sabji Mandi Logistics</option>
              </select>
              <Package className="w-4 h-4 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="weight" className="block text-xs font-bold text-slate-700 mb-1">Estimated Weight (Optional)</label>
            <div className="relative">
              <input
                type="text"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="e.g., 500kg, 1 Ton"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/40 text-slate-800 font-medium placeholder-slate-400 transition-all"
              />
              <Scale className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <label htmlFor="bookingDate" className="block text-xs font-bold text-slate-700 mb-1">Booking Date *</label>
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
          <label className="block text-xs font-bold text-slate-700 mb-2">Preferred Transit Time *</label>
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
        <label htmlFor="notes" className="block text-xs font-bold text-slate-700 mb-1">Special Instructions / Goods List (Optional)</label>
        <div className="relative">
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="List items to shift (e.g. Bed, Fridge, 10 Cartons) or loading details..."
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
            Submitting Inquiry...
          </>
        ) : (
          <>
            <WhatsAppIcon className="w-5 h-5" />
            Book &amp; Get Price On WhatsApp
          </>
        )}
      </button>

      {/* Footer Notice */}
      <div className="flex items-center justify-center gap-3 text-xs font-semibold text-slate-500 border-t border-slate-100 pt-4 mt-1">
        <span>Min. booking from ₹600</span>
        <span className="w-1.5 h-1.5 bg-slate-350 rounded-full"></span>
        <span>Varanasi &amp; 10+ Districts</span>
      </div>
    </form>
  );
}
