import Image from "next/image";
import Link from "next/link";
import InquiryForm from "@/components/InquiryForm";
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

// Service list with icons and details
const services = [
  {
    name: "Pickup Service",
    icon: Truck,
    description: "Fast loading & transport of goods using 3-wheeler or mini pickup loaders.",
  },
  {
    name: "Goods Transport",
    icon: Package,
    description: "Commercial goods and cargo transport with flexible loading capacities.",
  },
  {
    name: "Household Shifting",
    icon: HomeIcon,
    description: "Safe & stress-free complete house shifting with optional labour/packing help.",
  },
  {
    name: "Furniture Shifting",
    icon: Sofa,
    description: "Careful moving of delicate wooden, glass, and metal furniture items.",
  },
  {
    name: "Parcel Delivery",
    icon: Send,
    description: "Secured parcel transport for boxes, cartons, and bulk packages.",
  },
  {
    name: "Local Transport",
    icon: MapPin,
    description: "Intra-city transport across Varanasi streets, markets, and hubs.",
  },
  {
    name: "Intercity Transport",
    icon: Navigation,
    description: "Long distance logistics connecting Varanasi to Azamgarh, Mau, Mirzapur, etc.",
  },
  {
    name: "Tempo Booking",
    icon: Calendar,
    description: "Direct daily or hourly tempo booking for custom transport requirements.",
  },
  {
    name: "Sabji Mandi Logistics",
    icon: ShoppingBag,
    description: "Early morning logistics service directly to local sabji mandis & retail shops.",
  },
];

// Why choose us parameters
const trustFactors = [
  {
    title: "24/7 Availability",
    icon: Clock,
    desc: "Late-night shifts or early-morning deliveries, we work round-the-clock.",
  },
  {
    title: "Affordable Pricing",
    icon: Coins,
    desc: "Pricing starts from only ₹600. Honest rates discussed upfront.",
  },
  {
    title: "Trusted & Safe",
    icon: ShieldCheck,
    desc: "Locally trusted business with reliable transit safety for your goods.",
  },
  {
    title: "Fast Response",
    icon: Zap,
    desc: "Submit your inquiry and get a manual call from Rohit within 15 minutes.",
  },
  {
    title: "Experienced Drivers",
    icon: Users,
    desc: "Skilled drivers familiar with Varanasi and nearby regional highways.",
  },
];

// Vehicle fleet
const fleet = [
  {
    name: "Mahindra Alfa Loader",
    image: "/alfa.png",
    capacity: "Up to 500 kg",
    usage: "Small loads, narrow streets, fast parcel transit.",
    icon: "3-Wheeler"
  },
  {
    name: "Tata Ace (Magic)",
    image: "/magic.png",
    capacity: "Up to 1.2 Tons (Chota Hathi)",
    usage: "Best for Household shifting and commercial goods.",
    icon: "Mini Truck"
  },
  {
    name: "E-Rickshaw Loader (Toto)",
    image: "/toto.png",
    capacity: "Up to 350 kg",
    usage: "Eco-friendly, budget transport, local market items.",
    icon: "Electric Loader"
  },
  {
    name: "Piaggio Ape Tempo",
    image: "/tempo.png",
    capacity: "Up to 750 kg",
    usage: "Classic local transport, agricultural transport.",
    icon: "Classic Tempo"
  }
];

// Districts
const areas = [
  "Varanasi", "Azamgarh", "Chandauli", "Mirzapur", "Bhadohi", 
  "Chunar", "Sonabhadra", "Ghazipur", "Ballia", "Jaunpur", "Mau"
];

// PageProps for Next.js App Router query params
interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialService = typeof params.service === "string" ? params.service : "";

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
            {/* Track: Icon on mobile, text on desktop */}
            <Link 
              href="/track"
              className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:py-2 text-slate-600 hover:text-primary-800 hover:bg-slate-50 rounded-xl text-xs font-bold border border-slate-200/80 transition-all shrink-0 hover:scale-[1.02]"
              title="Track Booking"
            >
              <Search className="w-4 h-4 text-primary-600" />
              <span className="hidden sm:inline ml-1.5">Track Booking</span>
            </Link>

            {/* Call: Icon on mobile, text on desktop */}
            <a 
              href="tel:7080360217" 
              className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:py-2 rounded-xl text-primary-800 hover:bg-primary-50/50 text-xs font-extrabold border border-primary-100/60 transition-all shrink-0 hover:scale-[1.02]"
              title="Call: 7080360217"
            >
              <Phone className="w-4 h-4 text-accent-500" />
              <span className="hidden sm:inline ml-1.5">Call: 7080360217</span>
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
              Trusted Local Transport in Varanasi
            </div>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-primary-800 leading-[1.1]">
              Fast, Safe &amp; Reliable <br />
              <span className="text-accent-500">Shifting &amp; Tempo Services</span>
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Need to move household goods, office furniture, or commercial parcels? Book our local tempos and mini trucks starting from just <span className="font-bold text-primary-800">₹600</span>. Professional service in Varanasi and surrounding districts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-2">
              <Link 
                href="#inquiry" 
                className="w-full sm:w-auto px-8 py-4 bg-primary-800 hover:bg-primary-900 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-primary-800/10 hover:shadow-xl hover:shadow-primary-800/20 transition-all text-center uppercase tracking-wider hover:-translate-y-0.5"
              >
                Get a Quote Now
              </Link>
              <a 
                href="tel:7080360217"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                <Phone className="w-5 h-5 text-accent-500" />
                Call: 7080360217
              </a>
            </div>

            {/* Premium Stat Mini Cards */}
            <div className="grid grid-cols-3 gap-3.5 border-t border-slate-100 pt-8 mt-6">
              <div className="bg-slate-50/50 border border-slate-100 p-3 sm:p-4 rounded-2xl flex flex-col justify-center text-center lg:text-left shadow-sm">
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-primary-800">₹600</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Min. Booking</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-100 p-3 sm:p-4 rounded-2xl flex flex-col justify-center text-center lg:text-left shadow-sm">
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-primary-800">24/7</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Live Support</span>
              </div>
              <div className="bg-slate-50/50 border border-slate-100 p-3 sm:p-4 rounded-2xl flex flex-col justify-center text-center lg:text-left shadow-sm">
                <span className="block font-display font-extrabold text-2xl sm:text-3xl text-primary-800">11+</span>
                <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Districts</span>
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
              <span className="text-xs font-extrabold uppercase tracking-wider text-accent-500">Our Premium Fleet</span>
              <h3 className="text-lg font-display font-extrabold">Tata Ace &amp; Magic Mini Trucks</h3>
              <p className="text-xs text-slate-300">Perfect for local house shifting and commercial cargo logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Section */}
      <section id="services" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">Our Offerings</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800">
              Professional Transport Services
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Choose from our wide range of shifting and delivery services tailored for household, shop, and business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => {
              const IconComp = service.icon;
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
                      {service.name}
                    </h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <Link 
                    href={`/#inquiry?service=${encodeURIComponent(service.name)}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-600 group-hover:text-accent-700 transition-colors uppercase tracking-wider"
                  >
                    Select &amp; Book <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
              <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">Why Choose Us</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800">
                Safe Transport, Honest Prices, Local Trust
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We believe in providing transparent, friendly services without hidden fees. Rohit Kumar Singh handles pricing negotiations directly to offer you the best deals.
              </p>
              <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 self-center lg:self-start max-w-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 animate-pulse" />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-slate-800 text-sm">Direct Contact</span>
                  <span className="text-xs text-slate-500">Talk to the owner directly for bookings.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trustFactors.map((factor, idx) => {
                const IconComp = factor.icon;
                return (
                  <div key={idx} className="bg-white p-7 rounded-3xl border border-slate-200/60 shadow-sm flex gap-4 hover:shadow-md hover:border-primary-100/60 transition-all duration-300">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-800 shrink-0">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base mb-1">{factor.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed">{factor.desc}</p>
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
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">Our Fleet</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800">
              Vehicles for Every Load Size
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              From narrow city lanes to open highways, we select the perfect loader vehicle based on your load volume.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {fleet.map((vehicle, idx) => (
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
                    {vehicle.icon}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-display font-extrabold text-slate-800 text-lg mb-1 group-hover:text-primary-800 transition-colors">{vehicle.name}</h3>
                    <div className="inline-flex items-center gap-1 text-[10px] text-primary-800 font-extrabold bg-primary-50 px-2.5 py-1 rounded-lg mb-3 border border-primary-100/50">
                      Capacity: {vehicle.capacity}
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed mb-6">
                      {vehicle.usage}
                    </p>
                  </div>
                  <Link 
                    href="#inquiry" 
                    className="block text-center w-full py-3 bg-slate-50 border border-slate-200/60 hover:bg-primary-800 hover:text-white hover:border-primary-800 text-slate-700 font-bold text-xs rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Select vehicle
                  </Link>
                </div>
              </div>
            ))}
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
                  Active Logistics Network
                </div>
                
                <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800 mb-4 leading-tight">
                  Express Connections Across <span className="text-accent-500">Eastern UP</span>
                </h2>
                
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  From our central transport headquarters in Varanasi, we run daily outstation and local shuttle routes to deliver your household goods and commercial shipments safely.
                </p>
                
                {/* Network Stats / Features */}
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-700 shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Same-Day Shifting</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Quick transit times between Varanasi and connecting cities.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-xl bg-accent-50 border border-accent-100 flex items-center justify-center text-accent-600 shrink-0">
                      <Navigation className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Full Route Visibility</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Live status updates for outstation deliveries through your tracking code.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Popular Routes Ticker */}
              <div className="border-t border-slate-100 pt-6 mt-8">
                <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">Popular Daily Routes</span>
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
                {areas.map((area, idx) => {
                  const isVaranasi = area === "Varanasi";
                  
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
                            HQ & Hub
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <span className={`block font-display font-extrabold text-base sm:text-lg leading-tight transition-colors ${
                          isVaranasi ? "text-white" : "text-slate-800 group-hover:text-primary-800"
                        }`}>
                          {area}
                        </span>
                        <span className={`block text-[10px] mt-0.5 font-medium ${
                          isVaranasi ? "text-primary-100" : "text-slate-400"
                        }`}>
                          {isVaranasi ? "Central Operations Office" : "Express Connectivity"}
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
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest text-center lg:text-left">Inquiry Flow</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800 text-center lg:text-left">
              Easy 3-Step Booking
            </h2>
            <p className="text-slate-600 text-sm sm:text-base text-center lg:text-left mb-4">
              Here is how we coordinate and process your transport requests manually:
            </p>

            <div className="flex flex-col gap-6 max-w-md mx-auto lg:mx-0">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 text-white font-bold text-sm flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Submit Inquiry Form</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Fill out our short form with your pickup/drop points and service type.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 text-white font-bold text-sm flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Redirect to WhatsApp</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Your inputs auto-generate a direct message to connect you with Rohit Kumar Singh.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-800 text-white font-bold text-sm flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Manual Pricing & Confirmation</h4>
                  <p className="text-xs text-slate-500 mt-0.5">We discuss and finalize the prices based on distance and load, then book offline.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <InquiryForm initialService={initialService} />
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-3">
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">Testimonials</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-primary-800">
              What Our Customers Say
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Read how local business owners and household customers rate our logistics support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-slate-50/40 border border-slate-200/50 flex flex-col justify-between hover:shadow-md hover:border-slate-300/40 transition-all duration-300 relative min-h-[220px] group">
              {/* Giant quotation mark in background */}
              <span className="absolute top-2 right-4 text-7xl text-slate-200/50 font-serif leading-none select-none group-hover:text-primary-100 transition-colors pointer-events-none">&ldquo;</span>
              
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-6 relative z-10">
                &ldquo;I booked Krishna Transport for shifting my household items from Sigra to Salarpur. Rohit was very helpful. They provided a Tata Magic loader and two helpers at very reasonable charges. Highly recommended!&rdquo;
              </p>
              <div>
                <span className="block font-bold text-slate-800 text-sm">Amit Kumar</span>
                <span className="text-xs text-primary-600 font-bold">Household Shifting, Varanasi</span>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-slate-50/40 border border-slate-200/50 flex flex-col justify-between hover:shadow-md hover:border-slate-300/40 transition-all duration-300 relative min-h-[220px] group">
              <span className="absolute top-2 right-4 text-7xl text-slate-200/50 font-serif leading-none select-none group-hover:text-primary-100 transition-colors pointer-events-none">&ldquo;</span>
              
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-6 relative z-10">
                &ldquo;We run a grocery shop in Azamgarh and need regular bulk parcel deliveries from Varanasi mandi. Krishna Transport is highly punctual and handles cargo carefully. Best pricing in the area.&rdquo;
              </p>
              <div>
                <span className="block font-bold text-slate-800 text-sm">Vijay Pratap Singh</span>
                <span className="text-xs text-primary-600 font-bold">Shop Owner, Azamgarh</span>
              </div>
            </div>

            <div className="p-7 rounded-3xl bg-slate-50/40 border border-slate-200/50 flex flex-col justify-between hover:shadow-md hover:border-slate-300/40 transition-all duration-300 relative min-h-[220px] group">
              <span className="absolute top-2 right-4 text-7xl text-slate-200/50 font-serif leading-none select-none group-hover:text-primary-100 transition-colors pointer-events-none">&ldquo;</span>
              
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed mb-6 relative z-10">
                &ldquo;Best tempo booking service in Varanasi! Booked an Alfa loader for shifting my furniture items. Pricing is exactly as discussed, and driver was polite. Zero hassle.&rdquo;
              </p>
              <div>
                <span className="block font-bold text-slate-800 text-sm">Pooja Mishra</span>
                <span className="text-xs text-primary-600 font-bold">Furniture Booking, Varanasi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Contact & Maps Section */}
      <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col justify-center gap-6">
            <span className="text-xs font-extrabold text-accent-500 uppercase tracking-widest">Get In Touch</span>
            <h2 className="font-display font-extrabold text-3xl text-primary-800">
              Krishna Transport Office Location
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              If you have any doubts, custom load requirements, or need long-distance routes, feel free to visit our office or call us. We speak Hindi and English.
            </p>
 
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-800 text-sm">Address:</span>
                  <span className="text-xs text-slate-500">Salarpur, Vidhya Bihar Inter College ke Piche, Varanasi, Uttar Pradesh 221007</span>
                </div>
              </div>
 
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-800 text-sm">Phone Numbers:</span>
                  <span className="text-xs text-slate-500">Primary: 7080360217 | Alternate & WhatsApp: 7071634535</span>
                </div>
              </div>
 
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-slate-800 text-sm">Email Address:</span>
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
              Eastern UP's trusted local logistics and shifting service provider. Offering high-quality household shifting, mini truck loaders, and goods transport.
            </p>
            
            {/* Contact numbers directly in brand block */}
            <div className="flex flex-col gap-2 mt-2">
              <a href="tel:7080360217" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-accent-500" />
                <span>+91 70803 60217 (Primary)</span>
              </a>
              <a href="https://wa.me/917071634535" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span>+91 70716 34535 (WhatsApp)</span>
              </a>
            </div>
          </div>
          
          {/* Column 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent-500">Navigation</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="#fleet" className="hover:text-white transition-colors">Our Fleet</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Booking</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Logistics Services (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent-500">Logistics Services</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400 font-medium">
              <li><Link href="/?service=pickup#inquiry" className="hover:text-white transition-colors">Local Pickup Loader</Link></li>
              <li><Link href="/?service=shifting#inquiry" className="hover:text-white transition-colors">Household Shifting</Link></li>
              <li><Link href="/?service=goods#inquiry" className="hover:text-white transition-colors">Commercial Goods Transport</Link></li>
              <li><Link href="/?service=furniture#inquiry" className="hover:text-white transition-colors">Furniture Moving</Link></li>
              <li><Link href="/?service=parcel#inquiry" className="hover:text-white transition-colors">Bulk Parcel Delivery</Link></li>
            </ul>
          </div>
          
          {/* Column 4: Coverage & Location (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-widest text-accent-500">Operating Hours</h4>
            <div className="flex flex-col gap-3 text-xs text-slate-400">
              <div className="flex gap-2 items-center">
                <Clock className="w-4 h-4 text-accent-500 shrink-0" />
                <span>6:00 AM – 10:00 PM (Daily)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Active service and physical office operations. Emergency transport queries can be directed to WhatsApp 24/7.
              </p>
              
              <div className="mt-2 p-3 bg-white/5 border border-white/5 rounded-xl">
                <span className="block text-[10px] text-slate-400 uppercase font-black tracking-wide">Main Hub</span>
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
              <span>Owner: <strong className="text-slate-400">Rohit Kumar Singh</strong></span>
              <span className="text-slate-700">|</span>
              <span>Headquarters: <strong className="text-slate-400">Varanasi, UP</strong></span>
              <span className="text-slate-700">|</span>
              <Link href="/admin" className="text-slate-650 hover:text-slate-400 transition-colors" title="Admin Gate">
                <Lock className="w-3 h-3 inline align-middle" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
