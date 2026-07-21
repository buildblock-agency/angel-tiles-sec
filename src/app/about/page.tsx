'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Award, Compass, Heart, Users } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header entry animation
    gsap.fromTo('.about-intro-reveal',
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' }
    );

    // Story columns reveal
    gsap.fromTo('.about-story-col',
      { opacity: 0, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-story-section',
          start: 'top 85%',
        }
      }
    );

    // Count up animation for stats
    const stats = gsap.utils.toArray('.about-stat-number');
    stats.forEach((stat: any) => {
      const targetVal = parseInt(stat.getAttribute('data-value') || '0', 10);
      gsap.fromTo(stat, 
        { textContent: '0' },
        {
          textContent: targetVal,
          duration: 1.8,
          ease: 'power1.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: '.about-stats-section',
            start: 'top 88%',
          },
          onUpdate: function() {
            const val = stat.textContent;
            if (stat.getAttribute('data-value') === '500') {
              stat.textContent = val + 'k+';
            } else if (stat.getAttribute('data-value') === '98') {
              stat.textContent = val + '%';
            } else if (stat.getAttribute('data-value') === '15') {
              stat.textContent = val + '+';
            } else if (stat.getAttribute('data-value') === '120') {
              stat.textContent = val + '+';
            }
          }
        }
      );
    });

    // Timeline cards reveal
    const timelineCards = gsap.utils.toArray('.timeline-card');
    if (timelineCards.length > 0) {
      gsap.fromTo(timelineCards,
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.timeline-section',
            start: 'top 80%',
          }
        }
      );
    }

    // Pillars cards reveal
    const pillars = gsap.utils.toArray('.about-pillar');
    if (pillars.length > 0) {
      gsap.fromTo(pillars,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.about-pillars-section',
            start: 'top 85%',
          }
        }
      );
    }
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-stone-950 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-20 w-full">
        {/* Intro */}
        <div className="max-w-3xl mb-16">
          <span className="about-intro-reveal text-garnet-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4">
            Our Legacy
          </span>
          <h1 className="about-intro-reveal font-serif text-4xl md:text-6xl uppercase tracking-wide text-silver-100 mb-6">
            The Sourcing <br />
            <span className="italic text-garnet-foil">Story & Studio</span>
          </h1>
          <p className="about-intro-reveal text-silver-300 text-sm leading-relaxed">
            Since our founding, Angel Tiles & Stone Studio has established itself as the leading destination for designers, architects, and luxury homeowners in Rajasthan. We believe that choosing natural stone is not just sourcing a material—it is selecting an artwork that has matured over millions of years.
          </p>
        </div>

        {/* Story Section */}
        <div className="about-story-section grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="about-story-col relative aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden border border-stone-850 shadow-2xl">
            <Image
              src="/showroom/statuario_marble_living.webp"
              alt="Luxurious Italian Statuario marble installation in a modern living room"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-stone-950/25" />
          </div>

          <div className="about-story-col flex flex-col gap-6 text-xs text-silver-300 leading-relaxed font-sans">
            <h3 className="font-serif text-xl md:text-2xl text-silver-100 uppercase tracking-wider">
              Selected Slabs, No Reinforcements
            </h3>
            <p>
              Many stone yards stock commercial grade slabs that require significant chemical filling and mesh netting to stay structurally sound. At Angel Tiles & Stone Studio, we operate on a strict hand-selection sourcing protocol. Every marble block and granite slab that enters our Shankar Nagar yard is inspected for density, hairline fissures, and crystalline structure.
            </p>
            <p>
              Our luxury imported marbles, including Italian Statuario, Botticino, and Carrara White, are sourced directly from quarry runs in Italy. They are cut and polished using state-of-the-art gang saw machinery to ensure perfectly flat dimensions with minimal thickness offsets.
            </p>
            <p>
              By combining Jodhpur's historical stone craftsmanship with modern laser cutting and sizing, we supply blocks and tiles that require minimal waste during installation, providing a clean, seamless finish that stands the test of generations.
            </p>
          </div>
        </div>

        {/* Statistics Section */}
        <section className="about-stats-section grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-stone-900 py-12 mb-24">
          <div className="text-center">
            <span className="about-stat-number font-serif text-4xl md:text-5xl text-garnet-400 font-bold block" data-value="15">0</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold mt-2 block">Years of Legacy</span>
          </div>
          <div className="text-center">
            <span className="about-stat-number font-serif text-4xl md:text-5xl text-garnet-400 font-bold block" data-value="500">0</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold mt-2 block">Sq Ft Delivered (K)</span>
          </div>
          <div className="text-center">
            <span className="about-stat-number font-serif text-4xl md:text-5xl text-garnet-400 font-bold block" data-value="120">0</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold mt-2 block">Slab Varieties</span>
          </div>
          <div className="text-center">
            <span className="about-stat-number font-serif text-4xl md:text-5xl text-garnet-400 font-bold block" data-value="98">0</span>
            <span className="text-[9px] text-stone-500 uppercase tracking-widest font-bold mt-2 block">Satisfaction %</span>
          </div>
        </section>

        {/* Sourced Story Timeline */}
        <section className="timeline-section mb-24">
          <span className="text-garnet-400 text-xs font-bold uppercase tracking-[0.3em] block mb-4 text-center">
            The Sourcing Journey
          </span>
          <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-silver-100 mb-12 text-center">
            From Quarry <span className="italic text-garnet-foil">to Living Room</span>
          </h2>

          <div className="relative border-l border-stone-900 ml-4 md:ml-32 py-8 space-y-12">
            {[
              {
                step: "01",
                title: "Raw Block Extraction",
                location: "Carrara (Italy) & Makrana (India)",
                desc: "We physically travel to active quarries to inspect and purchase raw marble blocks directly from quarry fronts. Only blocks with dense crystalline structures make our selection."
              },
              {
                step: "02",
                title: "Precision Slicing",
                location: "Gangsaw Processing Units",
                desc: "Blocks are processed using modern diamond gang saws that slice through rock at calibrated speeds. This guarantees flat slab sizing with less than 1mm of thickness variation."
              },
              {
                step: "03",
                title: "Structural Resining",
                location: "Vacuum Mesh Lines",
                desc: "Slabs with beautiful patterns are treated under vacuum lines with top-grade epoxy resin and fine back-netting. This strengthens natural fissures without coloring the stone's body."
              },
              {
                step: "04",
                title: "Mirror Calibrated Polishing",
                location: "Epoxy Resin Curing",
                desc: "Slabs are polished on multi-head line polishers using progressive grit stones. This brings out a permanent, natural mirror-like luster with gloss indexes exceeding 95%."
              },
              {
                step: "05",
                title: "Signature Studio Laying",
                location: "Angel Studio Yard Jodhpur",
                desc: "Inspect our premium collections in person at our Shankar Nagar studio or preview them warped in perspective on our signature Room Visualizer."
              }
            ].map((item, idx) => (
              <div key={idx} className="timeline-card relative pl-8 md:pl-12 group">
                {/* Timeline node */}
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-stone-950 border border-garnet-400 group-hover:bg-garnet-400 transition-colors duration-300" />
                
                <div className="bg-stone-900/20 border border-stone-900 rounded-xl p-6 md:p-8 hover:border-stone-850 hover:bg-stone-900/30 transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-garnet-400 font-bold uppercase tracking-widest">Step {item.step}</span>
                    <span className="text-[9px] text-stone-500 uppercase font-sans tracking-wider">{item.location}</span>
                  </div>
                  <h4 className="font-serif text-lg md:text-xl text-silver-100 uppercase font-medium group-hover:text-garnet-400 transition-colors mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs text-silver-300 leading-relaxed font-sans max-w-2xl">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pillars Grid */}
        <section className="about-pillars-section grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          <div className="about-pillar border border-stone-900 rounded-xl p-6 bg-stone-900/10">
            <Compass className="w-8 h-8 text-garnet-400 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-silver-100 mb-2">Direct Sourcing</h4>
            <p className="text-[10px] text-stone-400 leading-relaxed">
              We bypass middle agencies, importing blocks directly from quarries in Italy, Turkey, and premium local mines across Rajasthan.
            </p>
          </div>

          <div className="about-pillar border border-stone-900 rounded-xl p-6 bg-stone-900/10">
            <Award className="w-8 h-8 text-garnet-400 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-silver-100 mb-2">Architectural Grade</h4>
            <p className="text-[10px] text-stone-400 leading-relaxed">
              All marble slabs are bookmatched and reinforced to meet commercial and high-end residential load and polish specifications.
            </p>
          </div>

          <div className="about-pillar border border-stone-900 rounded-xl p-6 bg-stone-900/10">
            <Heart className="w-8 h-8 text-garnet-400 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-silver-100 mb-2">Visual Certainty</h4>
            <p className="text-[10px] text-stone-400 leading-relaxed">
              We empower clients with homography room visualizers and layout runs so they are 100% confident in their material choices.
            </p>
          </div>

          <div className="about-pillar border border-stone-900 rounded-xl p-6 bg-stone-900/10">
            <Users className="w-8 h-8 text-garnet-400 mb-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-silver-100 mb-2">Dedicated Sizing</h4>
            <p className="text-[10px] text-stone-400 leading-relaxed">
              Provide cut-to-size cladding, customized stair treads, and custom threshold frames directly prepared from active blocks.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
