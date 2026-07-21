import os
import zipfile
import glob
import fitz # PyMuPDF
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

TMP_EXTRACT_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-extract"
PORTFOLIO_DIR = r"D:\angel tiles updated\asset\portfolio"
DOWNLOADS_DIR = r"C:\Users\LENOV\Downloads\angel tiles web res-20260721T051844Z-1-001\angel tiles web res"

os.makedirs(TMP_EXTRACT_DIR, exist_ok=True)

# Find all PDFs in PORTFOLIO zips and DOWNLOADS
pdf_sources = {}

# 1. Unzip ZIPs into temp memory / extract PDF paths
if os.path.exists(PORTFOLIO_DIR):
    for z_name in ["12X18-KITCHEN-02.zip", "12X18-GLOSSY-12.zip"]:
        z_path = os.path.join(PORTFOLIO_DIR, z_name)
        if os.path.exists(z_path):
            with zipfile.ZipFile(z_path, 'r') as z:
                for member in z.namelist():
                    if member.endswith('.pdf') and "Pricelist" not in member:
                        extracted_path = z.extract(member, os.path.join(TMP_EXTRACT_DIR, "_pdfs"))
                        pdf_sources[os.path.basename(member)] = extracted_path

if os.path.exists(DOWNLOADS_DIR):
    for f in os.listdir(DOWNLOADS_DIR):
        if f.endswith('.pdf') and "Pricelist" not in f:
            pdf_sources[f] = os.path.join(DOWNLOADS_DIR, f)

def get_category(filename):
    fn = filename.upper()
    if "PRICELIST" in fn:
        return None
    if "GLOSSY" in fn or "KITCHEN" in fn:
        return "ceramic-crystal-tiles"
    if "MATT" in fn:
        return "tiles"
    if "POOJA" in fn:
        return "digital-3d-7d-tiles"
    if any(k in fn for k in ["GOLDEN BASIN", "MARBLE BASIN", "VANITY", "TITA-QUARTZ-KITCHEN-SINK", "SANITARY"]):
        return "sanitary-items"
    return "ceramic-crystal-tiles"

print(f"Found {len(pdf_sources)} unique target catalog PDFs.")

catalog_picks = []

for pdf_name, pdf_path in sorted(pdf_sources.items()):
    cat_slug = get_category(pdf_name)
    if not cat_slug:
        continue

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Error opening {pdf_name}: {e}")
        continue

    page_count = len(doc)
    folder_name = os.path.splitext(pdf_name)[0]
    out_dir = os.path.join(TMP_EXTRACT_DIR, cat_slug, folder_name)
    os.makedirs(out_dir, exist_ok=True)

    extracted_count = 0
    # Determine candidate pages to render (2-3 per catalog)
    if page_count == 1:
        target_pages = [0]
    elif page_count == 2:
        target_pages = [0, 1]
    else:
        # Pick representative pages (excluding back cover if > 3 pages)
        mid1 = page_count // 3
        mid2 = (2 * page_count) // 3
        target_pages = [mid1, mid2]
        if page_count >= 5:
            target_pages.append(min(page_count - 2, mid2 + 1))

    for p_idx in target_pages:
        page = doc.load_page(p_idx)
        pix = page.get_pixmap(dpi=100) # fast 100 dpi render
        img_name = f"page_{p_idx + 1:02d}.jpg"
        img_path = os.path.join(out_dir, img_name)
        pix.save(img_path)

        with Image.open(img_path) as im:
            w, h = im.size

        # Design reference & suggested name
        ref_id = f"{cat_slug}-{folder_name.lower().replace(' ', '-')}-p{p_idx + 1}"

        catalog_picks.append({
            "pdf_name": pdf_name,
            "category": cat_slug,
            "page": p_idx + 1,
            "total_pages": page_count,
            "img_path": img_path,
            "width": w,
            "height": h,
            "ref_id": ref_id
        })

print(f"Extracted {len(catalog_picks)} page picks across all catalogs.")
