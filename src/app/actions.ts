"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";
import { headers } from "next/headers";

export interface InquiryData {
  fullName: string;
  phoneNumber: string;
  pickupLocation: string;
  dropLocation: string;
  bookingDate: string;
  bookingTime: string;
  goodsType: string;
  weight?: string;
  notes?: string;
}

// Helper to generate unique Inquiry Code (KT-DDMM-123)
function generateInquiryCode(): string {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const randomDigits = Math.floor(100 + Math.random() * 900); // 100-999
  return `KT-${dd}${mm}-${randomDigits}`;
}

// Helper to verify admin password
function verifyAdmin(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD || "krishna@admin2026";
  return password === correctPassword;
}

// 1. Submit a transport inquiry
export async function submitInquiry(data: InquiryData) {
  try {
    // Basic validation
    if (
      !data.fullName ||
      !data.phoneNumber ||
      !data.pickupLocation ||
      !data.dropLocation ||
      !data.bookingDate ||
      !data.bookingTime ||
      !data.goodsType
    ) {
      return { success: false, error: "Please fill all required fields." };
    }

    const inquiryCode = generateInquiryCode();

    // Insert into Supabase (No .select() call since public role lacks read permissions)
    const { error } = await supabase
      .from("inquiries")
      .insert([
        {
          inquiry_code: inquiryCode,
          full_name: data.fullName,
          phone_number: data.phoneNumber,
          pickup_location: data.pickupLocation,
          drop_location: data.dropLocation,
          booking_date: data.bookingDate,
          booking_time: data.bookingTime,
          goods_type: data.goodsType,
          weight: data.weight || null,
          notes: data.notes || null,
          status: "pending",
          redirected_to_whatsapp: true,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: "Database error. Please try again." };
    }

    // Build tracking URL dynamically using request headers
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";
    const origin = `${protocol}://${host}`;
    const trackingUrl = `${origin}/track/${inquiryCode}`;

    // Generate prefilled WhatsApp message
    const formattedMessage = `Hello Krishna Transport & Travel Management, I would like to book a service.

*Booking ID:* ${inquiryCode}
*Name:* ${data.fullName}
*Phone:* ${data.phoneNumber}
*Pickup Location:* ${data.pickupLocation}
*Drop Location:* ${data.dropLocation}
*Date:* ${data.bookingDate}
*Time:* ${data.bookingTime}
*Goods Type:* ${data.goodsType}
${data.weight ? `*Estimated Weight:* ${data.weight}\n` : ""}${data.notes ? `*Additional Notes:* ${data.notes}\n` : ""}
*Track My Booking Here:* ${trackingUrl}

Please contact me for final pricing.`;

    const encodedText = encodeURIComponent(formattedMessage);
    const whatsappUrl = `https://wa.me/917071634535?text=${encodedText}`;

    return {
      success: true,
      inquiryCode,
      redirectUrl: whatsappUrl,
    };
  } catch (err: any) {
    console.error("Inquiry submission error:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// 2. Public method to fetch a single inquiry by its code (secure, read-only)
export async function getInquiryByCode(code: string) {
  try {
    if (!code) return { success: false, error: "Inquiry Code is required." };

    // Fetch using supabaseAdmin to bypass select RLS checks safely
    const { data, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .eq("inquiry_code", code.trim())
      .maybeSingle();

    if (error) {
      console.error("Fetch inquiry by code error:", error);
      return { success: false, error: "Database lookup failed." };
    }

    if (!data) {
      return { success: false, error: "Inquiry not found. Check the code." };
    }

    return { success: true, inquiry: data };
  } catch (err) {
    console.error("Fetch inquiry exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// 3. Fetch all inquiries for admin
export async function getInquiries(password: string) {
  if (!verifyAdmin(password)) {
    return { success: false, error: "Invalid admin password." };
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin fetch error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, inquiries: data };
  } catch (err: any) {
    console.error("Admin fetch exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// 4. Update status and operations of an inquiry
export interface OperationalUpdateData {
  quoted_amount?: number | null;
  driver_name?: string | null;
  driver_phone?: string | null;
  vehicle_number?: string | null;
  status?: string;
  cancellation_reason?: string | null;
}

export async function updateInquiryOperations(
  id: string, 
  updateData: OperationalUpdateData, 
  password: string
) {
  if (!verifyAdmin(password)) {
    return { success: false, error: "Invalid admin password." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("inquiries")
      .update({
        quoted_amount: updateData.quoted_amount,
        driver_name: updateData.driver_name,
        driver_phone: updateData.driver_phone,
        vehicle_number: updateData.vehicle_number,
        status: updateData.status,
        cancellation_reason: updateData.cancellation_reason,
      })
      .eq("id", id);

    if (error) {
      console.error("Admin operations update error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Admin operations update exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// 5. Delete an inquiry (spam cleanup)
export async function deleteInquiry(id: string, password: string) {
  if (!verifyAdmin(password)) {
    return { success: false, error: "Invalid admin password." };
  }

  try {
    const { error } = await supabaseAdmin
      .from("inquiries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Admin delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Admin delete exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

// 6. Public method to cancel a booking by its code
export async function cancelBooking(code: string, reason: string) {
  try {
    if (!code) return { success: false, error: "Booking code is required." };
    if (!reason) return { success: false, error: "Cancellation reason is required." };

    // Update using supabaseAdmin to bypass update RLS checks safely
    const { error } = await supabaseAdmin
      .from("inquiries")
      .update({
        status: "cancelled",
        cancellation_reason: reason.trim()
      })
      .eq("inquiry_code", code.trim());

    if (error) {
      console.error("Cancel booking error:", error);
      return { success: false, error: "Database update failed." };
    }

    return { success: true };
  } catch (err) {
    console.error("Cancel booking exception:", err);
    return { success: false, error: "An unexpected error occurred." };
  }
}

