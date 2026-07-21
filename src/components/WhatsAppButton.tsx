'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, X, ExternalLink } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [showTooltip, setShowTooltip] = useState(false);

  // Hide on visualizer to avoid cluttering canvas controls
  if (pathname === '/visualize') return null;

  const mainWaUrl = "https://wa.me/919929548511?text=Hi%20Angel%20Tiles%20%26%20Stone%20Studio%20Jodhpur,%20I%20am%20interested%20in%20your%20collection.";
  const sanjeevWaUrl = "https://wa.me/919928700997?text=Hi%20Sanjeev%20Ji,%20I%20am%20enquiring%20about%20stone%20slabs%20at%20Angel%20Studio.";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      
      {/* Interactive Popover Card on Hover/Click */}
      {showTooltip && (
        <div className="mb-3 w-72 bg-stone-900/95 border border-stone-800 backdrop-blur-xl rounded-2xl p-4 shadow-2xl text-xs flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-silver-100 uppercase text-[10px] tracking-wider">Studio Live WhatsApp</span>
            </div>
            <button 
              onClick={() => setShowTooltip(false)}
              className="text-stone-400 hover:text-white transition-colors"
              aria-label="Close popup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-stone-300 leading-relaxed">
            Chat directly with our showroom team for instant slab quotes & availability.
          </p>

          <div className="flex flex-col gap-2 pt-1">
            <a
              href={mainWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition-colors font-medium text-[11px]"
            >
              <div className="flex flex-col">
                <span className="font-bold text-silver-100">Sekhar Ji (Main Line)</span>
                <span className="text-[10px] text-stone-400">+91 99295 48511</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>

            <a
              href={sanjeevWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-silver-200 transition-colors font-medium text-[11px]"
            >
              <div className="flex flex-col">
                <span className="font-bold text-silver-100">Sanjeev Sharma Ji</span>
                <span className="text-[10px] text-stone-400">+91 99287 00997</span>
              </div>
              <Phone className="w-3.5 h-3.5 shrink-0 text-garnet-400" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Pill Button */}
      <div className="flex items-center gap-2">
        <a
          href={mainWaUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          aria-label="Chat on WhatsApp"
          data-cursor="chat"
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-2xl shadow-emerald-950/60 border border-emerald-400/30 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 group"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
          </span>
          <MessageCircle className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300 fill-white/20" />
          <span className="hidden sm:inline">WhatsApp Enquiry</span>
        </a>
      </div>
    </div>
  );
}

