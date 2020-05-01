import { style } from "./style";

const image = ({ src }) =>
  `<div class='Layer__image' style='background-image: url(${src})'></div>`;

const layer = ({
  src,
  mask,
  size,
  rotation,
}: {
  src: string;
  mask: string;
  size: number;
  rotation: number;
}) => {
  const styles = style({
    filter: `hue-rotate(${rotation}deg)`,
    mask: `url(svgs/${mask}--${size}.svg)`,
  });

  return `<div class='Layer' style='${styles}'>${image({ src })}</div>`;
};

export const generate = { layer, image };
