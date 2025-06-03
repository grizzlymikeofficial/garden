import { configure } from "queryparams";
import imagesLoaded from "imagesloaded";
import screenfull from "screenfull";
import { SIZES } from "./config";
import { sample } from "./lib/sample";
import { generate } from "./lib/generate";
import { renderNode } from "./lib/renderNode";
import { loadingIndicator } from "./lib/loadingIndicator";

console.log("index.js ran correctly");

// Add performance monitoring
const perfMonitor = {
  timers: new Map<string, number>(),
  marks: new Map<string, number>(),

  startTimer(name: string) {
    this.timers.set(name, window.performance.now());
  },

  endTimer(name: string) {
    const start = this.timers.get(name);
    if (start) {
      const duration = window.performance.now() - start;
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      this.timers.delete(name);
    }
  },

  mark(name: string) {
    this.marks.set(name, window.performance.now());
  },

  measure(name: string) {
    const start = this.marks.get(name);
    if (start) {
      const duration = window.performance.now() - start;
      console.log(`📊 ${name}: ${duration.toFixed(2)}ms`);
      this.marks.delete(name);
    }
  }
};

// Function to get random images from local folder
const getRandomImages = (): Promise<string[]> => {
  return new Promise((resolve) => {
    // Get 4 random numbers between 1 and 25
    const randomNumbers = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 30) + 1
    );

    // Convert numbers to image paths with relative path
    const imagePaths = randomNumbers.map(num =>
      `images_olivia/${num}.jpeg`
    );

    resolve(imagePaths);
  });
};

// Set period to exactly 2 seconds (2000 milliseconds)
const parameters = configure({ period: 5000 });

// @ts-ignore
window.parameters = parameters;

const {
  params: { period: PERIOD },
} = parameters;

const DOM = {
  app: document.getElementById("app"),
};

type Strategy = (size: number, srcs: string[]) => string[];

const STRATEGIES: Strategy[] = [
  (size, srcs) =>
    ["a", "b", "c", "d"].map((mask, i) =>
      generate.layer({
        src: srcs[i],
        mask,
        size,
        rotation: i * 90,
      })
    ),

  (size, srcs) =>
    ["a", "b", "c", "d"].map((mask, i) =>
      generate.layer({
        src: srcs[i],
        mask,
        size,
        rotation: sample([0, 90, 180, 270]),
      })
    ),

  (size, srcs) =>
    ["ad", "bc"].map((mask, i) =>
      generate.layer({
        src: srcs[i],
        mask,
        size,
        rotation: sample([0, 90, 180, 270]),
      })
    ),

  (size, srcs) =>
    ["a", "b", "c", "d"].map((mask, i) =>
      generate.layer({
        src: srcs[0],
        mask,
        size,
        rotation: i * 90,
      })
    ),
];

const size = (): number => {
  return sample([
    ...SIZES.extraSmall,
    ...SIZES.small,
    ...SIZES.small,
    ...SIZES.small,
    ...SIZES.small,
    ...SIZES.medium,
  ]);
};

let currentTimeout: number | null = null;
let isRendering = false;

// Add a class to track active elements
class ActiveElements {
  private elements: Set<HTMLElement> = new Set();
  private loaders: Set<any> = new Set();

  addElement(element: HTMLElement) {
    this.elements.add(element);
  }

  addLoader(loader: any) {
    this.loaders.add(loader);
  }

  cleanup() {
    // Clean up all tracked elements
    this.elements.forEach(element => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    this.elements.clear();

    // Clean up all loaders
    this.loaders.forEach(loader => {
      if (loader && typeof loader.destroy === 'function') {
        loader.destroy();
      }
    });
    this.loaders.clear();
  }
}

const activeElements = new ActiveElements();

const load = (src: string): Promise<void> =>
  new Promise<void>((resolve) => {
    perfMonitor.startTimer(`load-${src}`);

    const img = renderNode(generate.image({ src })) as HTMLElement;

    if (!img) {
      console.error("Failed to create image node.");
      return;
    }

    if (!DOM.app) {
      console.error("Element with id 'app' not found.");
      return;
    }

    DOM.app.appendChild(img);
    activeElements.addElement(img);

    const loader = imagesLoaded(img, { background: true });
    activeElements.addLoader(loader);

    loader.on("done", () => {
      if (DOM.app?.contains(img)) {
        DOM.app.removeChild(img);
      }
      perfMonitor.endTimer(`load-${src}`);
      resolve();
    });
  });

const render = (): void => {
  if (isRendering) {
    console.log("⚠️ Skipping render - already rendering");
    return;
  }

  perfMonitor.startTimer('render');
  isRendering = true;
  loadingIndicator.show();

  // Clear any existing timeout
  if (currentTimeout) {
    window.clearTimeout(currentTimeout);
    currentTimeout = null;
  }

  // Clean up previous elements before starting new render
  perfMonitor.startTimer('cleanup');
  activeElements.cleanup();
  perfMonitor.endTimer('cleanup');

  perfMonitor.startTimer('getRandomImages');
  getRandomImages()
    .then((srcs: string[]) => {
      perfMonitor.endTimer('getRandomImages');

      if (!srcs || srcs.length === 0) {
        console.error("No images received.");
        return;
      }

      perfMonitor.startTimer('strategy');
      const strategy = sample(STRATEGIES);
      const layers = strategy(size(), srcs);
      perfMonitor.endTimer('strategy');

      perfMonitor.startTimer('loadImages');
      Promise.all(srcs.map(load))
        .then(() => {
          perfMonitor.endTimer('loadImages');

          if (DOM.app) {
            perfMonitor.startTimer('updateDOM');
            // Clear existing content
            DOM.app.innerHTML = "";
            // Add new layers
            DOM.app.innerHTML = layers.join("");
            perfMonitor.endTimer('updateDOM');
          }

          loadingIndicator.hide();
          isRendering = false;
          perfMonitor.endTimer('render');

          // Schedule next render
          currentTimeout = window.setTimeout(render, PERIOD);
        })
        .catch((error) => {
          console.error("Error loading images:", error);
          loadingIndicator.hide();
          isRendering = false;
          perfMonitor.endTimer('render');
          // Schedule next render even if there was an error
          currentTimeout = window.setTimeout(render, PERIOD);
        });
    })
    .catch((error) => {
      console.error("Error in getRandomImages:", error);
      loadingIndicator.hide();
      isRendering = false;
      perfMonitor.endTimer('render');
      // Schedule next render even if there was an error
      currentTimeout = window.setTimeout(render, PERIOD);
    });
};

// Add memory monitoring
const monitorMemory = () => {
  // @ts-ignore - performance.memory is Chrome-specific
  const memory = window.performance.memory;
  if (memory) {
    const used = Math.round(memory.usedJSHeapSize / 1024 / 1024);
    const total = Math.round(memory.totalJSHeapSize / 1024 / 1024);
    console.log(`💾 Memory: ${used}MB / ${total}MB`);
  }
};

// Monitor memory every 5 seconds
setInterval(monitorMemory, 5000);

// Cleanup function
const cleanup = () => {
  if (currentTimeout) {
    window.clearTimeout(currentTimeout);
    currentTimeout = null;
  }
  if (DOM.app) {
    DOM.app.innerHTML = "";
  }
  activeElements.cleanup();
  isRendering = false;
};

// Start rendering
render();

// Add click handler for manual refresh
document.addEventListener('click', (event) => {
  // Prevent triggering on fullscreen request
  if (screenfull && typeof screenfull.isEnabled === 'function' && screenfull.isEnabled) {
    return;
  }

  // Clear the current timeout
  if (currentTimeout) {
    window.clearTimeout(currentTimeout);
    currentTimeout = null;
  }

  // Trigger a new render
  render();
});

// Add cleanup on page unload
window.addEventListener('beforeunload', cleanup);

if (screenfull && typeof screenfull.isEnabled === 'function') {
  document.addEventListener("click", () => {
    screenfull.request();
  });
}