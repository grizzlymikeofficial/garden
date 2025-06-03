const fs = require('fs');

const SIZES = {
  small: [16, 32, 64],
  medium: [128, 256, 512],
  large: [1024, 2048, 4096]
};

const allSizes = Object.keys(SIZES).reduce(
  (acc, key) => [...acc, ...SIZES[key]],
  []
);

const GENERATORS = {
  ad: (size) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h${size}v${size}H0zm${size} ${size}h${size}v${size}H${size}z"/>
  </svg>`,

  bc: (size) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 ${size}h${size}v${size}H0zM${size} 0h${size}v${size}H${size}z"/>
  </svg>`,

  a: (size) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 0h${size}v${size}H0z"/>
  </svg>`,

  b: (size) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M${size} 0h${size}v${size}H${size}z"/>
  </svg>`,

  c: (size) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 ${size}h${size}v${size}H0z"/>
  </svg>`,

  d: (size) => `<svg width="${size * 2}" height="${size * 2}" xmlns="http://www.w3.org/2000/svg">
    <path d="M${size} ${size}h${size}v${size}H${size}z"/>
  </svg>`,
};

const NAMES = Object.keys(GENERATORS);

const writeSVGs = () => {
  NAMES.forEach((name) => {
    allSizes.forEach((size) => {
      const xml = GENERATORS[name](size);
      fs.writeFileSync(`./src/svgs/${name}--${size}.svg`, xml);
      console.log(`Saved ${name}/${size}`);
    });
  });
};

writeSVGs(); 