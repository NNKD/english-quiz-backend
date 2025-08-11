import * as process from 'node:process';

export default () => ({
  DB_URL: process.env.DB_URL,
});
