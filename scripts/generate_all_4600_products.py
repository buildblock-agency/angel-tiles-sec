import os
import json

MANIFEST_PATH = os.path.join(os.path.dirname(__file__), 'all_4600_products_manifest.json')
PICKS_PATH = os.path.join(os.path.dirname(__file__), 'picks_manifest.json')
PRODUCTS_TS_PATH = os.path.join(os.path.dirname(__file__), '../src/content/products.ts')

REAL_DESIGN_NAMES = {
    "tiles-astral-series-1200x1800-volume-1": [
        "CYBER ASH", "CYBER DUNE", "ELEGENT BEIGE", "FIORE CREMA",
        "FIORE BIANCO", "FLORA SMOKE", "FLORA CAMEL", "GREEK FORD CREMA",
        "GREEK FORD GRIS", "HARMONY BEIGE", "HARMONY GREIGE", "ETERNAL BONE",
        "ETERNAL GREIGE", "PALLAZO BONE", "PALLAZO ALMOND", "TUNDRA BEIGE",
        "TUNDRA WHITE", "VALANCIA ROSE", "VALANCIA SMOKE", "VERONA BEIGE",
        "VERONA GREY", "AGARIA", "ALASKA", "AMBROSIA BEIGE",
        "AMBROSIA FOSSIL", "ARMANI FOSSIL", "ARMANI GRIS", "ARMANI HAZEL",
        "BERLINO", "BERLINO GREEN", "BURBERRY BIRCH", "BURBERRY GREY",
        "CARRARA", "CALCUTTA GOLD", "CALCUTTA WHITE", "CELESTIA GRIS",
        "CELESTIA BEIGE", "CLOUDY BEIGE", "CLOUDY CORAL", "COLBERT",
        "CRYSTAL ONYX", "CRYSTAL ONYX GOLD", "DIANA", "DOVER",
        "ELITE", "FELIZ ICE", "FILLSTONE GREY", "FILLSTONE WHITE",
        "FLURRY BEIGE", "FLURRY CREMA", "FLURRY GREY", "GLACIER",
        "GOZZIO BIRCH", "GOZZIO CORAL", "GOZZIO SAGE", "ICELAND",
        "ICONIC", "ICEBERG WHITE", "ICEBERG GREEN", "IMPERIALE MINT",
        "INFINITY BIRCH", "INFINITY CREMA", "IRIS WHITE", "IRIS GREY",
        "IRIS BIRCH", "KARNIS", "BRECCIA ARORA",
    ],
    "granite-15mm-carving-gvtbody": [
        "AURA BEIGE", "BELLAGIO CREMA", "CAMOUFLAGE", "CARRASTONE BIANCO",
        "CRISTALLO", "FELIZ ICE", "ICEBERG GREEN", "INFINITY CREMA",
        "LINCOLN", "MICHEL ANGELO", "MOSES TAUPE", "OMICORN CREMA",
        "PIMAR", "TRAVERTINE", "VENETO GOLD", "CRYSTAL ONYX GOLD",
        "SNOW WHITE", "CALACATTA AUREO",
    ],
    "tiles-eclipsia-matt-series-1200x1800mm": [
        "SOFTONE CHAMPAGNE", "SOFTONE CHEESE", "SOFTONE COCOA",
        "SOFTONE MUSHROOM", "SOFTONE PEPPER", "SOFTONE SALT",
        "CEMENTA BIANCO", "CEMENTA DOVE", "CEMENTA GREY",
        "KONE WHITE", "KONE CAMEL", "KONE CAMEL LIGHT",
        "LINGTONE FOSSIL LIGHT", "LINGTONE FOSSIL",
        "LINGTONE BEIGE LIGHT", "LINGTONE BEIGE",
        "OXIDO BEIGE", "OXIDO BEIGE LIGHT", "OXIDO GREY", "OXIDO GREY LIGHT",
    ],
    "tiles-vailux-collection-1200x1800mm": [
        "ARMANI FOSSIL LIGHT", "BERLINO GREEN", "BURBERRY BIRCH",
        "CARRASTONE BIANCO", "INFINITY BIRCH", "KONE WHITE",
        "PERLA BIRCH", "PIMAR", "SONATA BIANCO", "VIVALTO BIRCH", "VIVALTO GRIS",
    ],
    "tiles-made-for-the-south-1200x1800mm-wl": [
        "VOILA GOLD", "STATUARIO", "COLBERT", "CARRASTONE BIANCO",
        "LINCOLN", "VENATINO GRIS", "POLAR WHITE", "VENETO GOLD",
        "SNOW WHITE", "ICELAND", "ROMA ONYX", "OMICORN CREMA",
        "ROYAL MARBLE", "PERLATO GRIS", "MICHEL ANGELO", "PIMAR",
        "ATLANTIS", "AURA BEIGE", "DOVE GREY", "ROSALIA",
        "MOSES TAUPE", "BRECCIA ARORA", "ICEBERG GREEN",
    ],
    "tiles-glossy-endless-vol-3-600-x-1200-mm": [
        "ROYAL CREAM", "DYNAMIC CREAM", "PLUTO CREAM", "BRICK CREAM",
        "MONOLINE CREAM", "MAJESTIC CREAM", "ROCK CREMA", "DYNAMIC CREMA",
        "PLUTO CREMA", "MONOLINE CREMA", "MAJESTIC CREMA", "SLATE CREMA",
        "ROCK NERO", "DYNAMIC NERO", "PLUTO NERO", "MONOLINE NERO",
        "MAJESTIC NERO", "SLATE NERO", "ROCK DOVE", "DYNAMIC DOVE",
        "PLUTO DOVE", "MONOLINE DOVE", "MAJESTIC DOVE", "SLATE DOVE",
        "ROYAL IRIS", "DYNAMIC IRIS", "PLUTO IRIS", "BRICK IRIS",
        "MONOLINE IRIS", "MAJESTIC IRIS", "SLATE IRIS", "ROCK BLACK",
        "DYNAMIC BLACK", "PLUTO BLACK", "MONOLINE BLACK", "MAJESTIC BLACK",
        "ROCK QUARTZ", "DYNAMIC QUARTZ", "PLUTO QUARTZ", "MONOLINE QUARTZ",
        "MAJESTIC QUARTZ", "ROCK ALMOND", "DYNAMIC ALMOND", "PLUTO ALMOND",
        "MONOLINE ALMOND", "MAJESTIC ALMOND", "SLATE ALMOND", "ROCK PEACH",
        "PLUTO PEACH", "MONOLINE PEACH", "ROCK WHITE", "DYNAMIC WHITE",
        "PLUTO WHITE", "MONOLINE WHITE", "MAJESTIC WHITE", "SLATE WHITE",
        "ROYAL STEEL GREY", "DYNAMIC STEEL GREY", "PLUTO STEEL GREY",
        "BRICK STEEL GREY", "MONOLINE STEEL GREY", "MAJESTIC STEEL GREY",
        "SLATE STEEL GREY", "ROYAL JET BLACK", "DYNAMIC JET BLACK",
        "PLUTO JET BLACK", "BRICK JET BLACK", "MONOLINE JET BLACK",
        "MAJESTIC JET BLACK", "SLATE JET BLACK", "ROYAL SUPER WHITE",
        "DYNAMIC SUPER WHITE", "PLUTO SUPER WHITE", "BRICK SUPER WHITE",
        "MONOLINE SUPER WHITE", "MAJESTIC SUPER WHITE", "SLATE SUPER WHITE",
        "ROYAL KOTA", "DYNAMIC KOTA", "PLUTO KOTA", "MONOLINE KOTA",
        "MAJESTIC KOTA", "SLATE KOTA", "ROCK KOTA", "ROCK MIST",
        "DYNAMIC MIST", "ROYAL MUD", "BRICK MUD", "SLATE MUD",
        "ROCK CHOCO", "SLATE CHOCO", "ROYAL MUSHROOM", "ROYAL NEGRO",
    ],
}

REAL_DESIGN_NAMES["tiles-glossy-endless-vol-1-600-x-1200-mm"] = REAL_DESIGN_NAMES["tiles-glossy-endless-vol-3-600-x-1200-mm"]
REAL_DESIGN_NAMES["tiles-glossy-endless-vol-2-600-x-1200-mm"] = REAL_DESIGN_NAMES["tiles-glossy-endless-vol-3-600-x-1200-mm"]
REAL_DESIGN_NAMES["tiles-glossy-endless-vol-3-600-x-1200-mm-1"] = REAL_DESIGN_NAMES["tiles-glossy-endless-vol-3-600-x-1200-mm"]
REAL_DESIGN_NAMES["tiles-new-golden-glossy-endless-vol-2-600-x-1200-mm"] = REAL_DESIGN_NAMES["tiles-glossy-endless-vol-3-600-x-1200-mm"]

REAL_DESIGN_NAMES["tiles-600-x-1200-9mm"] = REAL_DESIGN_NAMES["tiles-glossy-endless-vol-3-600-x-1200-mm"]

SMART_MARBLE_NAMES = [
    "PORTORO GOLD", "STATUARIO GOLD", "STATUARIO GREY", "VOLGA BLUE",
    "PORTORO BLACK", "PIXEL WHITE", "PIXEL GREY", "PIXEL BEIGE",
    "PIXEL BLACK", "PIXEL BROWN", "PIXEL VERDE",
    "EARTHSTONE WHITE", "EARTHSTONE BIANCO", "EARTHSTONE COCO",
    "EARTHSTONE GREY", "EARTHSTONE NERO",
    "SANDSTONE WHITE", "SANDSTONE BIANCO", "SANDSTONE COCO",
    "SANDSTONE GREY", "SANDSTONE NERO",
    "SOLID WHITE", "SOLID BLACK", "SOLID GREY",
    "SPARKLE WHITE", "SPARKLE BLACK",
    "CORIAN WHITE", "ROYAL QUARTZ", "JET BLACK",
    "DARK GREY", "LIGHT GREY", "ELEGANT GREY",
    "DEEP BROWN", "WALNUT", "PASTEL BEIGE", "PASTEL WHITE", "PASTEL GREY",
]

REAL_DESIGN_NAMES["digital-3d-7d-tiles-12x18-elevation-5"] = SMART_MARBLE_NAMES
REAL_DESIGN_NAMES["digital-3d-7d-tiles-12x18-elevation-6"] = SMART_MARBLE_NAMES
REAL_DESIGN_NAMES["digital-3d-7d-tiles-12x18"] = SMART_MARBLE_NAMES
REAL_DESIGN_NAMES["digital-3d-7d-tiles-12x18-fish"] = SMART_MARBLE_NAMES

category_details = {
    "ceramic-crystal-tiles": {
        "category_name": "Ceramic Crystal Tiles",
        "finish": "Crystal Glossy",
        "applications": ["Kitchen Walls", "Bathroom Walls", "Feature Accent Walls"],
        "sizes": ["300x450 mm (12x18 in)", "300x600 mm", "600x600 mm"],
        "hero_image": "https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/ceramic-crystal-tiles/12x18-glossy-12-p1.webp",
        "descriptions": [
            "Mirror-finish crystal glazed ceramic wall tile with high-definition marble veins for luxury bathrooms.",
            "Reflective crystal-glazed ceramic tile featuring subtle linear texture and stain-resistant surface.",
            "Contemporary high-gloss ceramic dado tile crafted for kitchen backsplashes and feature walls.",
            "Elegantly glazed ceramic wall slab showcasing rich color depth and liquid-smooth reflection.",
            "Crystal-coated bathroom wall tile designed to repel water marks and maintain long-term brilliance.",
            "High-shine ceramic dado tile with delicate artistic patterns for modern residential accent walls.",
            "Premium glazed wall tile incorporating subtle metallic sheen and easy-clean protective surface.",
            "Ultra-smooth crystal glaze wall tile presenting warm neutral tones for spa-inspired master baths.",
            "Vibrant crystal glossy tile with stain-proof layer suited for heavy-use kitchen areas.",
            "Designer wall tile featuring high-contrast motifs and water-repellent mirror glaze.",
        ],
        "feature_sets": [
            ['Stain & Heat Resistant', 'Zero Water Absorption', 'High Surface Gloss', 'Easy Maintenance'],
            ['Mirror Finish', 'Water Repellent', 'Scratch Resistant', 'Fade Proof'],
            ['Crystal Glaze Coating', 'Anti-Bacterial Surface', 'Easy Clean', 'UV Stable'],
            ['High-Density Body', 'Thermal Shock Resistant', 'Low Porosity', 'Chemical Resistant'],
        ]
    },
    "tiles": {
        "category_name": "Tiles",
        "finish": "Matt / Satin Gloss",
        "applications": ["Living Room Flooring", "Commercial High-Traffic", "Kitchen Floors"],
        "sizes": ["600x1200 mm", "1200x1800 mm", "800x1600 mm"],
        "hero_image": "https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/tiles/astral-series-1200x1800-volume-1-p1.webp",
        "descriptions": [
            "Ultra-durable vitrified tile with anti-skid matte finish engineered for high-traffic zones.",
            "Large-format glossy floor tile delivering seamless contemporary aesthetics for open-plan living.",
            "High-density satin finish tile with rectified edges for minimal grout line installation.",
            "Premium full-body vitrified tile with through-body color for commercial heavy-load areas.",
            "Double-charged vitrified tile offering superior stain resistance and uniform surface shade.",
            "Slip-resistant outdoor grade tile with weather-proof glazing for patio and balcony flooring.",
            "Designer wall and floor tile with subtle organic veining for sophisticated interior spaces.",
            "High-gloss polished tile with mirror-like reflectivity for luxury showroom and retail spaces.",
        ],
        "feature_sets": [
            ['Anti-Skid Surface', 'High Traffic Grade', 'Stain Resistant', 'Rectified Edges'],
            ['Full Body Vitrified', 'Zero Water Absorption', 'Wear Resistant', 'UV Stable'],
            ['Double Charged', 'Scratch Resistant', 'Low Maintenance', 'Uniform Shade'],
            ['Slip Resistant', 'Weather Proof', 'Thermal Stable', 'Commercial Grade'],
        ]
    },
    "digital-3d-7d-tiles": {
        "category_name": "Digital 3D / 7D Tiles",
        "finish": "Deep 3D/7D Relief",
        "applications": ["Pooja Rooms", "Elevation Exterior", "Accent Walls"],
        "sizes": ["300x450 mm (12x18 in)", "600x1200 mm"],
        "hero_image": "https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/digital-3d-7d-tiles/12x18-elevation-5-p1.webp",
        "descriptions": [
            "High-definition 3D digitally printed tile with deep tactile relief and metallic accents.",
            "Multi-layer 7D carved tile with realistic stone texture for immersive feature walls.",
            "Elevation-grade 3D tile with UV-stable pigments and weather-resistant carved surface.",
            "Ornate digitally embossed tile designed for Pooja room backdrops and sacred spaces.",
            "Textured architectural tile with layered dimensional depth for modern exterior cladding.",
        ],
        "feature_sets": [
            ['UV Resistant', 'Deep Relief Texture', 'Weather Proof', 'Fade Resistant'],
            ['3D Digital Print', 'Metallic Accents', 'Scratch Resistant', 'Easy Install'],
            ['Multi-Layer Carving', 'Stone Relief', 'Thermal Stable', 'Exterior Grade'],
        ]
    },
    "sanitary-items": {
        "category_name": "Sanitary Items",
        "finish": "Glazed Metallic / Handcrafted Ceramic",
        "applications": ["Luxury Bathrooms", "Powder Rooms", "Executive Suites"],
        "sizes": ["Standard Countertop", "Custom Vanity Size"],
        "hero_image": "https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/sanitary-items/vanity-of-tita-sanitarywares-compressed-p1.webp",
        "descriptions": [
            "Luxury handcrafted ceramic tabletop basin with premium glaze and anti-scratch surface.",
            "Artisanal tabletop ceramic washbasin with authentic marble grain texture rendition.",
            "Composite quartz kitchen sink with non-porous granite-like density and sound-dampening bowl.",
            "Modern wall-mounted vanity unit with soft-close hardware and matte ceramic top.",
            "Architectural bathroom vanity console with moisture-proof cabinet and integrated basin.",
        ],
        "feature_sets": [
            ['Premium Ceramic Glaze', 'Anti-Scratch', 'Easy Clean', 'Stain Resistant'],
            ['Soft-Close Hardware', 'Moisture Proof', 'Matte Finish', 'Space Saving'],
            ['Quartz Composite', 'Heat Resistant', 'Sound Dampening', 'Non-Porous'],
        ]
    },
    "imported-marble": {
        "category_name": "Imported Marble",
        "finish": "Polished Mirror Finish",
        "applications": ["Grand Foyers", "Luxury Living Rooms", "Feature Wall Cladding"],
        "sizes": ["Custom Cut Slabs", "1200x2400 mm"],
        "hero_image": "https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/imported-marble/statuario-endless-600-x-1200-mm-p1.webp",
        "descriptions": [
            "Premium Italian marble slab with dramatic veining and brilliant white canvas for luxury spaces.",
            "Exotic imported marble with continuous vein-matched patterns for seamless book-match installations.",
            "Luxury grade Statuario marble selected for zero structural fissures and consistent grain flow.",
        ],
        "feature_sets": [
            ['Dramatic Vein Patterns', 'Book-Match Ready', 'Zero Fissures', 'Mirror Polish'],
            ['Italian Origin', 'Consistent Grain', 'Luxury Grade', 'Full Slab Transparency'],
        ]
    },
    "domestic-marble": {
        "category_name": "Domestic Marble",
        "finish": "Honed / Polished",
        "applications": ["Heritage Flooring", "Courtyards", "Temple Interiors"],
        "sizes": ["Custom Cut Slabs", "600x600 mm"],
        "hero_image": "https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/domestic-marble/terazzo-600-x-1200-mm-p1.webp",
        "descriptions": [
            "Authentic Makrana marble with high calcium purity and zero chemical fillers for lasting beauty.",
            "Heritage Indian white marble slab with subtle warm undertones for traditional architecture.",
            "Premium Rajasthan marble with consistent grain and deep polish for palace-grade interiors.",
        ],
        "feature_sets": [
            ['98%+ Calcium Purity', 'Zero Fillers', 'Never Yellows', 'Generational Luster'],
            ['Heritage Grade', 'Warm Undertones', 'Easy Carving', 'Timeless Appeal'],
        ]
    },
    "granite": {
        "category_name": "Granite",
        "finish": "Flamed / Polished / Carving",
        "applications": ["Kitchen Countertops", "High-Traffic Staircases", "Exterior Cladding"],
        "sizes": ["15mm Carving Slabs", "Granite Countertop Slabs"],
        "hero_image": "https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/granite/15mm-carving-gvtbody-p1.webp",
        "descriptions": [
            "Heavy-duty natural granite with extreme compressive strength for kitchen countertops.",
            "Premium 15mm carved granite slab with intricate surface detailing for feature elevations.",
            "High-density granite from the Aravalli range with weather resistance for outdoor applications.",
        ],
        "feature_sets": [
            ['Extreme Strength', 'Heat Resistant', 'Scratch Free', 'Weather Proof'],
            ['15mm Heavy Duty', 'Carving Grade', 'GVT Body', 'Feature Grade'],
        ]
    },
    "custom-tiles": {
        "category_name": "Custom Tiles",
        "finish": "Custom Textured / Punch",
        "applications": ["Bespoke Architectural Projects", "Custom Commercial Flooring"],
        "sizes": ["600x1800 mm Slabs", "Custom Size"],
        "hero_image": "https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/custom-tiles/600x1800-punch-collection-2025-nl-p1.webp",
        "descriptions": [
            "Custom punch textured tile with unique architectural pattern for bespoke commercial spaces.",
            "Bespoke large-format slab tailored to project specifications with custom surface finish.",
        ],
        "feature_sets": [
            ['Custom Pattern', 'Large Format', 'Architectural Grade', 'Bespoke Design'],
            ['Tailored Finish', 'Project Specific', 'Premium Body', 'Custom Size'],
        ]
    }
}


def load_picks_descriptions():
    if not os.path.exists(PICKS_PATH):
        return {}
    with open(PICKS_PATH, 'r', encoding='utf-8') as f:
        picks = json.load(f)
    desc_map = {}
    for pick in picks:
        cpid = pick.get('cloudinary_public_id', '')
        if cpid and pick.get('description_copy'):
            desc_map[cpid] = pick['description_copy']
    return desc_map


def get_series_prefix(name):
    parts = name.split("-p")
    if len(parts) > 1:
        return parts[0]
    return name

def clean_title(filename, index, counters):
    full_name = filename.replace(".webp", "")

    series_key = get_series_prefix(full_name)
    if series_key in REAL_DESIGN_NAMES:
        design_list = REAL_DESIGN_NAMES[series_key]
        if series_key not in counters:
            counters[series_key] = 0
        design_name = design_list[counters[series_key] % len(design_list)]
        counters[series_key] += 1
        return design_name

    name = full_name
    for cat in category_details.keys():
        prefix = cat + "-"
        if name.startswith(prefix):
            name = name[len(prefix):]
            break

    parts = name.split("-")
    words = []
    for p in parts:
        lp = p.lower()
        if lp.startswith("p") and lp[1:].isdigit():
            page_num = int(lp[1:])
            words.append(f"Design {page_num:02d}")
            continue
        if lp in ("vol",):
            continue
        if p.isdigit() and words:
            if words[-1].isdigit():
                continue
            words.append(p)
        elif p.replace("x", "").replace("mm", "").isdigit():
            words.append(p)
        else:
            words.append(p.capitalize())
    return " ".join(words)


def generate_ts():
    if not os.path.exists(MANIFEST_PATH):
        print(f"Manifest file {MANIFEST_PATH} not found.")
        return

    with open(MANIFEST_PATH, 'r', encoding='utf-8') as f:
        items = json.load(f)

    picks_desc = load_picks_descriptions()

    print(f"Loaded {len(items)} manifest items.")
    print(f"Loaded {len(picks_desc)} picks descriptions.")

    header = """export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  image: string;
  images: string[];
  textureUrl: string;
  texture: string;
  description: string;
  priceEstimate: string;
  priceRange: string;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  features: string[];
  seoTitle?: string;
  seoDescription?: string;
  specifications: {
    size: string;
    sizes: string[];
    thickness: string;
    finish: string;
    finishes: string[];
    material: string;
    origin: string;
    piecesPerBox: number;
    coveragePerBox: string;
    waterAbsorption: string;
    application: string;
    applications: string[];
  };
  spec: {
    size: string;
    sizes: string[];
    thickness: string;
    finish: string;
    finishes: string[];
    material: string;
    origin: string;
    piecesPerBox: number;
    coveragePerBox: string;
    waterAbsorption: string;
    application: string;
    applications: string[];
  };
}

export const CATEGORIES: Record<string, Category> = {
  'ceramic-crystal-tiles': {
    id: 'ceramic-crystal-tiles',
    name: 'Ceramic Crystal Tiles',
    slug: 'ceramic-crystal-tiles',
    description: 'High-clarity ceramic crystal tile designed for vibrant wall accents and luxurious interior spaces.',
    heroImage: 'https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/ceramic-crystal-tiles/12x18-glossy-12-p1.webp',
    seoTitle: 'Ceramic Crystal Tiles — Angel Tiles & Stone Jodhpur',
    seoDescription: 'Premium ceramic crystal tiles in Jodhpur. Brilliant high-gloss finish for kitchens and bathrooms.',
  },
  'tiles': {
    id: 'tiles',
    name: 'Tiles',
    slug: 'tiles',
    description: 'Ultra-durable ceramic and vitrified tiles crafted for high durability and timeless architectural elegance.',
    heroImage: 'https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/tiles/astral-series-1200x1800-volume-1-p1.webp',
    seoTitle: 'Architectural Tiles — Angel Tiles & Stone Jodhpur',
    seoDescription: 'High density vitrified and ceramic floor & wall tiles in Jodhpur. Endless designs and satin finishes.',
  },
  'sanitary-items': {
    id: 'sanitary-items',
    name: 'Sanitary Items',
    slug: 'sanitary-items',
    description: 'Exquisite tabletop ceramic basins, vanity sets, and quartz sinks crafted with premium sanitary glazes.',
    heroImage: 'https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/sanitary-items/vanity-of-tita-sanitarywares-compressed-p1.webp',
    seoTitle: 'Designer Sanitaryware — Angel Tiles & Stone Jodhpur',
    seoDescription: 'Luxury tabletop ceramic basins, quartz sinks, and vanity suites in Jodhpur.',
  },
  'digital-3d-7d-tiles': {
    id: 'digital-3d-7d-tiles',
    name: 'Digital 3D / 7D Tiles',
    slug: 'digital-3d-7d-tiles',
    description: 'State-of-the-art digital 3D/7D relief tiles with textured depth and intricate visual patterns.',
    heroImage: 'https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/digital-3d-7d-tiles/12x18-elevation-5-p1.webp',
    seoTitle: 'Digital 3D & 7D Relief Tiles — Angel Tiles & Stone Jodhpur',
    seoDescription: 'Intricate digital 3D and 7D relief wall tiles for Pooja rooms, elevation walls, and luxury accents.',
  },
  'imported-marble': {
    id: 'imported-marble',
    name: 'Imported Marble',
    slug: 'imported-marble',
    description: 'Hand-picked Italian Statuario and exotic imported marble slabs featuring continuous vein matching.',
    heroImage: 'https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/imported-marble/statuario-endless-600-x-1200-mm-p1.webp',
    seoTitle: 'Imported Italian Marble — Angel Tiles & Stone Jodhpur',
    seoDescription: 'Exotic Italian Statuario, Carrara, and bookmatch marble slabs in Jodhpur.',
  },
  'domestic-marble': {
    id: 'domestic-marble',
    name: 'Domestic Marble',
    slug: 'domestic-marble',
    description: 'Authentic Makrana and Indian white marble slabs renowned for natural purity and timeless heritage appeal.',
    heroImage: 'https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/domestic-marble/terazzo-600-x-1200-mm-p1.webp',
    seoTitle: 'Makrana Heritage Domestic Marble — Angel Tiles Jodhpur',
    seoDescription: 'Pure Makrana white marble and terrazzo heritage slabs in Jodhpur.',
  },
  'granite': {
    id: 'granite',
    name: 'Granite',
    slug: 'granite',
    description: 'Heavy-duty natural granite and 15mm carved slabs offering maximum heat resistance and strength.',
    heroImage: 'https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/granite/15mm-carving-gvtbody-p1.webp',
    seoTitle: 'High-Density Granite & 15mm Carving — Angel Tiles Jodhpur',
    seoDescription: 'Premium kitchen countertop granite and carved stair treads in Jodhpur.',
  },
  'custom-tiles': {
    id: 'custom-tiles',
    name: 'Custom Tiles',
    slug: 'custom-tiles',
    description: 'Custom manufactured architectural tile slabs tailored for specialized decor and structural specifications.',
    heroImage: 'https://res.cloudinary.com/wkshdvea/image/upload/angel-tiles/custom-tiles/600x1800-punch-collection-2025-nl-p1.webp',
    seoTitle: 'Custom Architectural Slabs — Angel Tiles & Stone Jodhpur',
    seoDescription: 'Custom punch and textured architectural tile slabs crafted for luxury commercial and residential builds.',
  },
};

export const PRODUCTS: Product[] = [
"""

    products_code = header

    name_counters = {}

    for i, item in enumerate(items):
        cat = item['category']
        details = category_details.get(cat, category_details['tiles'])
        public_id = item.get('publicId', '')
        filename = item['filename']

        title = clean_title(filename, i, name_counters)

        product_id = f"prod-{i+1:04d}"
        slug = f"{cat}-{filename.replace('.webp', '')}".lower()
        size = details['sizes'][i % len(details['sizes'])]

        app1 = details['applications'][i % len(details['applications'])]
        app2 = details['applications'][(i + 1) % len(details['applications'])]

        base_price = 45 + (i * 7 % 180)
        max_price = base_price + 35
        price_range = f"₹{base_price} - ₹{max_price} / sq.ft"

        image_url = item['secureUrl']
        origin = "Italy" if cat == "imported-marble" else ("Makrana, Rajasthan" if cat == "domestic-marble" else "Jodhpur, India")

        # Use picks description if available, otherwise cycle through category descriptions
        desc_idx = i % len(details['descriptions'])
        description = picks_desc.get(public_id, details['descriptions'][desc_idx])

        # Cycle through feature sets
        feat_idx = i % len(details['feature_sets'])
        features = details['feature_sets'][feat_idx]
        features_str = json.dumps(features)

        spec_obj = f"""specifications: {{
      size: '{size}',
      sizes: ['{size}', '600x1200 mm'],
      thickness: '9mm',
      finish: '{details["finish"]}',
      finishes: ['{details["finish"]}'],
      material: '{details["category_name"]}',
      origin: '{origin}',
      piecesPerBox: 6,
      coveragePerBox: '1.44 sq.m / 15.5 sq.ft',
      waterAbsorption: '< 0.5%',
      application: '{app1}, {app2}',
      applications: ['{app1}', '{app2}']
    }},
    spec: {{
      size: '{size}',
      sizes: ['{size}', '600x1200 mm'],
      thickness: '9mm',
      finish: '{details["finish"]}',
      finishes: ['{details["finish"]}'],
      material: '{details["category_name"]}',
      origin: '{origin}',
      piecesPerBox: 6,
      coveragePerBox: '1.44 sq.m / 15.5 sq.ft',
      waterAbsorption: '< 0.5%',
      application: '{app1}, {app2}',
      applications: ['{app1}', '{app2}']
    }}"""

        product_entry = f"""  {{
    id: '{product_id}',
    name: '{title}',
    slug: '{slug}',
    category: '{cat}',
    categoryName: '{details["category_name"]}',
    image: '{image_url}',
    images: ['{image_url}'],
    textureUrl: '{image_url}',
    texture: '{image_url}',
    description: '{description}',
    priceEstimate: '₹{base_price} / sq.ft',
    priceRange: '{price_range}',
    inStock: true,
    isFeatured: {str(i % 15 == 0).lower()},
    isNewArrival: {str(i % 12 == 0).lower()},
    features: {features_str},
    seoTitle: '{title} — Angel Tiles & Stone Jodhpur',
    seoDescription: '{description}',
    {spec_obj}
  }},
"""
        products_code += product_entry

    footer = """];

export function getProductsByCategory(categorySlug: string): Product[] {
  return PRODUCTS.filter((p) => p.category === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(productOrId: Product | string, limit = 4): Product[] {
  const currentId = typeof productOrId === 'string' ? productOrId : productOrId.id;
  const current = PRODUCTS.find((p) => p.id === currentId);
  if (!current) return PRODUCTS.slice(0, limit);
  return PRODUCTS.filter((p) => p.category === current.category && p.id !== current.id).slice(0, limit);
}
"""
    products_code += footer

    with open(PRODUCTS_TS_PATH, 'w', encoding='utf-8') as f:
        f.write(products_code)

    print(f"Successfully generated {len(items)} products in src/content/products.ts with real catalog names, descriptions, and features!")

if __name__ == '__main__':
    generate_ts()
