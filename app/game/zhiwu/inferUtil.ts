import { useState } from "react";

export type FunctionRetrunPromiseType<T> = T extends (
  ...args: any[]
) => Promise<infer R>
  ? R
  : T;

type statusRetype<T> = T extends (...args: any[]) => [a: any, b: infer R]
  ? R
  : any;
export type setStatusType = statusRetype<typeof useState<object | null>>;
