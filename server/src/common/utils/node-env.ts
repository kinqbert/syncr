import { CONFIG } from "src/config/configuration";

import { NODE_ENV } from "../constants/node-env";

export const isDevelopment = () => CONFIG.NODE_ENV === NODE_ENV.development;
export const isProduction = () => CONFIG.NODE_ENV === NODE_ENV.production;
