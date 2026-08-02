import fs from 'fs';
import path from 'path';
import https from 'https';

const testAssetsDir = path.join(process.cwd(), 'test-assets');
if (!fs.existsSync(testAssetsDir)) {
  fs.mkdirSync(testAssetsDir);
}

const assets = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Rotating_earth_%28large%29.gif',
    name: 'animated_earth.gif'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png',
    name: 'transparent_demo.png'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/New_York_City_Skyline_from_Hoboken_Terminal.jpg',
    name: 'new_york_skyline_20mb.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/recurser/exif-orientation-examples/master/Landscape_8.jpg',
    name: 'exif_rotated.jpg'
  }
];

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading test assets...');
  for (const asset of assets) {
    const dest = path.join(testAssetsDir, asset.name);
    console.log(`Downloading ${asset.name}...`);
    try {
      await download(asset.url, dest);
      console.log(`Successfully downloaded ${asset.name} (${fs.statSync(dest).size} bytes)`);
    } catch (e) {
      console.error(`Failed to download ${asset.name}:`, e.message);
    }
  }
}

main();
