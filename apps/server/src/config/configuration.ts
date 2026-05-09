import "dotenv/config";

import Joi from "joi";

import { NODE_ENV } from "../common/constants/node-env";

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid(...Object.values(NODE_ENV))
    .default("development"),
  CLIENT_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  GOOGLE_CALENDAR_CLIENT_ID: Joi.string().allow("").optional(),
  GOOGLE_CALENDAR_CLIENT_SECRET: Joi.string().allow("").optional(),
  GOOGLE_CALENDAR_REDIRECT_URI: Joi.string().allow("").optional(),
  CALENDAR_TOKEN_SECRET: Joi.string().allow("").optional(),
})
  .unknown()
  .required();

interface EnvVars {
  PORT: number;
  NODE_ENV: NODE_ENV;
  CLIENT_URL: string;
  DATABASE_URL: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  GOOGLE_CALENDAR_CLIENT_ID?: string;
  GOOGLE_CALENDAR_CLIENT_SECRET?: string;
  GOOGLE_CALENDAR_REDIRECT_URI?: string;
  CALENDAR_TOKEN_SECRET?: string;
}

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

const envVars = value as EnvVars;

export const CONFIG = {
  PORT: envVars.PORT || 3000,
  NODE_ENV: envVars.NODE_ENV,
  CLIENT_URL: envVars.CLIENT_URL,
  DATABASE_URL: envVars.DATABASE_URL,
  ACCESS_TOKEN_SECRET: envVars.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: envVars.REFRESH_TOKEN_SECRET,
  GOOGLE_CALENDAR_CLIENT_ID: envVars.GOOGLE_CALENDAR_CLIENT_ID,
  GOOGLE_CALENDAR_CLIENT_SECRET: envVars.GOOGLE_CALENDAR_CLIENT_SECRET,
  GOOGLE_CALENDAR_REDIRECT_URI: envVars.GOOGLE_CALENDAR_REDIRECT_URI,
  CALENDAR_TOKEN_SECRET: envVars.CALENDAR_TOKEN_SECRET || envVars.REFRESH_TOKEN_SECRET,
};
