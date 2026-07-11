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
          <div className="flex items-center gap-3 mt-1 text-[10px] uppercase tracking-wider font-semibold">
            <a 
              href="https://instagram.com/angeltilesandstone" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gold-400 transition-colors"
              data-cursor="explore"
            >
              Instagram
            </a>
            <span className="text-stone-800">•</span>
            <a 
              href="https://facebook.com/angeltilesandstone" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-gold-400 transition-colors"
              data-cursor="explore"
            >
              Facebook
            </a>
          </div>
        </div>

        {/* Categories Link */}
        <div className="footer-col flex flex-col gap-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Collections</h4>
          <ul className="flex flex-col gap-2.5 text-xs">
            <li>
              <Link href="/collections/marble" className="hover:text-gold-400 transition-colors" data-cursor="explore">
                Luxury Marble (Indian & Italian)
              </Link>
            </li>
            <li>
              <Link href="/collections/granite" className="hover:text-gold-400 transition-colors" data-cursor="explore">
                High-Density Granite Slabs
              </Link>
            </li>
            <li>
              <Link href="/collections/tiles" className="hover:text-gold-400 transition-colors" data-cursor="explore">
                Vitrified & Ceramic Tiles
              </Link>
            </li>
            <li>
              <Link href="/collections/sanitaryware" className="hover:text-gold-400 transition-colors" data-cursor="explore">
                Designer Sanitaryware
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact details */}
        <div className="footer-col flex flex-col gap-4 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-widest text-white">Showroom Contact</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-3">
              <a 
                href="https://wa.me/918147941542?text=Hi%20Angel%20Tiles,%20I%20am%20interested%20in%20your%20stone%20collection." 
                className="flex items-center gap-2 hover:text-gold-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="chat"
              >
                <Phone className="w-4 h-4 text-gold-400" />
                <span>+91 81479 41542 (WhatsApp)</span>
              </a>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400" />
                <span>info@angeltilesandstone.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>8:00 AM - 11:00 PM (Monday - Sunday)</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-semibold text-white">Angel Tiles & Stone Studio</span>
                <span className="text-stone-500 leading-normal mt-1 text-[11px]">
                  Krishna Kunj, 197, Pipli Chouraha, Shankar Nagar, Bhadu Market, Jodhpur, Rajasthan 342008
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
