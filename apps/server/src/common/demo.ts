import { AsyncLocalStorage } from "node:async_hooks";

import { Request } from "express";

export const DEMO_HEADER = "x-demo-mode";
export const DEMO_HEADER_VALUE = "true";
export const DEMO_USER_EMAIL = "demo@syncr.cc";

const demoRequestContext = new AsyncLocalStorage<{ isDemo: boolean }>();

export const runInDemoContext = <T>(isDemo: boolean, callback: () => T) =>
  demoRequestContext.run({ isDemo }, callback);

export const runWithDemoContext = (request: Request, next: () => void) => {
  runInDemoContext(isDemoRequest(request), next);
};

export const isDemo = () => demoRequestContext.getStore()?.isDemo ?? false;

export const isDemoRequest = (request: Request) =>
  request.headers[DEMO_HEADER] === DEMO_HEADER_VALUE;
