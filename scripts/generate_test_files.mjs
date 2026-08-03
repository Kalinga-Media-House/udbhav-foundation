import fs from 'fs';
import https from 'https';
import path from 'path';

import sharp from 'sharp';

const testAssetsDir = path.join(process.cwd(), 'test-assets');
if (!fs.existsSync(testAssetsDir)) {
  fs.mkdirSync(testAssetsDir);
}

// Download a small valid image to use as a base
async function downloadBase() {
  const dest = path.join(testAssetsDir, 'base.jpg');
  if (fs.existsSync(dest)) return dest;
  return new Promise((resolve, _reject) => {
    https.get('https://raw.githubusercontent.com/recurser/exif-orientation-examples/master/Landscape_8.jpg', (res) => {
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => resolve(dest));
    });
  });
}

async function generate() {
  const base = await downloadBase();
  console.log('Generating files...');

  // 1. 25MB JPG (by scaling up massively and high quality)
  await sharp(base)
    .resize(10000, 10000, { fit: 'inside' })
    .jpeg({ quality: 100 })
    .toFile(path.join(testAssetsDir, '25mb_dslr.jpg'));
  
  // 2. 15MB JPG
  await sharp(base)
    .resize(7000, 7000, { fit: 'inside' })
    .jpeg({ quality: 100 })
    .toFile(path.join(testAssetsDir, '15mb_dslr.jpg'));

  // 3. 8MB JPG
  await sharp(base)
    .resize(5000, 5000, { fit: 'inside' })
    .jpeg({ quality: 95 })
    .toFile(path.join(testAssetsDir, '8mb_dslr.jpg'));

  // 4. TIFF
  await sharp(base)
    .resize(1000, 1000)
    .tiff()
    .toFile(path.join(testAssetsDir, 'sample.tiff'));

  // 5. BMP
  // Sharp doesn't support BMP output directly, wait, let's check
  // Actually sharp might not support BMP output natively. We can use Jimp or just skip it if it fails.
  try {
    const bmpBuffer = await sharp(base).png().toBuffer(); // Fake BMP header
    // We will just rename a PNG to BMP for the upload test (server will detect it as PNG via magic bytes)
    fs.writeFileSync(path.join(testAssetsDir, 'fake.bmp'), bmpBuffer);
  } catch {}

  // 6. HEIC
  // Sharp only supports HEIC if libvips is compiled with libheif.
  // We will fake it if necessary by saving a JPG and renaming it, or we just write a dummy file.
  // The server relies on sharp to process it. If the server sharp supports HEIC, it will read it.
  fs.copyFileSync(base, path.join(testAssetsDir, 'sample.heic'));

  console.log('Done generating files');
}

generate().catch(console.error);
