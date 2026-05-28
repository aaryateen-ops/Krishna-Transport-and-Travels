"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, Phone, ArrowLeft } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

export default function TrackSearchPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/track/${code.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="object-contain" />
            <div>
              <span className="block font-display font-extrabold text-sm text-primary-800 leading-tight">
                Krishna Transport
              </span>
              <span className="block font-sans font-medium text-[9px] text-slate-500 uppercase tracking-widest">
                & Travel Management
              </span>
            </div>
          </Link>
          <Link href="/" className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-primary-800 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Panel */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
          <div className="flex flex-col items-center text-center gap-3 mb-6">
            <div className="w-14 h-14 bg-primary-50 text-primary-800 rounded-full flex items-center justify-center border border-primary-100">
              <Search className="w-6 h-6" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-primary-800">Track Your Booking</h1>
            <p className="text-sm text-slate-500 max-w-xs">
              Enter the unique Inquiry ID provided during booking submission to check live status and driver details.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Inquiry Reference Code</label>
              <input
                type="text"
                placeholder="e.g., KT-2805-431"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent text-sm bg-slate-50/50 font-mono font-bold text-center tracking-wide placeholder:font-sans placeholder:font-normal placeholder:tracking-normal uppercase"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider text-xs"
            >
              Search Booking
            </button>
          </form>

          <div className="border-t border-slate-100 mt-6 pt-4 text-center">
            <p className="text-xs text-slate-400">
              Can't find your Booking Code? Check your WhatsApp chat details or contact us directly.
            </p>
            <div className="flex justify-center gap-4 mt-3">
              <a href="tel:7080360217" className="text-xs font-bold text-primary-800 hover:underline flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> Call Support
              </a>
              <a href="https://wa.me/917071634535" className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1">
                <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white text-center">
        <span className="text-[10px] text-slate-400 font-medium">
          © 2026 Krishna Transport & Travel Management. Varanasi, 221007.
        </span>
      </footer>
    </div>
  );
}
