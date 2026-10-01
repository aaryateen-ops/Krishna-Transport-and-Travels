import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import Script from "next/script";
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
  alternates: {
    canonical: "https://krishnatransports.com",
  },
  title: {
    default: "कृष्णा ट्रांसपोर्ट वाराणसी | टेम्पो बुकिंग, छोटा हाथी & घर शिफ्टिंग",
    template: "%s | कृष्णा ट्रांसपोर्ट वाराणसी",
  },
  description: "वाराणसी और पूर्वांचल में टेम्पो, छोटा हाथी (टाटा मैजिक), पिकअप और घर/दुकान शिफ्टिंग के लिए सबसे सस्ती व सुरक्षित ट्रांसपोर्ट सर्विस। किराया सिर्फ ₹600 से शुरू। 24/7 तुरंत बुकिंग।",
  keywords: [
    "Tempo Service in Varanasi",
    "Pickup Service in Varanasi",
    "House Shifting in Varanasi",
    "Mini Truck Booking in Varanasi",
    "Goods Transport in Varanasi",
    "Varanasi Transport Services",
    "Chhota Hathi Varanasi",
    "Tata Ace Booking Varanasi",
    "Household shifting Azamgarh Chandauli Mirzapur Bhadohi",
    "Local transport Varanasi",
    "Tempo rental Varanasi",
    "कृष्णा ट्रांसपोर्ट वाराणसी",
    "वाराणसी टेम्पो भाड़ा"
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
  verification: {
    google: "CNh9DXgwKoAPaGvGGtz23gAXeDXsT1E_8ZtsFHxNAGE",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "कृष्णा ट्रांसपोर्ट वाराणसी | टेम्पो बुकिंग, छोटा हाथी & घर शिफ्टिंग",
    description: "वाराणसी और आस-पास के जिलों में घर का सामान, दुकान का फर्नीचर या कोई भी पार्सल भेजें। टेम्पो या छोटा हाथी ऑनलाइन बुक करें और लाइव ट्रैक करें। किराया सिर्फ ₹600 से शुरू।",
    url: "https://krishnatransports.com",
    siteName: "कृष्णा ट्रांसपोर्ट",
    locale: "hi_IN",
    type: "website",
    images: [
      {
        url: "/og_banner.png",
        width: 1200,
        height: 630,
        alt: "कृष्णा ट्रांसपोर्ट वाराणसी - ऑनलाइन टेम्पो बुकिंग और लाइव ट्रैकिंग",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "कृष्णा ट्रांसपोर्ट वाराणसी | ऑनलाइन टेम्पो बुकिंग & शिफ्टिंग सर्विस",
    description: "वाराणसी और आस-पास के जिलों में सामान भेजें। गाड़ी ऑनलाइन बुक करें और लाइव ट्रैक करें। किराया ₹600 से शुरू।",
    images: ["/og_banner.png"],
  }
};

export const viewport: Viewport = {
  themeColor: "#1e3a8a",
  width: "device-width",
  initialScale: 1,
};

const jsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["LocalBusiness", "MovingCompany"],
      "@id": "https://krishnatransports.com/#business",
      "name": "कृष्णा ट्रांसपोर्ट वाराणसी (Krishna Transport and Travels)",
      "alternateName": [
        "Krishna Transport Varanasi",
        "Krishna Travels Salarpur",
        "Krishna Transport & Travel Management"
      ],
      "url": "https://krishnatransports.com",
      "logo": "https://krishnatransports.com/logo.png",
      "image": "https://krishnatransports.com/og_banner.png",
      "telephone": "+917080360217",
      "priceRange": "₹600 - ₹5000",
      "currenciesAccepted": "INR",
      "paymentAccepted": "Cash, UPI",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Behind Vidya Vihar Inter College, Salarpur",
        "addressLocality": "Varanasi",
        "addressRegion": "Uttar Pradesh",
        "postalCode": "221007",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.3575,
        "longitude": 83.0125
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "06:00",
          "closes": "22:00"
        }
      ],
      "areaServed": [
        { "@type": "City", "name": "Varanasi" },
        { "@type": "City", "name": "Azamgarh" },
        { "@type": "City", "name": "Chandauli" },
        { "@type": "City", "name": "Mirzapur" },
        { "@type": "City", "name": "Bhadohi" },
        { "@type": "City", "name": "Jaunpur" },
        { "@type": "City", "name": "Ghazipur" },
        { "@type": "City", "name": "Mau" }
      ],
      "founder": {
        "@type": "Person",
        "name": "Rohit Kumar Singh"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+917080360217",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["Hindi", "Bhojpuri", "English"]
      },
      "description": "वाराणसी में टेम्पो, टाटा मैजिक (छोटा हाथी), पिकअप और घर/दुकान का सामान सुरक्षित शिफ्ट करने के लिए सबसे भरोसेमंद ट्रांसपोर्ट सर्विस।"
    },
    {
      "@type": "WebSite",
      "@id": "https://krishnatransports.com/#website",
      "url": "https://krishnatransports.com",
      "name": "कृष्णा ट्रांसपोर्ट वाराणसी",
      "description": "वाराणसी और पूर्वांचल में ऑनलाइन टेम्पो बुकिंग & शिफ्टिंग सर्विस",
      "publisher": {
        "@id": "https://krishnatransports.com/#business"
      },
      "inLanguage": "hi"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="google-site-verification" content="CNh9DXgwKoAPaGvGGtz23gAXeDXsT1E_8ZtsFHxNAGE" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JWG7BYPXSD"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JWG7BYPXSD');
          `}
        </Script>

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
                      console.log('PWA ServiceWorker failed: ', err);
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
