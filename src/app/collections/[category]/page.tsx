import { notFound } from 'next/navigation';
import CategoryClient from '@/components/CategoryClient';
import { CATEGORIES, getProductsByCategory, PRODUCTS } from '@/content/products';

// Pre-generate static parameters for Next.js Static Site Generation (SSG)
export async function generateStaticParams() {
  return [
    { category: 'marble' },
    { category: 'granite' },
    { category: 'tiles' },
    { category: 'sanitaryware' }
  ];
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

  // Curated 200-400 word SEO on-page blocks targeting Jodhpur local queries
  const seoBlocks = {
    marble: `
      <p>Choosing the right <strong>marble suppliers in Jodhpur</strong> requires understanding the geological grades of the stone. Italian marble options like Statuario and Carrara are prized for their crystalline white backgrounds and sweeping veins, elevating luxury interiors to art pieces. Indian marble varieties, particularly from the historical quarries of Makrana, remain unmatched in durability and calcium percentage. Unlike vitrified alternatives, real marble slabs are highly translucent, developing a rich generational shine over decades.</p>
      <p>When procurement is planned, visiting a specialized showroom to inspect complete book-matched slab runs is critical. At Angel Tiles & Stone Jodhpur, we display full slab sets under natural daylighting and warm spotlights so architects and clients can preview the final vein intersections. Our slabs are reinforced with high-strength resins and hand-inspected for core density to guarantee perfect structural stability during floor layout laying.</p>
    `,
    granite: `
      <p>Granite slabs are the premier selection for kitchen counter slabs, stair treads, and heavy-duty thresholds in Rajasthan. Sourced from the ancient crags of the Aravalli range, granite presents extreme compressive strength and scratch-free density. Variants like Jodhpur Red and Rajasthan Black are favored locally for outdoor paving due to their resistance to blistering heat and weathering. Imported granites like Alaska White incorporate silver mica crystals that shimmer under overhead spotlighting.</p>
      <p>As the leading <strong>granite dealers in Jodhpur</strong>, we supply slabs pre-calibrated and polished to mirror indexes. Granite countertops are highly resistant to acidic stains from lemon juice or vinegar when properly sealed. Our installation guide recommends applying a premium impregnating stone sealer immediately after laying to protect the natural crystalline pores from long-term oil absorption.</p>
    `,
    tiles: `
      <p>Modern vitrified tiles are the cornerstone of speed and low-maintenance in modern architectures. Glazed Vitrified Tiles (GVT) and Polished Glazed Vitrified Tiles (PGVT) offer extremely realistic high-definition replicas of rare marbles, concrete, and wooden planks. For high-traffic commercial projects, Double Charge vitrified tiles are engineered with a dual pigment layer that stands up to heavy wear without showing signs of traffic wear.</p>
      <p>At our premium <strong>tiles showroom in Jodhpur</strong>, we showcase large-format tiles sizing up to 1200x600mm and 1600x800mm. Laying larger tiles minimizes joint grouts, creating the illusion of a monolithic slab floor. All our tile products feature high break resistance, zero water absorption (<0.05%), and flat structural edges for neat laying with minimal leveling offsets.</p>
    `,
    sanitaryware: `
      <p>Luxury bathroom designs demand a clean alignment of sanitaryware and brassware. The shift towards minimal wall-hung closets with concealed flush systems has transformed toilets from utilities to clean design extensions. Choosing closets with rimless bowl geometry ensures 100% flushing coverage, eliminating standard hidden corners where bacteria and water scales gather over time.</p>
      <p>As premium <strong>sanitaryware showroom dealers in Jodhpur</strong>, we house modern matte-colored tabletop washbasins, rimless water closets, and premium bath fittings. Our basins feature ultra-thin 5mm structural edges crafted from refined clays fired at high kiln temperatures. All ceramic glazes incorporate a dirt-repellent nano-coating, ensuring water sheets off without leaving chalky deposits.</p>
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
