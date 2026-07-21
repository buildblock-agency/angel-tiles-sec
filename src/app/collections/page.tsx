import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Layers } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CATEGORIES } from '@/content/products';

export const metadata = {
  title: "Studio Collections — Angel Tiles & Stone Jodhpur",
  description: "Explore Jodhpur's finest selection of imported Italian marble, Makrana white marble, high-density granite slabs, architectural tiles, and designer sanitaryware.",
};

export default function CollectionsPage() {
  const categoriesList = Object.values(CATEGORIES);

  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Page Header */}
        <div className="max-w-2xl mb-16">
          <span className="text-garnet-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
            Studio Categories
          </span>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-silver-100 mb-6">
            Our Studio <span className="italic text-garnet-foil">Collections</span>
          </h1>
          <p className="text-silver-300 text-sm leading-relaxed">
            Discover our curated portfolio of architectural surface materials across 8 distinct categories. Select any category below to view specific slab dimensions, specs, and preview inside our interactive Room Visualizer.
          </p>
        </div>

        {/* Categories Grid (8 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categoriesList.map((category) => (
            <Link 
              key={category.slug}
              href={`/collections/${category.slug}`}
              className="group relative h-[360px] rounded-xl overflow-hidden border border-stone-900 flex flex-col justify-end p-6 transition-all duration-500 hover:-translate-y-1 shadow-xl hover:border-garnet-500/40 hover:shadow-garnet-900/20"
              data-cursor="explore"
            >
              {/* Category Background Image */}
              <div className="absolute inset-0 z-0">
                <Image 
                  src={category.heroImage} 
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  priority
                />
                {/* Gradient overlays to darken image and support text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent z-10" />
                <div className="absolute inset-0 bg-stone-950/30 group-hover:bg-transparent transition-colors z-10" />
              </div>

              {/* Text contents */}
              <div className="relative z-20">
                <div className="w-9 h-9 rounded-lg bg-garnet-500/10 border border-garnet-400/30 flex items-center justify-center text-garnet-400 mb-3 group-hover:bg-garnet-500 group-hover:text-silver-50 transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-xl text-silver-100 uppercase tracking-wide group-hover:text-garnet-400 transition-colors mb-2">
                  {category.name}
                </h3>
                <p className="text-[11px] text-stone-400 leading-relaxed mb-4 line-clamp-3">
                  {category.description}
                </p>
                <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-garnet-400 group-hover:text-silver-100 transition-colors">
                  <span>Explore products</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
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

