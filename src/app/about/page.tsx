import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, Compass, Heart, Users } from 'lucide-react';

export const metadata = {
  title: "Our Sourcing Story & Craftsmanship — Angel Jodhpur",
  description: "Learn how Angel Tiles & Stone Studio imports, selects, and crafts high-grade Italian marble and Rajasthani granite slabs for luxury projects.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Intro */}
        <div className="max-w-3xl mb-16">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
            Our Legacy
          </span>
          <h1 className="font-serif text-4xl md:text-6xl uppercase tracking-wide text-white mb-6">
            The Sourcing <br />
            <span className="italic text-gold-foil">Story & Studio</span>
          </h1>
          <p className="text-stone-400 text-sm leading-relaxed">
            Since our founding, Angel Tiles & Stone Studio has established itself as the leading destination for designers, architects, and luxury homeowners in Rajasthan. We believe that choosing natural stone is not just sourcing a material—it is selecting an artwork that has matured over millions of years.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden border border-stone-850 shadow-2xl">
            <Image
              src="/showroom/image_16.webp"
              alt="Inside showroom showing slab stacks"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-stone-950/25" />
          </div>

          <div className="flex flex-col gap-6 text-xs text-stone-400 leading-relaxed font-sans">
            <h3 className="font-serif text-xl md:text-2xl text-white uppercase tracking-wider">
              Selected Slabs, No Reinforcements
            </h3>
            <p>
              Many stone yards stock commercial grade slabs that require significant chemical filling and mesh netting to stay structurally sound. At Angel Tiles & Stone Studio, we operate on a strict hand-selection sourcing protocol. Every marble block and granite slab that enters our Mandore Road yard is inspected for density, hairline fissures, and crystalline structure.
            </p>
            <p>
              Our luxury imported marbles, including Italian Statuario, Botticino, and Carrara White, are sourced directly from quarry runs in Italy. They are cut and polished using state-of-the-art gang saw machinery to ensure perfectly flat dimensions with minimal thickness offsets.
            </p>
            <p>
              By combining Jodhpur's historical stone craftsmanship with modern laser cutting and sizing, we supply blocks and tiles that require minimal waste during installation, providing a clean, seamless finish that stands the test of generations.
            </p>
          </div>
        </div>

        {/* Pillars Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10">
            <Compass className="w-8 h-8 text-gold-400 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Direct Sourcing</h4>
            <p className="text-[10px] text-stone-500 leading-relaxed">
              We bypass middle agencies, importing blocks directly from quarries in Italy, Turkey, and premium local mines across Rajasthan.
            </p>
          </div>

          <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10">
            <Award className="w-8 h-8 text-gold-400 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Architectural Grade</h4>
            <p className="text-[10px] text-stone-500 leading-relaxed">
              All marble slabs are bookmatched and reinforced to meet commercial and high-end residential load and polish specifications.
            </p>
          </div>

          <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10">
            <Heart className="w-8 h-8 text-gold-400 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Visual Certainty</h4>
            <p className="text-[10px] text-stone-500 leading-relaxed">
              We empower clients with homography room visualizers and layout runs so they are 100% confident in their material choices.
            </p>
          </div>

          <div className="border border-stone-900 rounded-xl p-6 bg-stone-900/10">
            <Users className="w-8 h-8 text-gold-400 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2">Dedicated Sizing</h4>
            <p className="text-[10px] text-stone-500 leading-relaxed">
              Provide cut-to-size cladding, customized stair treads, and custom threshold frames directly prepared from active blocks.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
