export const COOKIE_PARAM = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  sessionId: "sessionId",
};

export type COOKIE_PARAM = (typeof COOKIE_PARAM)[keyof typeof COOKIE_PARAM];
