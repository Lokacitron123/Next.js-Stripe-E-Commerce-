import { z } from "zod";

// Zod is a managing package for env variables
// It works like TypeScript to define our env variables according to the definition of the zod.object -- see below
// If our env variables doesn't have this setup, zod will throw an error, making it easier for us to troubleshoot

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXT_PUBLIC_STRIPE_KEY: z.string().min(1),
  NEXT_STRIPE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_STRIPE_SUCCESS_URL: z.string().min(1),
  NEXT_PUBLIC_STRIPE_CANCEL_URL: z.string().min(1),

  EMAIL_SERVER_USER: z.string().min(1),
  EMAIL_SERVER_PASSWORD: z.string().min(1),
  EMAIL_SERVER_HOST: z.string().min(1),
  EMAIL_SERVER_PORT: z.string().min(1),
  EMAIL_FROM: z.string().min(1),
});

export const env = envSchema.parse(process.env);
