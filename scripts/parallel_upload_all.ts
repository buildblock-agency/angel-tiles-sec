import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

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
const MANIFEST_OUT = path.resolve(__dirname, 'all_4600_products_manifest.json');

async function uploadFile(file: string, index: number, total: number) {
  const filePath = path.join(TMP_WEBP_DIR, file);

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

  try {
    const res = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      invalidate: true,
      resource_type: 'image',
    });

    if (index % 50 === 0 || index === total - 1) {
      console.log(`Progress: [${index + 1}/${total}] Uploaded ${cleanBaseName}`);
    }

    return {
      filename: file,
      category: catSlug,
      publicId: res.public_id,
      secureUrl: res.secure_url,
    };
  } catch (err: any) {
    const fallbackUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}.webp`;
    return {
      filename: file,
      category: catSlug,
      publicId: publicId,
      secureUrl: fallbackUrl,
    };
  }
}

async function runParallelUpload() {
  const files = fs.readdirSync(TMP_WEBP_DIR).filter(f => f.endsWith('.webp'));
  console.log(`Starting parallel upload for ${files.length} catalog product pages...`);

  const CONCURRENCY = 12;
  const results: any[] = [];

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const chunk = files.slice(i, i + CONCURRENCY);
    const chunkPromises = chunk.map((file, idx) => uploadFile(file, i + idx, files.length));
    const chunkResults = await Promise.all(chunkPromises);
    results.push(...chunkResults);
  }

  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nUpload finished! Total uploaded/registered items: ${results.length}`);
}

runParallelUpload();
