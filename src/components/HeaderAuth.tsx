"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface HeaderAuthProps {
  lang?: "hi" | "en";
}

export default function HeaderAuth({ lang = "hi" }: HeaderAuthProps) {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          if (session.user.email === "rohitsingh0641346@gmail.com") {
            setDashboardUrl("/admin");
          } else {
            setDashboardUrl("/dashboard");
          }
        } else {
          setDashboardUrl(null);
        }
      } catch (err) {
        console.error("Header Auth check error:", err);
      } finally {
        setSessionChecked(true);
      }
    }

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && session.user) {
        if (session.user.email === "rohitsingh0641346@gmail.com") {
          setDashboardUrl("/admin");
        } else {
          setDashboardUrl("/dashboard");
        }
      } else {
        setDashboardUrl(null);
      }
      setSessionChecked(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!sessionChecked) {
    return (
      <div className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:py-2 rounded-xl border border-slate-200/80 shrink-0">
        <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (dashboardUrl) {
    return (
      <Link 
        href={dashboardUrl}
        className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:py-2 text-primary-800 hover:text-white bg-primary-50 hover:bg-primary-800 border border-primary-100 rounded-xl text-xs font-extrabold transition-all shrink-0 hover:scale-[1.02]"
        title={lang === "hi" ? "डैशबोर्ड पर जाएँ" : "Go to Dashboard"}
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline ml-1.5">{lang === "hi" ? "मेरा डैशबोर्ड" : "My Dashboard"}</span>
      </Link>
    );
  }

  return (
    <Link 
      href="/login"
      className="flex items-center justify-center w-9 h-9 sm:w-auto sm:px-4 sm:py-2 text-slate-650 hover:text-primary-800 hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold transition-all shrink-0 hover:scale-[1.02]"
      title={lang === "hi" ? "खाते में लॉगिन करें" : "Login to Account"}
    >
      <User className="w-4 h-4 text-slate-400" />
      <span className="hidden sm:inline ml-1.5">{lang === "hi" ? "कस्टमर लॉगिन" : "Customer Login"}</span>
    </Link>
  );
}
