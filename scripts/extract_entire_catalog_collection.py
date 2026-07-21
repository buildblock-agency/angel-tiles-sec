import os
import zipfile
import glob
import fitz # PyMuPDF
import sys
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

TMP_ALL_PDFS = r"d:\angel tiles updated\angel-tiles\scripts\tmp-all-pdfs"
TMP_ALL_WEBP = r"d:\angel tiles updated\angel-tiles\scripts\tmp-all-webp"
PORTFOLIO_DIR = r"D:\angel tiles updated\asset\portfolio"
DOWNLOADS_DIR = r"C:\Users\LENOV\Downloads\angel tiles web res-20260721T051844Z-1-001\angel tiles web res"

os.makedirs(TMP_ALL_PDFS, exist_ok=True)
os.makedirs(TMP_ALL_WEBP, exist_ok=True)

# 1. Unzip ALL ZIPs in PORTFOLIO_DIR
if os.path.exists(PORTFOLIO_DIR):
    for f in os.listdir(PORTFOLIO_DIR):
        if f.endswith('.zip'):
            z_path = os.path.join(PORTFOLIO_DIR, f)
            print(f"Unzipping: {f}")
            try:
                with zipfile.ZipFile(z_path, 'r') as z:
                    for member in z.namelist():
                        if member.endswith('.pdf') and "Pricelist" not in member:
                            fname = os.path.basename(member)
                            target_pdf = os.path.join(TMP_ALL_PDFS, fname)
                            if not os.path.exists(target_pdf):
                                with z.open(member) as source, open(target_pdf, 'wb') as target:
                                    target.write(source.read())
            except Exception as e:
                print(f"Error unzipping {f}: {e}")

# 2. Copy all PDFs from DOWNLOADS_DIR
if os.path.exists(DOWNLOADS_DIR):
    for f in os.listdir(DOWNLOADS_DIR):
        if f.endswith('.pdf') and "Pricelist" not in f:
            target_pdf = os.path.join(TMP_ALL_PDFS, f)
            if not os.path.exists(target_pdf):
                src_pdf = os.path.join(DOWNLOADS_DIR, f)
                with open(src_pdf, 'rb') as source, open(target_pdf, 'wb') as target:
                    target.write(source.read())

pdf_files = [f for f in os.listdir(TMP_ALL_PDFS) if f.endswith('.pdf')]
print(f"\nTotal PDF catalogs extracted across ALL ZIPs: {len(pdf_files)}")

def categorize_pdf(filename):
    fn = filename.upper()
    if "PRICELIST" in fn:
        return None
    if any(k in fn for k in ["STATUARIO", "BOOK-MATCH", "BOOK_MATCH", "CARRA", "ITALIAN"]):
        return "imported-marble"
    if any(k in fn for k in ["MAKRANA", "ALBETA", "TERAZZO", "TERRAZZO"]):
        return "domestic-marble"
    if any(k in fn for k in ["GRANITE", "CARVING", "BLACK"]):
        return "granite"
    if any(k in fn for k in ["POOJA", "ELEVATION", "FISH", "3D", "7D", "RELIEF"]):
        return "digital-3d-7d-tiles"
    if any(k in fn for k in ["GOLDEN BASIN", "MARBLE BASIN", "VANITY", "TITA-QUARTZ-KITCHEN-SINK", "SANITARY", "SINK"]):
        return "sanitary-items"
    if any(k in fn for k in ["ASTRAL", "ENDLESS", "600X1800", "1200X1800", "MATT", "PGVT", "SLAB"]):
        return "tiles"
    if any(k in fn for k in ["GLOSSY", "KITCHEN"]):
        return "ceramic-crystal-tiles"
    return "tiles"

manifest = []
total_pages_count = 0

for pdf_name in sorted(pdf_files):
    cat_slug = categorize_pdf(pdf_name)
    if not cat_slug:
        continue

    pdf_path = os.path.join(TMP_ALL_PDFS, pdf_name)
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Skipping corrupt PDF {pdf_name}: {e}")
        continue

    page_count = len(doc)
    total_pages_count += page_count
    clean_base = os.path.splitext(pdf_name)[0].lower().replace(" ", "-").replace("_", "-").replace("(", "").replace(")", "")

    # EXTRACT EVERY SINGLE PAGE (page 0 to page_count-1)
    for p_idx in range(page_count):
        page = doc.load_page(p_idx)
        pix = page.get_pixmap(dpi=140)

        file_slug = f"{cat_slug}-{clean_base}-p{p_idx + 1}.webp"
        out_path = os.path.join(TMP_ALL_WEBP, file_slug)

        temp_png = os.path.join(TMP_ALL_WEBP, f"temp_{p_idx}.png")
        pix.save(temp_png)

        with Image.open(temp_png) as im:
            max_dim = 1800
            if im.width > max_dim or im.height > max_dim:
                im.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            im.save(out_path, "WEBP", quality=82, optimize=True)

        if os.path.exists(temp_png):
            os.remove(temp_png)

        size_kb = round(os.path.getsize(out_path) / 1024.0, 1)

        manifest.append({
            "pdf": pdf_name,
            "page": p_idx + 1,
            "category": cat_slug,
            "file_slug": file_slug,
            "local_path": out_path,
            "size_kb": size_kb,
            "public_id": f"angel-tiles/{cat_slug}/{clean_base}-p{p_idx + 1}"
        })

print(f"\nExtracted EVERY SINGLE PAGE from ALL PDFs!")
print(f"Total PDFs: {len(pdf_files)} | Total Catalog Pages Rendered: {len(manifest)}")
