import { configure } from "queryparams";
import imagesLoaded from "imagesloaded";

const ENDPOINT =
  "https://atlas.auspic.es/graph/ec630788-ceba-4f2a-b06a-b7a6827242ce";

const QUERY = `
  {
    collection: object {
      ... on Collection {
        sample(amount: 4) {
          image: entity {
            ... on Image {
              src: url
            }
          }
        }
      }
    }
  }
`;

const request = () =>
  fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query: QUERY }),
  }).then((res) => res.json());

import { SIZES } from "./config";
import { sample } from "./lib/sample";
import { generate } from "./lib/generate";
import { renderNode } from "./lib/renderNode";
import { loadingIndicator } from "./lib/loadingIndicator";

const parameters = configure({ period: 7500 });

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

const size = () => {
  return sample([
    ...SIZES.extraSmall,
    ...SIZES.small,
    ...SIZES.small,
    ...SIZES.small,
    ...SIZES.small,
    ...SIZES.medium,
  ]);
};

const load = (src: string) =>
  new Promise((resolve) => {
    const img = renderNode(generate.image({ src }));

    DOM.app.appendChild(img);

    // @ts-ignore
    const loader = imagesLoaded(img, { background: true });

    loader.on("done", () => {
      DOM.app.removeChild(img);
      resolve();
    });
  });

const render = () => {
  loadingIndicator.show();

  request()
    .then(({ data: { collection: { sample } } }) =>
      sample.map(({ image: { src } }) => src)
    )
    .then((srcs) => {
      const strategy = sample(STRATEGIES);
      const layers = strategy(size(), srcs);

      Promise.all(srcs.map(load)).then(() => {
        DOM.app.innerHTML = layers.join("");
        loadingIndicator.hide();
        setTimeout(render, PERIOD);
      });
    });
};

render();
