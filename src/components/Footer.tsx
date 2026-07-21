'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo('.footer-col',
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 92%',
        }
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="bg-stone-950 border-t border-stone-900 pt-16 pb-8 px-6 text-stone-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* About section */}
        <div className="footer-col flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full border border-garnet-500/30 bg-stone-900 overflow-hidden flex items-center justify-center p-1">
              <Image 
                src="/logo.png" 
                alt="Angel Tiles Logo" 
                width={28} 
                height={28} 
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-base tracking-widest text-silver-100 uppercase font-medium">
                Angel
              </span>
              <span className="text-[8px] tracking-[0.25em] text-stone-500 uppercase -mt-1">
                Tiles & Stone Studio
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-stone-400 mt-2">
            Elevating Jodhpur's architecture with premium Italian marble, dense granite, large-format vitrified tiles, and designer sanitaryware. Experience materials virtually in your room before you buy.
          </p>
          <div className="flex items-center gap-3 mt-1 text-[10px] uppercase tracking-wider font-semibold">
            <a 
              href="https://instagram.com/angeltilesandstone" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-garnet-400 transition-colors text-silver-300"
              data-cursor="explore"
            >
              Instagram
            </a>
            <span className="text-stone-700">•</span>
            <a 
              href="https://facebook.com/angeltilesandstone" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-garnet-400 transition-colors text-silver-300"
              data-cursor="explore"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Categories Link */}
        <div className="footer-col flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-silver-100">Collections</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <Link href="/collections/imported-marble" className="hover:text-garnet-400 transition-colors text-stone-400" data-cursor="explore">
                Imported Marble
              </Link>
            </li>
            <li>
              <Link href="/collections/domestic-marble" className="hover:text-garnet-400 transition-colors text-stone-400" data-cursor="explore">
                Domestic Marble
              </Link>
            </li>
            <li>
              <Link href="/collections/granite" className="hover:text-garnet-400 transition-colors text-stone-400" data-cursor="explore">
                High-Density Granite
              </Link>
            </li>
            <li>
              <Link href="/collections/tiles" className="hover:text-garnet-400 transition-colors text-stone-400" data-cursor="explore">
                Vitrified & Architectural Tiles
              </Link>
            </li>
            <li>
              <Link href="/collections/sanitary-items" className="hover:text-garnet-400 transition-colors text-stone-400" data-cursor="explore">
                Designer Sanitary Items
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact details */}
        <div className="footer-col flex flex-col gap-4 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-silver-100">Showroom Contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">Main Studio Contact (Sekhar Ji)</span>
                <a 
                  href="https://wa.me/919929548511?text=Hi%20Angel%20Tiles%20%26%20Stone%20Studio%20Jodhpur,%20I%20am%20enquiring%20about%20slabs." 
                  className="flex items-center gap-2 hover:text-garnet-400 transition-colors text-silver-100 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="chat"
                >
                  <Phone className="w-4 h-4 text-garnet-400" />
                  <span>+91 99295 48511</span>
                </a>
              </div>

              <div className="flex flex-col gap-1 mt-1">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">Direct Sourcing (Sanjeev Sharma Ji)</span>
                <a 
                  href="https://wa.me/919928700997?text=Hi%20Sanjeev%20Ji,%20I%20am%20interested%20in%20your%20marble%20and%20granite%20slabs." 
                  className="flex items-center gap-2 hover:text-garnet-400 transition-colors text-silver-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="chat"
                >
                  <Phone className="w-4 h-4 text-stone-500" />
                  <span>+91 99287 00997</span>
                </a>
              </div>

              <a 
                href="mailto:angeltilesju@gmail.com"
                className="flex items-center gap-2 hover:text-garnet-400 transition-colors text-silver-200 mt-1"
              >
                <Mail className="w-4 h-4 text-garnet-400" />
                <span>angeltilesju@gmail.com</span>
              </a>
              <div className="flex items-center gap-2 text-stone-400 mt-0.5">
                <Clock className="w-4 h-4 text-garnet-400" />
                <span>10:00 AM – 6:00 PM (Monday – Sunday)</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-garnet-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-semibold text-silver-100">Angel Tiles & Stone Studio</span>
                <span className="text-stone-400 leading-normal mt-1 text-[11px]">
                  Krishna Kunj, 197, Pipli Chouraha, Shankar Nagar, Bhadu Market, Jodhpur, Rajasthan 342008
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-stone-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-wider text-stone-500">
        <div>
          © {currentYear} Angel Tiles & Stone Studio. All Rights Reserved.
        </div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-silver-300 transition-colors">Privacy Policy</Link>
          <span>•</span>
          <a 
            href="https://buildblock.in" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-garnet-400 transition-colors"
          >
            Developed by BuildBlock
          </a>
        </div>
      </div>
    </footer>
  );
}
