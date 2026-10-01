"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { 
  MapPin, 
  Navigation, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Check,
  ChevronDown
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

interface FareCalculatorWidgetProps {
  lang: "hi" | "en";
}

// Clean logistics hubs in & around Varanasi
const LOCATIONS = [
  { id: "salarpur", name: { hi: "सलारपुर (मुख्य कार्यालय)", en: "Salarpur (HQ Hub)" }, type: "local", distanceKm: 0 },
  { id: "lanka", name: { hi: "लंका / BHU", en: "Lanka / BHU" }, type: "local", distanceKm: 14 },
  { id: "sigra", name: { hi: "सिगरा / रथयात्रा", en: "Sigra / Rath Yatra" }, type: "local", distanceKm: 8 },
  { id: "cantt", name: { hi: "कैंट रेलवे स्टेशन", en: "Varanasi Cantt Station" }, type: "local", distanceKm: 6 },
  { id: "pandeypur", name: { hi: "पांडेयपुर / पहड़िया", en: "Pandeypur / Paharia" }, type: "local", distanceKm: 4 },
  { id: "godowlia", name: { hi: "गोदौलिया / चौक", en: "Godowlia / Chowk" }, type: "local", distanceKm: 10 },
  { id: "shivpur", name: { hi: "शिवपुर / गिलट बाजार", en: "Shivpur / Gilat Bazar" }, type: "local", distanceKm: 7 },
  { id: "ramnagar", name: { hi: "रामनगर / पड़ाव", en: "Ramnagar / Padao" }, type: "local", distanceKm: 16 },
  { id: "babatpur", name: { hi: "बाबतपुर (एयरपोर्ट)", en: "Babatpur (Airport)" }, type: "local", distanceKm: 24 },
  { id: "chandauli", name: { hi: "चंदौली / मुगलसराय", en: "Chandauli / Mughalsarai" }, type: "intercity", distanceKm: 32 },
  { id: "mirzapur", name: { hi: "मिर्ज़ापुर", en: "Mirzapur" }, type: "intercity", distanceKm: 65 },
  { id: "jaunpur", name: { hi: "जौनपुर", en: "Jaunpur" }, type: "intercity", distanceKm: 62 },
  { id: "bhadohi", name: { hi: "भदोही", en: "Bhadohi" }, type: "intercity", distanceKm: 48 },
  { id: "azamgarh", name: { hi: "आज़मगढ़", en: "Azamgarh" }, type: "intercity", distanceKm: 104 },
  { id: "ghazipur", name: { hi: "गाज़ीपुर", en: "Ghazipur" }, type: "intercity", distanceKm: 78 },
  { id: "mau", name: { hi: "मऊ", en: "Mau" }, type: "intercity", distanceKm: 98 },
];

const VEHICLES = [
  {
    id: "tata-ace",
    name: { hi: "टाटा एस (छोटा हाथी)", en: "Tata Ace (Magic)" },
    capacity: { hi: "1.2 टन तक", en: "Up to 1.2 Ton" },
    tag: { hi: "घर शिफ्टिंग / बड़ा लोड", en: "House Shifting" },
    baseRate: 750,
    perKmRate: 26,
    image: "/magic.png"
  },
  {
    id: "alfa",
    name: { hi: "महिंद्रा अल्फा", en: "Mahindra Alfa" },
    capacity: { hi: "500 KG तक", en: "Up to 500 KG" },
    tag: { hi: "तंग गलियों के लिए", en: "Narrow Streets" },
    baseRate: 600,
    perKmRate: 20,
    image: "/alfa.png"
  },
  {
    id: "tempo",
    name: { hi: "पियाजियो टेम्पो", en: "Piaggio Ape" },
    capacity: { hi: "750 KG तक", en: "Up to 750 KG" },
    tag: { hi: "मंडी व व्यापारिक", en: "Commercial / Mandi" },
    baseRate: 650,
    perKmRate: 22,
    image: "/tempo.png"
  },
  {
    id: "toto",
    name: { hi: "ई-रिक्शा लोडर", en: "E-Rickshaw Loader" },
    capacity: { hi: "350 KG तक", en: "Up to 350 KG" },
    tag: { hi: "कम बजट / लोकल", en: "Budget Friendly" },
    baseRate: 450,
    perKmRate: 16,
    image: "/toto.png"
  }
];

export default function FareCalculatorWidget({ lang }: FareCalculatorWidgetProps) {
  const [pickup, setPickup] = useState("salarpur");
  const [drop, setDrop] = useState("lanka");
  const [selectedVehicle, setSelectedVehicle] = useState("tata-ace");

  // Calculate estimated distance and fare range
  const calculation = useMemo(() => {
    const pLoc = LOCATIONS.find(l => l.id === pickup) || LOCATIONS[0];
    const dLoc = LOCATIONS.find(l => l.id === drop) || LOCATIONS[1];
    const vehicle = VEHICLES.find(v => v.id === selectedVehicle) || VEHICLES[0];

    let approxKm = Math.abs(pLoc.distanceKm - dLoc.distanceKm);
    if (approxKm === 0) approxKm = 4;
    else approxKm = Math.max(approxKm, 6);

    let estimatedMin = vehicle.baseRate;
    let estimatedMax = vehicle.baseRate + Math.round(approxKm * vehicle.perKmRate);

    if (dLoc.type === "intercity" || pLoc.type === "intercity") {
      estimatedMin = Math.round(vehicle.baseRate + approxKm * vehicle.perKmRate * 1.35);
      estimatedMax = Math.round(estimatedMin * 1.15);
    } else {
      estimatedMin = Math.max(vehicle.baseRate, Math.round(estimatedMax * 0.9));
    }

    estimatedMin = Math.round(estimatedMin / 50) * 50;
    estimatedMax = Math.round(estimatedMax / 50) * 50;
    if (estimatedMin === estimatedMax) estimatedMax += 100;

    const isIntercity = dLoc.type === "intercity" || pLoc.type === "intercity";
    const approxMinutes = isIntercity 
      ? Math.round((approxKm / 42) * 60)
      : Math.round((approxKm / 18) * 60) + 15;

    return {
      km: approxKm,
      minFare: estimatedMin,
      maxFare: estimatedMax,
      minutes: approxMinutes,
      pickupName: pLoc.name[lang],
      dropName: dLoc.name[lang],
      vehicleName: vehicle.name[lang],
      vehicleCapacity: vehicle.capacity[lang],
      isIntercity
    };
  }, [pickup, drop, selectedVehicle, lang]);

  const whatsappUrl = useMemo(() => {
    const msg = lang === "hi"
      ? `नमस्ते रोहित भैया! मुझे कृष्णा ट्रांसपोर्ट से गाड़ी बुक करनी है:%0A📍 पिकअप: ${calculation.pickupName}%0A🏁 ड्रॉप: ${calculation.dropName}%0A🚚 गाड़ी: ${calculation.vehicleName}%0A💰 अनुमानित किराया: ₹${calculation.minFare} - ₹${calculation.maxFare}%0Aकृपया बुकिंग कन्फर्म करें।`
      : `Hello Rohit ji! I want to book a vehicle with Krishna Transport:%0A📍 Pickup: ${calculation.pickupName}%0A🏁 Drop: ${calculation.dropName}%0A🚚 Vehicle: ${calculation.vehicleName}%0A💰 Est. Fare: ₹${calculation.minFare} - ₹${calculation.maxFare}%0APlease confirm booking.`;
    return `https://wa.me/917071634535?text=${msg}`;
  }, [calculation, lang]);

  const activeVehicle = VEHICLES.find(v => v.id === selectedVehicle) || VEHICLES[0];

  return (
    <div id="fare-calculator" className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 relative overflow-hidden transition-all duration-300">
      
      {/* Decorative Brand Top Border Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-800 via-primary-600 to-accent-500"></div>

      {/* Widget Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent-600 block mb-0.5">
            {lang === "hi" ? "त्वरित भाड़ा अनुमान" : "Quick Fare Estimate"}
          </span>
          <h3 className="font-display font-extrabold text-lg sm:text-xl text-primary-900 leading-tight">
            {lang === "hi" ? "किराया कैलकुलेटर" : "Instant Rate Calculator"}
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {lang === "hi" ? "लाइव दरें" : "Live Rates"}
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Route Selectors (Pickup & Drop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Pickup */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary-800 shrink-0" />
              <span>{lang === "hi" ? "पिकअप (कहाँ से उठाना है)" : "Pickup Location"}</span>
            </label>
            <div className="relative">
              <select
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-800 transition-all appearance-none cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name[lang]}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Drop */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-accent-600 shrink-0" />
              <span>{lang === "hi" ? "ड्रॉप (कहाँ पहुँचाना है)" : "Drop Location"}</span>
            </label>
            <div className="relative">
              <select
                value={drop}
                onChange={(e) => setDrop(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/60 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-800 transition-all appearance-none cursor-pointer"
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name[lang]}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Route Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-500 scrollbar-none">
          <span className="font-bold text-[11px] text-slate-400 shrink-0">
            {lang === "hi" ? "रूट:" : "Routes:"}
          </span>
          <button
            type="button"
            onClick={() => { setPickup("salarpur"); setDrop("lanka"); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-primary-50 hover:text-primary-800 text-slate-700 font-semibold text-[11px] shrink-0 transition-colors"
          >
            सलारपुर ⇄ लंका
          </button>
          <button
            type="button"
            onClick={() => { setPickup("cantt"); setDrop("sigra"); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-primary-50 hover:text-primary-800 text-slate-700 font-semibold text-[11px] shrink-0 transition-colors"
          >
            कैंट ⇄ सिगरा
          </button>
          <button
            type="button"
            onClick={() => { setPickup("salarpur"); setDrop("azamgarh"); }}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-primary-50 hover:text-primary-800 text-slate-700 font-semibold text-[11px] shrink-0 transition-colors"
          >
            वाराणसी ⇄ आज़मगढ़
          </button>
        </div>

        {/* Vehicle Selection Cards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-primary-800" />
              <span>{lang === "hi" ? "गाड़ी चुनें:" : "Select Vehicle:"}</span>
            </span>
            <span className="text-[11px] font-bold text-primary-800 bg-primary-50 px-2 py-0.5 rounded-md border border-primary-100">
              {activeVehicle.tag[lang]}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {VEHICLES.map((v) => {
              const isSelected = selectedVehicle === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVehicle(v.id)}
                  className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all relative cursor-pointer ${
                    isSelected
                      ? "bg-primary-50/70 border-primary-800 ring-2 ring-primary-800/10 shadow-sm"
                      : "bg-white hover:bg-slate-50/80 border-slate-200"
                  }`}
                >
                  {/* Selected check badge */}
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary-800 text-white rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                  )}

                  {/* Thumbnail Image */}
                  <div className="relative w-full h-12 mb-1.5 rounded-lg overflow-hidden bg-white flex items-center justify-center border border-slate-100">
                    <Image
                      src={v.image}
                      alt={v.name[lang]}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </div>

                  <div>
                    <span className={`block font-bold text-xs leading-tight ${isSelected ? "text-primary-950 font-extrabold" : "text-slate-800"}`}>
                      {v.name[lang]}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                      {v.capacity[lang]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calculated Fare Summary Card */}
        <div className="bg-gradient-to-br from-primary-50/50 via-slate-50/50 to-amber-50/30 rounded-2xl p-4 border border-primary-100/70">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                {lang === "hi" ? "अनुमानित किराया" : "Estimated Rate"}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="font-display font-black text-2xl sm:text-3xl text-primary-900 tracking-tight">
                  ₹{calculation.minFare} – ₹{calculation.maxFare}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {lang === "hi" ? "(लगभग)" : "(approx)"}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-2xs">
                <MapPin className="w-3 h-3 text-primary-800" />
                ~{calculation.km} KM
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <Clock className="w-3 h-3" />
                ~{calculation.minutes} {lang === "hi" ? "मिनट" : "mins"}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              {lang === "hi" ? "सीधे मालिक से तय किराया • कोई छुपा चार्ज नहीं" : "Direct owner pricing • No hidden fees"}
            </span>
          </div>
        </div>

        {/* Action Buttons: WhatsApp & Direct Call */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 fill-current shrink-0" />
            <span>{lang === "hi" ? "व्हाट्सएप पर फाइनल करें" : "Confirm on WhatsApp"}</span>
          </a>

          <a
            href="tel:7080360217"
            className="w-full py-3.5 px-4 bg-primary-800 hover:bg-primary-900 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-primary-900/15 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4 text-accent-400 shrink-0" />
            <span>{lang === "hi" ? "रोहित भैया: 7080360217" : "Call: 7080360217"}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
