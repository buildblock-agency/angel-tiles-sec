'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Shield, Award, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Preloader from '@/components/Preloader';

gsap.registerPlugin(ScrollTrigger);

export default function HomeClient() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [preloaderFinished, setPreloaderFinished] = useState(false);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderFinished(true);
  }, []);

  useEffect(() => {
    const visited = sessionStorage.getItem('hasVisited_angel');
    if (visited) {
      setPreloaderFinished(true);
    }
  }, []);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleSliderMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleSliderMove(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (e: MouseEvent) => {
      handleSliderMove(e.clientX);
    };

    const onUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!isDragging) return;

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleSliderMove(e.touches[0].clientX);
      }
    };

    const onTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);

  const totalFrames = 60;

  // 1. Preload Hero Frames in Client (progressive: first 5 eagerly, rest in batches)
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    const eagerCount = 5;

    setLoadProgress(0);

    const onLoad = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
      if (loadedCount === totalFrames) {
        setIsAssetsLoaded(true);
      }
    };

    const loadBatch = (start: number, end: number) => {
      for (let i = start; i <= end; i++) {
        const img = new window.Image();
        img.src = `/hero-frames/frame_${i.toString().padStart(2, '0')}.webp`;
        img.onload = onLoad;
        img.onerror = onLoad;
        images.push(img);
      }
    };

    loadBatch(1, eagerCount);

    setTimeout(() => loadBatch(eagerCount + 1, 15), 300);
    setTimeout(() => loadBatch(16, 30), 800);
    setTimeout(() => loadBatch(31, 45), 1500);
    setTimeout(() => loadBatch(46, totalFrames), 2500);

    imagesRef.current = images;
  }, []);

  // 1.5. Golden Particle Embers Animation Loop (runs when preloader finishes)
  useEffect(() => {
    if (!preloaderFinished) return;

    const canvas = particleCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isTabActive = true;

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
    }

    let particles: Particle[] = [];
    const isLowEnd = window.innerWidth < 768 && (window.devicePixelRatio || 1) > 1;
    const particleCount = isLowEnd ? 30 : 100;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.5 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: -Math.random() * 0.5 - 0.15,
        opacity: Math.random() * 0.6 + 0.1
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rect = canvas.getBoundingClientRect();
      const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

      if (!isVisible || !isTabActive) {
        animationFrameId = requestAnimationFrame(drawParticles);
        return;
      }

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) {
          p.x = canvas.width + 10;
        } else if (p.x > canvas.width + 10) {
          p.x = -10;
        }

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(184, 67, 79, ${p.opacity})`);
        gradient.addColorStop(1, `rgba(150, 34, 47, 0)`);
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [preloaderFinished]);

  // 2. Playback Frame Sequence on Scroll via GSAP
  useGSAP(() => {
    if (!isAssetsLoaded || !preloaderFinished || !canvasRef.current || !heroSectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = imagesRef.current;
    
    // Set initial canvas size
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      renderFrame(scrollObj.frame);
    };

    const renderFrame = (index: number) => {
      const imgIdx = Math.floor(index) - 1;
      const img = images[Math.max(0, Math.min(totalFrames - 1, imgIdx))];
      if (!img || !img.complete) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;
      
      const isMobile = canvasWidth < 768 * (window.devicePixelRatio || 1);

      if (isMobile) {
        // --- MOBILE PORTRAIT: AMBIENT OVERLAY & WIDE-ANGLE FOREGROUND ---
        
        // 1. Draw Full-bleed Cover Fit
        let bgWidth = canvasWidth;
        let bgHeight = canvasHeight;
        let bgOffsetX = 0;
        let bgOffsetY = 0;

        if (imgRatio > canvasRatio) {
          bgWidth = canvasHeight * imgRatio;
          bgOffsetX = (canvasWidth - bgWidth) / 2;
        } else {
          bgHeight = canvasWidth / imgRatio;
          bgOffsetY = (canvasHeight - bgHeight) / 2;
        }
        
        ctx.drawImage(img, bgOffsetX, bgOffsetY, bgWidth, bgHeight);

        // 2. Dark Overlay (replaces expensive blur(24px) — same visual, 100x faster)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // 3. Draw Foreground Layer (Zoomed out by 0.75)
        const zoomFactor = 0.75;
        const fgWidth = bgWidth * zoomFactor;
        const fgHeight = bgHeight * zoomFactor;
        const fgOffsetX = (canvasWidth - fgWidth) / 2;
        const fgOffsetY = (canvasHeight - fgHeight) / 2;
        
        ctx.drawImage(img, fgOffsetX, fgOffsetY, fgWidth, fgHeight);
      } else {
        // --- DESKTOP LANDSCAPE: STANDARD FULL-BLEED COVER FIT ---
        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (imgRatio > canvasRatio) {
          drawWidth = canvasHeight * imgRatio;
          offsetX = (canvasWidth - drawWidth) / 2;
        } else {
          drawHeight = canvasWidth / imgRatio;
          offsetY = (canvasHeight - drawHeight) / 2;
        }

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    };

    const scrollObj = { frame: 1 };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Bind scrub animation to scroll
    const isMobileScrub = window.innerWidth < 768;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobileScrub ? 1.2 : 0.6,
      }
    });

    tl.to(scrollObj, {
      frame: totalFrames,
      snap: 'frame',
      ease: 'none',
      onUpdate: () => {
        renderFrame(scrollObj.frame);
      }
    });

    // Fade out canvas background when scrolling past the hero
    gsap.to(canvas, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: '80% top',
        end: 'bottom top',
        scrub: true,
      }
    });

    // Fade out golden particle canvas on scroll
    if (particleCanvasRef.current) {
      gsap.to(particleCanvasRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'top -200px',
          scrub: true,
        }
      });
    }

    // Conditionally play slide-in animations or load instantly on subsequent visits
    const isSubsequentVisit = typeof window !== 'undefined' && sessionStorage.getItem('hasVisited_angel') === 'true';

    if (isSubsequentVisit) {
      gsap.set('header', { xPercent: 0, opacity: 1, clearProps: 'transform' });
      gsap.set('.home-main-content', { xPercent: 0, opacity: 1, clearProps: 'transform' });
      gsap.set('.hero-reveal-text', { x: 0, opacity: 1 });
      gsap.set('.hero-fade-in', { x: 0, opacity: 1 });
      gsap.set('.value-props-strip', { x: 0, opacity: 1 });
      ScrollTrigger.refresh();
    } else {
      // Falling header slides from the right (First Visit)
      gsap.fromTo('header',
        { xPercent: 30, opacity: 0 },
        { 
          xPercent: 0, 
          opacity: 1, 
          duration: 1.6, 
          delay: 0.05, 
          ease: 'power4.out',
          clearProps: 'transform'
        }
      );

      // Main content slides from the right (First Visit)
      gsap.fromTo('.home-main-content',
        { xPercent: 30, opacity: 0 },
        { 
          xPercent: 0, 
          opacity: 1, 
          duration: 1.6, 
          delay: 0.05, 
          ease: 'power4.out',
          clearProps: 'transform',
          onComplete: () => {
            ScrollTrigger.refresh();
          }
        }
      );

      // Staggered Title Animations slide from the right (First Visit)
      gsap.fromTo('.hero-reveal-text', 
        { opacity: 0, x: 80 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 1.4, 
          delay: 0.2,
          stagger: 0.1, 
          ease: 'power4.out' 
        }
      );

      // Staggered highlights entry slide from the right (First Visit)
      gsap.fromTo('.hero-fade-in',
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1.3,
          delay: 0.4,
          stagger: 0.08,
          ease: 'power4.out'
        }
      );

      // Value props strip slides from the right (First Visit)
      gsap.fromTo('.value-props-strip',
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 1.4,
          delay: 0.3,
          ease: 'power4.out'
        }
      );
    }

    // Snappy pop-up animation for the 3 studio collection cards on scroll
    gsap.fromTo('.collection-card',
      { opacity: 0, scale: 0.75, y: 40 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.8)',
        scrollTrigger: {
          trigger: '.collection-cards-grid',
          start: 'top 85%',
        }
      }
    );

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isAssetsLoaded, preloaderFinished]);

  return (
    <div ref={mainRef} className="relative min-h-screen bg-stone-900">
      {/* 1. Brand Preloader Concept */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Navbar Integration */}
      <Navbar />

      {/* 2. Main Page Content Wrapper (Animated sweep from right on load) */}
      <div 
        className="home-main-content"
        style={{ opacity: preloaderFinished ? undefined : 0 }}
      >
        {/* 2. Scroll-Scrubbed Canvas Hero Container */}
        <div 
          ref={heroSectionRef} 
          className="relative h-[250vh] w-full"
        >
        {/* Pinned Canvas Viewport */}
        <div className="sticky top-0 left-0 h-screen w-full overflow-hidden flex items-center justify-center z-0">
          <canvas ref={canvasRef} className="absolute md:inset-0 z-0 select-none pointer-events-none" />
          
          {/* Subtle dark gradient overlay over canvas */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/80 z-10" />

          {/* Floating Garnet Particles Overlay */}
          <canvas 
            ref={particleCanvasRef} 
            className="absolute inset-0 z-12 pointer-events-none opacity-80" 
          />

          {/* Hero text content overlay */}
          <div className="relative max-w-7xl mx-auto w-full px-6 h-full flex flex-col justify-end pb-32 z-20 pointer-events-none">
            <div className="max-w-3xl pointer-events-auto">
              <span className="hero-fade-in block text-garnet-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                Exclusive Stone Slabs & Premium Wall Tiles
              </span>
              <h1 className="hero-reveal-text font-serif text-5xl md:text-7xl leading-[1.1] uppercase tracking-wide text-silver-100 mb-6">
                Redefining <br className="hidden sm:block" />
                <span className="text-garnet-foil italic">Stone Spaces</span>
              </h1>
              <p className="hero-fade-in text-silver-300 text-sm md:text-base max-w-lg leading-relaxed mb-8">
                Jodhpur's destination for designers and luxury homeowners. Sourcing rare Italian Statuario, pristine Indian marble, and custom large-format tiles.
              </p>
              <div className="hero-fade-in flex flex-col sm:flex-row gap-4">
                <Link
                  href="/visualize"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-garnet-500 to-garnet-600 hover:from-garnet-600 hover:to-garnet-700 text-silver-50 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-lg shadow-garnet-900/30 border border-garnet-400/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try Room Visualizer</span>
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-stone-800 text-silver-100 font-bold text-xs uppercase tracking-widest rounded-full transition-colors hover:bg-stone-900"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Value Props Trust Strip */}
      <section className="value-props-strip relative bg-stone-900 z-20 py-20 border-t border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-stone-800/50 flex items-center justify-center shrink-0 border border-stone-700/50 text-garnet-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-silver-100 mb-2">Generational Stone</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Directly sourced marble from Jodhpur, Makrana, and Italian quarries. Hand-inspected for block density and grain continuity.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-stone-800/50 flex items-center justify-center shrink-0 border border-stone-700/50 text-garnet-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-silver-100 mb-2">Architects' Sourcing Choice</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Preferred partner of leading interior designers. Offering book-matched slabs and custom sizing specifications.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-stone-800/50 flex items-center justify-center shrink-0 border border-stone-700/50 text-garnet-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-silver-100 mb-2">Shankar Nagar Showroom</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                A massive layout displaying over 150+ variants. Experience slabs under natural day lighting and warm interior highlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Studio Collections Cards Grid (3-in-a-row on desktop, single column on mobile) */}
      <section className="relative z-20 bg-stone-900 py-24 px-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-garnet-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
                Curated Materials
              </span>
              <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-silver-100">
                Studio <span className="italic text-garnet-foil">Collections</span>
              </h2>
            </div>
            <p className="text-stone-400 text-xs md:text-sm max-w-md leading-relaxed">
              Explore our architectural surface portfolio. Sourced directly from premier quarries in Carrara, Makrana, and Morbi processing units.
            </p>
          </div>

          {/* Cards Grid: Exactly 3 cards per row on Desktop (lg:grid-cols-3 md:grid-cols-3), 1 column on Mobile (grid-cols-1) */}
          <div className="collection-cards-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Imported Italian Marble",
                subtitle: "Statuario & Carrara Slabs",
                desc: "Snow-white canvases with sweeping grey veins. Bookmatched patterns that flow like liquid glass across luxury living spaces.",
                image: "/showroom/statuario_marble_living.webp",
                href: "/collections/imported-marble",
                tag: "Imported Marble"
              },
              {
                title: "High-Density Granite",
                subtitle: "Countertops & Outdoor Paving",
                desc: "Alaska White, Rajasthan Black, and Jodhpur Red. Scratch-free, stain-repellent density built for active use.",
                image: "/showroom/alaska_granite_kitchen.webp",
                href: "/collections/granite",
                tag: "Granite Slabs"
              },
              {
                title: "Vitrified Floor Tiles",
                subtitle: "Large Format Slabs",
                desc: "Super-glossy PGVT and double charge vitrified tiles sized up to 1600x800mm for seamless monolithic floors.",
                image: "/showroom/pgvt_tiles_lobby.webp",
                href: "/collections/tiles",
                tag: "Floor Tiles"
              }
            ].map((card, idx) => (
              <div 
                key={idx}
                className="collection-card group relative bg-stone-800/30 border border-stone-800/50 hover:border-garnet-500/40 rounded-xl overflow-hidden flex flex-col justify-between p-6 transition-all duration-500 hover:-translate-y-1 shadow-xl hover:shadow-garnet-950/30"
              >
                <div>
                  {/* Card Image Wrapper */}
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden border border-stone-850 mb-6 bg-stone-900">
                    <Image 
                      src={card.image} 
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors" />
                    <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest text-silver-100 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded border border-stone-800">
                      {card.tag}
                    </span>
                  </div>

                  {/* Subtitle & Title */}
                  <span className="text-[10px] text-garnet-400 font-bold uppercase tracking-widest block mb-1">
                    {card.subtitle}
                  </span>
                  <h3 className="font-serif text-xl text-silver-100 uppercase font-medium group-hover:text-garnet-400 transition-colors mb-3">
                    {card.title}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="border-t border-stone-900/80 pt-4 mt-2">
                  <Link 
                    href={card.href} 
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-silver-200 group-hover:text-garnet-400 transition-colors"
                    data-cursor="explore"
                  >
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* All Collections CTA Banner */}
          <div className="mt-16 text-center">
            <Link 
              href="/collections" 
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-stone-800/40 border border-stone-800/60 text-silver-100 hover:border-garnet-400/40 hover:text-silver-50 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg"
            >
              <span>View All 8 Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Room Visualizer Teaser */}
      <section className="relative z-20 bg-stone-900 py-32 px-6 border-t border-stone-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col">
            <span className="text-garnet-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">
              Signature Technology
            </span>
            <h2 className="font-serif text-4xl md:text-5xl uppercase text-silver-100 tracking-wide mb-6">
              See it in your space <br />
              <span className="italic text-garnet-foil">before committing</span>
            </h2>
            <p className="text-silver-300 text-sm leading-relaxed mb-8 max-w-lg">
              Choosing stone is a massive design commitment. Our Room Visualizer lets you upload a photo of your own floor or wall, pin the planes, and instantly overlay any marble, granite, or tile texture in realistic perspective.
            </p>
            <div className="flex flex-col gap-4 text-xs font-semibold text-stone-400 uppercase tracking-widest mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-garnet-400" />
                <span>100% Client-Side processing (your photo stays private)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-garnet-400" />
                <span>Perspective homography matrix warping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-garnet-400" />
                <span>Realism shading layer preservation</span>
              </div>
            </div>
            <div>
              <Link
                href="/visualize"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-garnet-500 to-garnet-600 hover:from-garnet-600 hover:to-garnet-700 text-silver-50 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-lg shadow-garnet-900/30 border border-garnet-400/30"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Room Visualizer</span>
              </Link>
            </div>
          </div>
          
          {/* Before/After Split Demo */}
          <div 
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-2xl group cursor-ew-resize select-none touch-none"
          >
            {/* "After" Image (Base Layer) */}
            <div className="absolute inset-0 z-0 pointer-events-none">
              <Image 
                src="/showroom/after_marble_floor.png" 
                alt="Room showing luxury marble" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
            
            {/* "Before" Image (Clipped Overlay Layer) */}
            <div 
              className="absolute inset-0 z-10 pointer-events-none"
              style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            >
              <Image 
                src="/showroom/before_concrete_floor.png" 
                alt="Plain cement room floor" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Split Slider Divider Line & Handle */}
            <div 
              className="absolute inset-y-0 z-20 w-[2px] bg-garnet-400 pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-garnet-500 text-silver-50 border border-silver-100 flex items-center justify-center text-[9px] font-bold shadow-lg shadow-garnet-900/40">
                ◀▶
              </div>
            </div>
            
            {/* Before / After labels */}
            <div className="absolute left-4 top-4 z-20 px-3 py-1 bg-stone-950/80 backdrop-blur-md rounded text-[10px] text-stone-300 uppercase font-semibold border border-stone-800 select-none">
              Before
            </div>
            <div className="absolute right-4 top-4 z-20 px-3 py-1 bg-garnet-500 text-silver-50 rounded text-[10px] uppercase font-bold select-none animate-pulse">
              After (Visualizer Demo)
            </div>
          </div>
        </div>
      </section>

      {/* Footer Integration */}
      <Footer />
      </div> {/* end of .home-main-content */}
    </div>
  );
}
