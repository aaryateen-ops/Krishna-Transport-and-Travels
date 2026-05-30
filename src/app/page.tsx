"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import InquiryForm from "@/components/InquiryForm";
import HeaderAuth from "@/components/HeaderAuth";
import { 
  Truck, 
  Package, 
  Home as HomeIcon, 
  Sofa, 
  Send, 
  MapPin, 
  Navigation, 
  Calendar, 
  ShoppingBag,
  Phone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Coins, 
  Zap, 
  Users, 
  ChevronRight,
  MapPin as MapPinIcon,
  Search,
  Lock
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { useLanguage } from "@/lib/useLanguage";

// Service list with icons and details in both Hindi and English
const services = [
  {
    name: { hi: "पिकअप सर्विस (लोकल भाड़ा)", en: "Pickup Service" },
    icon: Truck,
    description: { hi: "3-व्हीलर या छोटा हाथी से शहर के अंदर सामान की तेज़ लोडिंग और ट्रांसपोर्ट।", en: "Fast loading & transport of goods using 3-wheeler or mini pickup loaders." },
  },
  {
    name: { hi: "व्यापारिक माल ट्रांसपोर्ट", en: "Goods Transport" },
    icon: Package,
    description: { hi: "दुकानों और फैक्ट्रियों का व्यापारिक माल भेजने के लिए मजबूत ट्रांसपोर्ट सुविधा।", en: "Commercial goods and cargo transport with flexible loading capacities." },
  },
  {
    name: { hi: "घर का सामान बदलना (Shifting)", en: "Household Shifting" },
    icon: HomeIcon,
    description: { hi: "बिना किसी टेंशन के सुरक्षित रूप से घर का पूरा सामान शिफ्ट करें (लेबर/पैकिंग हेल्प के साथ)।", en: "Safe & stress-free complete house shifting with optional labour/packing help." },
  },
  {
    name: { hi: "फर्नीचर शिफ्टिंग", en: "Furniture Shifting" },
    icon: Sofa,
    description: { hi: "लकड़ी, ग्लास और मेटल के कीमती फर्नीचर को बिना खरोंच के सुरक्षित पहुँचाना।", en: "Careful moving of delicate wooden, glass, and metal furniture items." },
  },
  {
    name: { hi: "पार्सल डिलीवरी (बल्क सामान)", en: "Parcel Delivery" },
    icon: Send,
    description: { hi: "बॉक्स, कार्टन और भारी पार्सल की सुरक्षित और समय पर डिलीवरी।", en: "Secured parcel transport for boxes, cartons, and bulk packages." },
  },
  {
    name: { hi: "लोकल ट्रांसपोर्ट (वाराणसी)", en: "Local Transport" },
    icon: MapPin,
    description: { hi: "वाराणसी के सभी बाजारों, गलियों और चौराहों में लोकल ट्रांसपोर्ट।", en: "Intra-city transport across Varanasi streets, markets, and hubs." },
  },
  {
    name: { hi: "बाहर जिलों के लिए ट्रांसपोर्ट", en: "Intercity Transport" },
    icon: Navigation,
    description: { hi: "वाराणसी से आज़मगढ़, मऊ, मिर्ज़ापुर, जौनपुर आदि जिलों के लिए ट्रांसपोर्ट।", en: "Long distance logistics connecting Varanasi to Azamgarh, Mau, Mirzapur, etc." },
  },
  {
    name: { hi: "टेम्पो बुकिंग", en: "Tempo Booking" },
    icon: Calendar,
    description: { hi: "दिन या घंटे के हिसाब से अपनी जरूरत के अनुसार सीधे टेम्पो बुक करें।", en: "Direct daily or hourly tempo booking for custom transport requirements." },
  },
  {
    name: { hi: "सब्जी मंडी माल सप्लाई", en: "Sabji Mandi Logistics" },
    icon: ShoppingBag,
    description: { hi: "सुबह-सुबह ताजी सब्जियां सीधे मंडियों और दुकानों तक पहुँचाने की सुविधा।", en: "Early morning logistics service directly to local sabji mandis & retail shops." },
  },
];

// Why choose us parameters in both Hindi and English
const trustFactors = [
  {
    title: { hi: "24/7 सर्विस चालू", en: "24/7 Availability" },
    icon: Clock,
    desc: { hi: "देर रात की शिफ्टिंग हो या सुबह-सुबह की डिलीवरी, हमारी गाड़ियां हमेशा तैयार हैं।", en: "Late-night shifts or early-morning deliveries, we work round-the-clock." },
  },
  {
    title: { hi: "किफायती और सही किराया", en: "Affordable Pricing" },
    icon: Coins,
    desc: { hi: "किराया सिर्फ ₹600 से शुरू। कोई छुपा हुआ चार्ज नहीं, पहले ही किराया साफ कर दिया जाता है।", en: "Pricing starts from only ₹600. Honest rates discussed upfront." },
  },
  {
    title: { hi: "सुरक्षित और भरोसेमंद", en: "Trusted & Safe" },
    icon: ShieldCheck,
    desc: { hi: "लोकल वाराणसी का अपना भरोसेमंद बिज़नेस, आपके सामान की पूरी सुरक्षा।", en: "Locally trusted business with reliable transit safety for your goods." },
  },
  {
    title: { hi: "तेज़ रिस्पॉन्स", en: "Fast Response" },
    icon: Zap,
    desc: { hi: "फॉर्म भरते ही 15 मिनट के अंदर रोहित भैया का सीधा कॉल आएगा।", en: "Submit your inquiry and get a manual call from Rohit within 15 minutes." },
  },
  {
    title: { hi: "अनुभवी ड्राइवर", en: "Experienced Drivers" },
    icon: Users,
    desc: { hi: "वाराणसी की गलियों और हाईवे के रास्तों को अच्छी तरह जानने वाले सुरक्षित ड्राइवर।", en: "Skilled drivers familiar with Varanasi and nearby regional highways." },
  },
];

// Vehicle fleet details in both Hindi and English
const fleet = [
  {
    name: "Mahindra Alfa Loader",
    image: "/alfa.png",
    capacity: { hi: "500 किलो तक", en: "Up to 500 kg" },
    usage: { hi: "कम सामान, पतली गलियों और तेज़ डिलीवरी के लिए बेस्ट।", en: "Small loads, narrow streets, fast parcel transit." },
    icon: { hi: "3-व्हीलर", en: "3-Wheeler" }
  },
  {
    name: "Tata Ace (Magic)",
    image: "/magic.png",
    capacity: { hi: "1.2 टन तक (छोटा हाथी)", en: "Up to 1.2 Tons" },
    usage: { hi: "घर का सामान (शिफ्टिंग) और व्यापारिक माल के लिए सबसे बढ़िया।", en: "Best for Household shifting and commercial goods." },
    icon: { hi: "छोटा हाथी", en: "Mini Truck" }
  },
  {
    name: "E-Rickshaw Loader (Toto)",
    image: "/toto.png",
    capacity: { hi: "350 किलो तक", en: "Up to 350 kg" },
    usage: { hi: "कम बजट में लोकल मार्केट के सामानों के लिए बेस्ट।", en: "Eco-friendly, budget transport, local market items." },
    icon: { hi: "इलेक्ट्रिक लोडर", en: "Electric Loader" }
  },
  {
    name: "Piaggio Ape Tempo",
    image: "/tempo.png",
    capacity: { hi: "750 किलो तक", en: "Up to 750 kg" },
    usage: { hi: "सब्जी मंडी और लोकल ट्रांसपोर्ट के लिए पुराना भरोसेमंद साधन।", en: "Classic local transport, agricultural transport." },
    icon: { hi: "टेम्पो", en: "Classic Tempo" }
  }
];

const areasMap = [
  { hi: "वाराणसी", en: "Varanasi" },
  { hi: "आज़मगढ़", en: "Azamgarh" },
  { hi: "चंदौली", en: "Chandauli" },
  { hi: "मिर्ज़ापुर", en: "Mirzapur" },
  { hi: "भदोही", en: "Bhadohi" },
  { hi: "चुनार", en: "Chunar" },
  { hi: "सोनभद्र", en: "Sonabhadra" },
  { hi: "गाज़ीपुर", en: "Ghazipur" },
  { hi: "बलिया", en: "Ballia" },
  { hi: "जौनपुर", en: "Jaunpur" },
  { hi: "मऊ", en: "Mau" }
];

function HomeContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get("service") || "";
  const [lang, setLang] = useLanguage();

  const t = {
    hi: {
      metaTitle: "कृष्णा ट्रांसपोर्ट वाराणसी",
      metaSubtitle: "वाराणसी में भरोसेमंद लोकल ट्रांसपोर्ट",
      heroHeading: "तेज़, सुरक्षित और भरोसेमंद",
      heroHeadingHighlight: "टेम्पो और शिफ्टिंग सर्विस",
      heroDesc: "घर का सामान, दुकान का फर्नीचर या कोई भी पार्सल भेजना हो? वाराणसी और आस-पास के जिलों में टेम्पो या छोटा हाथी बुक करें सिर्फ ₹600 से शुरू। रोहित भैया से सीधे संपर्क करें।",
      getQuoteBtn: "किराया जानें (Get Quote)",
      callBtn: "फ़ोन करें: 7080360217",
      statMin: "कम से कम किराया",
      statSupport: "24/7 लाइव सपोर्ट",
      statDistricts: "11+ जिले",
      fleetTitle: "हमारी प्रीमियम गाड़ियां",
      fleetSubtitle: "टाटा एस (छोटा हाथी) और टेम्पो",
      fleetDesc: "लोकल शिफ्टिंग और व्यावसायिक माल के लिए एकदम सही।",
      servicesTag: "हमारी सेवाएं (Our Services)",
      servicesTitle: "प्रोफेशनल ट्रांसपोर्ट सर्विस",
      servicesDesc: "अपनी जरूरत के हिसाब से वाराणसी और आस-पास के जिलों के लिए गाड़ियां बुक करें।",
      selectBook: "बुकिंग के लिए चुनें",
      whyTag: "हमें क्यों चुनें",
      whyTitle: "सुरक्षित डिलीवरी, सही किराया, लोकल भरोसा",
      whyDesc: "हमारा काम पूरी ईमानदारी का है, कोई छुपा हुआ चार्ज नहीं। किराया तय करने के लिए आप सीधे मालिक (रोहित कुमार सिंह) से बात कर सकते हैं।",
      directContact: "सीधा संपर्क (Direct Call)",
      directContactDesc: "बिना बिचौलियों के मालिक से सीधे बात करें।",
      fleetTag: "गाड़ियों की लिस्ट (Our Fleet)",
      fleetSectionTitle: "हर वजन के लिए गाड़ियां उपलब्ध",
      fleetSectionDesc: "वाराणसी की तंग गलियों से लेकर चौड़े हाईवे तक, आपके सामान के हिसाब से सही गाड़ी।",
      selectVehicleBtn: "गाड़ी चुनें",
      capacityLabel: "लोडिंग क्षमता:",
      networkTag: "सप्लाई नेटवर्क (Active Network)",
      networkTitle: "पूरे पूर्वांचल (Eastern UP) में गाड़ियां",
      networkDesc: "वाराणसी हब से हमारे टेम्पो और लोडर हर जिले में जाते हैं, ताकि आपका सामान सुरक्षित और समय पर पहुँचे।",
      sameDayTitle: "उसी दिन शिफ्टिंग (Same-Day)",
      sameDayDesc: "वाराणसी और पास के जिलों में उसी दिन सामान पहुँचाने की सुविधा।",
      liveStatusTitle: "लाइव अपडेट (Live Status)",
      liveStatusDesc: "अपने बुकिंग कोड से गाड़ी और ड्राइवर का लाइव स्टेटस देखें।",
      popularRoutes: "रोजाना चलने वाले मुख्य रूट",
      hqHub: "मुख्य हब & HQ",
      centralOffice: "मुख्य कार्यालय (वाराणसी)",
      expressConn: "तेज़ कनेक्टिविटी",
      inquiryTag: "बुकिंग का तरीका (Easy Booking)",
      inquiryTitle: "आसान 3-स्टेप बुकिंग",
      inquiryDesc: "गाड़ी बुक करने और किराया तय करने का आसान तरीका:",
      step1Title: "1. पूछताछ फॉर्म भरें",
      step1Desc: "फॉर्म में पिकअप, ड्रॉप और तारीख की जानकारी डालें।",
      step2Title: "2. व्हाट्सएप पर जाएँ",
      step2Desc: "फॉर्म सबमिट करते ही आपका मैसेज तैयार होकर व्हाट्सएप खुल जाएगा।",
      step3Title: "3. किराया फाइनल करें",
      step3Desc: "रोहित भैया से सीधे बात या वॉइस नोट भेजकर किराया पक्का करें।",
      testiTag: "ग्राहकों की राय (Testimonials)",
      testiTitle: "लोग हमारे बारे में क्या कहते हैं",
      testiDesc: "वाराणसी और पास के जिलों में हमारी सर्विस इस्तेमाल करने वाले लोगों के अनुभव।",
      testi1Text: "मैंने सिगरा से सालरपुर घर शिफ्ट करने के लिए कृष्णा ट्रांसपोर्ट से संपर्क किया। रोहित जी ने बहुत मदद की। उन्होंने वाजिब दाम में टाटा मैजिक गाड़ी और दो हेल्पर दिए। बहुत बढ़िया सर्विस!",
      testi1Name: "अमित कुमार",
      testi1Role: "घर शिफ्टिंग, वाराणसी",
      testi2Text: "हमारी आज़मगढ़ में किराने की दुकान है और वाराणसी मंडी से लगातार सामान मंगाना पड़ता है। कृष्णा ट्रांसपोर्ट की गाड़ियां समय पर आती हैं और माल सुरक्षित लाती हैं। किराया भी काफी सही है।",
      testi2Name: "विजय प्रताप सिंह",
      testi2Role: "दुकानदार, आज़मगढ़",
      testi3Text: "वाराणसी में सबसे अच्छी टेम्पो बुकिंग सर्विस! फर्नीचर भेजने के लिए मैंने महिंद्रा अल्फा बुक किया था। जो किराया तय हुआ था वही लिया, ड्राइवर का व्यवहार भी बहुत अच्छा था।",
      testi3Name: "पूजा मिश्रा",
      testi3Role: "फर्नीचर शिफ्टिंग, वाराणसी",
      contactTag: "संपर्क करें (Contact Us)",
      contactTitle: "कृष्णा ट्रांसपोर्ट ऑफिस का पता",
      contactDesc: "किसी भी जानकारी, बड़े लोड या लंबे रूट के लिए हमारे ऑफिस आएं या सीधे फोन करें। हम हिन्दी और इंग्लिश दोनों में बात करते हैं।",
      addrLabel: "पता (Address):",
      addrValue: "सैलारपुर, विद्या विहार इंटर कॉलेज के पीछे, वाराणसी, उत्तर प्रदेश - 221007",
      phoneLabel: "फ़ोन नंबर (Phone):",
      phoneValue: "प्राइमरी: 7080360217 | व्हाट्सएप व अन्य: 7071634535",
      emailLabel: "ईमेल एड्रेस (Email):",
      operatingHoursTag: "काम के घंटे (Operating Hours)",
      operatingHoursVal: "सुबह 6:00 – रात 10:00 बजे तक (रोजाना)",
      operatingHoursDesc: "ऑफिस और गाड़ियों की सामान्य बुकिंग के लिए। इमरजेंसी के लिए व्हाट्सएप 24 घंटे चालू है।",
      brandDesc: "पूर्वी उत्तर प्रदेश (पूर्वांचल) का भरोसेमंद लोकल ट्रांसपोर्ट और शिफ्टिंग सर्विस प्रदाता।",
      navLabel: "नेविगेशन",
      servicesLabel: "हमारी सेवाएं",
      ownerLabel: "मालिक:",
      hqLabel: "मुख्य कार्यालय:",
      portalLogin: "पोर्टल लॉगिन",
      trackBookingText: "ट्रैक बुकिंग",
      callTextMobile: "फ़ोन पर बुकिंग (Call)"
    },
    en: {
      metaTitle: "Krishna Transport Varanasi",
      metaSubtitle: "Trusted Local Transport in Varanasi",
      heroHeading: "Fast, Safe & Reliable",
      heroHeadingHighlight: "Shifting & Tempo Services",
      heroDesc: "Need to move household goods, office furniture, or commercial parcels? Book our local tempos and mini trucks starting from just ₹600. Professional service in Varanasi and surrounding districts.",
      getQuoteBtn: "Get a Quote Now",
      callBtn: "Call: 7080360217",
      statMin: "Min. Booking",
      statSupport: "Live Support",
      statDistricts: "Districts",
      fleetTitle: "Our Premium Fleet",
      fleetSubtitle: "Tata Ace & Magic Mini Trucks",
      fleetDesc: "Perfect for local house shifting and commercial cargo logistics.",
      servicesTag: "Our Offerings",
      servicesTitle: "Professional Transport Services",
      servicesDesc: "Choose from our wide range of shifting and delivery services tailored for household, shop, and business needs.",
      selectBook: "Select & Book",
      whyTag: "Why Choose Us",
      whyTitle: "Safe Transport, Honest Prices, Local Trust",
      whyDesc: "We believe in providing transparent, friendly services without hidden fees. Rohit Kumar Singh handles pricing negotiations directly to offer you the best deals.",
      directContact: "Direct Contact",
      directContactDesc: "Talk to the owner directly for bookings.",
      fleetTag: "Our Fleet",
      fleetSectionTitle: "Vehicles for Every Load Size",
      fleetSectionDesc: "From narrow city lanes to open highways, we select the perfect loader vehicle based on your load volume.",
      selectVehicleBtn: "Select vehicle",
      capacityLabel: "Capacity:",
      networkTag: "Active Logistics Network",
      networkTitle: "Express Connections Across Eastern UP",
      networkDesc: "From our central transport headquarters in Varanasi, we run daily outstation and local shuttle routes to deliver your household goods and commercial shipments safely.",
      sameDayTitle: "Same-Day Shifting",
      sameDayDesc: "Quick transit times between Varanasi and connecting cities.",
      liveStatusTitle: "Full Route Visibility",
      liveStatusDesc: "Live status updates for outstation deliveries through your tracking code.",
      popularRoutes: "Popular Daily Routes",
      hqHub: "HQ & Hub",
      centralOffice: "Central Operations Office",
      expressConn: "Express Connectivity",
      inquiryTag: "Inquiry Flow",
      inquiryTitle: "Easy 3-Step Booking",
      inquiryDesc: "Here is how we coordinate and process your transport requests manually:",
      step1Title: "Submit Inquiry Form",
      step1Desc: "Fill out our short form with your pickup/drop points and service type.",
      step2Title: "Redirect to WhatsApp",
      step2Desc: "Your inputs auto-generate a direct message to connect you with Rohit Kumar Singh.",
      step3Title: "Manual Pricing & Confirmation",
      step3Desc: "We discuss and finalize the prices based on distance and load, then book offline.",
      testiTag: "Testimonials",
      testiTitle: "What Our Customers Say",
      testiDesc: "Read how local business owners and household customers rate our logistics support.",
      testi1Text: "I booked Krishna Transport for shifting my household items from Sigra to Salarpur. Rohit was very helpful. They provided a Tata Magic loader and two helpers at very reasonable charges. Highly recommended!",
      testi1Name: "Amit Kumar",
      testi1Role: "Household Shifting, Varanasi",
      testi2Text: "We run a grocery shop in Azamgarh and need regular bulk parcel deliveries from Varanasi mandi. Krishna Transport is highly punctual and handles cargo carefully. Best pricing in the area.",
      testi2Name: "Vijay Pratap Singh",
      testi2Role: "Shop Owner, Azamgarh",
      testi3Text: "Best tempo booking service in Varanasi! Booked an Alfa loader for shifting my furniture items. Pricing is exactly as discussed, and driver was polite. Zero hassle.",
      testi3Name: "Pooja Mishra",
      testi3Role: "Furniture Booking, Varanasi",
      contactTag: "Get In Touch",
      contactTitle: "Krishna Transport Office Location",
      contactDesc: "If you have any doubts, custom load requirements, or need long-distance routes, feel free to visit our office or call us. We speak Hindi and English.",
      addrLabel: "Address:",
      addrValue: "Salarpur, Vidhya Bihar Inter College ke Piche, Varanasi, Uttar Pradesh 221007",
      phoneLabel: "Phone Numbers:",
      phoneValue: "Primary: 7080360217 | Alternate & WhatsApp: 7071634535",
      emailLabel: "Email Address:",
      operatingHoursTag: "Operating Hours",
      operatingHoursVal: "6:00 AM – 10:00 PM (Daily)",
      operatingHoursDesc: "Active service and physical office operations. Emergency transport queries can be directed to WhatsApp 24/7.",
      brandDesc: "Eastern UP's trusted local logistics and shifting service provider. Offering high-quality household shifting, mini truck loaders, and goods transport.",
      navLabel: "Navigation",
      servicesLabel: "Logistics Services",
      ownerLabel: "Owner:",
      hqLabel: "Headquarters:",
      portalLogin: "Portal Login",
      trackBookingText: "Track Booking",
      callTextMobile: "Call"
    }
  }[lang];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm print:hidden transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image 
                src="/logo.png" 
                alt="Krishna Transport Logo" 
                fill 
                unoptimized
                className="object-cover scale-[1.4] origin-center"
              />
            </div>
            <div>
              <span className="block font-display font-extrabold text-sm sm:text-base text-primary-800 leading-tight group-hover:text-primary-900 transition-colors">
                Krishna Transport
              </span>
              <span className="hidden sm:block font-sans font-bold text-[9px] text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                &amp; Travel Management
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === "hi" ? "en" : "hi")}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 transition-all cursor-pointer"
            >
              🌐 {lang === "hi" ? "English" : "हिन्दी"}
            </button>

            {/* Portal Auth Gate */}
            <HeaderAuth lang={lang} />

            {/* Track: Icon on mobile, text on desktop */}
            <Link 
              href="/track"
              className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:py-2 text-slate-600 hover:text-primary-800 hover:bg-slate-50 rounded-xl text-xs font-bold border border-slate-200/80 transition-all shrink-0 hover:scale-[1.02]"
              title={t.trackBookingText}
            >
              <Search className="w-4 h-4 text-primary-600" />
              <span className="hidden sm:inline ml-1.5">{t.trackBookingText}</span>
            </Link>

            {/* Call: Icon on mobile, text on desktop */}
            <a 
              href="tel:7080360217" 
              className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:py-2 rounded-xl text-primary-800 hover:bg-primary-50/50 text-xs font-extrabold border border-primary-100/60 transition-all shrink-0 hover:scale-[1.02]"
              title="Call: 7080360217"
            >
              <Phone className="w-4 h-4 text-accent-500" />
              <span className="hidden sm:inline ml-1.5">{t.callTextMobile}: 7080360217</span>
            </a>

            {/* WhatsApp: Icon on mobile, text on desktop */}
            <a 
              href="https://wa.me/917071634535" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold shadow-md shadow-green-100 hover:shadow-lg hover:shadow-green-200/30 transition-all shrink-0 border-none hover:scale-[1.02]"
              title="WhatsApp Chat"
            >
              <WhatsAppIcon className="w-4.5 h-4.5" />
              <span className="hidden sm:inline ml-1.5">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 via-white to-white py-16 sm:py-24 border-b border-slate-100 relative overflow-hidden">
        {/* Decorative background glow element */}
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-primary-200/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="flex flex-col gap-6 text-center lg:text-left lg:col-span-7">
            <div className="inline-flex self-center lg:self-start items-center gap-2 px-3.5 py-1.5 bg-primary-50 border border-primary-100/60 text-primary-800 rounded-full text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-accent-500 animate-pulse" />
              {t.metaSubtitle}
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary-800 leading-[1.1]">
              {t.heroHeading} <br />
              <span className="text-accent-500">{t.heroHeadingHighlight}</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.heroDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2">
              <Link 
                href="#inquiry" 
                className="w-full sm:w-auto px-8 py-4 bg-primary-800 hover:bg-primary-900 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-primary-800/10 hover:shadow-xl hover:shadow-primary-800/20 transition-all text-center uppercase tracking-wider hover:-translate-y-0.5"
              >
                {t.getQuoteBtn}
              </Link>
              <a 
                href="tel:7080360217"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5 text-accent-500" />
                {t.callBtn}
              </a>
            </div>

            {/* Premium Stat Mini Cards */}
            <div className="grid grid-cols-3 gap-3.5 border-t border-slate-100 pt-8 mt-6">
              <div className="bg-slate-50/50 border border-slate-100 p-3 sm:p-4 rounded-2xl flex flex-col justify-center text-center lg:text-left shadow-sm">
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-primary-800">₹600</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{t.statMin}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-100 p-3 sm:p-4 rounded-2xl flex flex-col justify-center text-center lg:text-left shadow-sm">
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-primary-800">24/7</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{t.statSupport}</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-100 p-3 sm:p-4 rounded-2xl flex flex-col justify-center text-center lg:text-left shadow-sm">
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-primary-800">11+</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{t.statDistricts}</span>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-5 relative h-72 sm:h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white hover:shadow-primary-800/5 transition-all group">
            <Image 
              src="/magic.png" 
              alt="Krishna Transport Tata Magic Loader" 
              fill 
              className="object-cover bg-white group-hover:scale-105 transition-transform duration-700"
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-6 text-white">
              <span className="text-xs font-extrabold uppercase tracking-wider text-accent-500">{t.fleetTitle}</span>
              <h3 className="text-lg font-display font-extrabold">{t.fleetSubtitle}</h3>
              <p className="text-xs text-slate-300">{t.fleetDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">{t.servicesTag}</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800">
              {t.servicesTitle}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              {t.servicesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const IconComp = service.icon;
              const sName = service.name[lang];
              const sDesc = service.description[lang];
              
              return (
                <div 
                  key={idx}
                  className="group p-8 rounded-3xl bg-white border border-slate-200/60 hover:border-primary-600/40 hover:shadow-xl hover:shadow-primary-800/5 transition-all duration-300 flex flex-col justify-between min-h-[250px] relative overflow-hidden"
                >
                  {/* Hover Accent Top Line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-800/0 via-primary-800/20 to-primary-800/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div>
                    <div className="w-12 h-12 bg-primary-50 text-primary-800 rounded-xl flex items-center justify-center group-hover:bg-primary-800 group-hover:text-white transition-all duration-350 mb-6 shrink-0">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-display font-extrabold text-slate-800 mb-2 group-hover:text-primary-800 transition-colors">
                      {sName}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                      {sDesc}
                    </p>
                  </div>
                  <Link 
                    href={`/#inquiry?service=${encodeURIComponent(service.name.en)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-600 group-hover:text-accent-700 transition-colors uppercase tracking-wider"
                  >
                    {t.selectBook} <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us Section */}
      <section className="py-16 sm:py-24 bg-slate-50/50 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col gap-6 text-center lg:text-left">
              <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">{t.whyTag}</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800">
                {t.whyTitle}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.whyDesc}
              </p>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 self-center lg:self-start max-w-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-slate-800 text-sm">{t.directContact}</span>
                  <span className="text-xs text-slate-500">{t.directContactDesc}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustFactors.map((factor, idx) => {
                const IconComp = factor.icon;
                const fTitle = factor.title[lang];
                const fDesc = factor.desc[lang];
                
                return (
                  <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm flex gap-4 hover:shadow-md hover:border-primary-100/60 transition-all duration-300">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-800 shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base mb-1">{fTitle}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{fDesc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Vehicle Fleet Section */}
      <section id="fleet" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">{t.fleetTag}</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800">
              {t.fleetSectionTitle}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              {t.fleetSectionDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fleet.map((vehicle, idx) => {
              const vCapacity = vehicle.capacity[lang];
              const vUsage = vehicle.usage[lang];
              const vIcon = vehicle.icon[lang];

              return (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary-800/5 hover:-translate-y-0.5 transition-all duration-300 flex flex-col group"
                >
                  <div className="relative h-48 bg-slate-50/50 border-b border-slate-100 overflow-hidden">
                    <Image 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      fill 
                      className="object-contain p-4 group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <span className="absolute top-3 left-3 bg-primary-800 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      {vIcon}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-slate-800 text-lg mb-1 group-hover:text-primary-800 transition-colors">{vehicle.name}</h3>
                      <div className="inline-flex items-center gap-1 text-[10px] text-primary-800 font-extrabold bg-primary-50 px-2.5 py-1 rounded-lg mb-3 border border-primary-100/50">
                        {t.capacityLabel} {vCapacity}
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed mb-6">
                        {vUsage}
                      </p>
                    </div>
                    <Link 
                      href="#inquiry" 
                      className="block text-center w-full py-3 bg-slate-50 border border-slate-200/60 hover:bg-primary-800 hover:text-white hover:border-primary-800 text-slate-700 font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                    >
                      {t.selectVehicleBtn}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Service Areas Section */}
      <section className="py-16 sm:py-24 bg-slate-50/50 border-y border-slate-200/60 relative overflow-hidden">
        {/* Decorative subtle background design elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            
            {/* Left Content Card - Network Info */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-slate-200/60 p-8 rounded-3xl shadow-sm relative overflow-hidden">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 text-primary-800 text-[10px] font-bold uppercase tracking-wider rounded-full mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-600 animate-pulse"></span>
                  {t.networkTag}
                </div>
                
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800 mb-4 leading-tight">
                  {lang === "hi" ? <>पूर्वांचल (<span className="text-accent-500">Eastern UP</span>) में एक्सप्रेस गाड़ियां</> : <>{t.networkTitle}</>}
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {t.networkDesc}
                </p>
                
                {/* Network Stats / Features */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{t.sameDayTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{t.sameDayDesc}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center text-accent-600 shrink-0">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{t.liveStatusTitle}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{t.liveStatusDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Popular Routes Ticker */}
              <div className="border-t border-slate-100 pt-6 mt-8">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">{t.popularRoutes}</span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 font-bold">Varanasi ⇆ Azamgarh</span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 font-bold">Varanasi ⇆ Mirzapur</span>
                  <span className="px-2.5 py-1 bg-slate-50 border border-slate-200/60 rounded-xl text-slate-600 font-bold">Varanasi ⇆ Bhadohi</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Areas Grid */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {areasMap.map((area, idx) => {
                  const isVaranasi = area.en === "Varanasi";
                  const aName = area[lang];
                  
                  return (
                    <div 
                      key={idx} 
                      className={`relative overflow-hidden p-5 rounded-2xl transition-all duration-300 group flex flex-col justify-between min-h-[120px] ${
                        isVaranasi 
                          ? "bg-primary-800 text-white shadow-md hover:bg-primary-900 shadow-primary-800/10 col-span-2 sm:col-span-1 hover:-translate-y-0.5 hover:shadow-lg" 
                          : "bg-white border border-slate-200/80 hover:border-primary-600/50 hover:bg-white hover:shadow-md hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Gradient Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/0 via-primary-600/0 to-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      
                      <div className="flex justify-between items-start">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isVaranasi ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400 group-hover:text-primary-800 group-hover:bg-primary-50 transition-colors"
                        }`}>
                          <MapPinIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </div>
                        {isVaranasi && (
                          <span className="text-[8px] font-black uppercase tracking-wider bg-accent-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                            {t.hqHub}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <span className={`block font-display font-extrabold text-base sm:text-lg leading-tight transition-colors ${
                          isVaranasi ? "text-white" : "text-slate-800 group-hover:text-primary-800"
                        }`}>
                          {aName}
                        </span>
                        <span className={`block text-[10px] mt-0.5 font-medium ${
                          isVaranasi ? "text-primary-100" : "text-slate-400"
                        }`}>
                          {isVaranasi ? t.centralOffice : t.expressConn}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 7. Inquiry Form & Booking Flow */}
      <section id="inquiry" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100 scroll-mt-16 sm:scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 flex flex-col justify-center gap-6">
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest text-center lg:text-left">{t.inquiryTag}</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800 text-center lg:text-left">
              {t.inquiryTitle}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base text-center lg:text-left mb-4">
              {t.inquiryDesc}
            </p>

            <div className="flex flex-col gap-6 max-w-md mx-auto lg:mx-0">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 text-white font-bold text-sm flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{t.step1Title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.step1Desc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 text-white font-bold text-sm flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{t.step2Title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.step2Desc}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 text-white font-bold text-sm flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{t.step3Title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{t.step3Desc}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InquiryForm initialService={initialService} lang={lang} />
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">{t.testiTag}</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800">
              {t.testiTitle}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              {t.testiDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-slate-50/40 border border-slate-200/50 flex flex-col justify-between hover:shadow-md hover:border-slate-300/40 transition-all duration-300 relative min-h-[220px] group">
              {/* Giant quotation mark in background */}
              <span className="absolute top-2 right-4 text-7xl text-slate-200/50 font-serif leading-none select-none group-hover:text-primary-100 transition-colors pointer-events-none">&ldquo;</span>
              
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-6 relative z-10">
                &ldquo;{t.testi1Text}&rdquo;
              </p>
              <div>
                <span className="block font-bold text-slate-800 text-sm">{t.testi1Name}</span>
                <span className="text-xs text-primary-600 font-bold">{t.testi1Role}</span>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-slate-50/40 border border-slate-200/50 flex flex-col justify-between hover:shadow-md hover:border-slate-300/40 transition-all duration-300 relative min-h-[220px] group">
              <span className="absolute top-2 right-4 text-7xl text-slate-200/50 font-serif leading-none select-none group-hover:text-primary-100 transition-colors pointer-events-none">&ldquo;</span>
              
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-6 relative z-10">
                &ldquo;{t.testi2Text}&rdquo;
              </p>
              <div>
                <span className="block font-bold text-slate-800 text-sm">{t.testi2Name}</span>
                <span className="text-xs text-primary-600 font-bold">{t.testi2Role}</span>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-slate-50/40 border border-slate-200/50 flex flex-col justify-between hover:shadow-md hover:border-slate-300/40 transition-all duration-300 relative min-h-[220px] group">
              <span className="absolute top-2 right-4 text-7xl text-slate-200/50 font-serif leading-none select-none group-hover:text-primary-100 transition-colors pointer-events-none">&ldquo;</span>
              
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-6 relative z-10">
                &ldquo;{t.testi3Text}&rdquo;
              </p>
              <div>
                <span className="block font-bold text-slate-800 text-sm">{t.testi3Name}</span>
                <span className="text-xs text-primary-600 font-bold">{t.testi3Role}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Contact & Maps Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center gap-6">
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">{t.contactTag}</span>
            <h2 className="font-display font-extrabold text-3xl text-primary-800">
              {t.contactTitle}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t.contactDesc}
            </p>
 
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-800 text-sm">{t.addrLabel}</span>
                  <span className="text-xs text-slate-500">{t.addrValue}</span>
                </div>
              </div>
 
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-800 text-sm">{t.phoneLabel}</span>
                  <span className="text-xs text-slate-500">{t.phoneValue}</span>
                </div>
              </div>
 
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-800 text-sm">{t.emailLabel}</span>
                  <span className="text-xs text-slate-500">rohitshekhawat47@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
 
          <div className="h-80 sm:h-96 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-white relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.331201509376!2d83.0035099!3d25.3262916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2e283ab7f9b3%3A0xe96a152e728e2170!2sVidhya%20Bihar%20Inter%20College!5e0!3m2!1sen!2sin!4v1716912345678!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover"
            ></iframe>
          </div>
        </div>
      </section>
 
      {/* 10. Footer */}
      <footer className="bg-primary-950 text-white border-t border-slate-800">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Column 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Krishna Transport Logo" 
                  fill 
                  unoptimized
                  className="object-cover scale-[1.4] origin-center"
                />
              </div>
              <div>
                <span className="block font-display font-extrabold text-base tracking-wide text-white leading-tight">Krishna Transport</span>
                <span className="text-[10px] text-primary-300 font-bold uppercase tracking-wider leading-none">&amp; Travel Management</span>
              </div>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mt-2">
              {t.brandDesc}
            </p>
            
            {/* Contact numbers directly in brand block */}
            <div className="flex flex-col gap-2 mt-2">
              <a href="tel:7080360217" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-accent-500" />
                <span>+91 70803 60217 ({lang === "hi" ? "प्राइमरी" : "Primary"})</span>
              </a>
              <a href="https://wa.me/917071634535" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span>+91 70716 34535 (WhatsApp)</span>
              </a>
            </div>
          </div>
          
          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent-500">{t.navLabel}</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">{lang === "hi" ? "होम पेज" : "Home"}</Link></li>
              <li><Link href="#fleet" className="hover:text-white transition-colors">{lang === "hi" ? "हमारी गाड़ियां" : "Our Fleet"}</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">{lang === "hi" ? "ट्रैक बुकिंग" : "Track Booking"}</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">{lang === "hi" ? "एडमिन डैशबोर्ड" : "Admin Dashboard"}</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Logistics Services (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent-500">{t.servicesLabel}</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
              <li><Link href="/?service=pickup#inquiry" className="hover:text-white transition-colors">{services[0].name[lang]}</Link></li>
              <li><Link href="/?service=shifting#inquiry" className="hover:text-white transition-colors">{services[2].name[lang]}</Link></li>
              <li><Link href="/?service=goods#inquiry" className="hover:text-white transition-colors">{services[1].name[lang]}</Link></li>
              <li><Link href="/?service=furniture#inquiry" className="hover:text-white transition-colors">{services[3].name[lang]}</Link></li>
              <li><Link href="/?service=parcel#inquiry" className="hover:text-white transition-colors">{services[4].name[lang]}</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Operating Hours (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent-500">{t.operatingHoursTag}</h4>
            <div className="flex flex-col gap-3 text-xs text-slate-400">
              <div className="flex gap-2 items-center">
                <Clock className="w-4 h-4 text-accent-500 shrink-0" />
                <span>{t.operatingHoursVal}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {t.operatingHoursDesc}
              </p>
              
              <div className="mt-2 p-3 bg-white/5 border border-white/5 rounded-xl">
                <span className="block text-[10px] text-slate-400 uppercase font-black tracking-wide">{lang === "hi" ? "मुख्य कार्यालय" : "Main Hub"}</span>
                <span className="block font-bold text-white text-[11px] mt-0.5">Salarpur, Varanasi, UP 221007</span>
              </div>
            </div>
          </div>
          
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-900 bg-slate-950/80 py-6 text-center sm:text-left">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] text-slate-500">
              © {new Date().getFullYear()} Krishna Transport &amp; Travel Management. All Rights Reserved.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span>{t.ownerLabel} <strong className="text-slate-400">Rohit Kumar Singh</strong></span>
              <span className="text-slate-700">|</span>
              <span>{t.hqLabel} <strong className="text-slate-400">Varanasi, UP</strong></span>
              <span className="text-slate-700">|</span>
              <Link href="/login" className="text-slate-500 hover:text-primary-800 transition-colors flex items-center gap-1 font-bold" title="Portal Login">
                <Lock className="w-3 h-3 inline align-middle text-slate-400" /> {t.portalLogin}
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Mobile Call Button */}
      <div className="fixed bottom-6 right-6 z-40 sm:hidden">
        <a 
          href="tel:7080360217"
          className="flex items-center gap-2 bg-primary-800 hover:bg-primary-900 text-white font-black text-xs px-5 py-3.5 rounded-full shadow-2xl animate-bounce border-2 border-white"
        >
          <Phone className="w-4 h-4 text-accent-500 fill-accent-500" />
          <span>{lang === "hi" ? "फ़ोन पर बुकिंग (Call)" : "Book on Call"}</span>
        </a>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
