import os
import glob
import json
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

TMP_EXTRACT_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-extract"
SHORTLIST_JSON = r"d:\angel tiles updated\angel-tiles\scripts\shortlist.json"

category_map = {
    "ceramic-crystal-tiles": "Ceramic Crystal Tiles",
    "tiles": "Tiles",
    "digital-3d-7d-tiles": "Digital 3D / 7D Tiles",
    "sanitary-items": "Sanitary Items"
}

catalog_picks = []

for cat_slug, cat_name in category_map.items():
    cat_dir = os.path.join(TMP_EXTRACT_DIR, cat_slug)
    if not os.path.exists(cat_dir):
        continue

    pdf_dirs = [d for d in os.listdir(cat_dir) if os.path.isdir(os.path.join(cat_dir, d))]

    for pdf_folder in sorted(pdf_dirs):
        pdf_path = os.path.join(cat_dir, pdf_folder)
        jpgs = sorted(glob.glob(os.path.join(pdf_path, "*.jpg")))

        if not jpgs:
            continue

        total_pages = len(jpgs)

        # Select 2-3 best pages (skipping front cover if multiple pages exist)
        if total_pages == 1:
            selected_indices = [0]
        elif total_pages == 2:
            selected_indices = [0, 1]
        elif total_pages == 3:
            selected_indices = [0, 1, 2]
        else:
            # For multi-page catalogs, pick representative middle pages with room/lifestyle renders
            step = max(1, (total_pages - 1) // 3)
            selected_indices = [step, 2 * step]
            if len(selected_indices) < 3 and total_pages >= 4:
                selected_indices.append(min(total_pages - 1, 3 * step))

        for idx in selected_indices:
            img_file = jpgs[idx]
            page_num = idx + 1

            # Get design reference based on folder and page
            ref_id = f"{pdf_folder.lower()}-p{page_num}"
            ref_clean = pdf_folder.replace("_", "-").replace(" ", "-").lower()

            with Image.open(img_file) as im:
                w, h = im.size

            catalog_picks.append({
                "pdf": pdf_folder + ".pdf",
                "category_slug": cat_slug,
                "category_name": cat_name,
                "page": page_num,
                "img_path": img_file,
                "width": w,
                "height": h,
                "ref_id": f"{cat_slug}-{ref_clean}-p{page_num}",
                "suggested_name": f"{pdf_folder} — Page {page_num} Design"
            })

with open(SHORTLIST_JSON, 'w', encoding='utf-8') as f:
    json.dump(catalog_picks, f, indent=2)

print(f"Generated shortlist with {len(catalog_picks)} picks across catalogs.")
