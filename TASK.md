# 📋 Project Task Tracker & Roadmap (TASK.md)
## Krishna Transport & Travels

**Status:** Active Production / Milestone 1 Completed  
**Last Updated:** October 2026  
**Engineering Standard:** Google / Meta / Microsoft Enterprise Sprint Model

---

## 1. Milestones Overview

| Milestone | Scope | Status | Completion Date |
|---|---|---|---|
| **Milestone 1** | Core Booking, WhatsApp Bridge, Tracking & Operations Dashboard | ✅ Completed | October 2026 |
| **Milestone 2** | Customer Portal, Email Sync, Bilingual Polish & SEO Optimization | ✅ Completed | October 2026 |
| **Milestone 3** | Automated Notifications (WhatsApp/SMS Webhooks) & Billing | ⏳ Planned | Q4 2026 |
| **Milestone 4** | Live Driver GPS Integration & Multi-City Expansion | 📅 Backlog | 2027 |

---

## 2. Completed Features (Done ✅)

### 2.1 Customer Booking & Public Portal
- [x] **Responsive Landing Page:** High-converting hero section with instant call and WhatsApp actions.
- [x] **Hyperlocal Inquiry Form (`InquiryForm.tsx`):**
  - Validation for Indian 10-digit mobile numbers, pickup/drop, goods type, and preferred time.
  - Server Action `submitInquiry` generating unique tracking code `KT-DDMM-XXX`.
  - Automatic prefilled WhatsApp message generator in Hindi/English with direct redirect.
- [x] **Interactive Fare Calculator Widget (`FareCalculatorWidget.tsx`):**
  - Locality-based distance calculation across Varanasi hubs.
  - Dynamic vehicle selection (Alfa 3W, Tata Ace, Bolero Pickup, Eicher 14ft).
  - Estimated transit time and transparent pricing breakdown.
- [x] **Route Matrix & Vehicle Fleet Showcase:**
  - Clear rate matrix for high-traffic routes (Cantt, Lanka, Babatpur, Shivpur, Ramnagar, etc.).
  - Detailed payload specs and dimensions for all vehicles.
- [x] **Public Tracking Portal (`/track` and `/track/[code]`):**
  - Real-time booking status timeline.
  - Driver name, phone dialer, vehicle number, and quoted amount display.
  - Self-service booking cancellation with mandatory customer reason.

### 2.2 Operations & Admin Management
- [x] **Admin Operations Portal (`/admin`):**
  - Supabase JWT session authentication + email verification (`rohitsingh0641346@gmail.com`).
  - Search inquiries by code, phone number, customer name, or location.
  - Filter tabs: All, Pending, Contacted, Assigned, Completed, Cancelled.
  - In-place editing: Driver name, Driver phone, Vehicle number, Fare quote, Status.
  - Hard delete for spam inquiries.
  - One-click WhatsApp and direct phone dialers for leads.

### 2.3 Customer Dashboard & Authentication
- [x] **Authentication Hub (`/login`):**
  - Google OAuth 2.0, Email Magic Link / OTP, and password authentication.
- [x] **Customer Dashboard (`/dashboard`):**
  - Automatic listing of inquiries associated with the customer's email.
  - Status tracking chips and direct tracking shortcuts.
  - Customer-side cancellation dialog.

### 2.4 SEO, PWA & Performance
- [x] Next.js 16 metadata configuration with canonical tags, OpenGraph cards, Twitter cards.
- [x] Schema.org `LocalBusiness` / `AutomotiveBusiness` JSON-LD structured data.
- [x] Dynamic `sitemap.ts` and `robots.ts` configured for Googlebot indexing.
- [x] PWA manifest setup (`manifest.json` and web app icons).
- [x] Tailwind CSS v4 performance tuning with zero horizontal scroll bug.

### 2.5 Humanization & Grounded Banarasi Logistics Polish (Completed ✅)
- [x] **Banarasi Logistics FAQ Section (`FAQSection.tsx`):**
  - Accordion for helper/labour support & floor lifting, No-Entry market regulations in Chowk/Godowlia, waterproof tarpaulin & monsoon protection, zero upfront payment terms, and free doorstep cancellation.
- [x] **Authentic Receipt Terms (`/track/[code]`):**
  - Removed hallucinated corporate "₹200 cancellation fee" in favor of genuine free doorstep cancellation & actual toll/parking slips.
- [x] **Brand & Contact Uniformity:**
  - Unified contact email to `rohitsingh0641346@gmail.com` across entire application.
  - Clear calling hotline (`70803 60217`) and WhatsApp desk (`70716 34535`).
- [x] **Content Typo & Slop Cleanup:**
  - Fixed bilingual token hallucination `सिगra` -> `सिगरा` in testimonials.
  - Polished AI marketing stats into authentic local guarantees (Tarpaulin covered, 15-20 min dispatch, direct owner call).
  - Replaced tilted phone frame mockup with clean, high-contrast smartphone frame.

### 2.6 Google #1 Ranking SEO & Semantic Dominance (Completed ✅)
- [x] **Expanded Search Intent Metadata (`src/app/layout.tsx`):**
  - Injected 30+ high-volume English, Hindi & Hinglish keywords covering core queries, micro-localities, and use-cases.
- [x] **Google SERP Rich Snippets (`FAQPage` + `Service` + `AggregateRating` + `Breadcrumbs`):**
  - Integrated FAQ Schema enabling interactive accordion dropdowns directly on Google Search results.
  - Added structured offer catalog with transparent prices for Chhota Hathi, 3W Alfa, House Shifting, and Mandi freight.
- [x] **Varanasi Locality & Micro-Markets Hub Section (`LocalityHubSection.tsx`):**
  - Interactive search and semantic cards for Lanka/BHU, Sigra/Rath Yatra, Godowlia/Chowk, Cantt Station, Shivpur, Paharia Mandi, Ramnagar, and Babatpur Airport.
- [x] **Dynamic Sitemap & Crawl Optimization (`src/app/sitemap.ts`):**
  - Optimized daily crawl frequencies for Googlebot indexing.

---

## 3. Active & Next Priorities (In Progress / Up Next ⏳)

- [ ] **Task 201: Automated WhatsApp Cloud API / Webhook Notifications:**
  - Send automated status update WhatsApp messages to customer when status changes to `assigned` or `in_transit`.
- [ ] **Task 202: PDF Invoice & Receipt Generation:**
  - One-click PDF download for completed commercial shipments with GST / Bill summary.
- [ ] **Task 203: Driver PWA Light Portal:**
  - Dedicated lightweight portal for drivers to toggle "Picked Up" and "Delivered" with one click.
- [ ] **Task 204: Google Analytics 4 & Conversion Tracking:**
  - Track conversion funnel from landing page visit -> form submission -> WhatsApp redirect.

---

## 4. Maintenance & Quality Checklist

| Check | Tool / Command | Last Run Result |
|---|---|---|
| **Linting** | `cmd /c npm run lint` | 0 Errors |
| **Type Checking** | TypeScript Compiler | Passing |
| **Dev Server Build** | Next.js 16.2.6 Turbopack | Ready on port 3000 |
| **Security Audit** | Supabase RLS & Auth JWT | Secure & Verified |
