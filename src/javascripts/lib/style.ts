import { getPrefix } from "./getPrefix";

// Get the CSS prefix (e.g., "-webkit-", "-moz-", etc.)
const { css: PREFIX } = getPrefix();

// Define the type of `styles` parameter as an object where keys are strings
// and values can be either string or number (common in CSS properties)
export const style = (styles: Record<string, string | number> = {}) =>
  Object.keys(styles)
    .map((key) => `${PREFIX}${key}:${styles[key]};${key}:${styles[key]}`)
    .join(";");