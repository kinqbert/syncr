export const NODE_ENV = {
  production: "production",
  development: "development",
};

export type NODE_ENV = (typeof NODE_ENV)[keyof typeof NODE_ENV];
