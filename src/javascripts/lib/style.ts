import { getPrefix } from "./getPrefix";

const { css: PREFIX } = getPrefix();

export const style = (styles = {}) =>
  Object.keys(styles)
    .map((key) => `${PREFIX}${key}:${styles[key]};${key}:${styles[key]}`)
    .join(";");
