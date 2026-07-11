import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";

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
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full flex flex-col font-sans bg-stone-950 text-stone-100 overflow-x-hidden selection:bg-gold-500 selection:text-black">
        {/* Grain static overlay */}
        <div className="grain-overlay" />
        
        {/* Custom cursor element */}
        <CustomCursor />
        
        {/* Smooth Scroll Wrapper */}
        <LenisProvider>
          <div className="flex flex-col flex-1 relative z-10">
            {children}
          </div>
        </LenisProvider>
      </body>
    </html>
  );
}
