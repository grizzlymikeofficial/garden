import * as fs from "fs";
import { SIZES } from "../src/javascripts/config";

// Get all sizes from config
const allSizes = Object.values(SIZES).reduce<number[]>((acc, sizes) => [...acc, ...sizes], []);

const GENERATORS = {
  ad: (size: number) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h${size}v${size}H0zm${size} ${size}h${size}v${size}H${size}z"/>
  </svg>`,

  bc: (size: number) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 ${size}h${size}v${size}H0zM${size} 0h${size}v${size}H${size}z"/>
  </svg>`,

  a: (size: number) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h${size}v${size}H0z"/>
  </svg>`,

  b: (size: number) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M${size} 0h${size}v${size}H${size}z"/>
  </svg>`,

  c: (size: number) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 ${size}h${size}v${size}H0z"/>
  </svg>`,

  d: (size: number) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M${size} ${size}h${size}v${size}H${size}z"/>
  </svg>`,
};

const NAMES = Object.keys(GENERATORS);

const writeSVGs = () => {
  NAMES.forEach((name) => {
    allSizes.forEach((size) => {
      const xml = GENERATORS[name as keyof typeof GENERATORS](size);
      fs.writeFileSync(`./src/svgs/${name}--${size}.svg`, xml);
      console.log(`Saved ${name}/${size}`);
    });
  });
};

writeSVGs();
