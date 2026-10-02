# 🎨 Design System & UI Specifications (DESIGN.md)
## Krishna Transport & Travels

**Design Philosophy:** Trust-Forward, Hyperlocal, High-Contrast & Mobile-First  
**Design Standard:** Google Material 3 / Modern Clean Enterprise  
**Framework:** Tailwind CSS v4 (`@theme`)

---

## 1. Design Philosophy & Regional Grounding

Krishna Transport & Travels serves customers in Varanasi and Eastern Uttar Pradesh. The visual design must evoke:
1. **Unquestioned Trust & Reliability (सुरक्षा और भरोसा):** Royal Deep Blue conveys professional logistics, authority, and safety.
2. **High Energy & Prompt Action (तेज़ सर्विस):** Energetic Orange commands attention for primary conversion triggers (WhatsApp booking, Call Now, Submit Inquiry).
3. **Clarity on Low-End Displays:** High contrast ratios, large legible Hindi typography, generous touch targets for one-handed thumb interaction on mobile devices.

---

## 2. Color Palette & Token Architecture

Defined in `src/app/globals.css` using Tailwind CSS v4 `@theme`:

### 2.1 Primary Brand Palette (Royal Deep Blue)
| Token | Hex Value | Primary Usage |
|---|---|---|
| `--color-primary-50` | `#eff6ff` | Background highlights, soft active states |
| `--color-primary-100` | `#dbeafe` | Light borders, subtle badge backdrops |
| `--color-primary-200` | `#bfdbfe` | Focused borders |
| `--color-primary-600` | `#2563eb` | Secondary buttons, link interactions |
| `--color-primary-700` | `#1d4ed8` | Hover state for primary buttons |
| `--color-primary-800` | `#1e3a8a` | **Primary Brand Color** - Headers, Hero backgrounds |
| `--color-primary-900` | `#1e3a8a` | Deep navigation background |
| `--color-primary-950` | `#0f172a` | Footers, dark mode surfaces |

### 2.2 Accent & Conversion Palette (Vibrant Orange & Green)
| Token / Name | Hex Value | Primary Usage |
|---|---|---|
| `--color-accent-500` | `#f97316` | **Primary CTA Button** (Book Now, Submit), Badges |
| `--color-accent-600` | `#ea580c` | Hover state for Primary CTA |
| `--color-accent-700` | `#c2410c` | Active / Pressed state |
| `WhatsApp Green` | `#25D366` | Instant WhatsApp floating and direct chat buttons |

### 2.3 Status Indicators & Operational Badges
| Status | Background | Text Color | Border Color | Semantic Meaning |
|---|---|---|---|---|
| **Pending** | `bg-amber-50` | `text-amber-700` | `border-amber-200` | Inquiry received, awaiting review |
| **Contacted** | `bg-blue-50` | `text-blue-700` | `border-blue-200` | Team has called customer |
| **Assigned** | `bg-purple-50` | `text-purple-700` | `border-purple-200` | Driver & vehicle allotted |
| **In Transit** | `bg-indigo-50` | `text-indigo-700` | `border-indigo-200` | Goods loaded & vehicle on route |
| **Completed** | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | Delivered & finished |
| **Cancelled** | `bg-rose-50` | `text-rose-700` | `border-rose-200` | Cancelled by customer or admin |

---

## 3. Typography & Font Hierarchy

Configured via `next/font/google`:
- **Display / Heading Font:** `Outfit` (`--font-display`), weights `600`, `700`, `800`.
- **Body / Interface Font:** `Inter` (`--font-sans`), weights `400`, `500`, `600`.

### Type Scale
| Level | Font Family | Size (Desktop / Mobile) | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| **H1 (Hero)** | Outfit | `3rem (48px)` / `2rem (32px)` | 800 (Bold) | Tight (1.15) | Primary Hero title |
| **H2 (Section)** | Outfit | `2.25rem (36px)` / `1.75rem (28px)` | 700 (Bold) | Snug (1.25) | Section headings |
| **H3 (Card Title)** | Outfit | `1.25rem (20px)` / `1.125rem (18px)` | 600 (Semibold) | Normal (1.35) | Fleet & Service cards |
| **Body Large** | Inter | `1.125rem (18px)` / `1rem (16px)` | 400-500 | Relaxed (1.6) | Hero descriptions, subheadings |
| **Body Regular** | Inter | `1rem (16px)` / `0.938rem (15px)` | 400 | Normal (1.5) | Standard content, form labels |
| **Caption / Meta** | Inter | `0.875rem (14px)` / `0.75rem (12px)` | 500 | Snug (1.4) | Timestamps, tracking codes, badges |

---

## 4. UI Components & Patterns

### 4.1 Buttons
- **Primary CTA:** `bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]`
- **Secondary CTA:** `bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 px-5 rounded-xl border border-blue-700/50 shadow-sm transition-all`
- **WhatsApp Action:** `bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2`
- **Ghost / Outlined:** `bg-white hover:bg-slate-50 text-slate-700 font-semibold py-2.5 px-4 rounded-xl border border-slate-200 transition-all`

### 4.2 Form Controls
- **Inputs & Selects:**
  ```css
  w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 
  placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent 
  transition-all text-base
  ```
  *(Crucial: 16px base font prevents iOS mobile zoom).*
- **Labels:** Semibold slate-700 text-sm mb-1.5 with red asterisk for mandatory fields.

### 4.3 Cards & Containers
- Standard Card: `bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6`
- Interactive Highlight Card: `bg-white rounded-2xl border-2 border-blue-600/20 shadow-md p-6`

### 4.4 Iconography
- Uses `lucide-react` exclusively.
- Consistent optical bounding boxes: standard icons `w-5 h-5` or `w-6 h-6`.
- Accent icons wrapped in soft circular backgrounds: `w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center`.

---

## 5. Responsive Layout & Breakpoints

| Breakpoint | Width Range | Layout Strategy |
|---|---|---|
| **Mobile (`< 640px`)** | 320px - 639px | Single column, sticky bottom CTA bar, full-width modals, stacked cards |
| **Tablet (`sm` & `md`)** | 640px - 1023px | 2-column grids for services, compact tables with horizontal scroll |
| **Desktop (`lg` & `xl`)** | 1024px - 1536px | Multi-column layouts (3-4 cols), sidebar admin navigation, hero 2-col split |
| **Max Content Width** | `max-w-7xl (1280px)` | Centered container with `mx-auto px-4 sm:px-6 lg:px-8` |

---

## 6. Accessibility & Motion Guidelines

1. **Accessibility (WCAG 2.1 AA):**
   - High text contrast across all backgrounds (`#1e3a8a` on white gives a 12.6:1 contrast ratio, far exceeding the 4.5:1 requirement).
   - All interactive icons have associated accessible labels or sibling text.
2. **Micro-Interactions & Animation:**
   - Soft pulsing ring on priority CTA: `--animate-pulse-ring` in `globals.css`.
   - Hover scale transitions limited to subtle `scale-[1.02]`.
   - Smooth scrolling enabled natively on the `html` element.
