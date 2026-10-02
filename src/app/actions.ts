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
  email?: string;
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
          email: data.email || null,
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

    // Generate prefilled WhatsApp message in Hindi/Hinglish
    const formattedMessage = `नमस्ते कृष्णा ट्रांसपोर्ट एंड ट्रेवल्स, मैं एक बुकिंग करना चाहता हूँ।

*बुकिंग आईडी (Booking ID):* ${inquiryCode}
*नाम (Name):* ${data.fullName}
*मोबाइल नंबर (Phone):* ${data.phoneNumber}
*कहाँ से सामान उठाना है (Pickup):* ${data.pickupLocation}
*कहाँ पहुँचाना है (Drop):* ${data.dropLocation}
*तारीख (Date):* ${data.bookingDate}
*समय (Time):* ${data.bookingTime}
*सर्विस का प्रकार (Service):* ${data.goodsType}
${data.weight ? `*अनुमानित वजन (Weight):* ${data.weight}\n` : ""}${data.notes ? `*सामान की लिस्ट / नोट (Notes):* ${data.notes}\n` : ""}
*बुकिंग ट्रैक करें (Track Link):* ${trackingUrl}

कृपया किराया तय करने के लिए मुझसे संपर्क करें।`;

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
export async function getInquiries(token: string) {
  try {
    if (!token) return { success: false, error: "Session token is required." };
    
    // Verify user JWT token using Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

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
  token: string
) {
  try {
    if (!token) return { success: false, error: "Session token is required." };
    
    // Verify user JWT token using Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

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
export async function deleteInquiry(id: string, token: string) {
  try {
    if (!token) return { success: false, error: "Session token is required." };
    
    // Verify user JWT token using Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

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

// 5.5 Fetch all inquiries for a specific customer email (secure, JWT verified)
export async function getCustomerInquiries(email: string, token: string) {
  try {
    if (!email) return { success: false, error: "Customer email is required." };
    if (!token) return { success: false, error: "Session token is required." };

    // Verify the JWT token belongs to the requested email
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== email.trim()) {
      return { success: false, error: "Unauthorized access." };
    }

    // Fetch using supabaseAdmin to bypass RLS select safely
    const { data, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .eq("email", email.trim())
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch customer inquiries error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, inquiries: data };
  } catch (err) {
    console.error("Fetch customer inquiries exception:", err);
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

// 7. Customer Feedback & Review Submissions
export interface CustomerReviewInput {
  inquiryCode?: string;
  customerName: string;
  customerPhone?: string;
  rating: number;
  comment: string;
}

export async function submitCustomerReview(input: CustomerReviewInput) {
  try {
    if (!input.customerName || !input.comment) {
      return { success: false, error: "Customer name and comment are required." };
    }

    const { error } = await supabase
      .from("reviews")
      .insert([
        {
          inquiry_code: input.inquiryCode ? input.inquiryCode.trim() : null,
          customer_name: input.customerName.trim(),
          customer_phone: input.customerPhone ? input.customerPhone.trim() : null,
          rating: Math.min(5, Math.max(1, input.rating || 5)),
          comment: input.comment.trim(),
          is_approved: true, // Visible immediately
        }
      ]);

    if (error) {
      console.error("Submit review error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Submit review exception:", err);
    return { success: false, error: "Failed to submit review." };
  }
}

// 8. Admin Reviews Fetch & Management
export async function getAdminReviews(token: string) {
  try {
    if (!token) return { success: false, error: "Session token is required." };

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get admin reviews error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, reviews: data || [] };
  } catch (err) {
    console.error("Get admin reviews exception:", err);
    return { success: false, error: "Failed to fetch reviews." };
  }
}

// 9. Admin Toggle Review Approval
export async function toggleReviewApproval(reviewId: string, isApproved: boolean, token: string) {
  try {
    if (!token) return { success: false, error: "Session token is required." };

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .update({ is_approved: isApproved })
      .eq("id", reviewId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to update review status." };
  }
}

// 10. Admin Delete Review
export async function deleteReview(reviewId: string, token: string) {
  try {
    if (!token) return { success: false, error: "Session token is required." };

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

    const { error } = await supabaseAdmin
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to delete review." };
  }
}

// 11. Vehicle Pricing Settings (Dynamic Rates Master)
export interface PricingRecord {
  id: string;
  vehicle_name: string;
  base_fare: number;
  per_km_rate: number;
  helper_rate: number;
}

export async function getPricingSettings() {
  try {
    const { data, error } = await supabase
      .from("pricing_settings")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Get pricing settings error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, pricing: (data || []) as PricingRecord[] };
  } catch (err) {
    console.error("Get pricing settings exception:", err);
    return { success: false, error: "Failed to fetch pricing settings." };
  }
}

export async function updatePricingSettings(records: PricingRecord[], token: string) {
  try {
    if (!token) return { success: false, error: "Session token is required." };

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

    for (const rec of records) {
      await supabaseAdmin
        .from("pricing_settings")
        .upsert({
          id: rec.id,
          vehicle_name: rec.vehicle_name,
          base_fare: Number(rec.base_fare),
          per_km_rate: Number(rec.per_km_rate),
          helper_rate: Number(rec.helper_rate),
          updated_at: new Date().toISOString(),
        });
    }

    return { success: true };
  } catch (err) {
    console.error("Update pricing settings exception:", err);
    return { success: false, error: "Failed to update pricing settings." };
  }
}

// 12. Drivers Fleet Master Management (Persisted in PostgreSQL)
export interface DriverRecord {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  vehicleNumber: string;
  status: "available" | "on_duty";
}

export async function getDriversList() {
  try {
    const { data, error } = await supabase
      .from("drivers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get drivers error:", error);
      return { success: false, error: error.message };
    }

    const mapped: DriverRecord[] = (data || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      phone: d.phone,
      vehicleType: d.vehicle_type,
      vehicleNumber: d.vehicle_number,
      status: d.status,
    }));

    return { success: true, drivers: mapped };
  } catch (err) {
    console.error("Get drivers exception:", err);
    return { success: false, error: "Failed to fetch drivers." };
  }
}

export async function createDriverRecord(
  driverData: { name: string; phone: string; vehicleType: string; vehicleNumber: string; status?: "available" | "on_duty" },
  token: string
) {
  try {
    if (!token) return { success: false, error: "Session token is required." };
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

    const id = `drv-${Date.now()}`;
    const { error } = await supabaseAdmin
      .from("drivers")
      .insert({
        id,
        name: driverData.name.trim(),
        phone: driverData.phone.trim(),
        vehicle_type: driverData.vehicleType,
        vehicle_number: driverData.vehicleNumber,
        status: driverData.status || "available",
      });

    if (error) {
      console.error("Create driver error:", error);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      driver: {
        id,
        name: driverData.name.trim(),
        phone: driverData.phone.trim(),
        vehicleType: driverData.vehicleType,
        vehicleNumber: driverData.vehicleNumber,
        status: driverData.status || "available" as const,
      } 
    };
  } catch (err) {
    console.error("Create driver exception:", err);
    return { success: false, error: "Failed to create driver." };
  }
}

export async function updateDriverStatusRecord(id: string, status: "available" | "on_duty", token: string) {
  try {
    if (!token) return { success: false, error: "Session token is required." };
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

    const { error } = await supabaseAdmin
      .from("drivers")
      .update({ status })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to update driver status." };
  }
}

export async function deleteDriverRecord(id: string, token: string) {
  try {
    if (!token) return { success: false, error: "Session token is required." };
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
      return { success: false, error: "Unauthorized access." };
    }

    const { error } = await supabaseAdmin
      .from("drivers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete driver error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error("Delete driver exception:", err);
    return { success: false, error: "Failed to delete driver." };
  }
}




