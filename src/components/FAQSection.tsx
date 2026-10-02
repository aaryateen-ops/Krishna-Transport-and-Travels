"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, PhoneCall, ShieldCheck, Truck, Clock, Coins } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";

interface FAQSectionProps {
  lang: "hi" | "en";
}

interface FAQItem {
  id: string;
  question: { hi: string; en: string };
  answer: { hi: string; en: string };
  category: "labour" | "timing" | "safety" | "payment" | "policy" | "intercity";
}

const FAQS_DATA: FAQItem[] = [
  {
    id: "faq-1",
    category: "labour",
    question: {
      hi: "क्या सामान चढ़ाने और उतारने के लिए लेबर (पल्लेदार / हेल्पर) भी मिलेगा?",
      en: "Do you provide helpers or labour for loading and unloading?"
    },
    answer: {
      hi: "हाँ, बिल्कुल! बुकिंग करते समय आप बता सकते हैं कि आपको कितने हेल्पर चाहिए। यदि पहली, दूसरी या तीसरी मंजिल पर बिना लिफ्ट के भारी सामान (जैसे डबल बेड, अलमारी, फ्रिज) चढ़ाना या उतारना हो, तो हेल्पर की उचित मजदूरी रोहित भैया से फोन पर पहले ही तय कर दी जाती है ताकि बाद में कोई असमंजस न रहे।",
      en: "Yes, absolutely! While booking, you can mention your helper requirements. If heavy items (double bed, almirah, refrigerator) need to be carried up stairs without an elevator, fair helper charges are confirmed over phone in advance so there are no surprises."
    }
  },
  {
    id: "faq-2",
    category: "timing",
    question: {
      hi: "बनारस के भीड़-भाड़ वाले बाजारों (चौक, गोदौलिया, विशेश्वरगंज) में नो-एंट्री का क्या समय है?",
      en: "What are the commercial no-entry timings in crowded Varanasi markets (Chowk, Godowlia)?"
    },
    answer: {
      hi: "बड़े ट्रकों पर दिन में पाबंदी रहती है, लेकिन हमारे 3-व्हीलर लोडर (महिंद्रा अल्फा) और छोटा हाथी संकरी गलियों में सुबह और दोपहर के तय स्लॉट्स में आसानी से निकल जाते हैं। थोक व्यापारिक माल के लिए अधिकांश व्यापारी सुबह 4:00 से 8:00 बजे या रात 10:00 बजे के बाद डिलीवरी शेड्यूल कराते हैं।",
      en: "While heavy commercial trucks face daytime no-entry restrictions, our compact 3-wheelers (Mahindra Alfa) and Tata Ace mini trucks easily navigate narrow alleys. For wholesale freight, dispatches are typically scheduled early morning (4 AM - 8 AM) or late evening after 10 PM."
    }
  },
  {
    id: "faq-3",
    category: "safety",
    question: {
      hi: "बारिश में सोफा, गद्दे या इलेक्ट्रॉनिक सामान भीगने से कैसे सुरक्षित रहते हैं?",
      en: "How are mattresses, sofas, and electronics protected from rain and dust?"
    },
    answer: {
      hi: "हमारी सभी गाड़ियों (अल्फा, टाटा एस, पिकअप) में मजबूत वाटरप्रूफ तिरपाल (Heavy-Duty Tarpaulin) और सुरक्षित रस्सियां 24 घंटे उपलब्ध रहती हैं। बारिश या धूल-मिट्टी के मौसम में सामान को डबल तिरपाल से कसकर बांधा जाता है जिससे गद्दे या फर्नीचर में पानी या खरोंच की कोई गुंजाइश नहीं रहती।",
      en: "All our fleet vehicles carry heavy-duty waterproof tarpaulins and industrial tie-down ropes round-the-clock. During rains or windy dusty conditions, items are double-wrapped to ensure zero water ingress or dust damage."
    }
  },
  {
    id: "faq-4",
    category: "payment",
    question: {
      hi: "किराया कब देना होता है — बुकिंग के समय एडवांस या माल पहुँचने पर?",
      en: "When is the fare payable — upfront advance or upon successful delivery?"
    },
    answer: {
      hi: "लोकल बनारस बुकिंग में कोई एडवांस नहीं लिया जाता! आपका सामान जब सुरक्षित ड्रॉप लोकेशन पर उतर जाता है और आप संतुष्ट हो जाते हैं, तब आप तय किराया सीधे ड्राइवर को नकद (Cash) या UPI (Google Pay, PhonePe, Paytm) से दे सकते हैं।",
      en: "No upfront deposit is required for intra-city Varanasi bookings! Once your shipment is safely delivered and inspected at the drop location, you pay the agreed fare directly to the driver via UPI (Google Pay, PhonePe, Paytm) or cash."
    }
  },
  {
    id: "faq-5",
    category: "policy",
    question: {
      hi: "अगर मुझे शिफ्टिंग की तारीख बदलनी हो या बुकिंग रद्द करनी हो तो क्या चार्ज लगेगा?",
      en: "Can I reschedule or cancel my booking? Is there any cancellation fee?"
    },
    answer: {
      hi: "गाड़ी आपके पिकअप पॉइंट पर पहुँचने से पहले बुकिंग कैंसल करना या समय बदलना 100% निःशुल्क है। अगर आपका प्लान बदलता है, तो बस एक बार रोहित सिंह को फोन या व्हाट्सएप पर सूचित कर दें।",
      en: "Rescheduling or cancelling your booking is 100% free before the vehicle arrives at your pickup doorstep. If your plans change, simply inform Rohit Singh over phone or WhatsApp with zero penalty."
    }
  },
  {
    id: "faq-6",
    category: "intercity",
    question: {
      hi: "क्या आप वाराणसी से आज़मगढ़, मऊ, मिर्ज़ापुर, चंदौली या जौनपुर के लिए भी गाड़ियाँ भेजते हैं?",
      en: "Do you service inter-district highway routes like Azamgarh, Mau, Mirzapur, or Jaunpur?"
    },
    answer: {
      hi: "जी हाँ! पूरे पूर्वांचल (Eastern UP) के सभी जिलों के लिए हमारे पास हाईवे-अनुभवी ड्राइवर और गाड़ियाँ उपलब्ध हैं। पूर्वांचल लिंक एक्सप्रेसवे, NH 19 (GT Road) और NH 233 के जरिए उसी दिन माल सुरक्षित पहुँचाने की गारंटी दी जाती है।",
      en: "Yes! We operate daily inter-district highway dispatches across Eastern UP with experienced highway drivers ensuring safe, same-day delivery via Purvanchal Link Expressway, GT Road (NH 19), and NH 233."
    }
  }
];

export default function FAQSection({ lang }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFAQ = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-20 sm:py-32 bg-white border-t border-slate-200/60 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-200/60 text-primary-800 text-xs font-bold mb-3 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-primary-700" />
            <span>{lang === "hi" ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}</span>
          </div>

          <h2 className="font-display font-black tracking-tight text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
            {lang === "hi" ? "बुकिंग से पहले मन में कोई सवाल?" : "Got Questions Before Booking?"}
          </h2>

          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {lang === "hi"
              ? "लेबर सहायता, नो-एंट्री नियम, तिरपाल सुरक्षा और किराए के भुगतान से जुड़े आपके सभी सवालों के साफ जवाब।"
              : "Clear, transparent answers about helper support, market no-entry timings, weather protection, and payment terms."}
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-3.5">
          {FAQS_DATA.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-50/80 border-primary-300 shadow-sm ring-1 ring-primary-100"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full py-4.5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className={`font-display font-bold text-sm sm:text-base transition-colors ${
                    isOpen ? "text-primary-900" : "text-slate-900"
                  }`}>
                    {faq.question[lang]}
                  </span>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? "bg-primary-100 text-primary-800 rotate-180" : "bg-slate-100 text-slate-500"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-700 text-xs sm:text-sm leading-relaxed border-t border-slate-200/60">
                    <p>{faq.answer[lang]}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Direct Owner Reassurance Card */}
        <div className="mt-12 bg-gradient-to-br from-primary-900 to-primary-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-accent-400">
              {lang === "hi" ? "कोई अन्य सवाल या खास जरूरत?" : "Have a specific question?"}
            </span>
            <h3 className="font-display font-black text-lg sm:text-xl text-white mt-1">
              {lang === "hi" ? "रोहित सिंह से सीधे बात करें" : "Talk Directly with Rohit Singh"}
            </h3>
            <p className="text-primary-100 text-xs sm:text-sm mt-1 max-w-md">
              {lang === "hi" 
                ? "बिना किसी बिचौलिये के अपनी मंजिल और सामान बताएं, 2 मिनट में सही किराया और गाड़ी फाइनल करें।"
                : "No brokers or automated bots. Discuss your load and destination directly for instant, honest pricing."}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
            <a
              href="tel:7080360217"
              className="flex-1 sm:flex-none px-5 py-3.5 bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>70803 60217</span>
            </a>

            <a
              href="https://wa.me/917071634535?text=%E0%A4%A8%E0%A4%AE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%87%20%E0%A4%B0%E0%A5%8B%E0%A4%B9%E0%A4%BF%E0%A4%A4%20%E0%A4%B8%E0%A4%BF%E0%A4%82%E0%A4%B9%20%E0%A4%9C%E0%A5%80!%20%E0%A4%AE%E0%A5%81%E0%A4%9D%E0%A5%87%20%E0%A4%97%E0%A4%BE%E0%A4%A1%E0%A4%BC%E0%A5%80%20%E0%A4%AC%E0%A5%81%E0%A4%95%E0%A4%BF%E0%A4%82%E0%A4%97%20%E0%A4%95%E0%A5%87%20%E0%A4%AC%E0%A4%BE%E0%A4%B0%E0%A5%87%20%E0%A4%AE%E0%A5%87%E0%A4%82%20%E0%A4%AA%E0%A5%82%E0%A4%9B%E0%A4%A8%E0%A4%BE%20%E0%A4%B9%E0%A5%88%E0%A5%A4"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
