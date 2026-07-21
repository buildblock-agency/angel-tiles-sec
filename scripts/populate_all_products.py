import json
import os

manifest_file = r"d:\angel tiles updated\angel-tiles\scripts\full_catalog_cloudinary_manifest.json"
products_file = r"d:\angel tiles updated\angel-tiles\src\content\products.ts"

with open(manifest_file, 'r', encoding='utf-8') as f:
    items = json.load(f)

# Construct clean TypeScript code
ts_code = '''export interface Product {
  slug: string;
  name: string;
  category: 'tiles' | 'imported-marble' | 'custom-tiles' | 'granite' | 'domestic-marble' | 'digital-3d-7d-tiles' | 'ceramic-crystal-tiles' | 'sanitary-items';
  seoTitle: string;
  seoDescription: string;
  image: string;
  texture: string;
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
  "imported-marble": {
    name: "Imported Marble",
    slug: "imported-marble",
    description: "Exclusive Italian, Carrara, and Statuario marble blocks and slabs imported directly for villa living areas and master baths.",
    seoTitle: "Imported Italian Marble Dealers Jodhpur — Statuario & Carrara Slabs",
    seoDescription: "Explore imported Italian Statuario, Carrara White, and luxury European marble at Angel Tiles & Stone Jodhpur.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616060/angel-tiles/imported-marble/book-match-600-x-1200-mm-p2.webp",
  },
  "domestic-marble": {
    name: "Domestic Marble",
    slug: "domestic-marble",
    description: "Authentic Makrana Albeta, Rajnagar, and premium Indian white marble slabs direct from historical Rajasthan quarries.",
    seoTitle: "Makrana White Marble Suppliers Jodhpur — Indian Marble Slabs",
    seoDescription: "Authentic Makrana White, Albeta, and Indian marble in Jodhpur.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616174/angel-tiles/domestic-marble/terazzo-600-x-1200-mm-p2.webp",
  },
  "granite": {
    name: "Granite",
    slug: "granite",
    description: "High-density granite slabs with exquisite natural grain variants for kitchen countertops, stairs, and exterior thresholds.",
    seoTitle: "Premium Granite Dealers Jodhpur — Kitchen Countertop Slabs",
    seoDescription: "Explore Rajasthan Black, Alaska White, and 15mm Carving granite slabs for countertops.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616058/angel-tiles/granite/15mm-carving-gvtbody-p2.webp",
  },
  "tiles": {
    name: "Tiles",
    slug: "tiles",
    description: "Large-format vitrified floor slabs, double charge, Astral Series 1200x1800mm, and architectural floor tiles.",
    seoTitle: "Vitrified & Floor Tiles Showroom Jodhpur — Large Format Slabs",
    seoDescription: "Upgrade your spaces with Astral Series 1200x1800mm and 600x1200mm endless vitrified floor tiles.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616074/angel-tiles/tiles/astral-series-1200x1800-volume-1-p2.webp",
  },
  "custom-tiles": {
    name: "Custom Tiles",
    slug: "custom-tiles",
    description: "Bespoke architectural ceramic tiles, designer terrazzo patterns, and customized waterjet mosaic compositions.",
    seoTitle: "Custom Architectural Tiles Jodhpur — Waterjet & Designer Mosaic",
    seoDescription: "Custom handcrafted ceramic tiles and bespoke floor patterns crafted to architectural specifications.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616072/angel-tiles/tiles/600x1800-punch-collection-2025-nl-p2.webp",
  },
  "digital-3d-7d-tiles": {
    name: "Digital 3D / 7D Tiles",
    slug: "digital-3d-7d-tiles",
    description: "High-definition 3D & 7D carved wall tiles creating tactile depth, metallic highlights, and realistic stone reliefs.",
    seoTitle: "Digital 3D 7D Carving Elevation Tiles Jodhpur — Feature Wall Slabs",
    seoDescription: "Stunning 3D and 7D relief carving tiles in Jodhpur. High-definition textured wall tiles for exterior elevations.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616050/angel-tiles/digital-3d-7d-tiles/12x18-elevation-5-p2.webp",
  },
  "ceramic-crystal-tiles": {
    name: "Ceramic Crystal Tiles",
    slug: "ceramic-crystal-tiles",
    description: "Crystal-glazed ceramic wall tiles with mirror reflective brilliance for luxury bathrooms and kitchen dado walls.",
    seoTitle: "Ceramic Crystal Glazed Wall Tiles Jodhpur — High Gloss Bathroom Tiles",
    seoDescription: "Discover crystal glazed ceramic wall tiles in Jodhpur. Ultra-smooth mirror glaze for easy-cleaning bathroom walls.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784615995/angel-tiles/ceramic-crystal-tiles/12x18-glossy-1-p2.webp",
  },
  "sanitary-items": {
    name: "Sanitary Items",
    slug: "sanitary-items",
    description: "Sleek wall-hung rimless closets, designer tabletop ceramic washbasins, quartz kitchen sinks, and luxury vanity suites.",
    seoTitle: "Luxury Bathroom Sanitary Items Jodhpur — Basins, Sinks & Vanities",
    seoDescription: "Exquisite sanitaryware items at Angel Studio Jodhpur. Golden electroplated basins, marble washbasins, quartz sinks.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616180/angel-tiles/sanitary-items/golden-basin-of-tita-sanitarywares-p2.webp",
  }
};

export const PRODUCTS: Product[] = [
  // Imported Marble
  {
    slug: "statuario-endless-bookmatch-marble",
    name: "Statuario Endless Bookmatch Marble",
    category: "imported-marble",
    seoTitle: "Statuario Endless Bookmatch Marble Slabs Jodhpur",
    seoDescription: "Exclusive Italian Statuario Endless bookmatch marble slabs in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616060/angel-tiles/imported-marble/book-match-600-x-1200-mm-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616061/angel-tiles/imported-marble/book-match-600-x-1200-mm-p4.webp",
    spec: {
      origin: "Carrara, Italy",
      finish: ["High-Gloss Polished", "Bookmatched"],
      sizes: ["1200x600 mm", "2400x1200 mm"],
      application: ["Living room floor", "Master bath feature wall"]
    },
    priceRange: "₹850 - ₹2,200 per sq ft",
    description: "Endless Statuario bookmatched marble slabs featuring continuous flowing grey veins across mirror-polished European white marble.",
    features: ["Continuous vein-matching layout", "High-gloss mirror reflective index", "Sourced from Italian Carrara blocks"]
  },
  {
    slug: "multi-statuario-endless-marble",
    name: "Multi-Statuario Endless Italian Slab",
    category: "imported-marble",
    seoTitle: "Multi-Statuario Italian Marble Slabs Jodhpur",
    seoDescription: "Multi-pattern Statuario Italian marble slabs for villa living rooms.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616177/angel-tiles/imported-marble/multi-statuario-endless-600-x-1200-mm-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616178/angel-tiles/imported-marble/multi-statuario-endless-600-x-1200-mm-p4.webp",
    spec: {
      origin: "Tuscany, Italy",
      finish: ["Mirror Gloss", "Leathered"],
      sizes: ["1200x600 mm"],
      application: ["Foyer flooring", "Accent walls"]
    },
    priceRange: "₹650 - ₹1,800 per sq ft",
    description: "Deep grey feathery veining on crisp translucent white Italian marble.",
    features: ["Dramatic vein variation", "Low porosity", "Timeless European aesthetic"]
  },

  // Domestic Marble
  {
    slug: "makrana-albeta-terrazzo-marble",
    name: "Makrana Terrazzo Heritage Marble",
    category: "domestic-marble",
    seoTitle: "Makrana Terrazzo Heritage Marble Jodhpur",
    seoDescription: "Authentic Makrana Albeta terrazzo style natural marble slabs.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616174/angel-tiles/domestic-marble/terazzo-600-x-1200-mm-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616175/angel-tiles/domestic-marble/terazzo-600-x-1200-mm-p4.webp",
    spec: {
      origin: "Makrana, Rajasthan",
      finish: ["Natural Polish", "Honed"],
      sizes: ["1200x600 mm", "8x4 feet slabs"],
      application: ["Living room flooring", "Courtyards"]
    },
    priceRange: "₹220 - ₹650 per sq ft",
    description: "Highest calcium concentration Indian white marble with subtle terrazzo stone aggregate patterns.",
    features: ["Zero yellowing over time", "Cool thermal insulation", "Generational durability"]
  },

  // Granite
  {
    slug: "carving-gvt-body-granite-slab",
    name: "15mm Carving GVT Architectural Granite",
    category: "granite",
    seoTitle: "15mm Heavy Duty Carving Granite Slabs Jodhpur",
    seoDescription: "15mm heavy duty structural carving granite slabs for kitchen counters.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616058/angel-tiles/granite/15mm-carving-gvtbody-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616059/angel-tiles/granite/15mm-carving-gvtbody-p4.webp",
    spec: {
      origin: "Rajasthan Quarries",
      finish: ["15mm Tactile Carving", "Lappato"],
      sizes: ["15mm Thickness", "1200x600 mm"],
      application: ["Kitchen countertops", "Stair treads", "Facade cladding"]
    },
    priceRange: "₹190 - ₹380 per sq ft",
    description: "15mm ultra-dense granite slab featuring micro-carved tactile surface grip for high-end kitchen countertops.",
    features: ["15mm full-body thickness", "Scratch & acid heat resistant", "Anti-skid texture"]
  },

  // Tiles
  {
    slug: "astral-jumbo-series-1200x1800",
    name: "Astral Series Jumbo Floor Slab (1200x1800mm)",
    category: "tiles",
    seoTitle: "Astral Series 1200x1800mm Large Format Floor Slabs Jodhpur",
    seoDescription: "Jumbo format 1200x1800mm vitrified floor slabs in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616074/angel-tiles/tiles/astral-series-1200x1800-volume-1-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616075/angel-tiles/tiles/astral-series-1200x1800-volume-1-p4.webp",
    spec: {
      origin: "Morbi, Gujarat",
      finish: ["Super Glossy", "Carving Satin"],
      sizes: ["1200x1800 mm"],
      application: ["Villa living hall", "Commercial showroom", "Hotel lobbies"]
    },
    priceRange: "₹120 - ₹240 per sq ft",
    description: "Grand 1200x1800mm jumbo format vitrified slab creating seamless, uninterrupted luxury floor expanses.",
    features: ["Jumbo 1200x1800mm dimensions", "Minimal grout joint lines", "Stain repellent nano glaze"]
  },
  {
    slug: "glossy-endless-vol-3-slab",
    name: "Glossy Endless Vol-3 Vitrified Slab (600x1200mm)",
    category: "tiles",
    seoTitle: "Glossy Endless Vol-3 Floor Tiles Jodhpur",
    seoDescription: "600x1200mm glossy endless pattern vitrified tiles in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616215/angel-tiles/tiles/glossy-endless-vol-3-600-x-1200-mm-1-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616216/angel-tiles/tiles/glossy-endless-vol-3-600-x-1200-mm-1-p4.webp",
    spec: {
      origin: "Morbi, Gujarat",
      finish: ["Endless High Gloss"],
      sizes: ["600x1200 mm"],
      application: ["Bedrooms", "Dining area", "Bathrooms"]
    },
    priceRange: "₹75 - ₹130 per sq ft",
    description: "Endless pattern continuous flow tile design bringing natural stone depth into residential rooms.",
    features: ["Endless continuous pattern", "High mirror gloss reflection index", "Durable vitrified body"]
  },
  {
    slug: "eclipsia-matt-series-slab",
    name: "Eclipsia Architectural Matt Slab (1200x1800mm)",
    category: "tiles",
    seoTitle: "Eclipsia Matt Series 1200x1800mm Floor Slabs Jodhpur",
    seoDescription: "Soft-touch matte finish 1200x1800mm slabs in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616207/angel-tiles/tiles/eclipsia-matt-series-1200x1800mm-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616208/angel-tiles/tiles/eclipsia-matt-series-1200x1800mm-p4.webp",
    spec: {
      origin: "Morbi, Gujarat",
      finish: ["Eclipsia Soft Matt", "Anti-Skid"],
      sizes: ["1200x1800 mm"],
      application: ["Living rooms", "Outdoor verandas", "Boutique offices"]
    },
    priceRange: "₹110 - ₹210 per sq ft",
    description: "Sophisticated matte tactile finish slab designed for minimalist, modern architectural environments.",
    features: ["Soft-touch matte glaze", "Anti-fingerprint & scratch resistant", "Large 1200x1800 format"]
  },

  // Custom Tiles
  {
    slug: "600x1800-punch-architectural-tile",
    name: "600x1800 Punch Relief Architectural Tile",
    category: "custom-tiles",
    seoTitle: "600x1800 Punch Collection Custom Tiles Jodhpur",
    seoDescription: "Bespoke 600x1800mm punch relief architectural tiles in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616072/angel-tiles/tiles/600x1800-punch-collection-2025-nl-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616073/angel-tiles/tiles/600x1800-punch-collection-2025-nl-p4.webp",
    spec: {
      origin: "Custom Studio Craft",
      finish: ["3D Punch Relief", "Metallic Inlay"],
      sizes: ["600x1800 mm"],
      application: ["Feature walls", "Pooja backdrop", "Foyer accents"]
    },
    priceRange: "₹280 - ₹750 per sq ft",
    description: "Bespoke 600x1800mm architectural punch collection tile featuring deep structural texture and metallic highlights.",
    features: ["Deep 3D punch texture", "Custom architectural sizing", "Hand-finished detail"]
  },

  // Digital 3D / 7D Tiles
  {
    slug: "digital-7d-elevation-carving-tile",
    name: "Digital 7D Carving Elevation Tile (12x18)",
    category: "digital-3d-7d-tiles",
    seoTitle: "Digital 7D Elevation Carving Tiles Jodhpur",
    seoDescription: "Tactile 7D digital carving relief wall tiles in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616050/angel-tiles/digital-3d-7d-tiles/12x18-elevation-5-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616051/angel-tiles/digital-3d-7d-tiles/12x18-elevation-5-p4.webp",
    spec: {
      origin: "Morbi, Gujarat",
      finish: ["7D Carving Relief", "Weatherproof Coating"],
      sizes: ["300x450 mm (12x18 in)"],
      application: ["Exterior elevation", "Boundary wall", "Pillars"]
    },
    priceRange: "₹85 - ₹190 per sq ft",
    description: "High-definition 7D digital relief carving tile engineered for weather-proof exterior stone elevations.",
    features: ["Weather & UV proof", "3D stone relief detail", "Zero maintenance"]
  },
  {
    slug: "digital-3d-pooja-sacred-tile",
    name: "Digital 3D Pooja Sacred Wall Tile",
    category: "digital-3d-7d-tiles",
    seoTitle: "Digital 3D Pooja Room Decorative Wall Tiles Jodhpur",
    seoDescription: "Digital 3D relief tiles for sacred Pooja rooms in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616056/angel-tiles/digital-3d-7d-tiles/12x18-pooja-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616057/angel-tiles/digital-3d-7d-tiles/12x18-pooja-p4.webp",
    spec: {
      origin: "Morbi, Gujarat",
      finish: ["3D Gold Embossed", "Crystal Gloss"],
      sizes: ["300x450 mm (12x18 in)"],
      application: ["Pooja room wall", "Mandir backdrop"]
    },
    priceRange: "₹95 - ₹220 per sq ft",
    description: "Sacred 3D digital motif tile with gold highlights and crystal glaze layer designed for temple backdrops.",
    features: ["Gold foil 3D embossing", "High resolution print", "Stain resistant surface"]
  },

  // Ceramic Crystal Tiles
  {
    slug: "12x18-crystal-glossy-wall-tile",
    name: "Crystal Mirror Glossy Wall Tile (12x18)",
    category: "ceramic-crystal-tiles",
    seoTitle: "12x18 Crystal Glazed Mirror Gloss Wall Tiles Jodhpur",
    seoDescription: "High-shine crystal glazed ceramic wall tiles in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784615995/angel-tiles/ceramic-crystal-tiles/12x18-glossy-1-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784615996/angel-tiles/ceramic-crystal-tiles/12x18-glossy-1-p4.webp",
    spec: {
      origin: "Morbi, Gujarat",
      finish: ["Crystal Mirror Gloss"],
      sizes: ["300x450 mm (12x18 in)"],
      application: ["Bathroom walls", "Kitchen dado", "Wash area"]
    },
    priceRange: "₹45 - ₹95 per sq ft",
    description: "Ultra-reflective crystal glass glaze yielding a liquid-smooth mirror finish that repels soap scum and water stains.",
    features: ["Liquid mirror reflection", "Easy wipe-clean surface", "High definition ceramic body"]
  },
  {
    slug: "12x18-kitchen-dado-crystal-tile",
    name: "Kitchen Dado Designer Crystal Tile (12x18)",
    category: "ceramic-crystal-tiles",
    seoTitle: "Kitchen Backsplash Dado Crystal Glazed Tiles Jodhpur",
    seoDescription: "Designer kitchen dado wall tiles with crystal glaze layer in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616046/angel-tiles/ceramic-crystal-tiles/12x18-kitchen-02-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616047/angel-tiles/ceramic-crystal-tiles/12x18-kitchen-02-p4.webp",
    spec: {
      origin: "Morbi, Gujarat",
      finish: ["High-Gloss Dado Decor"],
      sizes: ["300x450 mm (12x18 in)"],
      application: ["Kitchen backsplash", "Dado wall"]
    },
    priceRange: "₹50 - ₹110 per sq ft",
    description: "High-contrast kitchen dado ceramic tile with oil-repellent crystal surface built for heavy cooktop heat.",
    features: ["Oil & stain repellent", "Heat resistant glaze", "Vivid decor motifs"]
  },

  // Sanitary Items
  {
    slug: "tita-golden-electroplated-washbasin",
    name: "Tita Golden Electroplated Tabletop Basin",
    category: "sanitary-items",
    seoTitle: "Tita Golden Electroplated Tabletop Wash Basins Jodhpur",
    seoDescription: "Luxury golden electroplated ceramic tabletop washbasins in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616180/angel-tiles/sanitary-items/golden-basin-of-tita-sanitarywares-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616181/angel-tiles/sanitary-items/golden-basin-of-tita-sanitarywares-p4.webp",
    spec: {
      origin: "Tita Sanitarywares",
      finish: ["Brushed Gold Electroplated", "Scratchproof Glaze"],
      sizes: ["480x370x130 mm"],
      application: ["Master vanity counters", "Dining handwash area"]
    },
    priceRange: "₹4,500 - ₹14,500 per unit",
    description: "Handcrafted ceramic tabletop washbasin with electroplated gold finish and non-fading metallic luster.",
    features: ["Brushed gold electroplating", "5mm ultra-thin edge", "Scratchproof glaze coating"]
  },
  {
    slug: "tita-marble-grain-washbasin",
    name: "Tita Statuario Marble Basin Suite",
    category: "sanitary-items",
    seoTitle: "Tita Statuario Marble Pattern Wash Basins Jodhpur",
    seoDescription: "Authentic Statuario marble texture ceramic washbasins in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616182/angel-tiles/sanitary-items/marble-basin-of-tita-sanitarywares-compressed-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616183/angel-tiles/sanitary-items/marble-basin-of-tita-sanitarywares-compressed-p4.webp",
    spec: {
      origin: "Tita Sanitarywares",
      finish: ["Statuario Marble Texture", "Satin Matt"],
      sizes: ["420x420x140 mm"],
      application: ["Vanity counters", "Powder rooms"]
    },
    priceRange: "₹3,800 - ₹9,800 per unit",
    description: "Countertop washbasin featuring natural Statuario marble veining high-fired into fine ceramic clay.",
    features: ["Statuario marble pattern", "Dirt-repellent nano coating", "High chip resistance"]
  },
  {
    slug: "tita-quartz-kitchen-sink",
    name: "Tita Composite Quartz Kitchen Sink",
    category: "sanitary-items",
    seoTitle: "Tita Composite Quartz Kitchen Sinks Jodhpur",
    seoDescription: "High-density composite quartz granite kitchen sinks in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616184/angel-tiles/sanitary-items/tita-quartz-kitchen-sink-1-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616185/angel-tiles/sanitary-items/tita-quartz-kitchen-sink-1-p4.webp",
    spec: {
      origin: "Tita Sanitarywares",
      finish: ["Granite Quartz Matte", "Non-Porous"],
      sizes: ["24x18 in", "36x18 in double bowl"],
      application: ["Kitchen wash zone"]
    },
    priceRange: "₹6,800 - ₹18,500 per unit",
    description: "Composite quartz kitchen sink engineered with 80% natural quartz granite matrix for sound dampening and zero staining.",
    features: ["80% quartz granite composition", "Sound deadening heavy bowl", "Heat & thermal shock proof"]
  },
  {
    slug: "tita-architectural-vanity-suite",
    name: "Tita Architectural Bathroom Vanity Suite",
    category: "sanitary-items",
    seoTitle: "Tita Bathroom Vanity Cabinets & Countertop Basins Jodhpur",
    seoDescription: "Moisture-proof bathroom vanity units with integrated basins in Jodhpur.",
    image: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616186/angel-tiles/sanitary-items/tita_vanity_brochure-p2.webp",
    texture: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616187/angel-tiles/sanitary-items/tita_vanity_brochure-p4.webp",
    spec: {
      origin: "Tita Sanitarywares",
      finish: ["Moisture Proof HDHMR", "Soft Close German Hardware"],
      sizes: ["600mm", "800mm", "1000mm"],
      application: ["Master bathroom vanity"]
    },
    priceRange: "₹16,500 - ₹42,000 per suite",
    description: "Complete architectural vanity suite featuring moisture-resistant cabinet console and seamless ceramic washbasin.",
    features: ["Waterproof HDHMR construction", "German soft-close drawer slides", "Integrated mirror console"]
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
'''

with open(products_file, 'w', encoding='utf-8') as f:
    f.write(ts_code)

print("\nSuccessfully updated src/content/products.ts with clean TypeScript code!")
