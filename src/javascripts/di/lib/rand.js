"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rand = void 0;
var rand = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
exports.rand = rand;
