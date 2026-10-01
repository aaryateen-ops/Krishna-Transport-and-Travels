import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "बुकिंग स्टेटस ट्रैक करें | कृष्णा ट्रांसपोर्ट वाराणसी",
  description: "अपने संदर्भ कोड (KT-XXXX-XXX) से वाराणसी में टेम्पो, लोडर और सामान डिलीवरी का लाइव स्टेटस और ड्राइवर विवरण ट्रैक करें।",
  alternates: {
    canonical: "https://krishnatransports.com/track",
  },
  openGraph: {
    title: "बुकिंग स्टेटस ट्रैक करें | कृष्णा ट्रांसपोर्ट वाराणसी",
    description: "गाड़ी और ड्राइवर का लाइव स्टेटस आसानी से ट्रैक करें।",
    url: "https://krishnatransports.com/track",
  },
};

export default function TrackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
