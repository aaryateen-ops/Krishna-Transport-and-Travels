"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  Truck
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // Tabs: 'signin' or 'signup'
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  // Check if already logged in on mount
  useEffect(() => {
    async function checkCurrentSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const userEmail = session.user.email;
          if (userEmail === "rohitsingh0641346@gmail.com") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }
      } catch (err) {
        console.error("Session check error:", err);
      } finally {
        setCheckingSession(false);
      }
    }
    checkCurrentSession();
  }, [router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        setSuccessMsg("Logged in successfully! Redirecting...");
        const userEmail = data.user.email;
        
        // Save admin password to legacy storage if admin logs in, to keep admin actions working
        if (userEmail === "rohitsingh0641346@gmail.com") {
          // Store the JWT token as the authorization credential
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            localStorage.setItem("krishna_admin_password", session.access_token);
          }
          setTimeout(() => {
            router.push("/admin");
          }, 1000);
        } else {
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
        }
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setErrorMsg("An unexpected error occurred during sign in.");
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName || !phoneNumber) {
      setErrorMsg("Please fill all the fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Check if email confirmation is required by Supabase setup
        // Normally, if identities is empty and user exists, email might need confirmation,
        // but if they are signed in immediately, or can log in:
        if (data.session) {
          setSuccessMsg("Account created and logged in successfully! Redirecting...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } else {
          setSuccessMsg("Registration successful! Please check your email for a verification link, or try signing in.");
          setLoading(false);
          setActiveTab("signin");
        }
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setErrorMsg("An unexpected error occurred during registration.");
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="mt-4 text-sm font-semibold text-slate-500">Checking auth session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-primary-50 via-slate-50 to-white relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary-200/30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Bar */}
      <header className="w-full bg-white/80 backdrop-blur-lg border-b border-slate-200/50 py-4 px-6 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden border border-slate-200 shrink-0 group-hover:scale-105 transition-transform duration-300">
            <Image 
              src="/logo.png" 
              alt="Krishna Transport Logo" 
              fill 
              unoptimized
              className="object-cover scale-[1.4] origin-center"
            />
          </div>
          <span className="font-display font-extrabold text-sm sm:text-base text-primary-800 leading-tight">
            Krishna Transport
          </span>
        </Link>
        <Link 
          href="/" 
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-800 transition-colors"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          Back to Home
        </Link>
      </header>

      {/* Form Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-3xl shadow-2xl p-6 sm:p-8 transition-all hover:border-primary-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h1 className="font-display font-extrabold text-2xl text-primary-800">
              {activeTab === "signin" ? "Welcome Back!" : "Create Customer Account"}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1.5">
              {activeTab === "signin" 
                ? "Sign in to access your inquiries or admin dashboard." 
                : "Register to manage bookings, track trips, and view history."}
            </p>
          </div>

          {/* Alert Notifications */}
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs font-medium rounded-2xl flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Tabs */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
            <button
              onClick={() => {
                setActiveTab("signin");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "signin" 
                  ? "bg-white text-primary-800 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("signup");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                activeTab === "signup" 
                  ? "bg-white text-primary-800 shadow-sm" 
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={activeTab === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
            
            {activeTab === "signup" && (
              <>
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      id="fullName"
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none rounded-xl text-sm font-semibold transition-all"
                    />
                  </div>
                </div>

                {/* WhatsApp Phone Number */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    WhatsApp Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none rounded-xl text-sm font-semibold transition-all"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g. you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none rounded-xl text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-primary-600 focus:ring-1 focus:ring-primary-600 outline-none rounded-xl text-sm font-semibold transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-800 hover:bg-primary-900 text-white font-bold text-sm rounded-xl shadow-md shadow-primary-800/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer hover:scale-[1.01]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : activeTab === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full border-t border-slate-100 py-4 text-center text-[10px] sm:text-xs font-bold text-slate-400 bg-white">
        © {new Date().getFullYear()} Krishna Transport & Travel Management. All Rights Reserved.
      </footer>
    </div>
  );
}
