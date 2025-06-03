import { style } from "./style";
import { SIZES } from "../config";

// Define a type for the `src` object to avoid implicit `any`
type ImageProps = {
  src: string;
};

// Fix the image function with proper type
const image = ({ src }: ImageProps): string => {
  return `<div class='Layer__image' style='background-image: url(${src})'></div>`;
};

// Define types for the layer function
type LayerProps = {
  src: string;
  mask: string;
  size: number;
  rotation: number;
};

// Get all available sizes from config
const allSizes = Object.values(SIZES).reduce<number[]>((acc, sizes) => [...acc, ...sizes], []);

// Fix the layer function with proper type
const layer = ({ src, mask, size, rotation }: LayerProps): string => {
  // Find the closest available size from our config
  const closestSize = allSizes.reduce((prev: number, curr: number) => {
    return Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev;
  });

  const styles = style({
    filter: `hue-rotate(${rotation}deg)`,
    mask: `url(/svgs/${mask}--${closestSize}.svg)`,
  });

  return `<div class='Layer' style='${styles}'>${image({ src })}</div>`;
};

// Export generate object with properly typed methods
export const generate = { layer, image };