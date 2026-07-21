'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Check, Phone, ArrowRight, Layers } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Product } from '@/content/products';

interface ProductClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductClient({ product, relatedProducts }: ProductClientProps) {
  const [zoomScale, setZoomScale] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useGSAP(() => {
    gsap.fromTo('.product-hero-image', 
      { opacity: 0, scale: 1.05 }, 
      { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
    );
    gsap.fromTo('.product-detail-reveal',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, delay: 0.1, ease: 'power2.out' }
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setZoomScale(2);
  const handleMouseLeave = () => setZoomScale(1);

  // Prefilled WhatsApp Enquiry Message
  const waMessage = encodeURIComponent(
    `Hello Angel Tiles & Stone Studio Jodhpur. I am interested in sourcing ${product.name} (${product.priceRange}) for my project. Please share availability and slab coordinates.`
  );

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full">
        {/* Back Link */}
        <Link 
          href={`/collections/${product.category}`}
          className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-white uppercase font-bold tracking-widest mb-10 transition-colors"
          data-cursor="back"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {product.category}</span>
        </Link>

        {/* Product Details Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* Left Column: Interactive Image Zoom */}
          <div className="flex flex-col gap-4">
            <div 
              className="product-hero-image relative aspect-square md:aspect-[4/3] lg:aspect-square bg-stone-900 border border-stone-850 rounded-xl overflow-hidden cursor-crosshair group"
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Image 
                src={product.image} 
                alt={product.name}
                fill
                style={{
                  transform: `scale(${zoomScale})`,
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  transition: zoomScale === 1 ? 'transform 0.3s ease-out' : 'none'
                }}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-stone-950/10 pointer-events-none" />
              
              {/* Zoom Instruction */}
              <div className="absolute bottom-4 right-4 bg-stone-950/80 backdrop-blur-md px-3 py-1.5 rounded border border-stone-800 text-[10px] text-stone-400 uppercase font-bold tracking-wider select-none pointer-events-none group-hover:opacity-0 transition-opacity">
                Hover to zoom texture
              </div>
            </div>

            {/* Macro Texture Thumbnail */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-stone-850 bg-stone-900">
                <Image 
                  src={product.texture} 
                  alt={`${product.name} Macro Texture`} 
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-stone-950/30" />
                <span className="absolute bottom-2 left-2 text-[9px] text-stone-400 font-bold uppercase tracking-wider bg-stone-950/60 px-2 py-0.5 rounded">
                  Seamless Texture Patch
                </span>
              </div>
              <div className="flex flex-col justify-center p-3 border border-stone-900 rounded-lg bg-stone-900/10">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Material Aspect</span>
                <span className="text-xs text-white mt-1">High fidelity vein alignment</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sourcing Form & Spec Sheets */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category Tag */}
              <span className="product-detail-reveal inline-flex items-center gap-1.5 px-3 py-1 rounded bg-stone-900 border border-stone-800 text-[10px] font-bold text-garnet-400 uppercase tracking-wider mb-4">
                <Layers className="w-3.5 h-3.5" />
                <span>{product.category}</span>
              </span>

              <h1 className="product-detail-reveal font-serif text-4xl md:text-5xl uppercase tracking-wide text-silver-100 mb-4">
                {product.name}
              </h1>

              <div className="product-detail-reveal flex items-center gap-2 mb-6">
                <span className="text-xs text-stone-400">Estimated Sourcing Rate:</span>
                <span className="text-lg text-garnet-400 font-bold tracking-wider">{product.priceRange}</span>
              </div>

              <p className="product-detail-reveal text-sm text-silver-300 leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Specs sheet */}
              <div className="product-detail-reveal border border-stone-900 rounded-xl bg-stone-900/30 p-6 mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-silver-100 border-b border-stone-900 pb-3 mb-4">
                  Material Specifications
                </h4>
                <dl className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
                  <div>
                    <dt className="text-stone-400 font-medium">Country of Origin</dt>
                    <dd className="text-silver-100 mt-0.5">{product.spec.origin}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-400 font-medium">Finishes Available</dt>
                    <dd className="text-silver-100 mt-0.5">{(Array.isArray(product.spec.finishes) ? product.spec.finishes : [product.spec.finish]).join(', ')}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-400 font-medium">Standard Slab Sizes</dt>
                    <dd className="text-silver-100 mt-0.5">{(Array.isArray(product.spec.sizes) ? product.spec.sizes : [product.spec.size]).join(', ')}</dd>
                  </div>
                  <div>
                    <dt className="text-stone-400 font-medium">Best Applications</dt>
                    <dd className="text-silver-100 mt-0.5">{(Array.isArray(product.spec.applications) ? product.spec.applications : [product.spec.application]).join(', ')}</dd>
                  </div>
                </dl>
              </div>

              {/* Key Features */}
              <div className="product-detail-reveal mb-8">
                <h4 className="text-xs font-bold uppercase tracking-wider text-silver-100 mb-4">Key Characteristics</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-silver-300">
                      <Check className="w-4 h-4 text-garnet-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTAs */}
            <div className="product-detail-reveal grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-stone-900 pt-8 mt-4">
              <Link 
                href={`/visualize?product=${product.slug}`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-garnet-500 to-garnet-600 hover:from-garnet-600 hover:to-garnet-700 text-silver-50 font-bold text-xs uppercase tracking-widest rounded-full transition-transform hover:scale-105 shadow-lg shadow-garnet-900/30 border border-garnet-400/30"
                data-cursor="try"
              >
                <Sparkles className="w-4 h-4" />
                <span>See it in your room</span>
              </Link>
              <a 
                href={`https://wa.me/919929548511?text=${waMessage}`}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-stone-800 text-silver-100 hover:border-silver-100 transition-colors font-bold text-xs uppercase tracking-widest rounded-full"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="chat"
              >
                <Phone className="w-4 h-4 text-garnet-400" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-stone-900 pt-16">
            <h2 className="font-serif text-2xl text-silver-100 uppercase tracking-wider mb-8">
              Related <span className="italic text-garnet-foil">Products</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <div key={p.slug} className="group flex flex-col gap-4">
                  <Link 
                    href={`/products/${p.slug}`}
                    className="relative aspect-video rounded-lg overflow-hidden border border-stone-900 bg-stone-900"
                    data-cursor="explore"
                  >
                    <Image 
                      src={p.image} 
                      alt={p.name} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="33vw"
                    />
                    <div className="absolute inset-0 bg-stone-950/20" />
                  </Link>
                  <div>
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold">
                      {p.spec.origin}
                    </span>
                    <Link href={`/products/${p.slug}`}>
                      <h4 className="font-serif text-base text-silver-100 uppercase font-medium hover:text-garnet-400 transition-colors mt-1">
                        {p.name}
                      </h4>
                    </Link>
                    <div className="flex justify-between items-center text-xs mt-2">
                      <span className="text-stone-400">{p.priceRange}</span>
                      <Link 
                        href={`/products/${p.slug}`}
                        className="text-[10px] text-garnet-400 uppercase font-bold tracking-widest inline-flex items-center gap-1 hover:text-silver-50 transition-colors"
                      >
                        <span>View</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
