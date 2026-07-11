const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths
const ROOT_DIR = path.resolve(__dirname, '..');
const FRAMES_SRC_DIR = path.join(ROOT_DIR, '..', 'frames');
const PHOTOS_SRC_DIR = path.join(ROOT_DIR, '..', 'Angel Tiles Photos');

const HERO_FRAMES_DEST_DIR = path.join(ROOT_DIR, 'public', 'hero-frames');
const SHOWROOM_DEST_DIR = path.join(ROOT_DIR, 'public', 'showroom');
const TEXTURES_DEST_DIR = path.join(ROOT_DIR, 'public', 'textures');

// Ensure directories exist
[HERO_FRAMES_DEST_DIR, SHOWROOM_DEST_DIR, TEXTURES_DEST_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

async function processHeroFrames() {
  console.log('--- Processing Hero Frames ---');
  if (!fs.existsSync(FRAMES_SRC_DIR)) {
    console.error(`Source frames directory not found at: ${FRAMES_SRC_DIR}`);
    return;
  }

  // We have frame_0001.png to frame_0240.png
  // We take every 4th frame (60 frames total)
  let destIdx = 1;
  for (let srcIdx = 1; srcIdx <= 240; srcIdx += 4) {
    const fileName = `frame_${srcIdx.toString().padStart(4, '0')}.png`;
    const srcPath = path.join(FRAMES_SRC_DIR, fileName);
    const destPath = path.join(HERO_FRAMES_DEST_DIR, `frame_${destIdx.toString().padStart(2, '0')}.webp`);

    if (fs.existsSync(srcPath)) {
      try {
        await sharp(srcPath)
          .resize(1280) // Downscale to 1280px width for fast web rendering
          .webp({ quality: 75 })
          .toFile(destPath);
        console.log(`Processed: ${fileName} -> frame_${destIdx.toString().padStart(2, '0')}.webp`);
      } catch (err) {
        console.error(`Error processing frame ${srcIdx}:`, err.message);
      }
    } else {
      console.warn(`Frame not found: ${srcPath}`);
    }
    destIdx++;
  }
  console.log(`Hero frames processing complete. Total frames processed: ${destIdx - 1}`);
}

async function processShowroomPhotos() {
  console.log('--- Processing Showroom Photos ---');
  if (!fs.existsSync(PHOTOS_SRC_DIR)) {
    console.error(`Source photos directory not found at: ${PHOTOS_SRC_DIR}`);
    return;
  }

  const files = fs.readdirSync(PHOTOS_SRC_DIR);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg'));
  console.log(`Found ${jpgFiles.length} JPEG files in showroom source.`);

  // Process all JPEGs, copy them to public/showroom
  // Crop 512x512 patches from the first few files to use as marble/tile textures in the visualizer
  let textureCount = 0;
  for (let i = 0; i < jpgFiles.length; i++) {
    const file = jpgFiles[i];
    const srcPath = path.join(PHOTOS_SRC_DIR, file);
    const destPath = path.join(SHOWROOM_DEST_DIR, `image_${i + 1}.webp`);

    try {
      // 1. Process primary showroom photo (resize to 1600px width for web display)
      await sharp(srcPath)
        .resize(1600)
        .webp({ quality: 80 })
        .toFile(destPath);
      console.log(`Processed Showroom Image: ${file} -> image_${i + 1}.webp`);

      // 2. Extract texture patch from center if it's one of the first 8 photos
      // These will serve as raw material textures in the visualizer
      if (textureCount < 8) {
        const texturePath = path.join(TEXTURES_DEST_DIR, `texture_${textureCount + 1}.webp`);
        // Get metadata to crop center
        const meta = await sharp(srcPath).metadata();
        const cropSize = Math.min(meta.width, meta.height, 1024); // extract up to 1024x1024
        const left = Math.floor((meta.width - cropSize) / 2);
        const top = Math.floor((meta.height - cropSize) / 2);

        await sharp(srcPath)
          .extract({ left, top, width: cropSize, height: cropSize })
          .resize(512, 512) // standard texture size
          .webp({ quality: 85 })
          .toFile(texturePath);
        
        console.log(`Extracted Texture: ${file} -> texture_${textureCount + 1}.webp (512x512 crop)`);
        textureCount++;
      }
    } catch (err) {
      console.error(`Error processing photo ${file}:`, err.message);
    }
  }
  console.log('Showroom photos processing complete.');
}

async function run() {
  console.log('Starting Asset Processing Pipeline...');
  const start = Date.now();
  await processHeroFrames();
  await processShowroomPhotos();
  console.log(`Pipeline finished in ${((Date.now() - start) / 1000).toFixed(2)}s`);
}

run();
