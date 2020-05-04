import { rand } from "./rand";

export const sample = <T>(xs: readonly T[]) => xs[rand(0, xs.length)];
