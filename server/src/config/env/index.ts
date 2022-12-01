import dev from './dev';
import ci from './ci';
import stage from './stage';
import prod from './prod';

const envFile = process.env.NODE_ENV || 'dev';
const envs = { dev, ci, stage, prod };

export const env = envs[envFile];