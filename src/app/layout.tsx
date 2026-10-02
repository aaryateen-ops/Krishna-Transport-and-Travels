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
  metadataBase: new URL("https://www.krishnatransports.com"),
  alternates: {
    canonical: "https://www.krishnatransports.com",
  },
  title: {
    default: "कृष्णा ट्रांसपोर्ट वाराणसी | टेम्पो बुकिंग, छोटा हाथी & घर शिफ्टिंग",
    template: "%s | कृष्णा ट्रांसपोर्ट वाराणसी",
  },
  description: "वाराणसी और पूर्वांचल में टेम्पो, छोटा हाथी (टाटा मैजिक), पिकअप और घर/दुकान शिफ्टिंग के लिए सबसे सस्ती व सुरक्षित ट्रांसपोर्ट सर्विस। किराया सिर्फ ₹600 से शुरू। 24/7 तुरंत बुकिंग।",
  keywords: [
    // Top High-Intent Core Searches
    "Tempo Service in Varanasi",
    "Chhota Hathi Varanasi",
    "Chhota Hathi Booking Varanasi",
    "Tata Ace Booking Varanasi",
    "House Shifting in Varanasi",
    "Packers and Movers in Varanasi",
    "Tempo Bhada Varanasi",
    "Mini Truck Booking in Varanasi",
    "Pickup Service in Varanasi",
    "Goods Transport in Varanasi",
    "Porter Alternative in Varanasi",
    "Porter Tempo in Varanasi",
    
    // Hindi & Devanagari Search Queries
    "कृष्णा ट्रांसपोर्ट वाराणसी",
    "वाराणसी टेम्पो भाड़ा",
    "छोटा हाथी बुकिंग बनारस",
    "टाटा मैजिक भाड़ा वाराणसी",
    "घर का सामान शिफ्टिंग बनारस",
    "सस्ता ट्रांसपोर्ट वाराणसी",
    "पिकअप गाड़ी भाड़ा बनारस",
    "कम खर्चे में घर शिफ्टिंग",
    
    // Specific Use Cases
    "Furniture Shifting with Labour Varanasi",
    "BHU Room Shifting Varanasi",
    "Student Hostel Shifting Varanasi",
    "Paharia Mandi Goods Transport",
    "Visheshwarganj Commercial Freight",
    "Sabji Mandi Tempo Delivery Varanasi",
    "Waterproof Tarpaulin Tempo Varanasi",
    
    // Local Varanasi Hubs
    "Tempo booking Lanka Varanasi",
    "Goods auto Sigra Godowlia Chowk",
    "Tempo near Cantt Railway Station",
    "Mini truck Shivpur Pandeypur",
    "Transport service Ramnagar Babatpur",
    
    // Purvanchal Regional Highways
    "Varanasi to Azamgarh Mini Truck",
    "Varanasi to Mirzapur Transport",
    "Varanasi to Chandauli Mughalsarai Tempo",
    "Varanasi to Jaunpur Ghazipur Mau Cargo"
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
    url: "https://www.krishnatransports.com",
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
      "@id": "https://www.krishnatransports.com/#business",
      "name": "कृष्णा ट्रांसपोर्ट वाराणसी (Krishna Transport and Travels)",
      "alternateName": [
        "Krishna Transport Varanasi",
        "Krishna Travels Salarpur",
        "Krishna Transport & Travel Management"
      ],
      "url": "https://www.krishnatransports.com",
      "logo": "https://www.krishnatransports.com/logo.png",
      "image": "https://www.krishnatransports.com/og_banner.png",
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
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "180",
        "bestRating": "5",
        "worstRating": "1"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Transport & Shifting Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "छोटा हाथी (टाटा एस) बुकिंग - Chhota Hathi Rental",
              "description": "घर शिफ्टिंग और 1.2 टन तक व्यापारिक माल के लिए टाटा एस छोटा हाथी बुकिंग।"
            },
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "750.00",
              "priceCurrency": "INR"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "3-व्हीलर लोकल पिकअप लोडर - Mahindra Alfa 3-Wheeler",
              "description": "वाराणसी की संकरी गलियों, हॉस्टल रूम और 500 KG तक सामान के लिए 15 मिनट में लोडर।"
            },
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "600.00",
              "priceCurrency": "INR"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "घर शिफ्टिंग सर्विस (लेबर/पल्लेदार सहायता के साथ) - House Shifting",
              "description": "डबल बेड, फ्रिज, अलमारी और सोफा सुरक्षित शिफ्टिंग वाटरप्रूफ तिरपाल और हेल्पर के साथ।"
            },
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "750.00",
              "priceCurrency": "INR"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "व्यापारिक व सब्जी मंडी माल सप्लाई - Mandi Freight Logistics",
              "description": "विशेश्वरगंज और पहड़िया मंडी से थोक माल व क्रेट्स की नियमित सुरक्षित सप्लाई।"
            },
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "650.00",
              "priceCurrency": "INR"
            }
          }
        ]
      },
      "description": "वाराणसी में टेम्पो, टाटा मैजिक (छोटा हाथी), पिकअप और घर/दुकान का सामान सुरक्षित शिफ्ट करने के लिए सबसे भरोसेमंद ट्रांसपोर्ट सर्विस।"
    },
    {
      "@type": "WebSite",
      "@id": "https://www.krishnatransports.com/#website",
      "url": "https://www.krishnatransports.com",
      "name": "कृष्णा ट्रांसपोर्ट वाराणसी",
      "description": "वाराणसी और पूर्वांचल में ऑनलाइन टेम्पो बुकिंग & शिफ्टिंग सर्विस",
      "publisher": {
        "@id": "https://www.krishnatransports.com/#business"
      },
      "inLanguage": "hi"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.krishnatransports.com/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "क्या सामान चढ़ाने और उतारने के लिए लेबर (पल्लेदार / हेल्पर) भी मिलेगा?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "हाँ, बिल्कुल! बुकिंग करते समय आप बता सकते हैं कि आपको कितने हेल्पर चाहिए। पहली, दूसरी या तीसरी मंजिल पर बिना लिफ्ट के भारी सामान (डबल बेड, अलमारी, फ्रिज) चढ़ाने या उतारने के लिए हेल्पर की उचित मजदूरी फोन पर पहले ही तय कर दी जाती है।"
          }
        },
        {
          "@type": "Question",
          "name": "बनारस के भीड़-भाड़ वाले बाजारों (चौक, गोदौलिया, विशेश्वरगंज) में नो-एंट्री का क्या समय है?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "बड़े ट्रकों पर दिन में पाबंदी रहती है, लेकिन हमारे 3-व्हीलर लोडर (महिंद्रा अल्फा) और छोटा हाथी संकरी गलियों में सुबह और दोपहर के तय स्लॉट्स में आसानी से निकल जाते हैं। थोक व्यापारिक माल के लिए अधिकांश व्यापारी सुबह 4:00 से 8:00 बजे या रात 10:00 बजे के बाद डिलीवरी कराते हैं।"
          }
        },
        {
          "@type": "Question",
          "name": "बारिश में सोफा, गद्दे या इलेक्ट्रॉनिक सामान भीगने से कैसे सुरक्षित रहते हैं?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "हमारी सभी गाड़ियों (अल्फा, टाटा एस, पिकअप) में मजबूत वाटरप्रूफ तिरपाल (Heavy-Duty Tarpaulin) और सुरक्षित रस्सियां 24 घंटे उपलब्ध रहती हैं। बारिश के दिनों में सामान को डबल तिरपाल से कसकर बांधा जाता है जिससे पानी या खरोंच की कोई गुंजाइश नहीं रहती।"
          }
        },
        {
          "@type": "Question",
          "name": "किराया कब देना होता है — बुकिंग के समय एडवांस या माल पहुँचने पर?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "लोकल बनारस बुकिंग में कोई एडवांस नहीं लिया जाता! आपका सामान जब सुरक्षित ड्रॉप लोकेशन पर उतर जाता है और आप संतुष्ट हो जाते हैं, तब आप तय किराया सीधे ड्राइवर को नकद (Cash) या UPI (Google Pay, PhonePe, Paytm) से दे सकते हैं।"
          }
        },
        {
          "@type": "Question",
          "name": "अगर मुझे शिफ्टिंग की तारीख बदलनी हो या बुकिंग रद्द करनी हो तो क्या चार्ज लगेगा?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "गाड़ी आपके पिकअप पॉइंट पर पहुँचने से पहले बुकिंग कैंसल करना या समय बदलना 100% निःशुल्क है। अगर आपका प्लान बदलता है, तो बस एक बार फोन या व्हाट्सएप पर सूचित कर दें।"
          }
        },
        {
          "@type": "Question",
          "name": "क्या आप वाराणसी से आज़मगढ़, मऊ, मिर्ज़ापुर, चंदौली या जौनपुर के लिए भी गाड़ियाँ भेजते हैं?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "जी हाँ! पूरे पूर्वांचल (Eastern UP) के सभी जिलों के लिए हमारे पास हाईवे-अनुभवी ड्राइवर और गाड़ियाँ उपलब्ध हैं। पूर्वांचल लिंक एक्सप्रेसवे, GT Road (NH 19) और NH 233 के जरिए उसी दिन माल सुरक्षित पहुँचाने की गारंटी दी जाती है।"
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.krishnatransports.com/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "होम (Home)",
          "item": "https://www.krishnatransports.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "गाड़ी ट्रैक करें (Track Booking)",
          "item": "https://www.krishnatransports.com/track"
        }
      ]
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
