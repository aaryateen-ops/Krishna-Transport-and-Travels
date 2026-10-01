"use client";

import React, { useState } from "react";
import { 
  Star, 
  CheckCircle2, 
  MapPin, 
  Truck, 
  ShieldCheck, 
  Clock, 
  MessageSquare,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

interface TestimonialsSectionProps {
  lang: "hi" | "en";
}

interface TestimonialItem {
  id: string;
  name: string;
  role: { hi: string; en: string };
  location: string;
  route: string;
  rating: number;
  category: "all" | "shifting" | "commercial" | "highway";
  vehicle: { hi: string; en: string };
  text: { hi: string; en: string };
  date: string;
  verified: boolean;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "t1",
    name: "अमित शर्मा (Amit Sharma)",
    role: { hi: "दुकानदार • लंका चौराहा", en: "Retailer • Lanka Varanasi" },
    location: "Lanka, Varanasi",
    route: "Lanka → Sigra",
    rating: 5,
    category: "commercial",
    vehicle: { hi: "पियाजियो आपे लोडर", en: "Piaggio Ape Loader" },
    text: {
      hi: "रोहित भैया की सर्विस एकदम नंबर वन है! लंका से सिगra दुकान का माल 25 मिनट में पहुंचा दिया। किराया भी मार्केट से कम और साफ-सुथरा तय किया था, कोई एक्स्ट्रा पैसा नहीं मांगा।",
      en: "Rohit bhaiya's service is top notch! Delivered my store goods from Lanka to Sigra in just 25 minutes. Clean transparent pricing, no hidden charges."
    },
    date: "हाल ही में (Recently)",
    verified: true
  },
  {
    id: "t2",
    name: "राकेश यादव (Rakesh Yadav)",
    role: { hi: "घर की शिफ्टिंग • 2 BHK", en: "House Shifting • 2 BHK" },
    location: "Pandeypur, Varanasi",
    route: "Pandeypur → Shivpur",
    rating: 5,
    category: "shifting",
    vehicle: { hi: "टाटा एस (छोटा हाथी)", en: "Tata Ace" },
    text: {
      hi: "पहली बार ऑनलाइन बुकिंग की थी तो डर था, लेकिन छोटा हाथी एकदम टाइम पर आया। ड्राइवर भैया ने फ्रिज, डबल बेड और अलमारी बहुत सावधानी से चढ़ाया और उतारा। सारा सामान बिना खरोंच के पहुंच गया।",
      en: "First time booking online so I was anxious, but Tata Ace arrived right on time. Handled fridge, bed and wardrobe very carefully without any damage."
    },
    date: "2 दिन पहले (2 days ago)",
    verified: true
  },
  {
    id: "t3",
    name: "वीरेंद्र जायसवाल (Virendra Jaiswal)",
    role: { hi: "थोक किराना मर्चेंट", en: "Wholesale Grocery Merchant" },
    location: "Visheshwarganj, Varanasi",
    route: "Varanasi → Azamgarh",
    rating: 5,
    category: "highway",
    vehicle: { hi: "टाटा एस (हाईवे एक्सप्रेस)", en: "Tata Ace Highway" },
    text: {
      hi: "विशेश्वरगंज मंडी से हर हफ्ते आज़मगढ़ हमारी किराना बोरियां जाती हैं। कृष्णा ट्रांसपोर्ट से हमेशा समय पर गाड़ी मिल जाती है। हाईवे पर इनका ड्राइवर बहुत अनुभवी और भरोसेमंद है।",
      en: "Every week our grocery sacks go to Azamgarh from Visheshwarganj mandi. Krishna Transport always provides vehicle on time with trusted highway drivers."
    },
    date: "1 हफ्ता पहले (1 week ago)",
    verified: true
  },
  {
    id: "t4",
    name: "मनोज कुमार (Manoj Kumar)",
    role: { hi: "BHU रिसर्च स्कॉलर • रूम शिफ्टिंग", en: "BHU Research Scholar • Room Moving" },
    location: "BHU Campus, Varanasi",
    route: "BHU → Mahmoorganj",
    rating: 5,
    category: "shifting",
    vehicle: { hi: "महिन्द्रा अल्फा लोडर", en: "Mahindra Alfa" },
    text: {
      hi: "हॉस्टल से रूम शिफ्ट करना था, बुक्स, स्टडी टेबल और कूलर था। बड़े ट्रकों वाले बहुत ज्यादा किराया मांग रहे थे। रोहित भैया ने अल्फा लोडर वाजिब रेट में भेजा और आधे घंटे में शिफ्टिंग पूरी हो गई।",
      en: "Moved my books, study table and cooler from BHU hostel. Big trucks were charging high rates, but Rohit ji arranged Alfa loader at very student-friendly rates."
    },
    date: "3 दिन पहले (3 days ago)",
    verified: true
  },
  {
    id: "t5",
    name: "नेहा सिंह (Neha Singh)",
    role: { hi: "फैमिली शिफ्टिंग", en: "Family Shifting" },
    location: "Chunar / Mirzapur Road",
    route: "Varanasi → Mirzapur",
    rating: 5,
    category: "highway",
    vehicle: { hi: "टाटा एस (छोटा हाथी)", en: "Tata Ace" },
    text: {
      hi: "वाराणसी से मिर्ज़ापुर का रास्ता बारिश के मौसम में था। गाड़ी पर डबल वाटरप्रूफ तिरपाल बांधी गई थी जिससे सोफा और गद्दे बिल्कुल नहीं भीगे। बहुत जिम्मेदार सर्विस है।",
      en: "Shifted from Varanasi to Mirzapur during rains. Double waterproof tarpaulin was tied so sofas and mattresses stayed completely dry. Highly responsible team."
    },
    date: "5 दिन पहले (5 days ago)",
    verified: true
  },
  {
    id: "t6",
    name: "प्रिया सिंह (Priya Singh)",
    role: { hi: "बुटीक ओनर • महमूरगंज", en: "Boutique Owner • Mahmoorganj" },
    location: "Mahmoorganj, Varanasi",
    route: "Chowk → Mahmoorganj",
    rating: 5,
    category: "commercial",
    vehicle: { hi: "3-व्हीलर क्लोज्ड लोडर", en: "3-Wheeler Loader" },
    text: {
      hi: "चौक बनारस से फैब्रिक्स और बुटीक का कीमती सामान मंगवाया था। भैया लोगों ने बहुत केयरफुल होकर अनलोडिंग की। महिलाओं और सिंगल बिजनेसमैन के लिए एकदम सुरक्षित विकल्प है।",
      en: "Ordered precious boutique fabrics from Chowk. They unloaded very carefully. A completely safe and courteous transport choice for women entrepreneurs."
    },
    date: "1 हफ्ता पहले (1 week ago)",
    verified: true
  },
  {
    id: "t7",
    name: "आनंद श्रीवास्तव (Anand Srivastava)",
    role: { hi: "फर्नीचर डिलीवरी", en: "Furniture Delivery" },
    location: "Mughalsarai / Chandauli",
    route: "Varanasi → Mughalsarai",
    rating: 5,
    category: "shifting",
    vehicle: { hi: "टाटा एस", en: "Tata Ace" },
    text: {
      hi: "नया सोफा सेट और ग्लास डाइनिंग टेबल डिलीवर करानी थी। पैकिंग और रस्सियों का सपोर्ट ऐसा था कि कांच पर एक स्क्रैच तक नहीं आया। काम में कोई जल्दबाजी या लापरवाही नहीं थी।",
      en: "Delivered our glass dining table and sofa set to Mughalsarai. The tying and padding was so secure that not even a minor scratch occurred. Very careful team."
    },
    date: "2 हफ्ते पहले (2 weeks ago)",
    verified: true
  },
  {
    id: "t8",
    name: "राहुल त्रिपाठी (Rahul Tripathi)",
    role: { hi: "बिजनेस ओनर • रामनगर", en: "Business Owner • Ramnagar" },
    location: "Ramnagar Industrial Area",
    route: "Ramnagar → Cantt Station",
    rating: 5,
    category: "commercial",
    vehicle: { hi: "पियाजियो आपे", en: "Piaggio Ape" },
    text: {
      hi: "रामनगर इंडस्ट्रियल एरिया से कैंट स्टेशन तक मशीनरी स्पेयर पार्ट्स अर्जेंट भेजने थे। 15 मिनट में गाड़ी पिकअप पॉइंट पर हाजिर थी। बनारस में इतनी तेज सर्विस मिलना मुश्किल है।",
      en: "Urgent machinery spare parts dispatched from Ramnagar to Cantt station. Vehicle reached within 15 minutes. Best prompt response in Varanasi."
    },
    date: "हाल ही में (Recently)",
    verified: true
  }
];

export default function TestimonialsSection({ lang }: TestimonialsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<"all" | "shifting" | "commercial" | "highway">("all");

  const filteredTestimonials = activeCategory === "all"
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter((item) => item.category === activeCategory);

  return (
    <section id="reviews" className="py-20 sm:py-32 bg-slate-50/70 border-b border-slate-200/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Aggregate Social Proof Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center gap-3">
          
          {/* Trust Score Capsule */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 shadow-sm text-xs font-bold mb-1">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span>4.9 / 5.0</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-slate-700">
              {lang === "hi" ? "180+ बनारस व पूर्वांचल ग्राहक समीक्षाएं" : "180+ Verified Customer Reviews"}
            </span>
          </div>

          <span className="text-xs font-extrabold text-accent-600 uppercase tracking-widest">
            {lang === "hi" ? "सच्चा भरोसा • असली ग्राहक" : "Real Stories • Verified Customers"}
          </span>

          <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl text-primary-900 leading-tight">
            {lang === "hi" ? "बनारस के लोगों ने क्यों चुना कृष्णा ट्रांसपोर्ट?" : "Why Varanasi Trusts Krishna Transport"}
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            {lang === "hi"
              ? "छात्रों के रूम से लेकर व्यापारियों की मंडियों तक — हमारे साथ हर शिफ्टिंग और माल डिलीवरी 100% सुरक्षित और वादे के मुताबिक होती है।"
              : "From student hostel rooms to wholesale mandi dispatches — safe, reliable, and damage-free logistics with upfront pricing."}
          </p>

          {/* Key Guarantee Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-6 mt-4 w-full max-w-xl">
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="block font-display font-black text-xl sm:text-2xl text-emerald-700">100%</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                {lang === "hi" ? "सुरक्षित डिलीवरी" : "Damage-Free"}
              </span>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="block font-display font-black text-xl sm:text-2xl text-primary-800">15 Min</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                {lang === "hi" ? "औसत पिकअप" : "Avg Pickup Time"}
              </span>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm text-center">
              <span className="block font-display font-black text-xl sm:text-2xl text-accent-600">₹0</span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">
                {lang === "hi" ? "हिडन सरचार्ज" : "Zero Hidden Fee"}
              </span>
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="inline-flex items-center flex-wrap justify-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/80 mt-6 shadow-sm">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === "all"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lang === "hi" ? "सभी रिव्यू (All)" : "All Reviews"}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("shifting")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === "shifting"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lang === "hi" ? "घर व रूम शिफ्टिंग" : "House Shifting"}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("commercial")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === "commercial"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lang === "hi" ? "दुकान व व्यापारिक माल" : "Commercial Freight"}
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("highway")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCategory === "highway"
                  ? "bg-primary-800 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {lang === "hi" ? "पूर्वांचल हाईवे रूट" : "Highway Corridors"}
            </button>
          </div>

        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(30,58,138,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-800/0 via-accent-500/40 to-primary-800/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-3xl"></div>

              <div>
                {/* Header: User Info + Star Rating */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* User Avatar Circle with Initials */}
                    <div className="w-11 h-11 rounded-2xl bg-primary-100 text-primary-900 font-extrabold text-sm flex items-center justify-center shrink-0 border border-primary-200/60 shadow-inner">
                      {review.name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-sm leading-snug">
                        {review.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {review.role[lang]}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>

                {/* Route & Vehicle Tag Bar */}
                <div className="flex items-center flex-wrap gap-1.5 mb-4 text-[10px] font-semibold">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                    <MapPin className="w-3 h-3 text-accent-600 shrink-0" />
                    <span>{review.route}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-50/70 text-primary-800 border border-primary-100">
                    <Truck className="w-3 h-3 text-primary-700 shrink-0" />
                    <span>{review.vehicle[lang]}</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  &ldquo;{review.text[lang]}&rdquo;
                </p>
              </div>

              {/* Card Footer: Verified Badge + Date */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{lang === "hi" ? "सत्यापित कस्टमर" : "Verified Customer"}</span>
                </div>
                <span className="text-slate-400 text-[10px]">{review.date}</span>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Social Proof Bar & Feedback CTA */}
        <div className="mt-14 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-accent-50 text-accent-600 border border-accent-200 flex items-center justify-center shrink-0">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-slate-900 text-base sm:text-lg">
                {lang === "hi" ? "क्या आपने भी हाल ही में कृष्णा ट्रांसपोर्ट से सेवा ली है?" : "Used Krishna Transport recently?"}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                {lang === "hi" 
                  ? "अपना अनुभव या सुझाव रोहित भैया को सीधे व्हाट्सएप पर भेजें और भविष्य की बुकिंग पर विशेष छूट पाएं।"
                  : "Share your experience directly on WhatsApp and unlock special benefits on future bookings."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <a
              href="https://wa.me/917071634535?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20%E0%A4%B0%E0%A5%8B%E0%A4%B9%E0%A4%BF%E0%A4%A4%20%E0%A4%AD%E0%A5%88%E0%A4%AF%E0%A4%BE!%20%E0%A4%AE%E0%A5%88%E0%A4%82%20%E0%A4%85%E0%A4%AA%E0%A4%A8%E0%A4%BE%20%E0%A4%B0%E0%A4%BF%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A5%82%20%E0%A4%94%E0%A4%B0%20%E0%A4%AB%E0%A5%80%E0%A4%A1%E0%A4%AC%E0%A5%88%E0%A4%95%20%E0%A4%B6%E0%A5%87%E0%A4%AF%E0%A4%B0%20%E0%A4%95%E0%A4%B0%E0%A4%A8%E0%A4%BE%20%E0%A4%9A%E0%A4%BE%E0%A4%B9%E0%A4%A4%E0%A4%BE%20%E0%A4%B9%E0%A5%82%E0%A4%81%E0%A5%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>{lang === "hi" ? "रिव्यू शेयर करें" : "Share Feedback"}</span>
            </a>

            <a
              href="tel:7080360217"
              className="w-full sm:w-auto px-5 py-3 bg-primary-800 hover:bg-primary-900 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{lang === "hi" ? "सीधा संपर्क" : "Call Directly"}</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
