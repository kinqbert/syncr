import jwt from "jsonwebtoken";

import { CONFIG } from "../../config/configuration";
import { TokenPayload } from "../types/token";

export const generateAccessToken = (data: any) => {
  return jwt.sign(data, CONFIG.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
};

export const generateRefreshToken = (data: any) => {
  return jwt.sign(data, CONFIG.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, CONFIG.ACCESS_TOKEN_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, CONFIG.REFRESH_TOKEN_SECRET) as TokenPayload;
};
