import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  confirmPassword: z.string().min(6),

});

export const logInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createTokenSchema = z.object({
  tokenAddress: z.string(),
  balance: z.number().positive(),
});

export const updateTokenSchema = z.object({
  tokenAddress: z.string(),
  balance: z.number().positive(),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(6),
});

export const getTokenSchema = z.object({
  email: z.string().email(),
});
