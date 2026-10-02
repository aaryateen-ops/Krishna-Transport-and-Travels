# 🚫 AI Agent Restrictions & Anti-Patterns Policy (AI_RESTRICTIONS.md)
## Krishna Transport & Travels

**Audience:** All AI Coding Assistants, LLMs, Agents, and Autocomplete Tools  
**Governing Authority:** Principal Full Stack Engineer (Google / Meta / Microsoft Quality Standard)  
**Status:** ABSOLUTE MANDATE — ZERO COMPROMISE

---

## 1. Core Mandate

When an AI assistant works on this codebase, it must act as a **20+ Year Experienced Principal Full Stack Engineer**. Typical lazy AI coding practices, superficial edits, destructive rewrites, and half-baked implementations are **STRICTLY FORBIDDEN**.

---

## 2. Forbidden AI Behaviors (Strictly Prohibited)

### ❌ 1. No Lazy Placeholders or Partial Code ("The Stubbing Sin")
- **NEVER** write:
  - `// TODO: Implement later`
  - `// ... rest of the component remains the same`
  - `// Existing logic here`
  - `/* Add your styling here */`
  - Mock handlers like `onClick={() => console.log('clicked')}` when a real action is required.
- **Rule:** Every piece of code generated must be 100% complete, runnable, fully typed, and production-ready.

### ❌ 2. No Destructive Overwrites or Erasing Working Features
- **NEVER** replace a large existing file with a trimmed, summarized, or simplified version.
- **NEVER** accidentally remove:
  - SEO Meta tags or Schema.org JSON-LD scripts in `layout.tsx`.
  - Bilingual Hindi/English dictionary items.
  - Form validation rules or error toasts.
  - WhatsApp redirection logic or tracking URL generation.
  - Supabase JWT authentication verifications in admin/dashboard pages.
- **Rule:** Use surgical, targeted edits (`replace_file_content`). Inspect line ranges before editing to ensure context is fully preserved.

### ❌ 3. No Breaking Existing UI / Design System
- **NEVER** modify or overwrite the established design system without explicit user consent:
  - Primary Royal Blue (`#1e3a8a`), Action Orange (`#f97316`).
  - Google Fonts `Outfit` and `Inter`.
  - Established button styles, card layouts, shadows, and rounded corners.
- **NEVER** introduce inline styles (`style={{ ... }}`) when Tailwind CSS classes should be used.
- **NEVER** introduce Tailwind v3 configurations (`tailwind.config.js`). This project is built on **Tailwind CSS v4** using `@theme` in `src/app/globals.css`.

### ❌ 4. No Mobile Responsive Ignorance ("Desktop Only" Trap)
- Most customers of Krishna Transport use budget Android phones on 4G networks in Varanasi.
- **NEVER** use fixed pixel widths (`w-[500px]`, `w-[800px]`) that cause horizontal scrolling on mobile screens.
- **NEVER** create touch targets smaller than 44x44px.
- **NEVER** design a desktop-only table without a responsive mobile card fallback (see `/admin` and `/dashboard`).
- **Rule:** Mobile responsiveness is a first-class requirement, not an afterthought.

### ❌ 5. No Hallucinated Libraries or Bloated Dependencies
- **NEVER** run `npm install` for third-party libraries (e.g., Axios, Lodash, Moment.js, Bootstrap, Material UI, Shadcn CLI) when native browser APIs or existing libraries (`lucide-react`, native `fetch`, native `Date`, `@supabase/supabase-js`) suffice.
- **Rule:** Keep the dependency tree lean. Do not introduce dependencies without prior user approval.

### ❌ 6. No Silent Failures or Ignored Errors
- **NEVER** write empty catch blocks: `catch (e) {}`.
- **NEVER** fail to inform the user when an API call fails.
- **Rule:** Every asynchronous operation must have a visible error state, toast, or banner in the UI and clear logging on the server.

### ❌ 7. No Breaking Supabase Security & RLS
- **NEVER** bypass RLS carelessly by exposing `service_role` keys on the client-side.
- **NEVER** remove JWT verification checks in Server Actions.
- **NEVER** enable public read on sensitive customer tables (`inquiries`) containing personal phone numbers and home addresses.

### ❌ 8. No Unverified "Done" Claims
- **NEVER** tell the user "I have completed the task and everything is working" without:
  1. Checking syntax and types.
  2. Verifying Next.js compile status or running `npm run lint`.
  3. Verifying that the dev server is alive and free of Turbopack errors.

---

## 3. Mandatory AI Workflow Protocol

Before completing any task, every AI agent MUST execute this mental checklist:

```
[ ] 1. Did I read existing code and understand all dependencies before editing?
[ ] 2. Are all functions and components 100% complete without placeholders or TODOs?
[ ] 3. Did I preserve both Hindi and English language support?
[ ] 4. Does the UI look flawless and responsive on mobile (360px) as well as desktop (1440px)?
[ ] 5. Did I avoid adding unneeded npm packages?
[ ] 6. Is the Next.js dev server compiling cleanly with zero errors?
[ ] 7. Did I update TASK.md and MEMORY.md if milestones or state changed?
```

Any response or code generation that fails to adhere to these rules is considered a **critical defect**.
