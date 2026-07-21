import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valParts] = trimmed.split('=');
      if (key && valParts.length > 0) {
        process.env[key.trim()] = valParts.join('=').trim();
      }
    }
  });
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing Cloudinary credentials");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const TMP_WEBP_DIR = path.resolve(__dirname, 'tmp-all-webp');
const MANIFEST_OUT = path.resolve(__dirname, 'full_catalog_cloudinary_manifest.json');

async function runUploadAll() {
  if (!fs.existsSync(TMP_WEBP_DIR)) {
    console.error(`Directory not found: ${TMP_WEBP_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(TMP_WEBP_DIR).filter(f => f.endsWith('.webp'));
  console.log(`Starting Cloudinary upload for ${files.length} catalog items...`);

  const results: Array<{
    filename: string;
    category: string;
    publicId: string;
    secureUrl: string;
  }> = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(TMP_WEBP_DIR, file);

    // Extract category slug from file prefix
    let catSlug = 'tiles';
    const categories = [
      'imported-marble', 'domestic-marble', 'granite', 'tiles',
      'custom-tiles', 'digital-3d-7d-tiles', 'ceramic-crystal-tiles', 'sanitary-items'
    ];

    for (const c of categories) {
      if (file.startsWith(`${c}-`)) {
        catSlug = c;
        break;
      }
    }

    const baseName = file.replace(`${catSlug}-`, '').replace('.webp', '');
    const cleanBaseName = baseName.replace(/&/g, '-and-').replace(/[^a-zA-Z0-9_\-]/g, '-');
    const publicId = `angel-tiles/${catSlug}/${cleanBaseName}`;

    console.log(`[${i + 1}/${files.length}] Uploading ${file} -> ${publicId}...`);

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
      });

      console.log(`   ✔ ${res.secure_url}`);
      results.push({
        filename: file,
        category: catSlug,
        publicId: res.public_id,
        secureUrl: res.secure_url,
      });
    } catch (err) {
      console.error(`   ❌ Failed to upload ${file}:`, err);
    }
  }

  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nAll catalog photos uploaded successfully! Saved to ${MANIFEST_OUT}`);
}

runUploadAll();
