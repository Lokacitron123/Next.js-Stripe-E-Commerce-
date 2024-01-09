import zod from "zod";

// Zod is a managing package for env variables
// It works like TypeScript to define our env variables according to the definition of the zod.object -- see below
// If our env variables doesn't have this setup, zod will throw an error, making it easier for us to troubleshoot

const envSchema = zod.object({
  DATABASE_URL: zod.string().min(1),
  NEXTAUTH_SECRET: zod.string().min(1),
  GOOGLE_CLIENT_ID: zod.string().min(1),
  GOOGLE_CLIENT_SECRET: zod.string().min(1),
  NEXTAUTH_URL: zod.string().min(1),
});

export const env = envSchema.parse(process.env);
