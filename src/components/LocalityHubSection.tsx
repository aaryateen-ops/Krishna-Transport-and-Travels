"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Truck, 
  Clock, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  GraduationCap,
  ShoppingBag,
  Store,
  Factory
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

interface LocalityHubSectionProps {
  lang: "hi" | "en";
}

interface LocalityItem {
  id: string;
  name: { hi: string; en: string };
  landmark: { hi: string; en: string };
  bestService: { hi: string; en: string };
  typicalVehicles: string;
  dispatchTime: string;
  icon: any;
  searchKeywords: string;
  highlights: { hi: string; en: string }[];
}

const LOCALITIES: LocalityItem[] = [
  {
    id: "lanka-bhu",
    name: { hi: "लंका / बीएचयू (BHU)", en: "Lanka / BHU Campus" },
    landmark: { hi: "बीएचयू मेन गेट, रविदास गेट, सीर गोवर्धन", en: "BHU Main Gate, Ravidas Gate" },
    bestService: { hi: "हॉस्टल व रूम शिफ्टिंग, कूलर, स्टडी टेबल, बुक्स", en: "Student Room Moving, Study Tables & Books" },
    typicalVehicles: "महिन्द्रा अल्फा (3W) / टाटा एस",
    dispatchTime: "15 मिनट",
    icon: GraduationCap,
    searchKeywords: "tempo booking lanka bhu student room shifting",
    highlights: [
      { hi: "छात्रों के कम बजट के लिए विशेष रियायती दरें", en: "Budget student-friendly shifting rates" },
      { hi: "हॉस्टल से फ्लैट शिफ्टिंग में त्वरित सहायता", en: "Fast hostel-to-flat relocation" },
    ]
  },
  {
    id: "godowlia-chowk",
    name: { hi: "गोदौलिया / चौक (विश्वनाथ धाम)", en: "Godowlia / Chowk Varanasi" },
    landmark: { hi: "दशाश्वमेध, बांसफाटक, चौक, विशेश्वरगंज", en: "Dashashwamedh, Chowk, Vishwanath Corridor" },
    bestService: { hi: "तंग गलियों में 3-व्हीलर लोडर, कपड़ा, साड़ी व किराना पार्सल", en: "Narrow Lane 3W Cargo, Sarees, Fabrics & Grocery" },
    typicalVehicles: "3-व्हीलर अल्फा लोडर (तंग गलियों में एक्सपर्ट)",
    dispatchTime: "15-20 मिनट",
    icon: Store,
    searchKeywords: "goods tempo godowlia chowk narrow lane transport",
    highlights: [
      { hi: "संकरी गलियों में नो-एंट्री नियमों के अनुकूल गाड़ियां", en: "Lane-friendly loaders compliant with local rules" },
      { hi: "थोक कपड़ा व जनरल मर्चेंट माल की सुरक्षित लोडिंग", en: "Secure loading for textile and retail merchants" },
    ]
  },
  {
    id: "sigra-rathyatra",
    name: { hi: "सिगरा / रथयात्रा", en: "Sigra / Rath Yatra" },
    landmark: { hi: "सिगरा स्टेडियम, रथयात्रा चौराहा, महमूरगंज", en: "Sigra Stadium, Rath Yatra, Mahmoorganj" },
    bestService: { hi: "इलेक्ट्रॉनिक शोरूम माल, ऑफिस फर्नीचर व घर शिफ्टिंग", en: "Electronics, Showroom Stock & Home Shifting" },
    typicalVehicles: "टाटा एस (छोटा हाथी) / महिंद्रा पिकअप",
    dispatchTime: "15 मिनट",
    icon: Building2,
    searchKeywords: "tempo service sigra rath yatra furniture shifting",
    highlights: [
      { hi: "शोरूम डिस्प्ले व नाजुक सामान की सुरक्षित हैंडलिंग", en: "Delicate handling for showroom displays" },
      { hi: "1-2 BHK फ्लैट्स की पूरी घरेलू शिफ्टिंग", en: "Complete 1-2 BHK residential shifting" },
    ]
  },
  {
    id: "cantt-lahartara",
    name: { hi: "कैंट स्टेशन / लहरतारा", en: "Cantt Station / Lahartara" },
    landmark: { hi: "वाराणसी जंक्शन, रोडवेज बस स्टैंड, लहरतारा", en: "Varanasi Jn, Bus Stand, Lahartara" },
    bestService: { hi: "ट्रेन पार्सल लोडिंग, बल्क लगेज व व्यावसायिक कंसाइनमेंट", en: "Railway Parcel Cargo & Bulk Luggage" },
    typicalVehicles: "टाटा एस / पियाजियो टेम्पो",
    dispatchTime: "15 मिनट",
    icon: Truck,
    searchKeywords: "tempo near cantt station parcel mini truck lahartara",
    highlights: [
      { hi: "ट्रेन पार्सल ऑफिस से गोदाम तक सीधी डिलीवरी", en: "Direct station parcel to warehouse delivery" },
      { hi: "भारी कार्टन व संदूक सुरक्षित ले जाने की व्यवस्था", en: "Secure movement of heavy trunks and crates" },
    ]
  },
  {
    id: "shivpur-tarna",
    name: { hi: "शिवपुर / तरना / गिलट बाजार", en: "Shivpur / Tarna / Gilat Bazar" },
    landmark: { hi: "शिवपुर बाईपास, तरना, सेंट्रल जेल रोड", en: "Shivpur Bypass, Tarna, Central Jail Road" },
    bestService: { hi: "2-3 BHK संपूर्ण घर शिफ्टिंग, लेबर व पैकिंग सहायता", en: "2-3 BHK Complete Home Shifting with Helpers" },
    typicalVehicles: "छोटा हाथी (टाटा एस) / महिंद्रा बोलेरो पिकअप",
    dispatchTime: "15 मिनट",
    icon: Building2,
    searchKeywords: "house shifting shivpur tarna chhota hathi tempo",
    highlights: [
      { hi: "डबल बेड, सोफा, फ्रिज व अलमारी स्क्रैच-फ्री शिफ्टिंग", en: "Scratch-free bed, sofa, almirah moving" },
      { hi: "सुलभ रिंग रोड व हाईवे कनेक्टिविटी", en: "Direct Ring Road & Highway accessibility" },
    ]
  },
  {
    id: "pandeypur-paharia",
    name: { hi: "पांडेयपुर / पहड़िया (सब्जी मंडी)", en: "Pandeypur / Paharia Mandi" },
    landmark: { hi: "पहड़िया कृषि मंडी, पांडेयपुर चौराहा, आशापुर", en: "Paharia Mandi, Pandeypur, Ashapur" },
    bestService: { hi: "थोक सब्जी-फल मंडी क्रेट्स सप्लाई व हार्डवेयर माल", en: "Wholesale Mandi Crates, Fruits & Hardware Stock" },
    typicalVehicles: "पियाजियो टेम्पो / महिंद्रा अल्फा",
    dispatchTime: "10-15 मिनट",
    icon: ShoppingBag,
    searchKeywords: "paharia mandi sabji tempo pandeypur goods carrier",
    highlights: [
      { hi: "सुबह 4:00 AM से मंडी सप्लाई हेतु गाड़ियां तैयार", en: "Early 4:00 AM mandi dispatch readiness" },
      { hi: "भारी बोरियों और क्रेट्स की क्षमता", en: "High capacity for heavy sacks and crates" },
    ]
  },
  {
    id: "ramnagar-padao",
    name: { hi: "रामनगर / पड़ाव (इंडस्ट्रियल एरिया)", en: "Ramnagar / Padao Industrial" },
    landmark: { hi: "रामनगर किला रोड, इंडस्ट्रियल एस्टेट, पड़ाव चौराहा", en: "Industrial Area, Padao, Ramnagar Fort Road" },
    bestService: { hi: "फैक्ट्री स्पेयर पार्ट्स, मेटल, पाइप्स व थोक मशीनरी", en: "Industrial Machinery, Heavy Pipes & Factory Cargo" },
    typicalVehicles: "महिंद्रा पिकअप (1.7 टन) / टाटा एस",
    dispatchTime: "20 मिनट",
    icon: Factory,
    searchKeywords: "ramnagar industrial area tempo freight truck padao",
    highlights: [
      { hi: "1.5 से 2 टन तक भारी वजन उठाने की क्षमता", en: "1.5 to 2.0 ton heavy payload capability" },
      { hi: "जीटी रोड (NH 19) पर निर्बाध परिवहन", en: "Seamless transit across GT Road (NH 19)" },
    ]
  },
  {
    id: "babatpur-airport",
    name: { hi: "बाबतपुर (लाल बहादुर शास्त्री एयरपोर्ट)", en: "Babatpur (Airport Corridor)" },
    landmark: { hi: "बाबतपुर एयरपोर्ट, हरहुआ, पिंडरा", en: "Varanasi Airport, Harhua, Pindra" },
    bestService: { hi: "एयर कार्गो पार्सल, होटल सप्लाइज व लॉन्ग डिस्टेंस शिफ्टिंग", en: "Air Cargo Parcels, Hotel Logistics & Long Routes" },
    typicalVehicles: "टाटा एस / 14-फीट आयशर",
    dispatchTime: "25 मिनट",
    icon: PlaneIcon,
    searchKeywords: "babatpur airport tempo cargo goods carrier harhua",
    highlights: [
      { hi: "एयरपोर्ट कार्गो से शहर में समयबद्ध ट्रांसपोर्ट", en: "Time-critical airport cargo to city transit" },
      { hi: "हाईवे स्पीड और जीपीएस मॉनिटरिंग", en: "Highway speed with dedicated route safety" },
    ]
  }
];

function PlaneIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
    </svg>
  );
}

export default function LocalityHubSection({ lang }: LocalityHubSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLocalities = LOCALITIES.filter((loc) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      loc.name.hi.toLowerCase().includes(term) ||
      loc.name.en.toLowerCase().includes(term) ||
      loc.landmark.hi.toLowerCase().includes(term) ||
      loc.landmark.en.toLowerCase().includes(term) ||
      loc.searchKeywords.toLowerCase().includes(term)
    );
  });

  return (
    <section id="localities" className="py-20 sm:py-32 bg-slate-50/70 border-t border-slate-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-100/70 border border-primary-200 text-primary-900 text-xs font-bold mb-3 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-accent-600" />
            <span>{lang === "hi" ? "बनारस के सभी प्रमुख इलाके" : "Varanasi Locality & Hub Coverage"}</span>
          </div>

          <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
            {lang === "hi" ? "आपके मोहल्ले में 15 मिनट में गाड़ी हाजिर" : "15-Min Doorstep Dispatch in Every Varanasi Hub"}
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {lang === "hi"
              ? "लंका, सिगरा, गोदौलिया की संकरी गलियों से लेकर पहड़िया मंडी व रामनगर इंडस्ट्रियल एरिया तक — हमारा लोकल नेटवर्क हर चौराहे पर मौजूद है।"
              : "From the narrow alleys of Godowlia and Lanka to Paharia Mandi and Ramnagar Industrial Zone — prompt dispatch across all major Varanasi hubs."}
          </p>

          {/* Quick Search Locality Filter */}
          <div className="mt-6 max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === "hi" ? "अपना इलाका खोजें (उदा. लंका, सिगरा, पहड़िया)..." : "Search locality (e.g., Lanka, Sigra, Paharia)..."}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-700 shadow-sm"
            />
          </div>
        </div>

        {/* Localities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {filteredLocalities.map((loc) => {
            const IconComponent = loc.icon;

            return (
              <div
                key={loc.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(30,58,138,0.07)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Icon + Dispatch Time Badge */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-primary-50 text-primary-800 flex items-center justify-center border border-primary-100/60 shadow-sm group-hover:scale-105 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full shadow-xs">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      <span>{loc.dispatchTime}</span>
                    </span>
                  </div>

                  {/* Locality Title & Landmarks */}
                  <h3 className="font-display font-extrabold text-slate-900 text-base group-hover:text-primary-800 transition-colors">
                    {loc.name[lang]}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 mb-3 line-clamp-1">
                    📍 {loc.landmark[lang]}
                  </p>

                  {/* Best Suitable For */}
                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 mb-3 text-[11px] text-slate-700 leading-snug">
                    <span className="font-bold text-primary-900 block mb-0.5">
                      {lang === "hi" ? "मुख्य सेवा:" : "Best For:"}
                    </span>
                    <span>{loc.bestService[lang]}</span>
                  </div>

                  {/* Highlights Bullet List */}
                  <ul className="flex flex-col gap-1.5 mb-5 text-[11px] text-slate-600">
                    {loc.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0 mt-0.5" />
                        <span>{h[lang]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer Action: WhatsApp & Booking Link */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-semibold truncate max-w-[120px]">
                    {loc.typicalVehicles}
                  </span>

                  <a
                    href={`https://wa.me/917071634535?text=${encodeURIComponent(
                      `नमस्ते रोहित भैया! मुझे ${loc.name.hi} से गाड़ी बुक करनी है। कृपया किराया और गाड़ी उपलब्धता बताएं।`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-800 hover:text-accent-600 transition-colors cursor-pointer"
                  >
                    <span>{lang === "hi" ? "गाड़ी मंगाएं" : "Book Here"}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Locality Hub SEO Assurance Ribbon */}
        <div className="mt-12 text-center text-xs text-slate-500 font-medium flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{lang === "hi" ? "कोई हिडन सरचार्ज नहीं" : "No Hidden Surcharge"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-primary-800" />
            <span>{lang === "hi" ? "15 मिनट में लोकल पिकअप" : "15-Min Doorstep Pickup"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-accent-500" />
            <span>{lang === "hi" ? "रोहित भैया से सीधा संपर्क" : "Direct Owner Call (70803 60217)"}</span>
          </span>
        </div>

      </div>
    </section>
  );
}
