// Convierte un SVG a PNG usando Node.js y sharp
// Instala primero: npm install sharp


import sharp from 'sharp';
import fs from 'fs';

const inputSVG = 'public/vite.svg';
const output192 = 'public/icon-192.png';
const output512 = 'public/icon-512.png';

sharp(inputSVG)
  .resize(192, 192)
  .png()
  .toFile(output192, (err, info) => {
    if (err) throw err;
    console.log('icon-192.png generado');
  });

sharp(inputSVG)
  .resize(512, 512)
  .png()
  .toFile(output512, (err, info) => {
    if (err) throw err;
    console.log('icon-512.png generado');
  });
