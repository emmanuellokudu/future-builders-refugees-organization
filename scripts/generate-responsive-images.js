const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR = path.resolve(__dirname, '..', 'assets', 'img');

async function run() {
  console.log('--- FBRO Generating 480w Mobile WebP Images & Optimizing Logo ---');

  // 1. Optimize logo.png
  const logoPath = path.join(IMG_DIR, 'logo.png');
  if (fs.existsSync(logoPath)) {
    const origStat = fs.statSync(logoPath);
    console.log(`Original logo.png: ${(origStat.size / 1024).toFixed(1)} KB`);

    // Create optimized PNG (240px wide, max lossless compression)
    const optimizedLogo = await sharp(logoPath)
      .resize(240, null, { withoutEnlargement: true })
      .png({ compressionLevel: 9, effort: 10 })
      .toBuffer();

    fs.writeFileSync(logoPath, optimizedLogo);
    console.log(`Optimized logo.png: ${(optimizedLogo.length / 1024).toFixed(1)} KB (-${(((origStat.size - optimizedLogo.length) / origStat.size) * 100).toFixed(1)}%)\n`);
  }

  // 2. Generate 480w images for all 15 base images
  const baseNames = [
    'cleanup-01',
    'cleanup-06',
    'cleanup-team',
    'community-group',
    'farm-crop',
    'farm-field',
    'farm-greens',
    'meeting-portrait',
    'meeting-speaker-01',
    'meeting-speaker-02',
    'meeting-speaker-03',
    'meeting-women-01',
    'meeting-women-02',
    'nursery-seedlings',
    'youth-football'
  ];

  let total480Bytes = 0;

  for (const base of baseNames) {
    const src800 = path.join(IMG_DIR, `${base}-800.webp`);
    const src1600 = path.join(IMG_DIR, `${base}-1600.webp`);
    const sourceFile = fs.existsSync(src800) ? src800 : src1600;

    if (!fs.existsSync(sourceFile)) {
      console.warn(`Warning: Could not find source for ${base}`);
      continue;
    }

    const dest480 = path.join(IMG_DIR, `${base}-480.webp`);
    const meta = await sharp(sourceFile).metadata();

    // Determine target width/height maintaining aspect ratio
    // If portrait (height > width), resize height or width proportionally
    let resizeOpts;
    if (meta.width >= meta.height) {
      resizeOpts = { width: 480, withoutEnlargement: true };
    } else {
      resizeOpts = { width: 360, withoutEnlargement: true };
    }

    const buf = await sharp(sourceFile)
      .resize(resizeOpts.width, null, { withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 })
      .toBuffer();

    fs.writeFileSync(dest480, buf);
    total480Bytes += buf.length;
    console.log(`✓ Generated ${base}-480.webp: ${(buf.length / 1024).toFixed(1)} KB`);
  }

  console.log('\n----------------------------------------');
  console.log(`Generated ${baseNames.length} 480w images totaling ${(total480Bytes / 1024).toFixed(1)} KB (average: ${(total480Bytes / baseNames.length / 1024).toFixed(1)} KB per image)`);
  console.log('----------------------------------------\n');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
