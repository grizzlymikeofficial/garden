import { rand } from "./rand";

export const sample = <T>(xs: T[]) => xs[rand(0, xs.length)];
