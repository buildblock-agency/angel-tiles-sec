import os
import shutil

scratch_dirs = [
    r"d:\angel tiles updated\angel-tiles\scripts\tmp-all-pdfs",
    r"d:\angel tiles updated\angel-tiles\scripts\tmp-all-webp",
    r"d:\angel tiles updated\angel-tiles\scripts\tmp-catalogs",
    r"d:\angel tiles updated\angel-tiles\scripts\tmp-extract",
    r"d:\angel tiles updated\angel-tiles\scripts\tmp-uploads"
]

for s_dir in scratch_dirs:
    if os.path.exists(s_dir):
        try:
            shutil.rmtree(s_dir)
            print(f"Cleaned up scratch directory: {s_dir}")
        except Exception as e:
            print(f"Could not remove {s_dir}: {e}")

print("All temporary catalog working files successfully cleaned up!")
