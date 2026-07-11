'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 border-t border-stone-900 pt-16 pb-8 px-6 text-stone-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* About section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Angel Tiles Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="font-serif text-base tracking-widest text-white uppercase font-medium">
                Angel
              </span>
              <span className="text-[8px] tracking-[0.25em] text-stone-500 uppercase -mt-1">
                Tiles & Stone Studio
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-stone-500 mt-2">
            Elevating Jodhpur's architectures with premium Italian marbles, dense granites, large-format vitrified tiles, and designer sanitaryware. Experience materials virtually in your room before you buy.
          </p>
        </div>

        {/* Categories Link */}
        <div className="flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Collections</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <Link href="/collections/marble" className="hover:text-gold-400 transition-colors">
                Luxury Marble (Indian & Italian)
              </Link>
            </li>
            <li>
              <Link href="/collections/granite" className="hover:text-gold-400 transition-colors">
                High-Density Granite Slabs
              </Link>
            </li>
            <li>
              <Link href="/collections/tiles" className="hover:text-gold-400 transition-colors">
                Vitrified & Ceramic Tiles
              </Link>
            </li>
            <li>
              <Link href="/collections/sanitaryware" className="hover:text-gold-400 transition-colors">
                Designer Sanitaryware
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact details */}
        <div className="flex flex-col gap-4 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Showroom Contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-3">
              <a 
                href="https://wa.me/919876543210?text=Hi%20Angel%20Tiles,%20I%20am%20interested%20in%20your%20stone%20collection." 
                className="flex items-center gap-2 hover:text-gold-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>+91 98765 43210 (WhatsApp)</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400" />
                <span>info@angeltilesandstone.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>10:00 AM - 8:30 PM (Sunday Closed)</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-semibold text-white">Angel Tiles & Stone Studio</span>
                <span className="text-stone-500 leading-normal mt-1">
                  Plot No. 12, Industrial Area, Opposite New Mandi, Mandore Road, Jodhpur, Rajasthan, 342007
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-stone-600">
        <div>
          © {currentYear} Angel Tiles & Stone Studio. All Rights Reserved.
        </div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-stone-400 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <a 
            href="https://buildblock.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-gold-400 transition-colors"
          >
            Developed by BuildBlock
          </a>
        </div>
      </div>
    </footer>
  );
}
