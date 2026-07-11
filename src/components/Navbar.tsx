'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Collections', href: '/collections' },
    { name: 'Room Visualizer', href: '/visualize' },
    { name: 'About Studio', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-stone-950/65 backdrop-blur-lg border-b border-stone-900">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2 group"
          data-cursor="home"
        >
          <Image 
            src="/logo.png" 
            alt="Angel Tiles & Stone Logo" 
            width={36} 
            height={36} 
            className="object-contain"
          />
          <div className="flex flex-col">
            <span className="font-serif text-lg tracking-widest text-white font-medium uppercase group-hover:text-gold-400 transition-colors">
              Angel
            </span>
            <span className="text-[9px] tracking-[0.25em] text-stone-500 uppercase -mt-1 font-sans">
              Tiles & Stone Studio
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
                  isActive 
                    ? 'text-gold-400 font-bold border-b border-gold-400/50 pb-1' 
                    : 'text-stone-400 hover:text-white'
                }`}
                data-cursor="explore"
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <Link
          href="/visualize"
          className="relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95 shadow-md shadow-gold-500/20"
          data-cursor="try"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>See In Your Space</span>
        </Link>
      </div>
    </header>
  );
}
