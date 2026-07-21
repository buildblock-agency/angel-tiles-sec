import os
import zipfile
import shutil
import fitz # PyMuPDF
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

TMP_CATALOGS_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-catalogs"
TMP_EXTRACT_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-extract"
PORTFOLIO_DIR = r"D:\angel tiles updated\asset\portfolio"
DOWNLOADS_DIR = r"C:\Users\LENOV\Downloads\angel tiles web res-20260721T051844Z-1-001\angel tiles web res"

os.makedirs(TMP_CATALOGS_DIR, exist_ok=True)
os.makedirs(TMP_EXTRACT_DIR, exist_ok=True)

# Unzip any zip files in PORTFOLIO_DIR
if os.path.exists(PORTFOLIO_DIR):
    for f in os.listdir(PORTFOLIO_DIR):
        if f.endswith('.zip'):
            z_path = os.path.join(PORTFOLIO_DIR, f)
            with zipfile.ZipFile(z_path, 'r') as z:
                for member in z.namelist():
                    if member.endswith('.pdf'):
                        z.extract(member, TMP_CATALOGS_DIR)

# Copy PDFs from DOWNLOADS_DIR
if os.path.exists(DOWNLOADS_DIR):
    for f in os.listdir(DOWNLOADS_DIR):
        if f.endswith('.pdf'):
            src_path = os.path.join(DOWNLOADS_DIR, f)
            dst_path = os.path.join(TMP_CATALOGS_DIR, f)
            if not os.path.exists(dst_path):
                shutil.copy2(src_path, dst_path)

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

all_pdfs = [f for f in os.listdir(TMP_CATALOGS_DIR) if f.endswith('.pdf')]
print(f"Total PDFs found in tmp-catalogs: {len(all_pdfs)}")

results = []

for pdf_name in sorted(all_pdfs):
    cat_slug = get_category(pdf_name)
    if not cat_slug:
        print(f"Skipping (pricelist/text): {pdf_name}")
        continue

    pdf_path = os.path.join(TMP_CATALOGS_DIR, pdf_name)
    doc = fitz.open(pdf_path)
    page_count = len(doc)

    out_folder = os.path.join(TMP_EXTRACT_DIR, cat_slug, os.path.splitext(pdf_name)[0])
    os.makedirs(out_folder, exist_ok=True)

    extracted_pages = []

    for page_num in range(page_count):
        page = doc.load_page(page_num)
        text = page.get_text().strip()

        # Render page preview image
        pix = page.get_pixmap(dpi=120)
        img_name = f"page_{page_num + 1:02d}.jpg"
        img_path = os.path.join(out_folder, img_name)
        pix.save(img_path)

        with Image.open(img_path) as im:
            w, h = im.size

        extracted_pages.append({
            "page_num": page_num + 1,
            "img_path": img_path,
            "width": w,
            "height": h,
            "text": text.replace("\n", " ")
        })

    results.append({
        "pdf_name": pdf_name,
        "category": cat_slug,
        "page_count": page_count,
        "pages": extracted_pages
    })

print(f"\nExtraction finished for {len(results)} catalogs.")
