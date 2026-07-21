'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, SlidersHorizontal, Layers, Sparkles, Loader2, ChevronDown } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/content/products';

gsap.registerPlugin(ScrollTrigger);

interface CategoryClientProps {
  categoryName: string;
  categoryDesc: string;
  seoText: string;
  products: Product[];
}

const ITEMS_PER_BATCH = 24;

export default function CategoryClient({ 
  categoryName, 
  categoryDesc, 
  seoText, 
  products 
}: CategoryClientProps) {
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(ITEMS_PER_BATCH);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Gather unique finishes and applications for filters
  const allFinishes = Array.from(new Set(products.flatMap(p => p.spec.finish)));
  const allApps = Array.from(new Set(products.flatMap(p => p.spec.application)));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchFinish = selectedFinish === 'all' || product.spec.finish.includes(selectedFinish);
    const matchApp = selectedApp === 'all' || product.spec.application.includes(selectedApp);
    return matchFinish && matchApp;
  });

  // Visible subset for lazy loading
  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + ITEMS_PER_BATCH, filteredProducts.length));
      setIsLoadingMore(false);
    }, 200);
  }, [isLoadingMore, hasMore, filteredProducts.length]);

  // Reset pagination when filters change
  const handleFinishChange = (val: string) => {
    setSelectedFinish(val);
    setVisibleCount(ITEMS_PER_BATCH);
  };

  const handleAppChange = (val: string) => {
    setSelectedApp(val);
    setVisibleCount(ITEMS_PER_BATCH);
  };

  // Intersection Observer for Infinite Scroll Lazy Loading
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          handleLoadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, handleLoadMore]);

  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header entry animation
    gsap.fromTo('.category-subtitle', 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
    gsap.fromTo('.category-title', 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: 'power3.out' }
    );
    gsap.fromTo('.category-description', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
    );
  }, []);

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="category-subtitle text-garnet-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
            Studio Sourcing
          </span>
          <h1 className="category-title font-serif text-4xl md:text-6xl uppercase tracking-wide text-silver-100 mb-6">
            {categoryName} <span className="italic text-garnet-foil">Collection</span>
          </h1>
          <p className="category-description text-silver-300 text-sm leading-relaxed">
            {categoryDesc}
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between border-t border-b border-stone-900 py-6 mb-12">
          <div className="flex items-center gap-4 text-silver-100">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-garnet-400" />
              <span className="text-xs uppercase font-bold tracking-widest">Filter Slabs</span>
            </div>
            <span className="text-xs text-stone-500 font-mono">
              ({filteredProducts.length} Total Slabs)
            </span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs">
            {/* Finish Filter */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-medium">Finish:</span>
              <select 
                value={selectedFinish} 
                onChange={(e) => handleFinishChange(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-silver-200 focus:outline-none focus:border-garnet-400"
              >
                <option value="all">All Finishes</option>
                {allFinishes.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Application Filter */}
            <div className="flex items-center gap-2">
              <span className="text-stone-400 font-medium">Application:</span>
              <select 
                value={selectedApp} 
                onChange={(e) => handleAppChange(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-silver-200 focus:outline-none focus:border-garnet-400"
              >
                <option value="all">All Applications</option>
                {allApps.map(app => (
                  <option key={app} value={app}>{app}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <>
            <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedProducts.map((product, idx) => (
                <div 
                  key={product.slug}
                  className="product-card group bg-stone-900/40 border border-stone-900 hover:border-stone-800/80 rounded-xl overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 shadow-xl"
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-800 mb-5 bg-stone-950">
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      loading={idx < 3 ? "eager" : "lazy"}
                      preload={idx === 0}
                      decoding="async"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-stone-950/20" />
                  </div>

                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold block mb-1">
                        {product.spec.origin}
                      </span>
                      <h3 className="font-serif text-lg md:text-xl text-silver-100 uppercase font-medium group-hover:text-garnet-400 transition-colors mb-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-4">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-stone-900 pt-4 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-stone-400">Est. Price:</span>
                        <span className="text-garnet-400 font-bold">{product.priceRange}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Link 
                          href={`/products/${product.slug}`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-stone-800 text-[10px] font-bold uppercase tracking-widest rounded-md text-silver-200 hover:bg-stone-900 hover:text-silver-50 transition-colors"
                          data-cursor="explore"
                        >
                          <span>Specifications</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                        <Link 
                          href={`/visualize?product=${product.slug}`}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-garnet-500/10 border border-garnet-400/30 text-[10px] font-bold uppercase tracking-widest rounded-md text-garnet-400 hover:bg-garnet-500 hover:text-silver-50 transition-all"
                          data-cursor="try"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Visualize</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lazy Load & Infinite Scroll Controls */}
            <div className="flex flex-col items-center justify-center mb-20 gap-4">
              {/* Progress Indicator */}
              <div className="flex flex-col items-center gap-2 max-w-xs w-full">
                <div className="flex items-center justify-between w-full text-xs text-stone-400">
                  <span>Showing {displayedProducts.length} of {filteredProducts.length} Slabs</span>
                  <span className="font-mono">{Math.round((displayedProducts.length / filteredProducts.length) * 100)}%</span>
                </div>
                <div className="w-full bg-stone-900 h-1.5 rounded-full overflow-hidden border border-stone-800">
                  <div 
                    className="bg-garnet-500 h-full transition-all duration-500"
                    style={{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Infinite Scroll Trigger Sentinel */}
              <div ref={observerTarget} className="h-4 w-full" />

              {/* Load More Button */}
              {hasMore ? (
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-stone-900 border border-stone-800 hover:border-garnet-500/50 rounded-lg text-xs font-bold uppercase tracking-widest text-silver-200 hover:text-white transition-all shadow-lg cursor-pointer"
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-garnet-400" />
                      <span>Loading More Slabs...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Products ({filteredProducts.length - displayedProducts.length} remaining)</span>
                      <ChevronDown className="w-4 h-4 text-garnet-400" />
                    </>
                  )}
                </button>
              ) : (
                <p className="text-xs text-stone-500 tracking-wider uppercase">
                  ✓ All {filteredProducts.length} catalog slabs loaded
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 border border-dashed border-stone-800 rounded-xl mb-20">
            <Layers className="w-12 h-12 text-stone-700 mx-auto mb-4" />
            <h3 className="text-silver-100 text-base font-bold uppercase tracking-wider mb-2">No Matching Products</h3>
            <p className="text-xs text-stone-400 max-w-xs mx-auto">
              We couldn't find any products in {categoryName} that match your filter selections. Try clearing your options.
            </p>
          </div>
        )}

        {/* Lazy-loaded SEO Text Block */}
        <LazySeoSection categoryName={categoryName} seoText={seoText} />
      </main>

      <Footer />
    </div>
  );
}

function LazySeoSection({ categoryName, seoText }: { categoryName: string; seoText: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-t border-stone-900 pt-16 max-w-4xl min-h-[200px]">
      {isVisible ? (
        <>
          <h2 className="font-serif text-2xl text-silver-100 uppercase tracking-wider mb-6">
            Sourcing guide for {categoryName} in Rajasthan
          </h2>
          <div
            className="text-xs text-stone-400 leading-relaxed space-y-4 font-sans"
            dangerouslySetInnerHTML={{ __html: seoText }}
          />
        </>
      ) : (
        <div className="flex items-center justify-center h-48">
          <div className="flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-2 border-garnet-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-stone-500 uppercase tracking-widest">Loading guide...</span>
          </div>
        </div>
      )}
    </section>
  );
}

