#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const blogDir = './blog';

// Find all banner.svg files
const blogFolders = fs.readdirSync(blogDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

async function convertBanner(folder) {
  const svgPath = path.join(blogDir, folder, 'banner.svg');
  const pngPath = path.join(blogDir, folder, 'banner-og.png');

  if (!fs.existsSync(svgPath)) {
    console.log(`Skipping ${folder} - no banner.svg found`);
    return;
  }

  try {
    await sharp(svgPath)
      .resize(1200, 400, { // Match 3:1 aspect ratio from SVG
        fit: 'cover'
      })
      .png()
      .toFile(pngPath);

    console.log(`✓ Converted ${folder}/banner.svg → banner-og.png`);
  } catch (error) {
    console.error(`✗ Failed to convert ${folder}/banner.svg:`, error.message);
  }
}

async function main() {
  console.log('Converting SVG banners to PNG for OG tags...\n');

  for (const folder of blogFolders) {
    await convertBanner(folder);
  }

  console.log('\nDone!');
}

main();
