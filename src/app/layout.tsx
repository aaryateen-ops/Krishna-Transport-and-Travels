import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Krishna Transport & Travel Management | House Shifting & Tempo Service in Varanasi",
  description: "Fast, trusted, and affordable local household shifting, mini truck/tempo booking, goods transport, and parcel delivery in Varanasi and surrounding districts.",
  keywords: [
    "Tempo Service in Varanasi",
    "Pickup Service in Varanasi",
    "House Shifting in Varanasi",
    "Mini Truck Booking in Varanasi",
    "Goods Transport in Varanasi",
    "Varanasi Transport Services",
    "Household shifting Azamgarh Chandauli Mirzapur Bhadohi",
    "Local transport Varanasi",
    "Tempo rental Varanasi"
  ],
  authors: [{ name: "Rohit Kumar Singh" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Krishna Transport",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "Krishna Transport & Travel Management Varanasi",
    description: "Fast, trusted, and affordable local household shifting, mini truck/tempo booking, goods transport, and parcel delivery in Varanasi.",
    url: "https://krishna-transport.vercel.app", // placeholder vercel url
    siteName: "Krishna Transport",
    locale: "en_IN",
    type: "website",
  }
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        {children}
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('PWA ServiceWorker registered with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('PWA ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
