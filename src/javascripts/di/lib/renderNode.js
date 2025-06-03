"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderNode = void 0;
var renderNode = function (html) {
    return new DOMParser().parseFromString(html, "text/html").body.firstChild;
};
exports.renderNode = renderNode;
