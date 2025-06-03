"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.style = void 0;
var getPrefix_1 = require("./getPrefix");
var PREFIX = (0, getPrefix_1.getPrefix)().css;
var style = function (styles) {
    if (styles === void 0) { styles = {}; }
    return Object.keys(styles)
        .map(function (key) { return "".concat(PREFIX).concat(key, ":").concat(styles[key], ";").concat(key, ":").concat(styles[key]); })
        .join(";");
};
exports.style = style;
