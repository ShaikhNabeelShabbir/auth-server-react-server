import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createTokenSchema = z.object({
  token_address: z.string(),
  balance: z.number().positive(),
});

export const updateTokenSchema = z.object({
  token_address: z.string(),
  balance: z.number().positive(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
});

export const getTokenSchema = z.object({
  email: z.string().email(),
});
