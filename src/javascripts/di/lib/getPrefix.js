"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrefix = void 0;
var getPrefix = function () {
    var styles = window.getComputedStyle(document.documentElement, "");
    var pre = (Array.prototype.slice
        .call(styles)
        .join("")
        .match(/-(moz|webkit|ms)-/) ||
        // @ts-ignore
        (styles.OLink === "" && ["", "o"]))[1];
    var dom = "WebKit|Moz|MS|O".match(new RegExp("(".concat(pre, ")"), "i"))[1];
    return {
        dom: dom,
        lowercase: pre,
        css: "-".concat(pre, "-"),
        js: pre[0].toUpperCase() + pre.substr(1),
    };
};
exports.getPrefix = getPrefix;
