import { renderNode } from "./renderNode";

const el = renderNode('<div class="Indicator"></div>');

export const loadingIndicator = {
  el,
  show: () => document.body.appendChild(el),
  hide: () => document.body.removeChild(el),
};
