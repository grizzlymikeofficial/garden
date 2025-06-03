"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
var style_1 = require("./style");
var image = function (_a) {
    var src = _a.src;
    return "<div class='Layer__image' style='background-image: url(".concat(src, ")'></div>");
};
var layer = function (_a) {
    var src = _a.src, mask = _a.mask, size = _a.size, rotation = _a.rotation;
    var styles = (0, style_1.style)({
        filter: "hue-rotate(".concat(rotation, "deg)"),
        mask: "url(svgs/".concat(mask, "--").concat(size, ".svg)"),
    });
    return "<div class='Layer' style='".concat(styles, "'>").concat(image({ src: src }), "</div>");
};
exports.generate = { layer: layer, image: image };
