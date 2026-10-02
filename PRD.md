# 📄 Product Requirements Document (PRD)
## Krishna Transport & Travels (कृष्णा ट्रांसपोर्ट एंड ट्रेवल्स, वाराणसी)

**Version:** 1.0.0  
**Status:** Active / Production-Ready  
**Product Owner:** Rohit Kumar Singh (+91 7071634535)  
**Engineering Standard:** Big Tech (Google/Meta/Microsoft L6+ Principal Staff Spec)

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
In tier-2 and tier-3 Indian cities like Varanasi and Purvanchal (Azamgarh, Chandauli, Mirzapur, Jaunpur, Ghazipur), logistics and tempo hiring are dominated by unorganized, offline market stands (अड्डा). Customers face:
- Arbitrary surge pricing with zero transparency.
- Difficulty reaching verified drivers with suitable vehicle classes (3-wheeler loader, Tata Ace/Chhota Hathi, Pickup 1.7T).
- Zero shipment status visibility, lack of booking receipts, and insecure offline negotiations.
- High barrier to entry for non-English speakers.

### 1.2 Product Vision
**Krishna Transport & Travels** provides a seamless, hyperlocal logistics and vehicle-booking web platform tailored for the Varanasi and Purvanchal region. It bridges modern instant digital booking with the trusted, culturally grounded communication channel that customers prefer: **Direct WhatsApp interaction & Phone confirmation**.

### 1.3 Target Audience
1. **B2C Shifting Customers:** Individuals and families relocating homes or moving furniture within Varanasi or to nearby districts.
2. **B2B Local Merchants & Traders:** Wholesalers in Chowk, Godowlia, Vishweshwarganj, and Mandi traders needing daily or ad-hoc cargo transport.
3. **Regional Transporters:** Businesses dispatching bulk packages/cartons across Eastern Uttar Pradesh.
4. **Operations / Dispatch Admin:** Rohit Kumar Singh & operations team managing quotes, driver allocations, and fleet dispatch.

---

## 2. Core Value Propositions & Business Model

| Value Proposition | Implementation Mechanism |
|---|---|
| **Transparent & Affordable Base Pricing** | Fares starting from ₹600 with upfront rate matrix and instant fare estimator |
| **Instant Hybrid Booking** | Form submission saves order directly in Supabase DB and immediately redirects to WhatsApp with an auto-generated prefilled Hindi message |
| **End-to-End Tracking** | Public order tracking link (`/track/[code]`) with timeline, driver name, vehicle number, and quote |
| **Bilingual Local-First UI** | Native Hindi-first toggle with smooth fallback to English (`hi` / `en`) |
| **Zero App Download Friction** | Lightweight PWA-ready Next.js web application accessible on low-end Android mobile devices |

---

## 3. User Personas

### Persona A: "Ramesh Sharma" (Local Home Shifting Customer)
- **Profile:** Moving a 2-BHK apartment from Lanka to Shivpur, Varanasi.
- **Needs:** Needs a Tata Ace (Chhota Hathi) + 2 helpers, fixed price estimate without hidden charges, and clear tracking.
- **Pain Points:** Unreliable tempo stands, sudden price hikes upon arrival.

### Persona B: "Sunil Gupta" (Kirana / Mandi Trader)
- **Profile:** Needs daily vegetable/grain movement from Raja Talab Mandi to Maidagin market at 5:00 AM.
- **Needs:** 24/7 availability, recurring booking, fast phone/WhatsApp communication.

### Persona C: "Rohit Kumar Singh" (Fleet Owner & Dispatch Admin)
- **Profile:** Owner and operational head managing drivers, vehicles, and inquiries.
- **Needs:** Real-time visibility into all incoming inquiries, status updates (`pending`, `contacted`, `assigned`, `in_transit`, `completed`, `cancelled`), driver allocation, quotation input, and spam cleanup.

---

## 4. Key Functional Features & Specifications

### 4.1 Public Landing & Fare Estimation
- **Hero Section:** Clear headline in Hindi/English, quick booking CTA, primary call numbers, WhatsApp instant button, trust badges.
- **Interactive Fare Calculator (`FareCalculatorWidget.tsx`):**
  - Pickup and Drop locality selectors across key Varanasi hubs (Godowlia, Cantt, Lanka, BHU, Shivpur, Babatpur, Ramnagar, Sarnath, etc.).
  - Vehicle type selection: 3-Wheeler Loader, Tata Ace (Chhota Hathi), Bolero Pickup, 14ft Eicher.
  - Calculated estimate with distance, time estimate, and base fare.
- **Fleet Showcase (`FleetSection.tsx`):**
  - Specs for Mahindra Alfa Loader (500kg), Tata Ace Gold (750-1000kg), Mahindra Bolero Maxi Truck (1.5-1.7 Ton), 14-Feet Eicher (3-4 Ton).
  - Clear payload capacity, vehicle dimensions, and starting rates.
- **Route Matrix (`RouteMatrixSection.tsx`):** Pre-calculated routes between major hubs with standard expected pricing.
- **Testimonials & Trust Factors (`TestimonialsSection.tsx`):** Verified reviews from local customers and commercial clients.

### 4.2 Booking Inquiry Engine (`InquiryForm.tsx` & Server Actions)
- **Input Fields:**
  - Full Name (Required)
  - Phone Number (Required, 10-digit Indian validation)
  - Pickup Address / Landmark (Required)
  - Drop Address / Landmark (Required)
  - Booking Date & Preferred Time (Required)
  - Goods / Cargo Category (Required: Household, Commercial, Mandi, Furniture, Parcel, etc.)
  - Approximate Weight / Quantity (Optional)
  - Special Instructions / Notes (Optional)
  - Email (Optional - used for Customer Dashboard sync)
- **Submission Workflow:**
  1. Client validates inputs.
  2. Server Action `submitInquiry` creates database record with unique tracking code `KT-DDMM-XXX`.
  3. Form returns success and triggers seamless redirect to WhatsApp API with formatted message including tracking URL.
  4. User is redirected to `/track/[code]` or WhatsApp directly.

### 4.3 Live Tracking System (`/track` & `/track/[code]`)
- **Lookup:** Accessible via direct URL or search input by entering Booking ID (`KT-XXXX-XXX`).
- **Status Lifecycle:**
  - `pending` (इन्क्वायरी प्राप्त हुई - Verification pending)
  - `contacted` (संपर्क किया गया - Call made to customer)
  - `assigned` (ड्राइवर असाइन हुआ - Driver & vehicle assigned)
  - `in_transit` (सामान रास्ते में है - Goods loaded & moving)
  - `completed` (सफलतापूर्वक डिलीवर हुआ - Completed)
  - `cancelled` (रद्द किया गया - Cancelled with reason)
- **Real-Time Display:**
  - Quoted price (if finalized).
  - Assigned driver name and direct phone dialer.
  - Vehicle registration number and vehicle type.
  - Pickup and drop points with timestamp.
  - Option for customer to request cancellation before transit starts.

### 4.4 Customer Authentication & Dashboard (`/login`, `/dashboard`)
- **Authentication Providers:** Supabase Auth (Google OAuth, Email Magic Link / OTP, Password).
- **Dashboard Capabilities:**
  - Active and past booking history matching user's registered email.
  - Quick status chips and live details.
  - One-click tracking link.
  - Direct customer cancellation modal with mandatory cancellation reason.

### 4.5 Admin Operations Portal (`/admin`)
- **Access Control:** Restricted to authenticated admin email (`rohitsingh0641346@gmail.com`) via Supabase Auth session token verification and backend environment check.
- **Capabilities:**
  - Real-time tabular and card view of all inquiries ordered by recency.
  - Status filter tabs: All, Pending, Contacted, Assigned, Completed, Cancelled.
  - Search by Name, Phone, Pickup/Drop location, or Booking Code.
  - In-place editing:
    - Quoted Amount (₹)
    - Driver Name & Driver Phone
    - Vehicle Number
    - Status toggle
    - Cancellation reason
  - Direct WhatsApp and Call buttons for each customer lead.
  - Hard delete for spam inquiries.

---

## 5. Non-Functional Requirements (NFR)

### 5.1 Performance & Core Web Vitals
- **LCP (Largest Contentful Paint):** < 2.0s on 4G connections.
- **CLS (Cumulative Layout Shift):** < 0.05.
- **FID / INP:** < 100ms.
- **Image Optimization:** All assets served via `next/image` with WebP/AVIF compression.

### 5.2 Reliability & High Availability
- Stateless Next.js App Router deployed with serverless edge functions.
- PostgreSQL database hosted on Supabase with automatic backups and failover.

### 5.3 Security & Data Privacy
- Customer phone numbers and addresses protected by Supabase Row-Level Security (RLS).
- Public users can only read individual bookings if they possess the exact unique tracking code (`KT-DDMM-XXX`).
- Admin endpoints protected via cryptographic JWT validation checking against authorized admin UUID and email.
- Zero public exposure of Supabase Service Role keys.

### 5.4 Localization & Accessibility
- Complete bilingual support (`hi` Hindi & `en` English) toggled via `useLanguage` hook.
- Semantic HTML5, accessible color contrast (WCAG AA compliant: Royal Blue `#1e3a8a` & Bright Orange `#f97316`).
- Full responsive support (320px mobile screens up to 4K ultra-wide).

---

## 6. Success Metrics & KPIs
- **Lead Conversion Rate:** > 65% of submitted inquiries proceed to WhatsApp or phone confirmation.
- **Inquiry Response Time:** Average operator callback time under 15 minutes.
- **Customer Self-Service Tracking:** > 40% of tracking queries handled via `/track/[code]` rather than manual support calls.
- **Zero Critical Error Rate:** 99.9% error-free form submissions.
