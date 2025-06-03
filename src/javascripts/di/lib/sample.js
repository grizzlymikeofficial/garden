"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sample = void 0;
var rand_1 = require("./rand");
var sample = function (xs) { return xs[(0, rand_1.rand)(0, xs.length)]; };
exports.sample = sample;
