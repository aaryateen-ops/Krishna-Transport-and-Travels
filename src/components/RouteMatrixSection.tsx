"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Truck, 
  Phone, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Route
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

interface RouteMatrixSectionProps {
  lang: "hi" | "en";
}

interface CorridorData {
  id: string;
  name: { hi: string; en: string };
  isHq?: boolean;
  distanceKm: number;
  timeHours: string;
  highway: string;
  estFare: string;
  recommendedVehicle: { hi: string; en: string };
  features: { hi: string; en: string }[];
  highlight: { hi: string; en: string };
}

const CORRIDORS: CorridorData[] = [
  {
    id: "varanasi",
    name: { hi: "वाराणसी (सेंट्रल हब)", en: "Varanasi (HQ Hub)" },
    isHq: true,
    distanceKm: 0,
    timeHours: "15-20 मिनट",
    highway: "सलारपुर मुख्य डिपो • लोकल रिंग रोड",
    estFare: "₹600 – ₹900",
    recommendedVehicle: { hi: "महिंद्रा अल्फा या टाटा एस", en: "Mahindra Alfa / Tata Ace" },
    features: [
      { hi: "लंका, सिगरा, कैंट, गोदौलिया, पांडेयपुर तुरंत सेवा", en: "Lanka, Sigra, Cantt, Godowlia, Pandeypur coverage" },
      { hi: "15 मिनट में दरवाजे पर गाड़ी की गारंटी", en: "15-minute doorstep dispatch guarantee" },
      { hi: "घर शिफ्टिंग, फर्नीचर व दुकान का सामान", en: "House shifting, furniture & shop parcels" },
    ],
    highlight: { 
      hi: "सलारपुर (विद्या विहार के पीछे) से पूरे बनारस शहर में 24/7 लोकल गाड़ियां।", 
      en: "24/7 Intra-city loading service across all Varanasi lanes and markets." 
    }
  },
  {
    id: "azamgarh",
    name: { hi: "आज़मगढ़", en: "Azamgarh" },
    distanceKm: 104,
    timeHours: "2.5 घंटे",
    highway: "NH 233 / पूर्वांचल लिंक एक्सप्रेसवे",
    estFare: "₹2,400 – ₹2,800",
    recommendedVehicle: { hi: "टाटा एस (छोटा हाथी)", en: "Tata Ace (Mini Truck)" },
    features: [
      { hi: "दुकानदारों के लिए रोज़ाना थोक माल सप्लाई", en: "Daily wholesale supply for retail shopkeepers" },
      { hi: "मंडी से सीधे माल आज़मगढ़ पहुँचाने की सुविधा", en: "Direct mandi-to-shop express transit" },
      { hi: "पूरे रास्ते सुरक्षित तिरपाल व रस्सी पैकिंग", en: "Secure weather-proof rope & tarpaulin cover" },
    ],
    highlight: { 
      hi: "किराना, कपड़ा और हार्डवेयर सामान के लिए सबसे लोकप्रिय रूट।", 
      en: "Most popular commercial freight route connecting Varanasi to Azamgarh." 
    }
  },
  {
    id: "mirzapur",
    name: { hi: "मिर्ज़ापुर", en: "Mirzapur" },
    distanceKm: 65,
    timeHours: "1.5 घंटे",
    highway: "NH 35 / चुनार हाईवे",
    estFare: "₹1,600 – ₹1,950",
    recommendedVehicle: { hi: "टाटा एस या पियाजियो टेम्पो", en: "Tata Ace / Piaggio Ape" },
    features: [
      { hi: "वाराणसी से मिर्ज़ापुर उसी दिन डिलीवरी", en: "Same-day delivery from Varanasi" },
      { hi: "घर शिफ्टिंग और पीतल/फर्नीचर का सामान", en: "Household shifting & metal/brass goods" },
      { hi: "अनुभवी हाईवे ड्राइवर", en: "Experienced highway driver" },
    ],
    highlight: { 
      hi: "कम समय और सुरक्षित हाईवे कनेक्टिविटी के साथ सीधी डिलीवरी।", 
      en: "Fast highway transit for delicate furniture and domestic goods." 
    }
  },
  {
    id: "chandauli",
    name: { hi: "चंदौली (मुगलसराय)", en: "Chandauli / Mughalsarai" },
    distanceKm: 32,
    timeHours: "45 मिनट",
    highway: "GT Road (NH 19) / पड़ाव रूट",
    estFare: "₹900 – ₹1,200",
    recommendedVehicle: { hi: "महिंद्रा अल्फा या टाटा एस", en: "Mahindra Alfa / Tata Ace" },
    features: [
      { hi: "मुगलसराय जंक्शन से पार्सल लोडिंग", en: "Direct station parcel & cargo loading" },
      { hi: "अनाज मंडी व बिल्डिंग मटेरियल सप्लाई", en: "Galla mandi & building material transit" },
      { hi: "45 मिनट में त्वरित डिलीवरी", en: "Superfast 45-minute delivery" },
    ],
    highlight: { 
      hi: "वाराणसी से सटा प्रमुख इंडस्ट्रियल व रेलवे हब कॉरिडोर।", 
      en: "Industrial transit corridor linking Varanasi with Chandauli trade hubs." 
    }
  },
  {
    id: "jaunpur",
    name: { hi: "जौनपुर", en: "Jaunpur" },
    distanceKm: 62,
    timeHours: "1.5 घंटे",
    highway: "NH 31 (वाराणसी-जौनपुर फोरलेन)",
    estFare: "₹1,500 – ₹1,850",
    recommendedVehicle: { hi: "टाटा एस (छोटा हाथी)", en: "Tata Ace (Magic)" },
    features: [
      { hi: "फोरलेन एक्सप्रेसवे पर स्मूथ और तेज़ राइड", en: "Smooth transit on 4-lane highway" },
      { hi: "होलसेल गल्ला, किराना व इलेक्ट्रॉनिक माल", en: "Wholesale grains, electronics & cartons" },
      { hi: "किफायती एकतरफा (One-Way) किराया", en: "Affordable transparent one-way pricing" },
    ],
    highlight: { 
      hi: "जौनपुर शहर और ग्रामीण बाजारों के लिए भरोसेमंद सप्लाई।", 
      en: "Reliable distribution for Jaunpur retail markets and distributors." 
    }
  },
  {
    id: "bhadohi",
    name: { hi: "भदोही (कालीन नगरी)", en: "Bhadohi" },
    distanceKm: 48,
    timeHours: "1 घंटा 15 मिनट",
    highway: "भदोही-वाराणसी मुख्य मार्ग",
    estFare: "₹1,300 – ₹1,600",
    recommendedVehicle: { hi: "टाटा एस / पियाजियो टेम्पो", en: "Tata Ace / Piaggio Ape" },
    features: [
      { hi: "कारपेट यार्न, फेब्रिक व टेक्सटाइल सप्लाई", en: "Carpet yarn, fabric & textile cargo" },
      { hi: "वारंटी सहित सुरक्षित व साफ़-सुथरी गाड़ियां", en: "Clean & weather-proof loading decks" },
      { hi: "फैक्ट्री से गोदाम तक डायरेक्ट डिलीवरी", en: "Direct factory to warehouse loading" },
    ],
    highlight: { 
      hi: "टेक्सटाइल और एक्सपोर्ट कारपेट व्यापारियों का भरोसेमंद ट्रांसपोर्ट।", 
      en: "Trusted cargo solution for textile & carpet manufacturing units." 
    }
  },
  {
    id: "ghazipur",
    name: { hi: "गाज़ीपुर", en: "Ghazipur" },
    distanceKm: 78,
    timeHours: "1 घंटा 45 मिनट",
    highway: "NH 31 फोरलेन हाईवे",
    estFare: "₹1,900 – ₹2,300",
    recommendedVehicle: { hi: "टाटा एस (छोटा हाथी)", en: "Tata Ace" },
    features: [
      { hi: "थोक व्यापारी माल व डिस्ट्रीब्यूटर डिलीवरी", en: "Wholesale merchant & distributor logistics" },
      { hi: "घर का पूरा सामान एक बार में शिफ्टिंग", en: "Complete household shifting in a single trip" },
      { hi: "अनुभवी हाईवे ड्राइवर", en: "Verified commercial driver" },
    ],
    highlight: { 
      hi: "वाराणसी से गाज़ीपुर जिले के सभी प्रमुख कस्बों तक माल सप्लाई।", 
      en: "Regular cargo service to Ghazipur markets and surrounding towns." 
    }
  },
  {
    id: "mau",
    name: { hi: "मऊ", en: "Mau" },
    distanceKm: 98,
    timeHours: "2 घंटे 15 मिनट",
    highway: "वाराणसी-गाज़ीपुर-मऊ हाईवे",
    estFare: "₹2,300 – ₹2,700",
    recommendedVehicle: { hi: "टाटा एस (छोटा हाथी)", en: "Tata Ace (1.2 Ton)" },
    features: [
      { hi: "साड़ी, टेक्सटाइल धागा व बाज़ार का माल", en: "Textile, saree, thread & market parcels" },
      { hi: "उसी दिन सुरक्षित और बिना नुकसान डिलीवरी", en: "Same-day guaranteed damage-free delivery" },
      { hi: "24/7 बुकिंग और लाइव अपडेट्स", en: "24/7 direct booking and route updates" },
    ],
    highlight: { 
      hi: "पूर्वांचल के कपड़ा व्यापार का मुख्य ट्रांसपोर्ट कॉरिडोर।", 
      en: "Vital freight route connecting Varanasi to Mau textile markets." 
    }
  },
  {
    id: "sonbhadra",
    name: { hi: "सोनभद्र (रॉबर्ट्सगंज)", en: "Sonbhadra" },
    distanceKm: 115,
    timeHours: "3 घंटे",
    highway: "विंध्याचल एक्सप्रेस मार्ग",
    estFare: "₹2,800 – ₹3,300",
    recommendedVehicle: { hi: "टाटा एस (Heavy Duty)", en: "Tata Ace (Heavy Duty)" },
    features: [
      { hi: "औद्योगिक उपकरण व माइंस एरिया माल", en: "Industrial tools & mining equipment" },
      { hi: "पहाड़ी व घुमावदार रास्तों के अनुभवी ड्राइवर", en: "Specialized drivers for hill highways" },
      { hi: "लंबी दूरी की सुरक्षित शिफ्टिंग", en: "Long distance secured house shifting" },
    ],
    highlight: { 
      hi: "सोनभद्र के पहाड़ी और दूरदराज इलाकों तक सुरक्षित भारी ट्रांसपोर्ट।", 
      en: "Heavy-duty logistics connecting Varanasi to Sonbhadra industrial belt." 
    }
  },
  {
    id: "ballia",
    name: { hi: "बलिया", en: "Ballia" },
    distanceKm: 145,
    timeHours: "3.5 घंटे",
    highway: "NH 31 ईस्टर्न कॉरिडोर",
    estFare: "₹3,500 – ₹4,200",
    recommendedVehicle: { hi: "टाटा एस (लॉन्ग रूट)", en: "Tata Ace (Long Haul)" },
    features: [
      { hi: "पूरे पूर्वांचल का सबसे लंबा सीधा रूट", en: "Long-haul direct route across Eastern UP" },
      { hi: "पूरा घर या दुकान का भारी सामान", en: "Full household shifting & commercial bulk" },
      { hi: "वाजिब किराया व लेबर सहायता उपलब्ध", en: "Honest long-haul rates with optional helper" },
    ],
    highlight: { 
      hi: "वाराणसी से बलिया तक पूरा सामान सुरक्षित पहुँचाने की स्पेशल सुविधा।", 
      en: "Dedicated long-haul shifting & parcel freight to Ballia district." 
    }
  },
  {
    id: "chunar",
    name: { hi: "चुनार", en: "Chunar" },
    distanceKm: 42,
    timeHours: "1 घंटा",
    highway: "SH 5 / गंगा पुल मार्ग",
    estFare: "₹1,100 – ₹1,400",
    recommendedVehicle: { hi: "महिंद्रा अल्फा या पियाजियो", en: "Mahindra Alfa / Piaggio Ape" },
    features: [
      { hi: "मिट्टी बर्तन, चीनी मिट्टी उत्पाद व हस्तशिल्प", en: "Pottery, ceramic & local handicraft freight" },
      { hi: "कृषि उत्पाद व अनाज सप्लाई", en: "Agricultural produce & retail goods" },
      { hi: "सस्ती व त्वरित लोकल डिलीवरी", en: "Fast and affordable inter-district trips" },
    ],
    highlight: { 
      hi: "वाराणसी और चुनार के बीच रोज़ाना चलने वाली लोकल लोडर सर्विस।", 
      en: "Regular shuttle service connecting Varanasi and historic Chunar." 
    }
  }
];

export default function RouteMatrixSection({ lang }: RouteMatrixSectionProps) {
  const [selectedId, setSelectedId] = useState("varanasi");

  const current = CORRIDORS.find(c => c.id === selectedId) || CORRIDORS[0];

  const whatsappUrl = `https://wa.me/917071634535?text=${encodeURIComponent(
    lang === "hi"
      ? `नमस्ते रोहित भैया! मुझे वाराणसी से ${current.name.hi} के लिए गाड़ी बुक करनी है। अनुमानित किराया ₹${current.estFare} दिख रहा है। कृपया कन्फर्म करें।`
      : `Hello Rohit ji! I want to book a transport vehicle from Varanasi to ${current.name.en}. Please confirm fare & availability.`
  )}`;

  return (
    <section id="routes" className="py-20 sm:py-32 bg-white border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
          <span className="text-xs font-extrabold text-accent-600 uppercase tracking-widest">
            {lang === "hi" ? "सप्लाई नेटवर्क (Active Logistics Network)" : "Active Logistics Corridors"}
          </span>
          <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl text-primary-900 leading-tight">
            {lang === "hi" ? "पूरे पूर्वांचल (Eastern UP) में गाड़ियां उपलब्ध" : "Connecting Varanasi to Entire Eastern UP"}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {lang === "hi"
              ? "वाराणसी सेंट्रल हब (सलारपुर) से रोज़ाना निकलने वाले मुख्य रूट्स। किसी भी जिले पर क्लिक करके दूरी, समय और अनुमानित किराया देखें।"
              : "Active express corridors running daily from Varanasi Central Hub. Click any district to check distance, travel time & transparent fares."}
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Corridor Intel Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 via-white to-primary-50/30 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg shadow-slate-900/5 relative overflow-hidden transition-all duration-300">
            {/* Decorative Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-800 to-accent-500"></div>

            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-800 text-[10px] font-extrabold uppercase tracking-wider">
                <Route className="w-3.5 h-3.5 text-primary-700" />
                {current.isHq 
                  ? (lang === "hi" ? "मुख्य कार्यालय (Central HQ)" : "Central HQ Hub") 
                  : (lang === "hi" ? "एक्सप्रेस कॉरिडोर" : "Express Corridor")}
              </span>

              {current.isHq && (
                <span className="text-[10px] font-bold text-accent-600 bg-accent-50 border border-accent-200/80 px-2 py-0.5 rounded-full animate-pulse">
                  {lang === "hi" ? "15 मिनट पिकअप" : "15-min Dispatch"}
                </span>
              )}
            </div>

            {/* Corridor Title */}
            <div className="mb-5">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-primary-900 tracking-tight leading-tight">
                {current.isHq ? current.name[lang] : `वाराणसी ⇄ ${current.name[lang]}`}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {current.highway}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-2.5 mb-5 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {lang === "hi" ? "दूरी" : "Distance"}
                </span>
                <span className="font-display font-black text-lg text-slate-800">
                  {current.isHq ? "लोकल" : `${current.distanceKm} KM`}
                </span>
              </div>
              <div className="text-center border-x border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {lang === "hi" ? "औसत समय" : "Est. Time"}
                </span>
                <span className="font-display font-black text-lg text-slate-800">
                  {current.timeHours}
                </span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {lang === "hi" ? "अनु. किराया" : "Fare"}
                </span>
                <span className="font-display font-black text-base sm:text-lg text-emerald-700">
                  {current.estFare}
                </span>
              </div>
            </div>

            {/* Recommended Vehicle */}
            <div className="mb-5 p-3 bg-primary-50/70 border border-primary-100 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">
                {lang === "hi" ? "अनुशंसित गाड़ी:" : "Recommended:"}
              </span>
              <span className="font-bold text-primary-900">
                {current.recommendedVehicle[lang]}
              </span>
            </div>

            {/* Route Feature Checklist */}
            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                {lang === "hi" ? "रूट सुविधाएं:" : "Route Highlights:"}
              </span>
              {current.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{feat[lang]}</span>
                </div>
              ))}
            </div>

            {/* Direct Booking Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-200/60">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
                <span>{lang === "hi" ? "व्हाट्सएप पर बुक करें" : "Book Corridor"}</span>
              </a>

              <a
                href="tel:7080360217"
                className="w-full py-3 px-3 bg-primary-800 hover:bg-primary-900 text-white font-bold text-xs rounded-xl shadow-md shadow-primary-900/10 flex items-center justify-center gap-1.5 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-accent-400 shrink-0" />
                <span>{lang === "hi" ? "सीधे कॉल करें" : "Direct Hotline"}</span>
              </a>
            </div>

          </div>

          {/* Right Column: Interactive District Hub Selector (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary-800" />
                <span>{lang === "hi" ? "जिले व रूट्स चुनें (Select Destination):" : "Select Destination District:"}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {lang === "hi" ? "11+ जिले सक्रिय" : "11+ Districts Active"}
              </span>
            </div>

            {/* Corridor District Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CORRIDORS.map((c) => {
                const isSelected = selectedId === c.id;
                const isVaranasi = c.id === "varanasi";

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`p-4 rounded-2xl text-left transition-all duration-200 relative overflow-hidden group cursor-pointer flex flex-col justify-between min-h-[105px] ${
                      isSelected
                        ? "bg-primary-800 text-white shadow-lg shadow-primary-900/20 scale-[1.02] ring-2 ring-accent-500"
                        : "bg-slate-50/70 hover:bg-white text-slate-800 border border-slate-200/80 hover:border-primary-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected 
                          ? "bg-white/10 text-white" 
                          : "bg-white text-primary-800 border border-slate-200/60 group-hover:bg-primary-50"
                      }`}>
                        <Navigation className="w-3.5 h-3.5" />
                      </span>

                      {isVaranasi ? (
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-accent-500 text-white" : "bg-primary-50 text-primary-800 border border-primary-100"
                        }`}>
                          {lang === "hi" ? "सेंट्रल हब" : "HQ HUB"}
                        </span>
                      ) : (
                        <span className={`text-[10px] font-mono font-bold ${
                          isSelected ? "text-primary-100" : "text-slate-400"
                        }`}>
                          ~{c.distanceKm} KM
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <span className={`block font-display font-black text-sm sm:text-base leading-tight ${
                        isSelected ? "text-white" : "text-slate-900 group-hover:text-primary-800"
                      }`}>
                        {c.name[lang]}
                      </span>
                      <span className={`block text-[10px] font-medium mt-0.5 ${
                        isSelected ? "text-primary-200" : "text-slate-500"
                      }`}>
                        {c.timeHours}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Helper Note */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === "hi"
                  ? "किसी अन्य जिले, कस्बे या अंतर्राज्यीय (Bihar / MP) रूट के लिए सीधे रोहित भैया से फोन पर बात करके कस्टम कोटेशन प्राप्त कर सकते हैं।"
                  : "Need inter-state transport (Bihar, MP) or custom rural destination? Call Rohit directly for transparent quotes."}
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
