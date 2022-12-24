import Joi from 'joi';

export const DotenvValidation = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  JWT_SECRET_KEY: Joi.string().required(),
  NODE_ENV: Joi.string().valid('dev', 'prod').default('dev').required(),
});
