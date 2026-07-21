import os
import glob
import json
import fitz
from PIL import Image

TMP_EXTRACT_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-extract"
TMP_PDFS_DIR = os.path.join(TMP_EXTRACT_DIR, "_pdfs")
TMP_UPLOADS_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-uploads"
MANIFEST_JSON = r"d:\angel tiles updated\angel-tiles\scripts\picks_manifest.json"

os.makedirs(TMP_UPLOADS_DIR, exist_ok=True)

catalogs_config = [
    # Ceramic Crystal Tiles
    {"pdf": "12X18-GLOSSY-12.pdf", "category": "ceramic-crystal-tiles", "pages": [2, 4], "ref": "glossy-12", "copy": "Mirror-finish crystal glazed ceramic wall tile with high-definition marble veins for luxury bathrooms."},
    {"pdf": "12X18-GLOSSY-13.pdf", "category": "ceramic-crystal-tiles", "pages": [1, 3], "ref": "glossy-13", "copy": "Reflective crystal-glazed ceramic tile featuring subtle linear texture and stain-resistant surface."},
    {"pdf": "12X18-GLOSSY-14.pdf", "category": "ceramic-crystal-tiles", "pages": [2, 5], "ref": "glossy-14", "copy": "Contemporary high-gloss ceramic dado tile crafted for kitchen backsplashes and feature walls."},
    {"pdf": "12X18-GLOSSY-15.pdf", "category": "ceramic-crystal-tiles", "pages": [3, 6], "ref": "glossy-15", "copy": "Elegantly glazed ceramic wall slab showcasing rich color depth and liquid-smooth reflection."},
    {"pdf": "12X18-GLOSSY-16.pdf", "category": "ceramic-crystal-tiles", "pages": [2, 4], "ref": "glossy-16", "copy": "Crystal-coated bathroom wall tile designed to repel water marks and maintain long-term brilliance."},
    {"pdf": "12X18-GLOSSY-17.pdf", "category": "ceramic-crystal-tiles", "pages": [3, 5], "ref": "glossy-17", "copy": "High-shine ceramic dado tile with delicate artistic patterns for modern residential accent walls."},
    {"pdf": "12X18-GLOSSY-18.pdf", "category": "ceramic-crystal-tiles", "pages": [2, 4], "ref": "glossy-18", "copy": "Premium glazed wall tile incorporating subtle metallic sheen and easy-clean protective surface."},
    {"pdf": "12X18-GLOSSY-19.pdf", "category": "ceramic-crystal-tiles", "pages": [1, 2], "ref": "glossy-19", "copy": "Ultra-smooth crystal glaze wall tile presenting warm neutral tones for spa-inspired master baths."},
    {"pdf": "12X18-KITCHEN-01.pdf", "category": "ceramic-crystal-tiles", "pages": [2, 4], "ref": "kitchen-01", "copy": "Vibrant kitchen dado ceramic tile with stain-proof crystal layer suited for heavy cooktop heat."},
    {"pdf": "12X18-KITCHEN-02.pdf", "category": "ceramic-crystal-tiles", "pages": [3, 5], "ref": "kitchen-02", "copy": "Architectural kitchen backsplash ceramic tile with geometric decor motifs and gloss finish."},
    {"pdf": "12X18-KITCHEN-03.pdf", "category": "ceramic-crystal-tiles", "pages": [2, 4], "ref": "kitchen-03", "copy": "Designer kitchen wall tile featuring high-contrast motifs and water-repellent mirror glaze."},
    
    # Tiles (Matte)
    {"pdf": "12X18-MATT.pdf", "category": "tiles", "pages": [2, 4, 6], "ref": "matt", "copy": "High-density matte finish vitrified tile engineered for anti-skid bathroom and wet zone flooring."},
    
    # Digital 3D / 7D Tiles
    {"pdf": "12X18-POOJA.pdf", "category": "digital-3d-7d-tiles", "pages": [1, 3, 5], "ref": "pooja-3d", "copy": "High-definition 3D digitally printed tile with deep tactile relief and metallic accents for sacred spaces."},
    
    # Sanitary Items
    {"pdf": "Golden Basin of Tita Sanitarywares.pdf", "category": "sanitary-items", "pages": [1, 2], "ref": "golden-basin", "copy": "Luxury handcrafted ceramic tabletop basin featuring electroplated brushed gold finish and anti-scratch glaze."},
    {"pdf": "Marble basin of tita sanitarywares_compressed.pdf", "category": "sanitary-items", "pages": [1, 2], "ref": "marble-basin", "copy": "Artisanal tabletop ceramic washbasin rendered with authentic Statuario marble grain texture."},
    {"pdf": "Tita-Quartz-Kitchen-Sink-1.pdf", "category": "sanitary-items", "pages": [1], "ref": "quartz-sink", "copy": "Composite quartz kitchen sink crafted with non-porous granite-like density and sound-dampening bowl."},
    {"pdf": "Tita_vanity_brochure.pdf", "category": "sanitary-items", "pages": [1, 2], "ref": "vanity-set", "copy": "Architectural bathroom vanity console featuring seamless moisture-proof cabinet and integrated basin."},
    {"pdf": "Vanity of tita sanitarywares_compressed.pdf", "category": "sanitary-items", "pages": [1, 2], "ref": "vanity-suite", "copy": "Modern wall-mounted vanity unit with soft-close hardware and sleek matte ceramic countertop washbasin."}
]

picks_manifest = []

for item in catalogs_config:
    pdf_name = item["pdf"]
    cat_slug = item["category"]
    pages = item["pages"]
    ref_base = item["ref"]
    copy = item["copy"]

    pdf_path = os.path.join(TMP_PDFS_DIR, pdf_name)
    if not os.path.exists(pdf_path):
        print(f"Warning: PDF not found {pdf_path}")
        continue

    doc = fitz.open(pdf_path)

    for p_num in pages:
        if p_num > len(doc):
            p_num = len(doc)
        
        page = doc.load_page(p_num - 1)
        pix = page.get_pixmap(dpi=180) # High quality render for processing

        temp_png = os.path.join(TMP_UPLOADS_DIR, "temp.png")
        pix.save(temp_png)

        # File naming pattern: {category-slug}-{short-design-ref}.webp
        file_slug = f"{cat_slug}-{ref_base}-p{p_num}.webp"
        target_path = os.path.join(TMP_UPLOADS_DIR, file_slug)

        with Image.open(temp_png) as im:
            # Resize max ~1600-2000px wide
            max_width = 1800
            if im.width > max_width:
                ratio = max_width / float(im.width)
                new_h = int(im.height * ratio)
                im = im.resize((max_width, new_h), Image.Resampling.LANCZOS)
            
            # Save as optimized WebP (targeting ~150-300KB)
            im.save(target_path, "WEBP", quality=82, optimize=True)

        if os.path.exists(temp_png):
            os.remove(temp_png)

        file_size_kb = os.path.getsize(target_path) / 1024.0

        cloudinary_public_id = f"angel-tiles/{cat_slug}/{ref_base}-p{p_num}"

        entry = {
            "pdf_source": pdf_name,
            "pdf_page": p_num,
            "category_slug": cat_slug,
            "ref_id": file_slug.replace(".webp", ""),
            "local_file": file_slug,
            "local_filepath": target_path,
            "size_kb": round(file_size_kb, 1),
            "cloudinary_public_id": cloudinary_public_id,
            "description_copy": copy
        }
        picks_manifest.append(entry)
        print(f"Processed: {file_slug} ({entry['size_kb']} KB)")

with open(MANIFEST_JSON, "w", encoding="utf-8") as f:
    json.dump(picks_manifest, f, indent=2)

print(f"\nManifest built with {len(picks_manifest)} finalized WebP images ready for Cloudinary upload!")
