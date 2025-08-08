import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

interface EnvVars {
  PORT: number;
  MS_USER_HOST: string;
  MS_USER_PORT: number;
  MS_PRODUCT_HOST: string;
  MS_PRODUCT_PORT: number;
  MS_INVOICE_HOST: string;
  MS_INVOICE_PORT: number;
  SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    MS_USER_HOST: joi.string().required(),
    MS_USER_PORT: joi.number().required(),
    MS_PRODUCT_HOST: joi.string().required(),
    MS_PRODUCT_PORT: joi.number().required(),
    MS_INVOICE_HOST: joi.string().required(),
    MS_INVOICE_PORT: joi.number().required(),
    SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  MS_USER_HOST: envVars.MS_USER_HOST,
  MS_USER_PORT: envVars.MS_USER_PORT,
  MS_PRODUCT_HOST: envVars.MS_PRODUCT_HOST,
  MS_PRODUCT_PORT: envVars.MS_PRODUCT_PORT,
  MS_INVOICE_HOST: envVars.MS_INVOICE_HOST,
  MS_INVOICE_PORT: envVars.MS_INVOICE_PORT,
  SECRET: envVars.SECRET,
};
