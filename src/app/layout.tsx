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
  metadataBase: new URL("https://krishnatransports.com"),
  title: "कृष्णा ट्रांसपोर्ट वाराणसी | ऑनलाइन गाड़ी बुकिंग & लाइव ट्रैकिंग",
  description: "वाराणसी और आस-पास के जिलों में घर का सामान, दुकान का फर्नीचर या कोई भी पार्सल भेजें। टेम्पो या छोटा हाथी ऑनलाइन बुक करें और लाइव ट्रैक करें। किराया सिर्फ ₹600 से शुरू।",
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
    title: "कृष्णा ट्रांसपोर्ट",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "कृष्णा ट्रांसपोर्ट वाराणसी | ऑनलाइन गाड़ी बुकिंग & लाइव ट्रैकिंग",
    description: "वाराणसी और आस-पास के जिलों में घर का सामान, दुकान का फर्नीचर या कोई भी पार्सल भेजें। टेम्पो या छोटा हाथी ऑनलाइन बुक करें और लाइव ट्रैक करें। किराया सिर्फ ₹600 से शुरू।",
    url: "https://krishna-transport.vercel.app", // placeholder vercel url
    siteName: "कृष्णा ट्रांसपोर्ट",
    locale: "hi_IN",
    type: "website",
    images: [
      {
        url: "/og_banner.png",
        width: 1200,
        height: 630,
        alt: "कृष्णा ट्रांसपोर्ट वाराणसी - ऑनलाइन गाड़ी बुकिंग और लाइव ट्रैकिंग",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "कृष्णा ट्रांसपोर्ट वाराणसी | ऑनलाइन गाड़ी बुकिंग & लाइव ट्रैकिंग",
    description: "वाराणसी और आस-पास के जिलों में सामान भेजें। गाड़ी ऑनलाइन बुक करें और लाइव ट्रैक करें।",
    images: ["/og_banner.png"],
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
