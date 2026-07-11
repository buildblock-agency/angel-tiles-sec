const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BRAIN_DIR = 'C:\\Users\\LENOV\\.gemini\\antigravity-ide\\brain\\31e8d446-4a4f-4436-8a25-95c0d6fb3dfa';
const DEST_SHOWROOM_DIR = path.resolve(__dirname, '..', 'public', 'showroom');
const DEST_PRESETS_DIR = path.resolve(__dirname, '..', 'public', 'presets');

// Ensure destination directories exist
[DEST_SHOWROOM_DIR, DEST_PRESETS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const ASSETS_MAP = [
  { src: 'statuario_marble_living_1783706963667.png', dest: 'statuario_marble_living.webp', type: 'showroom' },
  { src: 'makrana_marble_lobby_1783706980337.png', dest: 'makrana_marble_lobby.webp', type: 'showroom' },
  { src: 'alaska_granite_kitchen_1783707004685.png', dest: 'alaska_granite_kitchen.webp', type: 'showroom' },
  { src: 'pgvt_tiles_lobby_1783707019639.png', dest: 'pgvt_tiles_lobby.webp', type: 'showroom' },
  { src: 'preset_living_floor_1783707037795.png', dest: 'preset_living_floor.webp', type: 'preset' },
  { src: 'preset_bedroom_floor_1783707049801.png', dest: 'preset_bedroom_floor.webp', type: 'preset' },
  { src: 'preset_bathroom_wall_1783707065908.png', dest: 'preset_bathroom_wall.webp', type: 'preset' },
  { src: 'preset_lobby_floor_1783707081756.png', dest: 'preset_lobby_floor.webp', type: 'preset' },
];

async function processAiAssets() {
  console.log('--- Processing AI Assets ---');
  for (const asset of ASSETS_MAP) {
    const srcPath = path.join(BRAIN_DIR, asset.src);
    const destDir = asset.type === 'showroom' ? DEST_SHOWROOM_DIR : DEST_PRESETS_DIR;
    const destPath = path.join(destDir, asset.dest);

    if (fs.existsSync(srcPath)) {
      try {
        await sharp(srcPath)
          .resize(1600) // downscale to standard web width
          .webp({ quality: 85 })
          .toFile(destPath);
        console.log(`Processed: ${asset.src} -> ${asset.dest}`);
      } catch (err) {
        console.error(`Error processing asset ${asset.src}:`, err.message);
      }
    } else {
      console.warn(`Source AI asset not found: ${srcPath}`);
    }
  }
  console.log('AI assets processing completed successfully.');
}

processAiAssets();
