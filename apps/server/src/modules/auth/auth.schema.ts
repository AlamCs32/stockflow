import { z } from 'zod';

export const registerSchema = z.object({
  email: z.email().trim().meta({ description: 'User email' }),
  password: z.string().min(8).max(128).meta({ description: 'Password (min 8 characters)' }),
  fullName: z.string().trim().min(1).max(120).meta({ description: 'Full name' }),
  phone: z.string().trim().optional().nullable().meta({ description: 'Phone number' }),
});

export const loginSchema = z.object({
  email: z.email().trim().meta({ description: 'User email' }),
  password: z.string().min(1).meta({ description: 'Password' }),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).meta({ description: 'Refresh token' }),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1).meta({ description: 'Refresh token to revoke' }),
});

export const userResponseSchema = z.object({
  id: z.uuid(),
  isActive: z.boolean(),
});

export const authResponseSchema = z.object({
  user: userResponseSchema,
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const messageResponseSchema = z.object({
  message: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
