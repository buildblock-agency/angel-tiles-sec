export interface Product {
  slug: string;
  name: string;
  category: 'marble' | 'granite' | 'tiles' | 'sanitaryware';
  seoTitle: string;
  seoDescription: string;
  image: string; // main image in public/showroom/image_X.webp
  texture: string; // texture crop in public/textures/texture_X.webp
  spec: {
    origin: string;
    finish: string[];
    sizes: string[];
    application: string[];
  };
  priceRange: string;
  description: string;
  features: string[];
}

export const CATEGORIES = {
  marble: {
    name: "Marble",
    slug: "marble",
    description: "Imported and Indian luxury marble blocks and slabs, hand-selected for premium flooring and wall cladding.",
    seoTitle: "Luxury Marble Suppliers Jodhpur - Italian & Makrana Marble Showroom",
    seoDescription: "Browse the finest selection of Italian Statuario, Makrana White, and imported marble at Angel Tiles & Stone Jodhpur. Perfect for premium residential flooring.",
    heroImage: "/showroom/image_1.webp",
  },
  granite: {
    name: "Granite",
    slug: "granite",
    description: "Highly durable granite slabs with exquisite grain and pattern variants, ideal for kitchen countertops, stairs, and outdoor floors.",
    seoTitle: "Premium Granite Dealers Jodhpur - Kitchen Countertops & Slab Prices",
    seoDescription: "Exquisite granite collection in Jodhpur. Find Rajasthan Black, Jodhpur Red, and Alaska White granite slabs for countertops and premium paving.",
    heroImage: "/showroom/image_4.webp",
  },
  tiles: {
    name: "Tiles",
    slug: "tiles",
    description: "Vitrified, ceramic, PGVT, and elevation tiles in modern finishes and large-format scales.",
    seoTitle: "Premium Vitrified Tiles Showroom Jodhpur - Large Format Floor Tiles",
    seoDescription: "Upgrade your space with vitrified, glazed, and ceramic tiles in Jodhpur. Explore modern floor and wall tiles at Jodhpur's luxury tile studio.",
    heroImage: "/showroom/image_6.webp",
  },
  sanitaryware: {
    name: "Sanitaryware",
    slug: "sanitaryware",
    description: "Sleek wall-hung closets, designer wash basins, and premium matte-black and brass bath fittings.",
    seoTitle: "Luxury Bathroom Sanitaryware Dealers Jodhpur - Bath Fittings",
    seoDescription: "Exquisite sanitaryware collection at Angel Tiles & Stone Jodhpur. Wall-hung toilets, designer tabletop basins, and luxury faucets from top brands.",
    heroImage: "/showroom/image_7.webp",
  }
};

export const PRODUCTS: Product[] = [
  {
    slug: "makrana-white-marble",
    name: "Makrana White Marble",
    category: "marble",
    seoTitle: "Original Makrana Albeta Marble Price Jodhpur - Sourcing & Details",
    seoDescription: "Get the highest grade Makrana White marble in Jodhpur. Authentic Rajasthan marble known for its calcium percentage, iconic luster, and lifelong durability.",
    image: "/showroom/makrana_marble_lobby.webp",
    texture: "/textures/texture_1.webp",
    spec: {
      origin: "Makrana, Rajasthan (India)",
      finish: ["Polished", "Honed", "Unpolished"],
      sizes: ["8x5 feet slabs", "6x4 feet slabs", "Cut-to-size tiles"],
      application: ["Living room flooring", "Pooja room", "Cladding", "Stairs"]
    },
    priceRange: "₹250 - ₹800 per sq ft",
    description: "Sourced directly from the oldest quarries in Makrana, this world-renowned white marble features a signature white base with soft grey and brown linear veins. Known for its extremely high calcium content, it does not turn yellow and develops a gorgeous shine over decades of usage.",
    features: ["Highest calcium concentration (98%+)", "Zero chemical reinforcement", "Translucent quality with subtle glow", "Generational longevity"]
  },
  {
    slug: "italian-statuario-marble",
    name: "Italian Statuario Marble",
    category: "marble",
    seoTitle: "Italian Statuario Marble Slabs Jodhpur - Premium Imports Showroom",
    seoDescription: "Exquisite imported Italian Statuario marble in Jodhpur. High-luster white base with bold grey patterns, ideal for luxurious villa interiors.",
    image: "/showroom/statuario_marble_living.webp",
    texture: "/textures/texture_2.webp",
    spec: {
      origin: "Carrara, Italy",
      finish: ["High-Gloss Polished", "Satin", "Leathereded"],
      sizes: ["9x6 feet jumbo slabs", "7x5 feet slabs"],
      application: ["Feature walls", "Master bath", "Living room highlights", "Countertops"]
    },
    priceRange: "₹950 - ₹2,500 per sq ft",
    description: "The ultimate standard of interior luxury. Featuring a stark, snow-white canvas interrupted by dramatic, sweeping grey veins. Each slab is book-matched to create seamless natural tapestries that serve as the focal point of high-end living spaces.",
    features: ["Dramatic vein matching patterns", "High-gloss mirror finish", "Sourced from Carrara's premium blocks", "Exclusive import selection"]
  },
  {
    slug: "alaska-white-granite",
    name: "Alaska White Granite",
    category: "granite",
    seoTitle: "Alaska White Granite Countertops Jodhpur - Premium Kitchen Stone",
    seoDescription: "Find premium Alaska White granite in Jodhpur. Highly durable, heat-resistant stone with frosty white and silver veins for kitchen slabs.",
    image: "/showroom/alaska_granite_kitchen.webp",
    texture: "/textures/texture_3.webp",
    spec: {
      origin: "Brazil / Rajasthan",
      finish: ["Polished", "Lappato", "Leathered"],
      sizes: ["10x3 feet counter slabs", "8x4 feet slabs"],
      application: ["Kitchen countertops", "Island tables", "Staircases", "Accent columns"]
    },
    priceRange: "₹180 - ₹350 per sq ft",
    description: "A stunning blend of frosty white, cool grey, and charcoal feldspar flecks with silver mica veins. Alaska White offers the beauty of marble with the exceptional structural density and scratch resistance of granite, making it perfect for active kitchens.",
    features: ["Extreme heat & scratch resistance", "Low porosity - stain repellent", "Highly unique, non-repetitive slabs", "Pre-sealed for durability"]
  },
  {
    slug: "rajasthan-black-granite",
    name: "Rajasthan Black Granite",
    category: "granite",
    seoTitle: "Rajasthan Black Granite Slabs Jodhpur - Jet Black Premium Paving",
    seoDescription: "Browse pure jet black granite in Jodhpur. Highly polished, durable black stone slabs for premium kitchen counters, stairs, and outdoor areas.",
    image: "/showroom/image_5.webp",
    texture: "/textures/texture_4.webp",
    spec: {
      origin: "Rajasthan (India)",
      finish: ["Mirror Polished", "Flamed (Outdoor)", "Leathered"],
      sizes: ["9x3 feet slabs", "8x4 feet slabs"],
      application: ["Outdoor stairs", "Door/Window frames", "Kitchen counter", "Facade cladding"]
    },
    priceRange: "₹120 - ₹220 per sq ft",
    description: "A dense, rich jet-black granite with tiny crystalline patterns that catch the light. Highly favored for clean minimalist kitchens, thresholds, door frames, and high-traffic steps due to its low maintenance and high durability.",
    features: ["Jet black consistent grain", "Excellent for flamed outdoor anti-slip steps", "Highly resistant to acidic cleaners", "Exceptional compressive strength"]
  },
  {
    slug: "double-charge-vitrified-tiles",
    name: "Double Charge Vitrified Tiles",
    category: "tiles",
    seoTitle: "Double Charge Floor Tiles Jodhpur - Heavy Duty Vitrified Showroom",
    seoDescription: "Heavy-duty 800x800mm and 600x600mm double charge floor tiles in Jodhpur. Ideal for high-traffic residential and commercial spaces.",
    image: "/showroom/image_6.webp",
    texture: "/textures/texture_5.webp",
    spec: {
      origin: "Morbi, Gujarat (India)",
      finish: ["Super Glossy", "Satin Matt"],
      sizes: ["800x800 mm", "600x600 mm"],
      application: ["Living room floor", "Showroom flooring", "Offices", "Corridors"]
    },
    priceRange: "₹45 - ₹85 per sq ft",
    description: "Manufactured using advanced press machinery, these tiles feature a double-layered pigment surface (3-4mm thicker than standard glazed tiles). They are highly resistant to wear, chipping, and fading, making them the preferred choice for heavy-traffic spaces.",
    features: ["Thick 3-4mm wear layer", "High break resistance", "Stain-proof nano sealing", "Extremely low water absorption (<0.05%)"]
  },
  {
    slug: "polished-glazed-vitrified-tiles",
    name: "PGVT Marble Look Tiles",
    category: "tiles",
    seoTitle: "PGVT Glazed Vitrified Tiles Jodhpur - Marble Finish Slabs",
    seoDescription: "Exquisite PGVT tiles in Jodhpur. Large format 1200x600mm tiles with high-definition digital prints replicating Italian marble veins.",
    image: "/showroom/pgvt_tiles_lobby.webp",
    texture: "/textures/texture_6.webp",
    spec: {
      origin: "Morbi, Gujarat (India)",
      finish: ["High-Gloss Glaze", "Carving", "Baby Satin"],
      sizes: ["1200x600 mm", "1600x800 mm"],
      application: ["Bedroom floors", "Bath walls", "TV unit cladding", "Kitchen walls"]
    },
    priceRange: "₹65 - ₹120 per sq ft",
    description: "Our Polished Glazed Vitrified Tiles (PGVT) utilize advanced 12-color inkjet printing to replicate the exact depth, grain, and color shifts of rare natural marbles like Statuario, Armani Bronze, and Portoro. Delivers a luxury stone look at a fraction of the cost.",
    features: ["Ultra HD digital marble textures", "Mirror gloss reflection index 95+", "Thin joints for seamless laying", "Easy to clean and zero sealing needed"]
  },
  {
    slug: "wall-hung-water-closet",
    name: "Wall-Hung Rimless Closet",
    category: "sanitaryware",
    seoTitle: "Rimless Wall-Hung Toilets Jodhpur - Luxury Bathroom Sanitary",
    seoDescription: "Explore sleek rimless wall-hung water closets in Jodhpur. Modern matte black and white ceramic toilets with UF soft-close seats.",
    image: "/showroom/image_11.webp",
    texture: "/textures/texture_7.webp",
    spec: {
      origin: "Imported / Indian OEM",
      finish: ["Matte White", "Glossy White", "Matte Blacked"],
      sizes: ["520x360x340 mm"],
      application: ["Modern bathrooms", "Powder rooms", "Commercial washrooms"]
    },
    priceRange: "₹8,500 - ₹22,000 per unit",
    description: "Sleek wall-hung ceramic commode with a modern rimless bowl design. Features dual-flush swirl flushing technology for superior hygiene, and a quick-release Urea Formaldehyde (UF) soft-close seat cover that is highly scratch-resistant.",
    features: ["Rimless design - 100% hygienic cleaning", "Super quiet swirl flush", "UF soft-close durable seat cover", "Dirt-repellent nano-glaze coating"]
  },
  {
    slug: "designer-tabletop-washbasin",
    name: "Designer Ceramic Tabletop Basin",
    category: "sanitaryware",
    seoTitle: "Designer Wash Basins Jodhpur - Luxury Tabletop Ceramic Basins",
    seoDescription: "Tabletop ceramic basins in Jodhpur. Shop matte finishes, thin-edge basins, and hand-crafted bathroom vanity essentials.",
    image: "/showroom/image_12.webp",
    texture: "/textures/texture_8.webp",
    spec: {
      origin: "Morbi, Gujarat",
      finish: ["Matte Terracotta", "Matte Black", "Emerald Green", "Rose Gold Detail"],
      sizes: ["480x370x130 mm", "400x400x120 mm"],
      application: ["Vanity counters", "Dining handwash area", "Powder toilets"]
    },
    priceRange: "₹3,200 - ₹9,500 per unit",
    description: "Crafted from fine clay under high kiln temperatures, our designer tabletop basins feature a sleek 5mm ultra-thin edge profile. Available in curated pastel and earthy matte colors, they serve as a striking visual centerpiece for modern vanity counters.",
    features: ["Ultra-thin 5mm edge profile", "Non-fading matte finish glazes", "Splash-proof bowl depth", "High shock and chip resistance"]
  },
  {
    slug: "jodhpur-red-granite",
    name: "Jodhpur Red Granite",
    category: "granite",
    seoTitle: "Jodhpur Red Granite Slabs Price - Rajasthan Paving Stone",
    seoDescription: "Sourcing premium Jodhpur Red Granite in Rajasthan. Durable, flamed red stone slabs for outdoor steps, pathways, and rustic elevations.",
    image: "/showroom/image_9.webp",
    texture: "/textures/texture_4.webp",
    spec: {
      origin: "Jodhpur, Rajasthan (India)",
      finish: ["Polished", "Flamed", "Lappato"],
      sizes: ["9x3 feet counter slabs", "8x4 feet slabs"],
      application: ["Outdoor stairs", "Wall cladding", "Paving", "Kitchen tops"]
    },
    priceRange: "₹90 - ₹160 per sq ft",
    description: "A locally sourced Rajasthan granite featuring a deep brick-red background with dark brown and black mineral spots. Extremely popular for exterior pathways, wall cladding, and anti-slip stair steps due to its weathering resistance.",
    features: ["High compressive strength", "Rich native color tones", "Anti-slip flamed options", "Extremely low thermal expansion"]
  },
  {
    slug: "carrara-white-marble",
    name: "Carrara White Marble",
    category: "marble",
    seoTitle: "Imported Carrara White Marble Slabs Jodhpur - Italian Stone Prices",
    seoDescription: "Classic imported Italian Carrara White marble in Jodhpur. Features fine, feather grey veins on a soft white base for luxury home flooring.",
    image: "/showroom/image_13.webp",
    texture: "/textures/texture_3.webp",
    spec: {
      origin: "Carrara, Tuscany (Italy)",
      finish: ["Mirror Polished", "Honed", "Satin"],
      sizes: ["8x5 feet slabs", "7x4 feet slabs"],
      application: ["Living room flooring", "Bath wall cladding", "Thresholds"]
    },
    priceRange: "₹350 - ₹650 per sq ft",
    description: "A classic Italian marble imported directly from Tuscany. Features a soft greyish-white background decorated with fine, feathery grey veins. Gives an incredibly elegant, clean look to residential floors.",
    features: ["Classic grey feather veining", "High mirror gloss index", "Imported direct from Tuscany", "Timeless architectural choice"]
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter(p => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return PRODUCTS.filter(p => p.category === product.category && p.slug !== product.slug).slice(0, limit);
}
