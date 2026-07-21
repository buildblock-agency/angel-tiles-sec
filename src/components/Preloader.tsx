'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);
  const subTextRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);

  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const panel4Ref = useRef<HTMLDivElement>(null);

  const [hasVisited, setHasVisited] = useState(false); // Default to false to prevent content flashing

  // Keep a mutable ref of the callback to avoid re-triggering timeline effects on parent renders
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const visited = sessionStorage.getItem('hasVisited_angel');
    if (visited) {
      onCompleteRef.current();
      setHasVisited(true);
      return;
    }
  }, []); // Run strictly once on mount

  useEffect(() => {
    if (hasVisited) return;

    // Respect reduced-motion: skip straight to content
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      sessionStorage.setItem('hasVisited_angel', 'true');
      onCompleteRef.current();
      setHasVisited(true);
      return;
    }

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const preventScroll = (e: TouchEvent) => {
      e.preventDefault();
    };
    document.addEventListener('touchmove', preventScroll, { passive: false });

    // --- Mobile viewport lock ---
    // Mobile browsers collapse/expand the address bar right after load,
    // which resizes this `fixed inset-0` container mid-animation. Because
    // the panels use `fill` + `object-cover`, that resize reads as the
    // image "zooming". Lock the height to the settled viewport size so
    // it can't move once the exit sequence starts.
    const container = containerRef.current;
    const lockHeight = () => {
      if (container) {
        const h = window.visualViewport?.height ?? window.innerHeight;
        container.style.height = `${h}px`;
      }
    };
    lockHeight();

    let stopTrackingViewport: (() => void) | undefined;
    if (window.visualViewport) {
      const onViewportResize = () => lockHeight();
      window.visualViewport.addEventListener('resize', onViewportResize);
      stopTrackingViewport = () =>
        window.visualViewport?.removeEventListener('resize', onViewportResize);
      setTimeout(() => stopTrackingViewport?.(), 1200);
    }
    // ---------------------------

    const panel1 = panel1Ref.current;
    const panel2 = panel2Ref.current;
    const panel3 = panel3Ref.current;
    const panel4 = panel4Ref.current;
    const cover = coverRef.current;

    // GSAP master timeline for the sequence
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('hasVisited_angel', 'true');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.removeEventListener('touchmove', preventScroll);
        setHasVisited(true);
      }
    });

    // 1. Initial State Setup
    gsap.set(cover, { xPercent: 0 });
    gsap.set([panel1, panel2, panel3, panel4], { xPercent: 0 });
    gsap.set([text1Ref.current, text2Ref.current], { yPercent: 105, opacity: 0 });
    gsap.set(subTextRef.current, { yPercent: -105, opacity: 0 });

    const counterObj = { value: 0 };

    // 2. Phase 1: Text & Counter Reveal Timeline
    tl.addLabel('start', 0);

    tl.to(counterObj, {
      value: 100,
      duration: 3.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.innerText = Math.round(counterObj.value).toString();
        }
      }
    }, 'start');

    tl.to(text1Ref.current, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'expo.out'
    }, 'start+=0.1');

    tl.to(text2Ref.current, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'expo.out'
    }, 'start+=0.22');

    tl.to(subTextRef.current, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out'
    }, 'start+=0.38');

    // 3. Phase 2: Cover Sweep Right (reveals stacked panels)
    tl.to(cover, {
      xPercent: 101,
      duration: 1.2,
      ease: 'expo.inOut'
    }, 'start+=1.8');

    // 4. Phase 3: Settle Hold
    tl.addLabel('exit', 'start+=3.4');

    tl.set(container, { pointerEvents: 'none' }, 'exit');

    tl.to([text1Ref.current, text2Ref.current, subTextRef.current, '.preloader-footer'], {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    }, 'exit');

    tl.call(() => {
      onCompleteRef.current();
    }, [], 'exit');

    // Staggered panels sweep left — 1 viewport width, no scale, no will-change
    tl.to(panel1, {
      xPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    }, 'exit');

    tl.to(panel2, {
      xPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    }, 'exit+=0.15');

    tl.to(panel3, {
      xPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    }, 'exit+=0.3');

    tl.to(panel4, {
      xPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    }, 'exit+=0.45');

    return () => {
      tl.kill();
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.removeEventListener('touchmove', preventScroll);
      stopTrackingViewport?.();
    };
  }, [hasVisited]);

  if (hasVisited) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-transparent flex flex-col items-center justify-center text-center select-none overflow-hidden"
    >
      {/* Wordmark (Layer 3 — top level, z-30) */}
      <div className="relative z-30 flex flex-col items-center justify-center select-none pointer-events-none">
        <div className="overflow-hidden py-2 flex items-center justify-center">
          <span
            ref={text1Ref}
            className="block font-serif text-7xl sm:text-8xl md:text-[11vw] font-bold tracking-[0.1em] leading-[0.9] text-white uppercase select-none opacity-0"
          >
            Angel
          </span>
        </div>
        <div className="overflow-hidden py-2 flex items-center justify-center">
          <span
            ref={text2Ref}
            className="block font-sans text-6xl sm:text-8xl md:text-[11vw] font-light tracking-[0.15em] leading-[0.9] text-garnet-400 uppercase select-none opacity-0"
          >
            Tiles
          </span>
        </div>
        <div className="overflow-hidden py-1 mt-6 flex items-center justify-center">
          <span
            ref={subTextRef}
            className="block font-sans text-[10px] sm:text-xs tracking-[0.5em] font-semibold text-stone-500 uppercase select-none opacity-0"
          >
            Stone Studio
          </span>
        </div>
      </div>

      {/* Footer bar */}
      <div className="preloader-footer absolute bottom-12 left-12 right-12 flex justify-between items-end z-30 pointer-events-none">
        <span className="hidden sm:inline font-sans text-[10px] tracking-[0.3em] font-bold text-stone-600 uppercase">
          Jodhpur, India
        </span>
        <div className="font-sans text-xs sm:text-sm tracking-[0.2em] font-bold text-stone-500 uppercase flex items-baseline gap-1">
          <span ref={counterRef}>0</span>
          <span className="text-[10px] text-stone-600">%</span>
        </div>
      </div>

      {/* Solid Background Cover (Layer 2 — z-25, slides right to reveal images) */}
      <div
        ref={coverRef}
        className="preloader-cover absolute inset-0 bg-stone-700 z-25"
      />

      {/* Stacked Full-Screen Image Panels (Layer 1 — z-21 to z-24, slides left staggered to reveal page) */}
      <div className="absolute inset-0 z-20 pointer-events-none w-full h-full overflow-hidden">
        
        {/* Panel 1 */}
        <div ref={panel1Ref} className="panel-1 absolute inset-0 w-full h-full overflow-hidden z-24 bg-stone-700">
          <Image
            src="/showroom/makrana_marble_lobby.webp"
            alt="Makrana marble lobby"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Panel 2 */}
        <div ref={panel2Ref} className="panel-2 absolute inset-0 w-full h-full overflow-hidden z-23 bg-stone-700">
          <Image
            src="/showroom/alaska_granite_kitchen.webp"
            alt="Alaska granite kitchen"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Panel 3 */}
        <div ref={panel3Ref} className="panel-3 absolute inset-0 w-full h-full overflow-hidden z-22 bg-stone-700">
          <Image
            src="/showroom/pgvt_tiles_lobby.webp"
            alt="PGVT tiles lobby"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

        {/* Panel 4 */}
        <div ref={panel4Ref} className="panel-4 absolute inset-0 w-full h-full overflow-hidden z-21 bg-stone-700">
          <Image
            src="/showroom/statuario_marble_living.webp"
            alt="Statuario marble finished living room"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>

      </div>
    </div>
  );
}
