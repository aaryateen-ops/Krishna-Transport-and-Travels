"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Truck, 
  Package, 
  Home as HomeIcon, 
  Sofa, 
  Send, 
  MapPin, 
  Navigation, 
  ShoppingBag, 
  Calendar,
  CheckCircle2, 
  ArrowRight,
  Mic,
  PhoneCall,
  Sparkles
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

interface ServicesSectionProps {
  lang: "hi" | "en";
}

const SERVICES_DATA = [
  {
    id: "shifting",
    category: "shifting",
    icon: HomeIcon,
    name: { hi: "घर का सामान शिफ्टिंग (House Shifting)", en: "Household Shifting" },
    tag: { hi: "सबसे ज्यादा मांग", en: "High Demand" },
    startingFare: "₹750",
    vehicleBadge: { hi: "छोटा हाथी (टाटा एस)", en: "Tata Ace" },
    description: { 
      hi: "बिना किसी टेंशन के सुरक्षित रूप से घर का पूरा सामान शिफ्ट करें। लेबर व पैकिंग सहायता भी उपलब्ध।", 
      en: "Stress-free complete home shifting with optional verified packing and helper assistance." 
    },
    features: [
      { hi: "डबल बेड, फ्रिज, सोफा व अलमारी", en: "Bed, fridge, sofa & almirah moving" },
      { hi: "लेबर/हेल्पर सहायता उपलब्ध", en: "Helper & labour support" },
      { hi: "सुरक्षित पैकिंग व स्क्रैच-फ्री लोडिंग", en: "Scratch-free safe loading" },
    ]
  },
  {
    id: "pickup",
    category: "local",
    icon: Truck,
    name: { hi: "लोकल पिकअप व टेम्पो भाड़ा", en: "Local Pickup Service" },
    tag: { hi: "15 मिनट पिकअप", en: "15-Min Pickup" },
    startingFare: "₹600",
    vehicleBadge: { hi: "3-व्हीलर / छोटा हाथी", en: "3-Wheeler / Tata Ace" },
    description: { 
      hi: "शहर के अंदर किसी भी चौराहे, मार्केट या गोदाम से सामान तुरंत उठाने और सुरक्षित पहुँचाने की सेवा।", 
      en: "Fast intra-city pickup across Varanasi markets, lanes, and hubs within 15 minutes." 
    },
    features: [
      { hi: "तंग गलियों में आसान पहुंच", en: "Access to narrowest city lanes" },
      { hi: "रोहित भैया से सीधा किराया तय", en: "Direct upfront owner pricing" },
      { hi: "24/7 तत्काल बुकिंग चालू", en: "24/7 immediate booking available" },
    ]
  },
  {
    id: "commercial",
    category: "commercial",
    icon: Package,
    name: { hi: "व्यापारिक व दुकान माल ट्रांसपोर्ट", en: "Commercial Goods Transport" },
    tag: { hi: "दुकानदार स्पेशल", en: "For Retailers" },
    startingFare: "₹650",
    vehicleBadge: { hi: "पियाजियो / टाटा एस", en: "Piaggio / Tata Ace" },
    description: { 
      hi: "दुकानों, गोदामों और फैक्ट्रियों का व्यापारिक माल सुरक्षित पहुँचाने के लिए मजबूत ट्रांसपोर्ट।", 
      en: "Heavy-duty commercial goods transport for retail shops, distributors and warehouses." 
    },
    features: [
      { hi: "मजबूत तिरपाल व सुरक्षित रस्सियां", en: "Weatherproof tarpaulin & ropes" },
      { hi: "थोक व्यापारियों के लिए सही रेट", en: "Fixed commercial wholesale rates" },
      { hi: "सटीक समय पर माल डिलीवरी", en: "Guaranteed on-time transit" },
    ]
  },
  {
    id: "furniture",
    category: "shifting",
    icon: Sofa,
    name: { hi: "फर्नीचर व ऑफिस शिफ्टिंग", en: "Furniture & Office Moving" },
    tag: { hi: "केयरफुल हैंडलिंग", en: "Careful Moving" },
    startingFare: "₹650",
    vehicleBadge: { hi: "छोटा हाथी / महिन्द्रा", en: "Tata Ace / Mahindra" },
    description: { 
      hi: "लकड़ी, ग्लास और मेटल के कीमती फर्नीचर को बिना खरोंच के सुरक्षित पहुँचाना।", 
      en: "Delicate handling of wooden, glass, and metal furniture with padding protection." 
    },
    features: [
      { hi: "सोफा, डाइनिंग टेबल व अलमारी", en: "Sofa, dining table & showcase" },
      { hi: "ऑफिस डेस्क, कंप्यूटर व चेयर", en: "Office tables, PCs & chairs" },
      { hi: "कुशल लोडिंग-अनलोडिंग सपोर्ट", en: "Expert loading support" },
    ]
  },
  {
    id: "intercity",
    category: "commercial",
    icon: Navigation,
    name: { hi: "पूर्वांचल अंतर-जिला ट्रांसपोर्ट", en: "Intercity Highway Logistics" },
    tag: { hi: "11+ जिले", en: "11+ Districts" },
    startingFare: "₹1,200",
    vehicleBadge: { hi: "टाटा एस (हाईवे)", en: "Tata Ace (Highway)" },
    description: { 
      hi: "वाराणसी से आज़मगढ़, मऊ, मिर्ज़ापुर, जौनपुर, गाज़ीपुर आदि सभी जिलों के लिए एक्सप्रेस ट्रांसपोर्ट।", 
      en: "Direct highway logistics connecting Varanasi to Azamgarh, Mirzapur, Jaunpur, Ghazipur, etc." 
    },
    features: [
      { hi: "उसी दिन सुरक्षित डिलीवरी", en: "Guaranteed same-day delivery" },
      { hi: "हाईवे अनुभवी सुरक्षित ड्राइवर", en: "Verified highway drivers" },
      { hi: "पारदर्शी वन-वे किराया", en: "Transparent one-way fares" },
    ]
  },
  {
    id: "mandi",
    category: "commercial",
    icon: ShoppingBag,
    name: { hi: "सब्जी मंडी व कृषि माल सप्लाई", en: "Mandi & Agro Logistics" },
    tag: { hi: "सुबह 4 AM चालू", en: "4 AM Early Birds" },
    startingFare: "₹600",
    vehicleBadge: { hi: "पियाजियो टेम्पो / अल्फा", en: "Piaggio Ape / Alfa" },
    description: { 
      hi: "सुबह-सुबह ताजी सब्जियां, फल और अनाज सीधे मंडियों और दुकानों तक पहुँचाने की सुविधा।", 
      en: "Early morning logistics service directly to local sabji mandis & retail grocery shops." 
    },
    features: [
      { hi: "सुबह 4 बजे से गाड़ियां तैयार", en: "Available from 4 AM early morning" },
      { hi: "क्रेट्स व बोरियों के लिए उपयुक्त डाला", en: "Spacious deck for crates & sacks" },
      { hi: "दैनिक / मासिक टाई-अप सुविधा", en: "Daily / monthly contract options" },
    ]
  }
];

export default function ServicesSection({ lang }: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "shifting" | "commercial" | "local">("all");

  const filteredServices = activeTab === "all" 
    ? SERVICES_DATA 
    : SERVICES_DATA.filter(s => s.category === activeTab);

  const voiceBookingWhatsApp = `https://wa.me/917071634535?text=${encodeURIComponent(
    lang === "hi"
      ? "नमस्ते रोहित भैया! मुझे गाड़ी बुक करनी है। मैं आपको इस व्हाट्सएप पर अपना वॉइस नोट (बोलकर) भेज रहा हूँ।"
      : "Hello Rohit ji! I want to book a transport vehicle. Sending you voice message with my pickup & drop details."
  )}`;

  return (
    <section id="services" className="py-20 sm:py-32 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
          <span className="text-xs font-extrabold text-accent-600 uppercase tracking-widest">
            {lang === "hi" ? "हमारी सेवाएं (Our Services)" : "Tailored Logistics Services"}
          </span>
          <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl text-primary-900 leading-tight">
            {lang === "hi" ? "आपकी जरूरत के हिसाब से सही ट्रांसपोर्ट" : "Professional Freight & Shifting Solutions"}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {lang === "hi"
              ? "वाराणसी और पूर्वांचल में हर तरह के लोड के लिए समर्पित गाड़ियां। फिक्स और वाजिब किराया, बिना किसी बिचौलिए के।"
              : "Dedicated commercial loaders and house moving vehicles in Varanasi with transparent owner-direct pricing."}
          </p>

          {/* Service Category Tabs */}
          <div className="inline-flex self-center items-center flex-wrap justify-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 mt-4">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lang === "hi" ? "सभी सेवाएं (All)" : "All Services"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shifting")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "shifting"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lang === "hi" ? "घर व रूम शिफ्टिंग" : "House Shifting"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("commercial")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "commercial"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lang === "hi" ? "व्यापारिक व मंडी माल" : "Commercial & Mandi"}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("local")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "local"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lang === "hi" ? "लोकल टेम्पो पिकअप" : "Local Pickup"}
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const IconComp = service.icon;
            const sName = service.name[lang];
            const sDesc = service.description[lang];
            const sTag = service.tag[lang];
            const sVehicle = service.vehicleBadge[lang];

            return (
              <div 
                key={service.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(30,58,138,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Top Subtle Line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-800/0 via-primary-800/30 to-primary-800/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div>
                  {/* Top Bar: Icon + Starting Fare Badge */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-800 border border-primary-100 flex items-center justify-center group-hover:bg-primary-800 group-hover:text-white transition-all duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {lang === "hi" ? "किराया शुरू" : "Starting"}
                      </span>
                      <span className="font-display font-black text-lg text-emerald-700">
                        {service.startingFare}
                      </span>
                    </div>
                  </div>

                  {/* Title & Tag */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-accent-50 text-accent-700 border border-accent-200/70">
                        {sTag}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500">
                        • {sVehicle}
                      </span>
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-slate-900 group-hover:text-primary-800 transition-colors leading-snug">
                      {sName}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {sDesc}
                  </p>

                  {/* Feature Checkpoints */}
                  <div className="space-y-2 mb-6 pt-3 border-t border-slate-100">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{feat[lang]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`https://wa.me/917071634535?text=${encodeURIComponent(
                      lang === "hi"
                        ? `नमस्ते रोहित भैया! मुझे "${sName}" के लिए गाड़ी बुक करनी है। कृपया किराया और जानकारी बताएं।`
                        : `Hello Rohit ji! I want to book "${service.name.en}". Please share details and availability.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href={`/#inquiry?service=${encodeURIComponent(service.name.en)}`}
                    className="py-2.5 px-3 bg-primary-800 hover:bg-primary-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <span>{lang === "hi" ? "फॉर्म भरें" : "Inquire"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Local Varanasi Custom Feature: "बोलकर बुक करें" (Voice Booking Banner) */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full">
            <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{lang === "hi" ? "बनारस स्पेशल • त्वरित बुकिंग" : "Fast Voice Booking"}</span>
              </div>
              <h3 className="font-display font-black text-xl sm:text-2xl text-slate-900 tracking-tight">
                {lang === "hi" ? "फॉर्म भरने का समय नहीं है? बोलकर बताएं!" : "Short on time? Book via Voice Note!"}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                {lang === "hi"
                  ? "सीधे व्हाट्सएप पर रोहित भैया को 10 सेकंड का वॉइस नोट भेजें: कहाँ से कहाँ सामान भेजना है। 5 मिनट में कॉल पर बुकिंग कन्फर्म!"
                  : "Send a quick 10-second voice note on WhatsApp detailing pickup & drop. Get a call confirmation in 5 minutes."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
            <a
              href={voiceBookingWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4" />
              <span>{lang === "hi" ? "व्हाट्सएप पर बोलकर बताएं" : "Send Voice Note"}</span>
            </a>

            <a
              href="tel:7080360217"
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-primary-800" />
              <span>{lang === "hi" ? "सीधे कॉल करें" : "Call Directly"}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
