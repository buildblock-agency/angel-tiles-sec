import os
import zipfile
import fitz # PyMuPDF
import sys

sys.stdout.reconfigure(encoding='utf-8')

TMP_CATALOGS_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-catalogs"
TMP_EXTRACT_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-extract"
PORTFOLIO_DIR = r"D:\angel tiles updated\asset\portfolio"

os.makedirs(TMP_CATALOGS_DIR, exist_ok=True)
os.makedirs(TMP_EXTRACT_DIR, exist_ok=True)

# 1. Unzip target zip files
zips = ["12X18-KITCHEN-02.zip", "12X18-GLOSSY-12.zip"]
for z_name in zips:
    z_path = os.path.join(PORTFOLIO_DIR, z_name)
    if os.path.exists(z_path):
        print(f"Extracting zip: {z_name}")
        with zipfile.ZipFile(z_path, 'r') as z:
            z.extractall(TMP_CATALOGS_DIR)

print("\nFiles in tmp-catalogs:")
pdf_files = [f for f in os.listdir(TMP_CATALOGS_DIR) if f.endswith('.pdf')]
for pdf in pdf_files:
    print(" -", pdf)

# 2. Process each PDF, render pages as preview JPEGs
summary = []

for pdf_name in sorted(pdf_files):
    if "Pricelist" in pdf_name:
        print(f"Skipping text pricing PDF: {pdf_name}")
        continue

    pdf_path = os.path.join(TMP_CATALOGS_DIR, pdf_name)
    doc = fitz.open(pdf_path)
    page_count = len(doc)
    print(f"\nProcessing PDF: {pdf_name} ({page_count} pages)")

    pdf_out_dir = os.path.join(TMP_EXTRACT_DIR, os.path.splitext(pdf_name)[0])
    os.makedirs(pdf_out_dir, exist_ok=True)

    for page_num in range(page_count):
        page = doc.load_page(page_num)
        text = page.get_text().strip()

        # Render high quality preview
        pix = page.get_pixmap(dpi=150)
        img_name = f"page_{page_num + 1:02d}.jpg"
        img_path = os.path.join(pdf_out_dir, img_name)
        pix.save(img_path)

        summary.append({
            "pdf": pdf_name,
            "page": page_num + 1,
            "text": text[:100].replace("\n", " "),
            "img_path": img_path
        })

print(f"\nTotal pages rendered: {len(summary)}")
