import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";
import PageTransition from "@/components/PageTransition";
import FloatingBooking from "@/components/FloatingBooking";
import WhatsAppButton from "@/components/WhatsAppButton";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Angel Tiles & Stone Studio — Flagship Showroom Jodhpur",
  description: "Exquisite Italian marble, granite, luxury vitrified tiles, and designer sanitaryware in Jodhpur. Preview in your room using our signature Room Visualizer.",
  keywords: [
    "marble suppliers Jodhpur",
    "Italian marble showroom Jodhpur",
    "tiles dealers Jodhpur",
    "sanitaryware showroom Jodhpur",
    "Makrana marble prices Jodhpur",
    "Room Visualizer tiles",
    "Angel Tiles Jodhpur"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased dark ${fontSans.variable} ${fontSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body className={`min-h-full flex flex-col font-sans bg-stone-950 text-silver-100 overflow-x-hidden selection:bg-garnet-500 selection:text-silver-50`}>
        {/* Grain static overlay */}
        <div className="grain-overlay" />
        
        {/* Custom cursor element */}
        <CustomCursor />

        {/* Global Floating Showroom Booking Widget */}
        <FloatingBooking />

        {/* Global Floating WhatsApp Action */}
        <WhatsAppButton />
        
        {/* Smooth Scroll Wrapper */}
        <LenisProvider>
          <div className="flex flex-col flex-1 relative z-10">
            <PageTransition>
              {children}
            </PageTransition>
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}

