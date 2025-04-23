import * as dotenv from 'dotenv';
import * as joi from 'joi';

dotenv.config();

interface EnvVars {
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;    
    DB_USER: string;
    DB_PASSWORD: string;    
    DATABASE: string;
    SYNC: boolean;
}

const envsSchema = joi.object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DATABASE: joi.string().required(),
    SYNC: joi.boolean().required(),

   

}).unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error (`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
    PORT: envVars.PORT,
    DB_HOST: envVars.DB_HOST,
    DB_PORT: envVars.DB_PORT,
    DB_USER: envVars.DB_USER,  
    DB_PASSWORD: envVars.DB_PASSWORD,
    DATABASE: envVars.DATABASE,
    SYNC: envVars.SYNC,
}