# 📜 Engineering Rules & Code Standards (RULES.md)
## Krishna Transport & Travels

**Standard Level:** Big Tech (Google L6+ / Meta E6+ / Microsoft Principal)  
**Target:** All Developers & AI Agents  
**Enforcement:** Mandatory & Zero Tolerance for Violations

---

## 1. Prime Directives (Non-Negotiable)

1. **NO PLACEHOLDERS OR INCOMPLETE CODE ("Zero Slop" Rule):**
   - **Never** write comments like `// TODO: implement later`, `// Add logic here`, `// ...rest of the code`, or stubbed functions.
   - Every function, component, Server Action, and handler must be 100% fully implemented, typed, and operable.
   - If a feature is touched, all edge cases (loading, empty state, error state, network timeout, retry) must be completely written.

2. **PRESERVE WORKING FUNCTIONALITY:**
   - Never remove or break existing working features (e.g., WhatsApp direct redirect, live tracking by code, bilingual toggle, admin auth flow) during any refactor.
   - Code changes must be additive or strictly surgical replacements. Verify that unrelated elements in the file are not accidentally deleted or mangled.

3. **VERIFY BEFORE DECLARING DONE:**
   - Always run linting (`npm run lint` / `cmd /c npm run lint`) and type checks before reporting completion.
   - Ensure the Next.js dev server builds cleanly without Turbopack runtime errors or React hydration mismatches.

4. **DOCUMENT INTENT & UPDATE REGISTRY:**
   - When modifying data models, routes, or design tokens, update `ARCHITECTURE.md`, `TASK.md`, and `MEMORY.md` in the same commit / interaction.

---

## 2. Next.js 16 & React 19 Core Standards

1. **Server vs. Client Component Boundaries:**
   - Keep components Server Components (`RSC`) by default.
   - Add `"use client"` **only** when using browser hooks (`useState`, `useEffect`, `useSearchParams`, `useTransition`), DOM events (`onClick`, `onChange`), or browser APIs.
   - Keep `"use client"` leaves as small as possible in the component tree.

2. **Server Actions Convention (`"use server"`):**
   - All server mutations must reside in `src/app/actions.ts` or dedicated server action modules.
   - Every Server Action must return a typed response envelope:
     ```typescript
     export type ActionResponse<T = unknown> = 
       | { success: true; data?: T; [key: string]: any }
       | { success: false; error: string };
     ```
   - Always catch errors inside Server Actions and return user-friendly error messages. Never expose raw SQL errors or database internals to the client.

3. **Routing & Hydration Safety:**
   - Any client component using `useSearchParams()` must be wrapped in a React `<Suspense fallback={...}>` boundary to prevent de-opting entire pages into client-side rendering.
   - Never perform direct window access (`window.location`, `localStorage`) during server render; wrap inside `useEffect` or guard with `typeof window !== 'undefined'`.

---

## 3. Database & Security Standards (Supabase)

1. **Client Separation:**
   - `supabase`: Public client using `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Used exclusively for client-side auth state (`supabase.auth`) and safe public inserts allowed by RLS.
   - `supabaseAdmin`: Used strictly in Server Actions on the server runtime.
2. **Authorization Guards:**
   - Any administrative action (`getInquiries`, `updateInquiryOperations`, `deleteInquiry`) MUST authenticate the incoming JWT token against Supabase Auth:
     ```typescript
     const { data: { user }, error: authError } = await supabase.auth.getUser(token);
     if (authError || !user || user.email !== "rohitsingh0641346@gmail.com") {
       return { success: false, error: "Unauthorized access." };
     }
     ```
   - Never trust user identity passed directly in a client parameter without verifying the cryptographically signed JWT.
3. **SQL Injection & Data Integrity:**
   - Only use Supabase SDK parameterized query builders. Raw unescaped strings in queries are prohibited.
   - Phone numbers must be normalized (10-digit Indian standard, stripping whitespace and `+91` prefix when storing).

---

## 4. UI, Styling & Tailwind CSS v4 Rules

1. **Tailwind v4 Native Config:**
   - This project uses Tailwind CSS v4 with `@import "tailwindcss";` and `@theme` definitions in `src/app/globals.css`.
   - Do **NOT** create a legacy `tailwind.config.js` or `tailwind.config.ts`. All custom theme tokens must be registered in `src/app/globals.css` under `@theme`.
2. **Color Palette Invariants:**
   - Primary Brand Color: Royal Blue (`#1e3a8a`, `--color-primary-800` / `--color-primary-900`).
   - Accent & Action Color: Vibrant Orange (`#f97316`, `--color-accent-500`).
   - Success: Emerald Green (`#10b981`).
   - Warning/Attention: Amber (`#f59e0b`).
   - Error: Crimson Red (`#ef4444`).
3. **No Horizontal Overflow:**
   - All page layouts must maintain `max-w-full overflow-x-hidden`.
   - Avoid fixed pixel widths (`w-[600px]`) that break on mobile viewports (iPhone SE 375px or small Android 360px). Always use responsive classes (`w-full max-w-xl`).
4. **Touch Targets & Mobile Usability:**
   - Minimum interactive button/touch target size must be at least `44px x 44px` on mobile.
   - Form inputs must have minimum font-size of `16px` (`text-base`) on mobile to prevent iOS Safari auto-zoom.

---

## 5. Localization & Cultural Adaptation Rules

1. **Bilingual Dual-Text Requirement:**
   - All user-facing UI elements, labels, place names, and status badges must support both Hindi (`hi`) and English (`en`) via `useLanguage()` hook.
   - Default language is Hindi (`hi`), honoring the core Varanasi and Purvanchal user demographic.
   - WhatsApp message templates must default to polite, clear Hindi/Hinglish with English headers.

2. **Hyperlocal Context Sensitivity:**
   - Varanasi landmark recognition (Godowlia, Lanka, BHU, Cantt, Chowk, Shivpur, Babatpur, Sarnath, Pandeypur, Ramnagar, etc.) must remain accurate in all dropdowns and route matrices.
   - Vehicle nomenclature must use local naming (e.g., *छोटा हाथी (Tata Ace)*, *3-व्हीलर लोडर*, *पिकअप*).

---

## 6. Code Cleanliness & Quality Guardrails

1. **TypeScript Strictness:**
   - No `any` type escapes when explicit types can be modeled.
   - Interface all data transfer objects (DTOs), form states, and API responses.
2. **Dead Code Elimination:**
   - Do not leave unused imports, orphaned CSS classes, or commented-out blocks of historical code.
3. **Zero Console Spam:**
   - Only log unexpected errors (`console.error`) with actionable debug context in server actions. Remove stray `console.log` statements from production code.
