import * as process from 'node:process';

export default () => ({
  DB_URL: process.env.DB_URL,
  MAIL_USER: process.env.MAIL_USER,
  MAIL_PASS: process.env.MAIL_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
});
