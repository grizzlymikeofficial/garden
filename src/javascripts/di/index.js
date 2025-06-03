"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var queryparams_1 = require("queryparams");
var imagesloaded_1 = require("imagesloaded");
var screenfull_1 = require("screenfull");
console.log("index.js ran correctly");
var ENDPOINT = "https://atlas.auspic.es/graph/ec630788-ceba-4f2a-b06a-b7a6827242ce";
var QUERY = "\n  {\n    collection: object {\n      ... on Collection {\n        sample(amount: 4) {\n          image: entity {\n            ... on Image {\n              src: url\n            }\n          }\n        }\n      }\n    }\n  }\n";
var request = function () {
    return fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query: QUERY }),
    }).then(function (res) { return res.json(); });
};
var config_1 = require("./config");
var sample_1 = require("./lib/sample");
var generate_1 = require("./lib/generate");
var renderNode_1 = require("./lib/renderNode");
var loadingIndicator_1 = require("./lib/loadingIndicator");
var parameters = (0, queryparams_1.configure)({ period: 7500 });
// @ts-ignore
window.parameters = parameters;
var PERIOD = parameters.params.period;
var DOM = {
    app: document.getElementById("app"),
};
var STRATEGIES = [
    function (size, srcs) {
        return ["a", "b", "c", "d"].map(function (mask, i) {
            return generate_1.generate.layer({
                src: srcs[i],
                mask: mask,
                size: size,
                rotation: i * 90,
            });
        });
    },
    function (size, srcs) {
        return ["a", "b", "c", "d"].map(function (mask, i) {
            return generate_1.generate.layer({
                src: srcs[i],
                mask: mask,
                size: size,
                rotation: (0, sample_1.sample)([0, 90, 180, 270]),
            });
        });
    },
    function (size, srcs) {
        return ["ad", "bc"].map(function (mask, i) {
            return generate_1.generate.layer({
                src: srcs[i],
                mask: mask,
                size: size,
                rotation: (0, sample_1.sample)([0, 90, 180, 270]),
            });
        });
    },
    function (size, srcs) {
        return ["a", "b", "c", "d"].map(function (mask, i) {
            return generate_1.generate.layer({
                src: srcs[0],
                mask: mask,
                size: size,
                rotation: i * 90,
            });
        });
    },
];
var size = function () {
    return (0, sample_1.sample)(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], config_1.SIZES.extraSmall, true), config_1.SIZES.small, true), config_1.SIZES.small, true), config_1.SIZES.small, true), config_1.SIZES.small, true), config_1.SIZES.medium, true));
};
var load = function (src) {
    return new Promise(function (resolve) {
        var img = (0, renderNode_1.renderNode)(generate_1.generate.image({ src: src }));
        if (!DOM.app) {
            console.error("Element with id 'app' not found.");
            return;
        }
        DOM.app.appendChild(img);
        // @ts-ignore
        var loader = (0, imagesloaded_1.default)(img, { background: true });
        loader.on("done", function () {
            DOM.app.removeChild(img);
            resolve();
        });
    });
};
var render = function () {
    loadingIndicator_1.loadingIndicator.show();
    request()
        .then(function (_a) {
            var sample = _a.data.collection.sample;
            return sample.map(function (_a) {
                var src = _a.image.src;
                return src;
            });
        })
        .then(function (srcs) {
            var strategy = (0, sample_1.sample)(STRATEGIES);
            var layers = strategy(size(), srcs);
            Promise.all(srcs.map(load)).then(function () {
                DOM.app.innerHTML = layers.join("");
                loadingIndicator_1.loadingIndicator.hide();
                setTimeout(render, PERIOD);
            });
        });
};
render();
if (screenfull_1.default.isEnabled) {
    document.addEventListener("click", function () {
        screenfull_1.default.request();
    });
}
