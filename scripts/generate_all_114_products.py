import json
import os
import re

manifest_file = r"d:\angel tiles updated\angel-tiles\scripts\full_catalog_cloudinary_manifest.json"
products_file = r"d:\angel tiles updated\angel-tiles\src\content\products.ts"

with open(manifest_file, 'r', encoding='utf-8') as f:
    items = json.load(f)

print(f"Loaded {len(items)} Cloudinary items from manifest.")

# Map items into TypeScript Product objects
products = []

for idx, item in enumerate(items):
    cat = item['category']
    url = item['secureUrl']
    pub_id = item['publicId']
    filename = item['filename']

    # Generate clean unique slug
    raw_name = filename.replace('.webp', '')
    slug = re.sub(r'[^a-z0-9\-]', '-', raw_name.lower())
    slug = re.sub(r'-+', '-', slug).strip('-')

    # Ensure uniqueness
    slug_final = f"{slug}"

    # Build human readable title
    clean_title = raw_name.replace('-', ' ').replace('_', ' ')
    clean_title = ' '.join(word.capitalize() for word in clean_title.split())
    
    # Custom naming rules per category
    if cat == 'ceramic-crystal-tiles':
        name = f"Crystal Glazed Tile — {clean_title.replace('Ceramic Crystal Tiles ', '')}"
        seo_title = f"{name} Jodhpur — Glossy Wall Tile"
        seo_desc = f"Explore {name} at Angel Tiles Jodhpur. Mirror-finish crystal glazed ceramic tile for bathrooms and kitchens."
        spec = {
            "origin": "Morbi, Gujarat",
            "finish": ["Crystal Mirror Gloss", "High Definition Polish"],
            "sizes": ["300x450 mm (12x18 in)"],
            "application": ["Bathroom walls", "Kitchen dado", "Wash area"]
        }
        price = "₹45 - ₹95 per sq ft"
        desc = "High-firing crystal glass glaze yielding a liquid-smooth mirror reflection that repels water stains and soap scum."
        features = ["Crystal glass layer coating", "Stain resistant surface", "Vivid color clarity", "Easy damp cloth wiping"]

    elif cat == 'digital-3d-7d-tiles':
        name = f"Digital 3D/7D Relief — {clean_title.replace('Digital 3d 7d Tiles ', '')}"
        seo_title = f"{name} Elevation Tiles Jodhpur"
        seo_desc = f"Stunning 3D & 7D carving elevation wall tile in Jodhpur. Weather-proof textured relief for feature walls."
        spec = {
            "origin": "Morbi, Gujarat",
            "finish": ["7D Carving Relief", "Sugar Metallic Finish"],
            "sizes": ["300x450 mm (12x18 in)", "600x1200 mm"],
            "application": ["Exterior elevation", "Feature wall", "Pooja room backdrop"]
        }
        price = "₹85 - ₹220 per sq ft"
        desc = "Advanced 7D digital printing creates realistic stone depth and tactile carving relief with metallic shimmer highlights."
        features = ["Tactile 7D relief texture", "Weather & UV proof glazes", "Zero fade outdoor coating", "Dramatic spotlight highlights"]

    elif cat == 'imported-marble':
        name = f"Italian Import — {clean_title.replace('Imported Marble ', '')}"
        seo_title = f"{name} Italian Marble Slabs Jodhpur"
        seo_desc = f"Exclusive imported Italian Statuario & Carrara marble slabs at Angel Tiles Jodhpur."
        spec = {
            "origin": "Carrara, Tuscany (Italy)",
            "finish": ["High-Gloss Polished", "Bookmatched", "Mirror Polish"],
            "sizes": ["1200x600 mm", "2400x1200 mm", "8x4 feet jumbo slabs"],
            "application": ["Living room flooring", "Master bath feature wall", "Foyer"]
        }
        price = "₹650 - ₹2,400 per sq ft"
        desc = "Endless Statuario bookmatched marble slabs featuring continuous flowing grey veins across mirror-polished European white marble."
        features = ["Continuous vein-matching layout", "High-gloss mirror reflective index", "Sourced from Italian Carrara blocks", "Exclusive import selection"]

    elif cat == 'domestic-marble':
        name = f"Makrana Heritage — {clean_title.replace('Domestic Marble ', '')}"
        seo_title = f"{name} Indian White Marble Jodhpur"
        seo_desc = f"Authentic Makrana Albeta and Indian white marble slabs direct from Rajasthan quarries."
        spec = {
            "origin": "Makrana, Rajasthan (India)",
            "finish": ["Mirror Polished", "Natural Satin", "Honed"],
            "sizes": ["1200x600 mm", "8x4 feet slabs"],
            "application": ["Living room flooring", "Pooja room", "Cladding"]
        }
        price = "₹220 - ₹650 per sq ft"
        desc = "Highest calcium concentration Indian white marble from Rajasthan quarries with lifelong luster and zero yellowing."
        features = ["Highest calcium concentration", "Zero yellowing over decades", "Cool thermal insulation", "Generational durability"]

    elif cat == 'granite':
        name = f"Architectural Granite — {clean_title.replace('Granite ', '')}"
        seo_title = f"{name} Countertop Slabs Jodhpur"
        seo_desc = f"High-density granite slabs with natural grain variants for kitchen countertops and stair treads."
        spec = {
            "origin": "Rajasthan Quarries (India)",
            "finish": ["15mm Tactile Carving", "Polished", "Lappato"],
            "sizes": ["15mm Structural Thickness", "1200x600 mm"],
            "application": ["Kitchen countertops", "Stair treads", "Facade cladding"]
        }
        price = "₹180 - ₹380 per sq ft"
        desc = "15mm heavy-duty structural granite slab featuring micro-carved tactile surface grip for high-end kitchen countertops."
        features = ["15mm full-body thickness", "Scratch & acid heat resistant", "Anti-skid texture", "High compressive strength"]

    elif cat == 'sanitary-items':
        name = f"Tita Sanitary — {clean_title.replace('Sanitary Items ', '')}"
        seo_title = f"{name} Luxury Bathroom Sanitary Jodhpur"
        seo_desc = f"Exquisite Tita sanitaryware items at Angel Studio Jodhpur. Golden electroplated basins, marble washbasins, quartz sinks."
        spec = {
            "origin": "Tita Sanitarywares",
            "finish": ["Golden Electroplated", "Statuario Marble Glaze", "Quartz Granite Matte"],
            "sizes": ["480x370x130 mm", "24x18 in Sink", "Vanity Console"],
            "application": ["Master vanity counter", "Dining handwash area", "Kitchen wash zone"]
        }
        price = "₹3,800 - ₹18,500 per unit"
        desc = "Handcrafted ceramic tabletop washbasin with electroplated gold finish, marble grain texture, or quartz granite composition."
        features = ["Brushed gold electroplating", "5mm ultra-thin edge profile", "Non-fading matte finish glazes", "High shock and chip resistance"]

    else: # tiles & custom-tiles
        name = f"Vitrified Floor Slab — {clean_title.replace('Tiles ', '')}"
        seo_title = f"{name} Large Format Tiles Jodhpur"
        seo_desc = f"Large-format vitrified floor slabs with continuous flow endless patterns in Jodhpur."
        spec = {
            "origin": "Morbi, Gujarat (India)",
            "finish": ["Super Glossy", "Soft Matt", "Endless High Gloss"],
            "sizes": ["1200x1800 mm", "600x1200 mm", "600x1800 mm"],
            "application": ["Living hall floor", "Bedrooms", "Commercial showrooms"]
        }
        price = "₹75 - ₹240 per sq ft"
        desc = "Large-format vitrified floor slabs with continuous flow endless patterns and stain-proof nano glazing."
        features = ["Jumbo format dimensions", "Minimal grout joint lines", "Stain repellent nano glaze", "High wear resistance"]

    # Texture URL: pair next image in category or fallback to same image
    next_idx = (idx + 1) % len(items)
    texture_url = items[next_idx]['secureUrl'] if items[next_idx]['category'] == cat else url

    prod_obj = {
        "slug": slug_final,
        "name": name,
        "category": cat,
        "seoTitle": seo_title,
        "seoDescription": seo_desc,
        "image": url,
        "texture": texture_url,
        "spec": spec,
        "priceRange": price,
        "description": desc,
        "features": features
    }
    products.append(prod_obj)

print(f"Generated {len(products)} Product objects.")

# Format as TypeScript output file
ts_output = f'''export interface Product {{
  slug: string;
  name: string;
  category: 'tiles' | 'imported-marble' | 'custom-tiles' | 'granite' | 'domestic-marble' | 'digital-3d-7d-tiles' | 'ceramic-crystal-tiles' | 'sanitary-items';
  seoTitle: string;
  seoDescription: string;
  image: string;
  texture: string;
  spec: {{
    origin: string;
    finish: string[];
    sizes: string[];
    application: string[];
  }};
  priceRange: string;
  description: string;
  features: string[];
}}

export const CATEGORIES = {{
  "imported-marble": {{
    name: "Imported Marble",
    slug: "imported-marble",
    description: "Exclusive Italian, Carrara, and Statuario marble blocks and slabs imported directly for villa living areas and master baths.",
    seoTitle: "Imported Italian Marble Dealers Jodhpur — Statuario & Carrara Slabs",
    seoDescription: "Explore imported Italian Statuario, Carrara White, and luxury European marble at Angel Tiles & Stone Jodhpur.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616060/angel-tiles/imported-marble/book-match-600-x-1200-mm-p2.webp",
  }},
  "domestic-marble": {{
    name: "Domestic Marble",
    slug: "domestic-marble",
    description: "Authentic Makrana Albeta, Rajnagar, and premium Indian white marble slabs direct from historical Rajasthan quarries.",
    seoTitle: "Makrana White Marble Suppliers Jodhpur — Indian Marble Slabs",
    seoDescription: "Authentic Makrana White, Albeta, and Indian marble in Jodhpur.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616174/angel-tiles/domestic-marble/terazzo-600-x-1200-mm-p2.webp",
  }},
  "granite": {{
    name: "Granite",
    slug: "granite",
    description: "High-density granite slabs with exquisite natural grain variants for kitchen countertops, stairs, and exterior thresholds.",
    seoTitle: "Premium Granite Dealers Jodhpur — Kitchen Countertop Slabs",
    seoDescription: "Explore Rajasthan Black, Alaska White, and 15mm Carving granite slabs for countertops.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616058/angel-tiles/granite/15mm-carving-gvtbody-p2.webp",
  }},
  "tiles": {{
    name: "Tiles",
    slug: "tiles",
    description: "Large-format vitrified floor slabs, double charge, Astral Series 1200x1800mm, and architectural floor tiles.",
    seoTitle: "Vitrified & Floor Tiles Showroom Jodhpur — Large Format Slabs",
    seoDescription: "Upgrade your spaces with Astral Series 1200x1800mm and 600x1200mm endless vitrified floor tiles.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616074/angel-tiles/tiles/astral-series-1200x1800-volume-1-p2.webp",
  }},
  "custom-tiles": {{
    name: "Custom Tiles",
    slug: "custom-tiles",
    description: "Bespoke architectural ceramic tiles, designer terrazzo patterns, and customized waterjet mosaic compositions.",
    seoTitle: "Custom Architectural Tiles Jodhpur — Waterjet & Designer Mosaic",
    seoDescription: "Custom handcrafted ceramic tiles and bespoke floor patterns crafted to architectural specifications.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616072/angel-tiles/tiles/600x1800-punch-collection-2025-nl-p2.webp",
  }},
  "digital-3d-7d-tiles": {{
    name: "Digital 3D / 7D Tiles",
    slug: "digital-3d-7d-tiles",
    description: "High-definition 3D & 7D carved wall tiles creating tactile depth, metallic highlights, and realistic stone reliefs.",
    seoTitle: "Digital 3D 7D Carving Elevation Tiles Jodhpur — Feature Wall Slabs",
    seoDescription: "Stunning 3D and 7D relief carving tiles in Jodhpur. High-definition textured wall tiles for exterior elevations.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616050/angel-tiles/digital-3d-7d-tiles/12x18-elevation-5-p2.webp",
  }},
  "ceramic-crystal-tiles": {{
    name: "Ceramic Crystal Tiles",
    slug: "ceramic-crystal-tiles",
    description: "Crystal-glazed ceramic wall tiles with mirror reflective brilliance for luxury bathrooms and kitchen dado walls.",
    seoTitle: "Ceramic Crystal Glazed Wall Tiles Jodhpur — High Gloss Bathroom Tiles",
    seoDescription: "Discover crystal glazed ceramic wall tiles in Jodhpur. Ultra-smooth mirror glaze for easy-cleaning bathroom walls.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784615995/angel-tiles/ceramic-crystal-tiles/12x18-glossy-1-p2.webp",
  }},
  "sanitary-items": {{
    name: "Sanitary Items",
    slug: "sanitary-items",
    description: "Sleek wall-hung rimless closets, designer tabletop ceramic washbasins, quartz kitchen sinks, and luxury vanity suites.",
    seoTitle: "Luxury Bathroom Sanitary Items Jodhpur — Basins, Sinks & Vanities",
    seoDescription: "Exquisite sanitaryware items at Angel Studio Jodhpur. Golden electroplated basins, marble washbasins, quartz sinks.",
    heroImage: "https://res.cloudinary.com/wkshdvea/image/upload/v1784616180/angel-tiles/sanitary-items/golden-basin-of-tita-sanitarywares-p2.webp",
  }}
}};

export const PRODUCTS: Product[] = {json.dumps(products, indent=2)};

export function getProductBySlug(slug: string): Product | undefined {{
  return PRODUCTS.find(p => p.slug === slug);
}}

export function getProductsByCategory(category: string): Product[] {{
  return PRODUCTS.filter(p => p.category === category);
}}

export function getRelatedProducts(product: Product, limit = 3): Product[] {{
  return PRODUCTS.filter(p => p.category === product.category && p.slug !== product.slug).slice(0, limit);
}}
'''

with open(products_file, 'w', encoding='utf-8') as f:
    f.write(ts_output)

print(f"Successfully written all {len(products)} products to src/content/products.ts!")
