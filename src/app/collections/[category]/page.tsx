import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { CATEGORIES, getProductsByCategory } from '@/content/products';

const CategoryClient = dynamic(() => import('@/components/CategoryClient'), {
  loading: () => (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-garnet-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-stone-400 uppercase tracking-widest">Loading Collection...</span>
      </div>
    </div>
  ),
});

// Pre-generate static parameters for Next.js Static Site Generation (SSG)
export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({
    category: slug,
  }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const categoryKey = params.category as keyof typeof CATEGORIES;
  const category = CATEGORIES[categoryKey];

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.seoTitle,
    description: category.seoDescription,
  };
}

export default async function CategoryPage(props: { params: Promise<{ category: string }> }) {
  const params = await props.params;
  const categoryKey = params.category as keyof typeof CATEGORIES;
  const category = CATEGORIES[categoryKey];

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(categoryKey);

  // Curated SEO on-page blocks targeting Jodhpur local queries
  const seoBlocks: Record<string, string> = {
    "imported-marble": `
      <p>Choosing imported Italian marble for luxury residences in Jodhpur requires selecting blocks with consistent grain structure and zero structural micro-fissures. Varieties like Statuario and Carrara White provide snow-white canvases with dramatic or feathery grey veining that elevate living room floors into gallery-level artwork.</p>
      <p>At Angel Studio Jodhpur, we showcase complete book-matched imported slab runs under natural daylighting so architects and clients can preview final vein intersections prior to installation.</p>
    `,
    "domestic-marble": `
      <p>Authentic Makrana White marble from historical Rajasthan quarries is world-renowned for its extremely high calcium concentration (98%+) and zero chemical fillers. Unlike softer limestone imports, Makrana marble never yellows over time and develops an exquisite deep luster over generations.</p>
      <p>We source Makrana Albeta and Rajnagar marble slabs directly from trusted quarry owners, delivering authentic Rajasthan heritage stone with full slab transparency.</p>
    `,
    "granite": `
      <p>Granite slabs are the premier selection for kitchen counter slabs, stair treads, and heavy-duty thresholds in Rajasthan. Sourced from the Aravalli range, granite presents extreme compressive strength and scratch-free density. Variants like Jodhpur Red and Rajasthan Black are favored locally for outdoor paving due to their weather resistance.</p>
      <p>As leading granite dealers in Jodhpur, we supply slabs pre-calibrated and polished to mirror index levels for seamless countertop laying.</p>
    `,
    "tiles": `
      <p>Modern vitrified tiles are the cornerstone of speed and minimal maintenance. Glazed Vitrified Tiles (GVT) and Polished Glazed Vitrified Tiles (PGVT) offer high-definition replicas of rare marbles and architectural concrete in formats up to 1600x800mm.</p>
      <p>At our Jodhpur studio, explore large-format vitrified floor slabs engineered with high break resistance, zero water absorption (<0.05%), and micro-rectified edges.</p>
    `,
    "custom-tiles": `
      <p>Custom architectural tiles and precision waterjet mosaic compositions allow architects to create signature foyer floor medallions, Pooja room backdrops, and bespoke hotel lobbies.</p>
      <p>Angel Studio collaborates with designers to fabricate custom terrazzo patterns and marble waterjet inlays tailored precisely to project CAD layouts.</p>
    `,
    "digital-3d-7d-tiles": `
      <p>Digital 3D and 7D carving elevation tiles combine multi-layer textured printing with metallic shimmer accents to create realistic stone reliefs and tactile depth on exterior facades and interior feature walls.</p>
      <p>Our 7D carving tiles are engineered to withstand extreme UV exposure without fading or thermal cracking.</p>
    `,
    "ceramic-crystal-tiles": `
      <p>Crystal glazed ceramic wall tiles feature a high-firing mirror glass glaze that offers brilliant light reflection while repelling moisture and soap scums in bathroom wall cladding.</p>
      <p>Explore an array of vibrant colors and ultra-smooth ceramic wall finishes at our Jodhpur studio.</p>
    `,
    "sanitary-items": `
      <p>Luxury bathroom designs demand a clean alignment of sanitaryware items. Minimal wall-hung rimless closets with concealed flush systems ensure 100% flushing coverage with quiet swirl operation.</p>
      <p>Pair wall-hung closets with our ultra-thin 5mm tabletop ceramic washbasins in matte terracotta, black, and pastel tones for a sophisticated vanity centerpiece.</p>
    `
  };

  const seoText = seoBlocks[categoryKey] || "";

  return (
    <CategoryClient
      categoryName={category.name}
      categoryDesc={category.description}
      seoText={seoText}
      products={categoryProducts}
    />
  );
}

