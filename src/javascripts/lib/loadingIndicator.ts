import { renderNode } from "./renderNode";

// Ensure renderNode returns a valid node or handle null case
const el = renderNode('<div class="Indicator"></div>') as HTMLElement;

export const loadingIndicator = {
  el,
  show: () => {
    if (el) {
      document.body.appendChild(el);
    }
  },
  hide: () => {
    if (el) {
      document.body.removeChild(el);
    }
  },
};