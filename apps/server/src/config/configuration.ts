import "dotenv/config";

import Joi from "joi";

import { NODE_ENV } from "../common/constants/node-env";

const envSchema = Joi.object({
  PORT: Joi.number().default(5050),
  NODE_ENV: Joi.string()
    .valid(...Object.values(NODE_ENV))
    .default("development"),
  CLIENT_URL: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
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
}

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Environment validation error: ${error.message}`);
}

const envVars = value as EnvVars;

export const CONFIG = {
  PORT: envVars.PORT || 5050,
  NODE_ENV: envVars.NODE_ENV,
  CLIENT_URL: envVars.CLIENT_URL,
  DATABASE_URL: envVars.DATABASE_URL,
  ACCESS_TOKEN_SECRET: envVars.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: envVars.REFRESH_TOKEN_SECRET,
};
