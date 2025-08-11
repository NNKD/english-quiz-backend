import * as process from 'node:process';

export default () => ({
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
});
