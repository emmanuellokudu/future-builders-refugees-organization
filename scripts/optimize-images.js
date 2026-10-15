#!/usr/bin/env node
/**
 * FBRO Image Optimization Utility
 * Non-destructively compresses WebP assets in assets/img/ with configurable quality.
 * Usage:
 *   node scripts/optimize-images.js [--quality=75] [--dry-run]
 *
 * Requirements:
 *   npm install -D sharp
 */

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.resolve(__dirname, '..', 'assets', 'img');

// Parse CLI arguments
const args = process.argv.slice(2);
const qualityArg = args.find(a => a.startsWith('--quality='));
const targetQuality = qualityArg ? parseInt(qualityArg.split('=')[1], 10) : 75;
const isDryRun = args.includes('--dry-run');

console.log('--- FBRO Image Optimization Script ---');
console.log(`Directory: ${IMG_DIR}`);
console.log(`Target Quality: ${targetQuality}`);
console.log(`Dry Run: ${isDryRun ? 'Yes (no files will be modified)' : 'No'}\n`);

let sharp;
try {
  sharp = require('sharp');
} catch (err) {
  console.log('NOTE: "sharp" is not currently installed.');
  console.log('To run WebP image re-encoding, install the optional devDependency:');
  console.log('  npm install -D sharp');
  console.log('Then run:');
  console.log(`  npm run optimize-images -- --quality=${targetQuality}\n`);
  process.exit(0);
}

async function run() {
  if (!fs.existsSync(IMG_DIR)) {
    console.error(`Error: Directory not found: ${IMG_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(IMG_DIR).filter(f => f.toLowerCase().endsWith('.webp'));
  if (files.length === 0) {
    console.log('No .webp files found in assets/img/');
    return;
  }

  console.log(`Found ${files.length} WebP images. Processing...\n`);

  let totalOriginal = 0;
  let totalOptimized = 0;
  let updatedCount = 0;

  for (const file of files) {
    const filePath = path.join(IMG_DIR, file);
    const originalStat = fs.statSync(filePath);
    const originalBytes = originalStat.size;
    totalOriginal += originalBytes;

    try {
      const inputBuffer = fs.readFileSync(filePath);
      const outputBuffer = await sharp(inputBuffer)
        .webp({ quality: targetQuality, effort: 6 })
        .toBuffer();

      const newBytes = outputBuffer.length;

      if (newBytes < originalBytes) {
        const saved = originalBytes - newBytes;
        const pct = ((saved / originalBytes) * 100).toFixed(1);
        console.log(`✓ ${file}: ${(originalBytes / 1024).toFixed(1)}KB -> ${(newBytes / 1024).toFixed(1)}KB (-${pct}%)`);

        if (!isDryRun) {
          fs.writeFileSync(filePath, outputBuffer);
        }
        totalOptimized += newBytes;
        updatedCount++;
      } else {
        console.log(`= ${file}: Already optimal (${(originalBytes / 1024).toFixed(1)}KB)`);
        totalOptimized += originalBytes;
      }
    } catch (e) {
      console.error(`✗ Error processing ${file}: ${e.message}`);
      totalOptimized += originalBytes;
    }
  }

  const totalSaved = totalOriginal - totalOptimized;
  const totalPct = ((totalSaved / totalOriginal) * 100).toFixed(1);

  console.log('\n----------------------------------------');
  console.log(`Optimization Complete:`);
  console.log(`Files updated: ${updatedCount} / ${files.length}`);
  console.log(`Original size: ${(totalOriginal / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`New size:      ${(totalOptimized / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Total saved:   ${(totalSaved / 1024).toFixed(1)} KB (-${totalPct}%)`);
  console.log('----------------------------------------\n');
}

run().catch(err => {
  console.error('Fatal error during optimization:', err);
  process.exit(1);
});
