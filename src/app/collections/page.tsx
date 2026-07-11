import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CATEGORIES } from '@/content/products';

export const metadata = {
  title: "Premium Stone & Tiles Collections — Angel Jodhpur",
  description: "Browse Jodhpur's finest selection of natural stones, granites, polished vitrified floor tiles, and luxury designer closets.",
};

export default function CollectionsPage() {
  const categoriesList = Object.values(CATEGORIES);

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Page Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
            Showroom Categories
          </span>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            Our Studio <span className="italic text-gold-foil">Collections</span>
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            Discover a handpicked range of architectural materials. Select a category below to explore specific products, sizes, spec sheets, and preview them inside our perspective visualizer.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categoriesList.map((category) => (
            <Link 
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="group relative h-[400px] rounded-xl overflow-hidden border border-stone-900 flex flex-col justify-end p-8 transition-transform duration-500 hover:-translate-y-1 shadow-xl hover:shadow-stone-900/50"
              data-cursor="explore"
            >
              {/* Category Background Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={category.heroImage} 
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Gradient overlays to darken image and support text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-transparent transition-colors z-10" />
              </div>

              {/* Text contents */}
              <div className="relative z-20">
                <div className="w-10 h-10 rounded bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl text-white uppercase tracking-wide group-hover:text-gold-400 transition-colors mb-3">
                  {category.name}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed max-w-md mb-6">
                  {category.description}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold-400">
                  <span>Explore products</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
