# 🧠 Project Memory & Context Knowledgebase (MEMORY.md)
## Krishna Transport & Travels

**Purpose:** Long-term Memory, Architectural Decisions, Domain Invariants & Operational Context  
**Standard:** Enterprise Knowledge Preservation for Developers & AI Agents  
**Last Updated:** October 2026

---

## 1. Domain & Business Invariants

- **Entity Name:** Krishna Transport and Travels (कृष्णा ट्रांसपोर्ट एंड ट्रेवल्स).
- **Headquarters / Operating Base:** Varanasi, Uttar Pradesh, India.
- **Service Territory:** Varanasi City, Ramnagar, Sarnath, Babatpur, and adjoining Purvanchal districts (Chandauli, Mirzapur, Jaunpur, Azamgarh, Ghazipur, Bhadohi).
- **Key Operator / Founder:** Rohit Kumar Singh.
- **Primary Business Phone & WhatsApp:** `+91 7071634535` (`917071634535`).
- **Designated Super Admin Email:** `rohitsingh0641346@gmail.com`.
- **Default Service Currency:** Indian Rupee (₹, INR). Base fare starts at ₹600.
- **Default Locale:** Hindi (`hi`) with secondary English (`en`).

---

## 2. Architectural Decisions & Technical Choices

### 2.1 Next.js 16 + React 19 + Turbopack
- **Decision:** Modern App Router architecture using React 19 Server Actions (`"use server"`) instead of traditional API routes (`/api/...`).
- **Rationale:** Reduces network roundtrips, co-locates mutation logic, eliminates client-side fetch boilerplate, and enables seamless progressive enhancement with `useTransition`.
- **Constraint:** Any component calling `useSearchParams()` MUST be wrapped in a `<Suspense>` boundary to prevent client-side de-optimization.

### 2.2 Tailwind CSS v4 Migration
- **Decision:** Pure Tailwind CSS v4 using `@import "tailwindcss";` and `@theme` block in `src/app/globals.css`.
- **Crucial Invariant:** Do NOT create `tailwind.config.js` or `tailwind.config.ts`. Tailwind v4 does not read legacy config files when using `@tailwindcss/postcss`. All design tokens (custom colors, fonts, keyframes) belong in `src/app/globals.css`.

### 2.3 Supabase Database & Security Pattern
- **Decision:** 
  - Anonymous visitors can insert inquiries into the `inquiries` table without logging in.
  - Public reads (`select *`) are blocked on the table to protect phone numbers and addresses.
  - Tracking lookup (`getInquiryByCode`) and customer lookup (`getCustomerInquiries`) run via secure server actions using `supabaseAdmin`.
  - Admin operations require a valid Supabase Auth JWT token verifying identity as `rohitsingh0641346@gmail.com`.
- **Environment Keys:**
  - `NEXT_PUBLIC_SUPABASE_URL`: Public Supabase Project URL.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public Anon Key.
  - `ADMIN_PASSWORD`: Backend admin authorization key.

### 2.4 Hybrid WhatsApp Booking Conversion Funnel
- **Decision:** Rather than forcing users through a rigid checkout payment gateway, users submit the booking form and are immediately routed to WhatsApp with a pre-filled, polite Hindi/English message.
- **Rationale:** In Varanasi and Purvanchal, local logistics deals are finalized through conversation (negotiating helper charges, floor-level lifting, specific timing). WhatsApp achieves a >65% conversion rate compared to typical drop-offs on online payment gates.

---

## 3. Data Formats & Identifiers

### 3.1 Booking / Inquiry Code Pattern
- **Format:** `KT-DDMM-XXX`
  - `KT`: Prefix for Krishna Transport
  - `DDMM`: Two-digit day and two-digit month of booking creation (e.g. `0210` for Oct 2)
  - `XXX`: Random 3-digit salt (100–999)
- **Example:** `KT-0210-482`
- **Lookup URL:** `/track/KT-0210-482`

### 3.2 Status Progression Enum
1. `pending`: Initial submission, awaiting operator call.
2. `contacted`: Customer contacted via phone or WhatsApp.
3. `assigned`: Driver & vehicle allocated with fixed quote.
4. `in_transit`: Goods loaded and vehicle currently en route.
5. `completed`: Goods delivered successfully.
6. `cancelled`: Cancelled by customer or admin (with mandatory reason).

---

## 4. Platform Environment & Tooling Gotchas (Windows Specifics)

- **PowerShell Execution Policy:** On this Windows machine, running `npm run dev` directly in PowerShell can trigger an execution policy error (`npm.ps1 cannot be loaded`). Always run commands using `cmd /c npm ...` or execute directly via `node`.
- **Background Processes:** The Next.js dev server runs as a background task. Never start duplicate instances on port 3000.
- **Path Separators:** Always handle Windows backslashes (`\`) vs POSIX forward slashes (`/`) cleanly when writing scripts or markdown links.

---

## 5. Master Index of Documentation Files

- [PRD.md](file:///d:/Krishna%20Transport%20and%20Travels/PRD.md): Product Requirements, Personas, Features, KPIs.
- [ARCHITECTURE.md](file:///d:/Krishna%20Transport%20and%20Travels/ARCHITECTURE.md): System Architecture, Mermaid Diagrams, DB Schema, Security Model.
- [RULES.md](file:///d:/Krishna%20Transport%20and%20Travels/RULES.md): Engineering Rules, Code Standards, Zero Slop Policy.
- [AI_RESTRICTIONS.md](file:///d:/Krishna%20Transport%20and%20Travels/AI_RESTRICTIONS.md): Strict AI prohibitions, forbidden habits, quality checklists.
- [DESIGN.md](file:///d:/Krishna%20Transport%20and%20Travels/DESIGN.md): UI Design System, Color Tokens, Typography, Responsive Breakpoints.
- [TASK.md](file:///d:/Krishna%20Transport%20and%20Travels/TASK.md): Roadmap, Milestones, Active Tasks, Maintenance Checks.
- [MEMORY.md](file:///d:/Krishna%20Transport%20and%20Travels/MEMORY.md): This file. Domain invariants, architectural rationale, lessons learned.
