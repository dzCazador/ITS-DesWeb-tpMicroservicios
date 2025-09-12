import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

interface EnvVars {
  PORT: number;
  HOST: string;
  GATEWAY_HOST: string;
  GATEWAY_PORT: number;
  DATABASE_URL: string;
  SECRET_KEY: string;
  MS_PRODUCT_HOST:string;
  MS_PRODUCT_PORT:number
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    HOST: joi.string().required(),
    GATEWAY_HOST: joi.string().required(),
    GATEWAY_PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    SECRET_KEY: joi.string().required(),
    MS_PRODUCT_HOST: joi.string().required(),
    MS_PRODUCT_PORT: joi.number().required(),    

  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,
  HOST: envVars.HOST,
  GATEWAY_HOST: envVars.GATEWAY_HOST,
  GATEWAY_PORT: envVars.GATEWAY_PORT,
  DATABASE_URL: envVars.DATABASE_URL,
  secredKey:envVars.SECRET_KEY,
  MS_PRODUCT_HOST: envVars.MS_PRODUCT_HOST,
  MS_PRODUCT_PORT:envVars.MS_PRODUCT_PORT,
  
};
