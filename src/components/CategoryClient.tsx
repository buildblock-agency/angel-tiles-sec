'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, SlidersHorizontal, Layers, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/content/products';

interface CategoryClientProps {
  categoryName: string;
  categoryDesc: string;
  seoText: string;
  products: Product[];
}

export default function CategoryClient({ 
  categoryName, 
  categoryDesc, 
  seoText, 
  products 
}: CategoryClientProps) {
  const [selectedFinish, setSelectedFinish] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<string>('all');

  // Gather unique finishes and applications for filters
  const allFinishes = Array.from(new Set(products.flatMap(p => p.spec.finish)));
  const allApps = Array.from(new Set(products.flatMap(p => p.spec.application)));

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchFinish = selectedFinish === 'all' || product.spec.finish.includes(selectedFinish);
    const matchApp = selectedApp === 'all' || product.spec.application.includes(selectedApp);
    return matchFinish && matchApp;
  });

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
            Showroom Sourcing
          </span>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            {categoryName} <span className="italic text-gold-foil">Collection</span>
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            {categoryDesc}
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between border-t border-b border-stone-900 py-6 mb-12">
          <div className="flex items-center gap-2 text-white">
            <SlidersHorizontal className="w-4 h-4 text-gold-400" />
            <span className="text-xs uppercase font-bold tracking-widest">Filter Slabs</span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs">
            {/* Finish Filter */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Finish:</span>
              <select 
                value={selectedFinish} 
                onChange={(e) => setSelectedFinish(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-stone-300 focus:outline-none focus:border-gold-400"
              >
                <option value="all">All Finishes</option>
                {allFinishes.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Application Filter */}
            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-medium">Application:</span>
              <select 
                value={selectedApp} 
                onChange={(e) => setSelectedApp(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded px-3 py-1.5 text-stone-300 focus:outline-none focus:border-gold-400"
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
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredProducts.map((product) => (
              <div 
                key={product.slug}
                className="group bg-stone-900/40 border border-stone-900 hover:border-stone-800/80 rounded-xl overflow-hidden flex flex-col justify-between p-4 transition-all duration-300 shadow-xl"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-800 mb-5">
                  <Image 
                    src={product.image} 
                    alt={product.name}
                    fill
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
                    <h3 className="font-serif text-lg md:text-xl text-white uppercase font-medium group-hover:text-gold-400 transition-colors mb-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-400 leading-relaxed line-clamp-2 mb-4">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 border-t border-stone-900 pt-4 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500">Est. Price:</span>
                      <span className="text-gold-400 font-bold">{product.priceRange}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link 
                        href={`/products/${product.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-stone-800 text-[10px] font-bold uppercase tracking-widest rounded-md text-stone-300 hover:bg-stone-900 hover:text-white transition-colors"
                        data-cursor="explore"
                      >
                        <span>Specifications</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <Link 
                        href={`/visualize?product=${product.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gold-400/10 border border-gold-400/30 text-[10px] font-bold uppercase tracking-widest rounded-md text-gold-400 hover:bg-gold-400 hover:text-stone-950 transition-all"
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
        ) : (
          <div className="text-center py-20 border border-dashed border-stone-800 rounded-xl mb-20">
            <Layers className="w-12 h-12 text-stone-700 mx-auto mb-4" />
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-2">No Matching Products</h3>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              We couldn't find any products in {categoryName} that match your filter selections. Try clearing your options.
            </p>
          </div>
        )}

        {/* SEO Text Block */}
        <section className="border-t border-stone-900 pt-16 max-w-4xl">
          <h2 className="font-serif text-2xl text-white uppercase tracking-wider mb-6">
            Sourcing guide for {categoryName} in Rajasthan
          </h2>
          <div 
            className="text-xs text-stone-500 leading-relaxed space-y-4 font-sans"
            dangerouslySetInnerHTML={{ __html: seoText }}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
