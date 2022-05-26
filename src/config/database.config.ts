import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  port: parseInt(process.env.DATABASE_PORT, 10) || 27180,
  host: process.env.DATABASE_HOST,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  uri: process.env.DATABASE_URI,
}));
