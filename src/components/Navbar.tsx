'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Sparkles, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Hide if scrolling down and scrolled past threshold (and mobile menu is closed)
      if (!isMobileMenuOpen) {
        setHidden(y > lastY.current && y > 120);
      }
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock page scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu if window is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const links = [
    { name: 'Collections', href: '/collections' },
    { name: 'Room Visualizer', href: '/visualize' },
    { name: 'About Studio', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <>
      <header className={`sticky top-0 left-0 right-0 z-50 bg-stone-950/65 backdrop-blur-lg border-b border-stone-900 transition-transform duration-500 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}>
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

          {/* Navigation Links (Desktop) */}
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

          {/* CTA & Hamburger Actions */}
          <div className="flex items-center gap-4">
            {/* CTA Button (Desktop & Tablet) */}
            <Link
              href="/visualize"
              className="hidden sm:inline-flex relative items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 active:scale-95 shadow-md shadow-gold-500/20"
              data-cursor="try"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>See In Your Space</span>
            </Link>

            {/* Hamburger Trigger button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 text-stone-400 hover:text-white transition-colors focus:outline-none rounded-lg border border-stone-800 bg-stone-950/40"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gold-400 animate-in fade-in zoom-in duration-200" />
              ) : (
                <Menu className="w-5 h-5 text-stone-300 animate-in fade-in zoom-in duration-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div 
        className={`fixed inset-x-0 top-20 bg-stone-950/98 backdrop-blur-2xl border-b border-stone-900 z-40 md:hidden flex flex-col p-8 gap-6 transition-all duration-300 ease-out shadow-2xl ${
          isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
        }`}
        style={{ maxHeight: 'calc(100vh - 5rem)', overflowY: 'auto' }}
      >
        <nav className="flex flex-col gap-6">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-widest py-3 border-b border-stone-900/50 transition-colors ${
                  isActive 
                    ? 'text-gold-400 font-bold border-gold-400/20' 
                    : 'text-stone-300 hover:text-white border-transparent'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="pt-6 mt-2 border-t border-stone-900">
          <Link
            href="/visualize"
            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-gold-500/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>See In Your Space</span>
          </Link>
        </div>
      </div>
    </>
  );
}
