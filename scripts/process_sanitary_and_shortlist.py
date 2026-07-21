import os
import fitz # PyMuPDF
import sys
import json
from PIL import Image

sys.stdout.reconfigure(encoding='utf-8')

TMP_EXTRACT_DIR = r"d:\angel tiles updated\angel-tiles\scripts\tmp-extract"
PDFS_DIR = os.path.join(TMP_EXTRACT_DIR, "_pdfs")

sanitary_pdfs = [
    "Golden Basin of Tita Sanitarywares.pdf",
    "Marble basin of tita sanitarywares_compressed.pdf",
    "Tita-Quartz-Kitchen-Sink-1.pdf",
    "Tita_vanity_brochure.pdf",
    "Vanity of tita sanitarywares_compressed.pdf"
]

out_base = os.path.join(TMP_EXTRACT_DIR, "sanitary-items")
os.makedirs(out_base, exist_ok=True)

for pdf_name in sanitary_pdfs:
    pdf_path = os.path.join(PDFS_DIR, pdf_name)
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path}")
        continue

    doc = fitz.open(pdf_path)
    page_count = len(doc)
    folder_name = os.path.splitext(pdf_name)[0]
    out_dir = os.path.join(out_base, folder_name)
    os.makedirs(out_dir, exist_ok=True)

    # Render top 2-3 pages
    target_pages = [0, min(1, page_count-1), min(2, page_count-1)]
    target_pages = sorted(list(set(target_pages)))

    for p_idx in target_pages:
        page = doc.load_page(p_idx)
        pix = page.get_pixmap(dpi=120)
        img_name = f"page_{p_idx + 1:02d}.jpg"
        img_path = os.path.join(out_dir, img_name)
        pix.save(img_path)
        print(f"Saved: {img_path}")

print("Finished rendering sanitary items pages.")
