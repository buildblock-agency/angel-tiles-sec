import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Read .env.local manually to ensure env vars are populated
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

console.log(`Cloudinary Config: Cloud Name=${cloudName}, API Key=${apiKey ? '***' + apiKey.slice(-4) : 'MISSING'}`);

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Error: Missing Cloudinary credentials in process.env");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

const TMP_UPLOADS_DIR = path.resolve(__dirname, 'tmp-uploads');
const MANIFEST_OUT = path.resolve(__dirname, 'final_cloudinary_manifest.json');

async function runUploadPipeline() {
  if (!fs.existsSync(TMP_UPLOADS_DIR)) {
    console.error(`Directory not found: ${TMP_UPLOADS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(TMP_UPLOADS_DIR).filter(f => f.endsWith('.webp'));
  console.log(`Found ${files.length} WebP images to upload to Cloudinary.`);

  const uploadResults: Array<{
    filename: string;
    category: string;
    publicId: string;
    secureUrl: string;
    bytes: number;
    format: string;
  }> = [];

  for (const file of files) {
    const filePath = path.join(TMP_UPLOADS_DIR, file);
    
    // Parse category and publicId from filename (e.g. ceramic-crystal-tiles-glossy-12-p2.webp)
    // Folder schema: angel-tiles/{category-slug}/{image-name}
    let catSlug = 'ceramic-crystal-tiles';
    if (file.startsWith('sanitary-items-')) catSlug = 'sanitary-items';
    else if (file.startsWith('digital-3d-7d-tiles-')) catSlug = 'digital-3d-7d-tiles';
    else if (file.startsWith('tiles-')) catSlug = 'tiles';

    const baseName = file.replace(`${catSlug}-`, '').replace('.webp', '');
    const publicId = `angel-tiles/${catSlug}/${baseName}`;

    console.log(`Uploading ${file} -> ${publicId}...`);

    try {
      const res = await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: true,
        invalidate: true,
        resource_type: 'image',
      });

      console.log(`  ✔ Uploaded: ${res.secure_url}`);
      uploadResults.push({
        filename: file,
        category: catSlug,
        publicId: res.public_id,
        secureUrl: res.secure_url,
        bytes: res.bytes,
        format: res.format,
      });
    } catch (err) {
      console.error(`  ❌ Failed to upload ${file}:`, err);
    }
  }

  fs.writeFileSync(MANIFEST_OUT, JSON.stringify(uploadResults, null, 2), 'utf8');
  console.log(`\nUpload complete! Final manifest saved to ${MANIFEST_OUT}`);
}

runUploadPipeline();
