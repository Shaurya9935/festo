import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log("My DB URL is:", process.env.DATABASE_URL); 

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
