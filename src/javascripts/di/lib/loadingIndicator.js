"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadingIndicator = void 0;
var renderNode_1 = require("./renderNode");
var el = (0, renderNode_1.renderNode)('<div class="Indicator"></div>');
exports.loadingIndicator = {
    el: el,
    show: function () { return document.body.appendChild(el); },
    hide: function () { return document.body.removeChild(el); },
};
