"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Package, 
  Ruler, 
  Weight, 
  Fuel, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  Wrench
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

interface FleetSectionProps {
  lang: "hi" | "en";
}

const FLEET_DATA = [
  {
    id: "tata-ace",
    name: "Tata Ace (Magic)",
    localName: { hi: "टाटा एस (छोटा हाथी)", en: "Tata Ace (Mini Truck)" },
    image: "/magic.png",
    startingRate: 750,
    badge: { hi: "सबसे लोकप्रिय", en: "Most Popular" },
    payload: { hi: "1.2 टन (1,200 KG)", en: "1.2 Tons (1,200 KG)" },
    bedSize: "7.2 ft × 4.9 ft",
    fuel: { hi: "डीजल (Heavy Duty)", en: "Diesel (Heavy Duty)" },
    bestFor: { 
      hi: "1-2 BHK पूरा घर शिफ्टिंग, फर्नीचर व गोदाम का बड़ा माल", 
      en: "1-2 BHK Complete House Shifting, Furniture & Bulk Cargo" 
    },
    whatFits: [
      { hi: "1 डबल बेड + 2 गद्दे", en: "1 Double Bed + 2 Mattresses" },
      { hi: "1 बड़ा फ्रिज (Single/Double Door)", en: "1 Refrigerator" },
      { hi: "1 अलमारी या 3-सीटर सोफा", en: "1 Almirah or 3-Seater Sofa" },
      { hi: "8-10 बड़े सामान के कार्टन बॉक्सेस", en: "8-10 Storage Cartons" },
      { hi: "लेबर/हेल्पर सहायता (वैकल्पिक)", en: "Helper Assistance Available" },
    ],
    technicalSpecs: [
      { label: { hi: "लोडिंग क्षमता", en: "Payload Capacity" }, value: "1,200 KG (1.2 Ton)" },
      { label: { hi: "डाला साइज (लंबाई × चौड़ाई)", en: "Bed Size (L × W)" }, value: "7.2 ft × 4.9 ft" },
      { label: { hi: "उपयुक्त दूरी", en: "Recommended For" }, value: { hi: "लोकल + अंतर-जिला (हाईवे)", en: "Local & Intercity Highways" } },
      { label: { hi: "ड्राइवर अनुभव", en: "Driver" }, value: { hi: "हाईवे अनुभवी ड्राइवर", en: "Highway Expert Driver" } },
    ]
  },
  {
    id: "alfa",
    name: "Mahindra Alfa Loader",
    localName: { hi: "महिंद्रा अल्फा (3-व्हीलर)", en: "Mahindra Alfa (3-Wheeler)" },
    image: "/alfa.png",
    startingRate: 600,
    badge: { hi: "तंग गलियों में तेज़", en: "Narrow Street Expert" },
    payload: { hi: "500 KG तक", en: "Up to 500 KG" },
    bedSize: "5.5 ft × 4.2 ft",
    fuel: { hi: "डीजल / सीएनजी", en: "Diesel / CNG" },
    bestFor: { 
      hi: "सिंगल कमरा, हॉस्टल शिफ्टिंग और बाज़ार के पार्सल", 
      en: "Single Room, Student Hostel Shifting & Retail Parcels" 
    },
    whatFits: [
      { hi: "1 सिंगल तख्त या छोटा दीवान", en: "1 Single Cot / Diwan" },
      { hi: "1 वॉशिंग मशीन या 1 कूलर", en: "1 Washing Machine or Air Cooler" },
      { hi: "1 स्टडी टेबल + कुर्सी", en: "1 Study Table + Chair" },
      { hi: "5-6 सूटकेस व कपड़े के बैग्स", en: "5-6 Luggage Bags / Boxes" },
    ],
    technicalSpecs: [
      { label: { hi: "लोडिंग क्षमता", en: "Payload Capacity" }, value: "500 KG" },
      { label: { hi: "डाला साइज (लंबाई × चौड़ाई)", en: "Bed Size (L × W)" }, value: "5.5 ft × 4.2 ft" },
      { label: { hi: "उपयुक्त दूरी", en: "Recommended For" }, value: { hi: "वाराणसी शहर की तंग गलियां", en: "Varanasi City Streets" } },
      { label: { hi: "पिकअप गति", en: "Dispatch Speed" }, value: { hi: "15 मिनट में उपलब्धता", en: "15-Min Fast Dispatch" } },
    ]
  },
  {
    id: "tempo",
    name: "Piaggio Ape Tempo",
    localName: { hi: "पियाजियो टेम्पो", en: "Piaggio Ape Tempo" },
    image: "/tempo.png",
    startingRate: 650,
    badge: { hi: "मंडी व व्यापारिक", en: "Commercial / Mandi" },
    payload: { hi: "750 KG तक", en: "Up to 750 KG" },
    bedSize: "6.0 ft × 4.5 ft",
    fuel: { hi: "डीजल", en: "Diesel" },
    bestFor: { 
      hi: "सब्जी मंडी सप्लाई, थोक व्यापारिक माल और भारी बॉक्स", 
      en: "Vegetable Mandi Supply, Wholesale Goods & Heavy Packages" 
    },
    whatFits: [
      { hi: "30-40 सब्जी मंडी क्रेट्स / बोरियां", en: "30-40 Vegetable Crates / Sacks" },
      { hi: "हार्डवेयर, सेनेटरी व टाइल्स बॉक्स", en: "Hardware, Tiles & Sanitary Goods" },
      { hi: "दुकान का साप्ताहिक रिस्टॉक माल", en: "Weekly Retail Shop Stock" },
      { hi: "मध्यम आकार का फर्नीचर", en: "Medium Sized Furniture" },
    ],
    technicalSpecs: [
      { label: { hi: "लोडिंग क्षमता", en: "Payload Capacity" }, value: "750 KG" },
      { label: { hi: "डाला साइज (लंबाई × चौड़ाई)", en: "Bed Size (L × W)" }, value: "6.0 ft × 4.5 ft" },
      { label: { hi: "उपयुक्त दूरी", en: "Recommended For" }, value: { hi: "मंडी, मार्केट और चौराहों पर", en: "Market & Commercial Hubs" } },
      { label: { hi: "लोडिंग सहायता", en: "Loading Help" }, value: { hi: "सुरक्षित तिरपाल व रस्सी सपोर्ट", en: "Rope & Tarpaulin Protection" } },
    ]
  },
  {
    id: "toto",
    name: "E-Rickshaw Loader (Toto)",
    localName: { hi: "ई-रिक्शा लोडर (टोटो)", en: "E-Rickshaw Loader" },
    image: "/toto.png",
    startingRate: 450,
    badge: { hi: "किफायती & ईको-फ्रेंडली", en: "Budget & Eco-Friendly" },
    payload: { hi: "350 KG तक", en: "Up to 350 KG" },
    bedSize: "4.5 ft × 3.5 ft",
    fuel: { hi: "100% इलेक्ट्रिक (Green)", en: "100% Electric" },
    bestFor: { 
      hi: "कम दूरी का हल्का सामान, दवाइयां और लोकल पार्सल", 
      en: "Short-Distance Light Goods, Medicines & Local Parcels" 
    },
    whatFits: [
      { hi: "4-6 कार्टन बॉक्सेस", en: "4-6 Storage Cartons" },
      { hi: "छात्रों का बुक्स व कपड़े का सामान", en: "Student Luggage & Books" },
      { hi: "लोकल दुकान के छोटे पैकेट्स", en: "Small Retail Parcels" },
      { hi: "हलके इलेक्ट्रॉनिक उपकरण", en: "Small Household Appliances" },
    ],
    technicalSpecs: [
      { label: { hi: "लोडिंग क्षमता", en: "Payload Capacity" }, value: "350 KG" },
      { label: { hi: "डाला साइज (लंबाई × चौड़ाई)", en: "Bed Size (L × W)" }, value: "4.5 ft × 3.5 ft" },
      { label: { hi: "उपयुक्त दूरी", en: "Recommended For" }, value: { hi: "शहर के अंदर 1-5 KM", en: "Within City 1-5 KM" } },
      { label: { hi: "पर्यावरण", en: "Eco Friendly" }, value: { hi: "शून्य प्रदूषण (Zero Emission)", en: "Zero Emission Electric" } },
    ]
  }
];

export default function FleetSection({ lang }: FleetSectionProps) {
  // Tab: 'fitting' (What fits inside) or 'specs' (Technical specifications)
  const [viewMode, setViewMode] = useState<"fitting" | "specs">("fitting");

  const scrollToCalculator = () => {
    const el = document.getElementById("fare-calculator");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="fleet" className="py-20 sm:py-32 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col gap-3">
          <span className="text-xs font-extrabold text-accent-600 uppercase tracking-widest">
            {lang === "hi" ? "हमारी गाड़ियां (Our Fleet)" : "Our Vehicle Fleet"}
          </span>
          <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl text-primary-900 leading-tight">
            {lang === "hi" ? "हर वजन और सामान के लिए सही गाड़ी" : "The Right Vehicle for Every Load Size"}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {lang === "hi"
              ? "वाराणसी की तंग गलियों से लेकर हाईवे तक, सामान के हिसाब से गाड़ी चुनें। सही किराया, बिना किसी छुपाए हुए चार्ज के।"
              : "From Varanasi's narrow market streets to open highways, choose the perfect loader with honest upfront pricing."}
          </p>

          {/* Interactive Mode Switcher */}
          <div className="inline-flex self-center items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-sm mt-3">
            <button
              type="button"
              onClick={() => setViewMode("fitting")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                viewMode === "fitting"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Package className="w-4 h-4" />
              <span>{lang === "hi" ? "क्या-क्या सामान आ सकता है?" : "What Fits Inside"}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("specs")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                viewMode === "specs"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>{lang === "hi" ? "तकनीकी विवरण (Specs)" : "Technical Specs"}</span>
            </button>
          </div>
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLEET_DATA.map((vehicle) => {
            const vName = vehicle.localName[lang];
            const vBadge = vehicle.badge[lang];
            const vPayload = vehicle.payload[lang];
            const vBestFor = vehicle.bestFor[lang];

            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(30,58,138,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Top Image Preview & Badge */}
                  <div className="relative h-48 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-6 overflow-hidden">
                    <span className="absolute top-3 left-3 bg-primary-800 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm z-10">
                      {vBadge}
                    </span>

                    <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold px-2.5 py-0.5 rounded-full z-10">
                      ₹{vehicle.startingRate} {lang === "hi" ? "से शुरू" : "start"}
                    </span>

                    <div className="relative w-full h-full">
                      <Image
                        src={vehicle.image}
                        alt={`${vehicle.name} - टेम्पो व माल ट्रांसपोर्ट वाराणसी`}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6">
                    {/* Title & Key Metrics */}
                    <div className="mb-4">
                      <h3 className="font-display font-black tracking-tight text-slate-900 text-lg group-hover:text-primary-800 transition-colors">
                        {vName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-800 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100/60">
                          <Weight className="w-3 h-3 text-primary-700" />
                          {vPayload}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          <Ruler className="w-3 h-3 text-slate-500" />
                          {vehicle.bedSize}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed mb-4 pb-3 border-b border-slate-100">
                      {vBestFor}
                    </p>

                    {/* Dynamic View: What Fits Inside VS Technical Specs */}
                    {viewMode === "fitting" ? (
                      <div className="space-y-2 mb-6 min-h-[140px]">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                          {lang === "hi" ? "इस गाड़ी में क्या-क्या आएगा:" : "Typical Load Fit:"}
                        </span>
                        {vehicle.whatFits.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-medium leading-tight">{item[lang]}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2.5 mb-6 min-h-[140px]">
                        <span className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
                          {lang === "hi" ? "तकनीकी विवरण:" : "Key Specifications:"}
                        </span>
                        {vehicle.technicalSpecs.map((spec, idx) => {
                          const val = typeof spec.value === "string" ? spec.value : spec.value[lang];
                          return (
                            <div key={idx} className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100/70">
                              <span className="text-slate-500">{spec.label[lang]}</span>
                              <span className="font-bold text-slate-800 text-right">{val}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={scrollToCalculator}
                    className="w-full py-2.5 px-4 bg-primary-800 hover:bg-primary-900 active:scale-[0.99] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>{lang === "hi" ? "किराया कैलकुलेट करें" : "Calculate Fare"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={`https://wa.me/917071634535?text=${encodeURIComponent(
                      lang === "hi" 
                        ? `नमस्ते रोहित भैया! मुझे ${vName} बुक करनी है। कृपया किराया व उपलब्धता बताएं।`
                        : `Hello Rohit ji! I want to book ${vName}. Please share fare & availability.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-4 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === "hi" ? "व्हाट्सएप बुकिंग" : "Book on WhatsApp"}</span>
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
