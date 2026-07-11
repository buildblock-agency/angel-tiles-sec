'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, Shield, Award, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function HomeClient() {
  const mainRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  
  const [loadProgress, setLoadProgress] = useState(0);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const totalFrames = 60;

  // 1. Preload Hero Frames in Client
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new window.Image();
      img.src = `/hero-frames/frame_${i.toString().padStart(2, '0')}.webp`;
      img.onload = () => {
        loadedCount++;
        const percent = Math.round((loadedCount / totalFrames) * 100);
        setLoadProgress(percent);
        if (loadedCount === totalFrames) {
          setIsAssetsLoaded(true);
        }
      };
      img.onerror = () => {
        // Fallback for missing frames
        loadedCount++;
        if (loadedCount === totalFrames) {
          setIsAssetsLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // 2. Playback Frame Sequence on Scroll via GSAP
  useGSAP(() => {
    if (!isAssetsLoaded || !canvasRef.current || !heroSectionRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = imagesRef.current;
    
    // Set initial canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
      canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      renderFrame(scrollObj.frame);
    };

    const renderFrame = (index: number) => {
      const imgIdx = Math.floor(index) - 1;
      const img = images[Math.max(0, Math.min(totalFrames - 1, imgIdx))];
      if (!img || !img.complete) return;

      // Draw image as object-fit cover
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      
      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;
      
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
    };

    const scrollObj = { frame: 1 };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // GSAP ScrollTrigger to scrub the frame value
    gsap.to(scrollObj, {
      frame: totalFrames,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          renderFrame(scrollObj.frame);
        }
      }
    });

    // Fade out canvas background when scrolling past the hero
    gsap.to(canvas, {
      opacity: 0.15,
      scrollTrigger: {
        trigger: heroSectionRef.current,
        start: 'bottom 90%',
        end: 'bottom 30%',
        scrub: true,
      }
    });

    // Staggered Title Animations
    gsap.fromTo('.hero-reveal-text', 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        stagger: 0.2, 
        ease: 'power3.out' 
      }
    );

    // Staggered highlights entry
    gsap.fromTo('.hero-fade-in',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      }
    );

    // Horizontal Collections Scroll
    const panels = gsap.utils.toArray('.horizontal-panel');
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.horizontal-container',
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${window.innerWidth * (panels.length - 1)}`,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isAssetsLoaded]);

  return (
    <div ref={mainRef} className="relative min-h-screen bg-stone-950">
      {/* 1. Preloader Cover */}
      {!isAssetsLoaded && (
        <div className="fixed inset-0 z-50 bg-stone-950 flex flex-col items-center justify-center text-center px-6">
          <div className="flex flex-col gap-1 mb-8">
            <span className="font-serif text-3xl tracking-widest text-white uppercase font-semibold">
              Angel
            </span>
            <span className="text-[10px] tracking-[0.3em] text-gold-400 uppercase -mt-1 font-sans">
              Tiles & Stone Studio
            </span>
          </div>
          <div className="w-64 h-1 bg-stone-900 rounded-full overflow-hidden mb-3 relative">
            <div 
              className="h-full bg-gradient-to-r from-gold-300 to-gold-500 rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-stone-500">
            Preloading Textures & Assets... {loadProgress}%
          </span>
        </div>
      )}

      {/* Navbar Integration */}
      <Navbar />

      {/* 2. Scroll-Scrubbed Canvas Hero Container */}
      <div 
        ref={heroSectionRef} 
        className="relative h-[250vh] w-full"
      >
        {/* Pinned Canvas Viewport */}
        <div className="sticky top-0 left-0 h-screen w-full overflow-hidden flex items-center justify-center z-0">
          <canvas ref={canvasRef} className="absolute inset-0 z-0 select-none pointer-events-none" />
          
          {/* Subtle dark gradient overlay over canvas */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/80 z-10" />

          {/* Hero text content overlay */}
          <div className="relative max-w-7xl mx-auto w-full px-6 h-full flex flex-col justify-end pb-32 z-20 pointer-events-none">
            <div className="max-w-3xl pointer-events-auto">
              <span className="hero-fade-in block text-gold-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">
                Exclusive Stone Slabs & Premium Wall Tiles
              </span>
              <h1 className="hero-reveal-text font-serif text-5xl md:text-7xl leading-[1.1] uppercase tracking-wide text-white mb-6">
                Redefining <br className="hidden sm:block" />
                <span className="text-gold-foil italic">Stone Spaces</span>
              </h1>
              <p className="hero-fade-in text-stone-400 text-sm md:text-base max-w-lg leading-relaxed mb-8">
                Jodhpur's destination for designers and luxury homeowners. Sourcing rare Italian Statuario, pristine Indian marble, and custom large-format tiles.
              </p>
              <div className="hero-fade-in flex flex-col sm:flex-row gap-4">
                <Link
                  href="/visualize"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-lg shadow-gold-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try Room Visualizer</span>
                </Link>
                <Link
                  href="/collections"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-stone-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-colors hover:bg-stone-900"
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
      <section className="relative bg-stone-950 z-20 py-20 border-t border-b border-stone-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-stone-900 flex items-center justify-center shrink-0 border border-stone-800 text-gold-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Generational Stone</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Directly sourced marble from Jodhpur, Makrana, and Italian quarries. Hand-inspected for block density and grain continuity.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-stone-900 flex items-center justify-center shrink-0 border border-stone-800 text-gold-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Architects' Sourcing Choice</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Preferred partner of leading interior designers. Offering book-matched slabs and custom sizing specifications.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-lg bg-stone-900 flex items-center justify-center shrink-0 border border-stone-800 text-gold-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-2">Mandore Showroom</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                A massive layout displaying over 150+ variants. Experience slabs under natural day lighting and warm interior highlights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Horizontal Collections Pin Sequence */}
      <section className="relative z-20 overflow-hidden">
        <div className="horizontal-container w-[400vw] h-screen flex">
          
          {/* Panel 1: Collections Intro */}
          <div className="horizontal-panel w-screen h-full shrink-0 bg-stone-950 flex items-center px-6 md:px-24">
            <div className="max-w-2xl">
              <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
                Curated Materials
              </span>
              <h2 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
                Our Premium <br />
                <span className="italic text-gold-foil">Collections</span>
              </h2>
              <p className="text-stone-400 text-sm leading-relaxed mb-8">
                Every space requires a different texture, density, and finish. Swipe or scroll horizontally to explore marble blocks, granite countertops, vitrified patterns, and custom fittings.
              </p>
              <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-widest text-gold-400">
                <span>Scroll to browse</span>
                <div className="w-16 h-[1px] bg-gold-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Panel 2: Marble */}
          <div className="horizontal-panel w-screen h-full shrink-0 bg-stone-900 flex items-center justify-center px-6 md:px-24 relative">
            <div className="absolute inset-0 z-0">
              <Image 
                src="/showroom/image_1.webp" 
                alt="Marble Slabs"
                fill
                className="object-cover opacity-25"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-stone-900 z-10" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-20 w-full max-w-6xl items-center">
              <div>
                <span className="text-gold-400 text-xs font-bold uppercase tracking-wider block mb-3">01 / Marble Slabs</span>
                <h3 className="font-serif text-3xl md:text-5xl text-white uppercase mb-6">Pure Italian & Makrana</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-8">
                  Flawless marble slabs sourced from quarries in Carrara, Italy and Makrana, India. Bookmatched patterns that flow like liquid glass across your living spaces.
                </p>
                <Link 
                  href="/collections/marble" 
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-gold-400 transition-colors"
                >
                  <span>Explore Marble Slabs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
                <Image 
                  src="/showroom/image_2.webp" 
                  alt="Statuario white slabs" 
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Panel 3: Granite */}
          <div className="horizontal-panel w-screen h-full shrink-0 bg-stone-950 flex items-center justify-center px-6 md:px-24 relative">
            <div className="absolute inset-0 z-0">
              <Image 
                src="/showroom/image_4.webp" 
                alt="Granite slabs"
                fill
                className="object-cover opacity-25"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-stone-950 z-10" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-20 w-full max-w-6xl items-center">
              <div>
                <span className="text-gold-400 text-xs font-bold uppercase tracking-wider block mb-3">02 / Granite</span>
                <h3 className="font-serif text-3xl md:text-5xl text-white uppercase mb-6">High-Density Granites</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-8">
                  Exquisite patterns in Alaska White, Rajasthan Black, and Jodhpur Red. The ultimate balance of aesthetic crystals and scratch-free, heat-resistant durability.
                </p>
                <Link 
                  href="/collections/granite" 
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-gold-400 transition-colors"
                >
                  <span>Explore Granite</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
                <Image 
                  src="/showroom/image_5.webp" 
                  alt="Black granite steps" 
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Panel 4: Tiles */}
          <div className="horizontal-panel w-screen h-full shrink-0 bg-stone-900 flex items-center justify-center px-6 md:px-24 relative">
            <div className="absolute inset-0 z-0">
              <Image 
                src="/showroom/image_6.webp" 
                alt="Vitrified Tiles"
                fill
                className="object-cover opacity-25"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-stone-900 z-10" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-20 w-full max-w-6xl items-center">
              <div>
                <span className="text-gold-400 text-xs font-bold uppercase tracking-wider block mb-3">03 / Vitrified Tiles</span>
                <h3 className="font-serif text-3xl md:text-5xl text-white uppercase mb-6">Large Format Vitrified</h3>
                <p className="text-stone-400 text-sm leading-relaxed mb-8">
                  Super-glossy PGVT, carving, and heavy-duty double charge tiles. Sized up to 1600x800mm for clean floor designs with minimal grout lines.
                </p>
                <Link 
                  href="/collections/tiles" 
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white hover:text-gold-400 transition-colors"
                >
                  <span>Explore Tiles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="relative aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-2xl">
                <Image 
                  src="/showroom/image_8.webp" 
                  alt="PGVT Marble tiles" 
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Room Visualizer Teaser */}
      <section className="relative z-20 bg-stone-950 py-32 px-6 border-t border-stone-900">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.25em] mb-4">
              Signature Technology
            </span>
            <h2 className="font-serif text-4xl md:text-5xl uppercase text-white tracking-wide mb-6">
              See it in your space <br />
              <span className="italic text-gold-foil">before committing</span>
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed mb-8 max-w-lg">
              Choosing stone is a massive design commitment. Our Room Visualizer lets you upload a photo of your own floor or wall, pin the planes, and instantly overlay any marble, granite, or tile texture in realistic perspective.
            </p>
            <div className="flex flex-col gap-4 text-xs font-semibold text-stone-500 uppercase tracking-widest mb-8">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>100% Client-Side processing (your photo stays private)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>Perspective homography matrix warping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                <span>Realism shading layer preservation</span>
              </div>
            </div>
            <div>
              <Link
                href="/visualize"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-lg shadow-gold-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Room Visualizer</span>
              </Link>
            </div>
          </div>
          
          {/* Before/After Split Demo */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-stone-800 shadow-2xl group cursor-ew-resize">
            {/* "After" Image (Left Side overlay) */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="/showroom/image_2.webp" 
                alt="Room showing luxury marble" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            
            {/* "Before" Image (Right side cropped) */}
            <div className="absolute inset-0 z-10 w-1/2 overflow-hidden border-r border-gold-400/50">
              <div className="absolute inset-0 w-[200%] h-full">
                <Image 
                  src="/showroom/image_6.webp" 
                  alt="Plain cement room floor" 
                  fill 
                  className="object-cover filter grayscale opacity-80"
                  sizes="100vw"
                />
              </div>
            </div>
            
            {/* Before / After labels */}
            <div className="absolute left-4 top-4 z-20 px-3 py-1 bg-stone-950/80 backdrop-blur-md rounded text-[10px] text-stone-400 uppercase font-semibold border border-stone-800 select-none">
              Before
            </div>
            <div className="absolute right-4 top-4 z-20 px-3 py-1 bg-gold-400 text-stone-950 rounded text-[10px] uppercase font-bold select-none">
              After (Visualizer Demo)
            </div>
          </div>
        </div>
      </section>

      {/* Footer Integration */}
      <Footer />
    </div>
  );
}
