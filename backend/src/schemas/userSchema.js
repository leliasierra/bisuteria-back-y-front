import { z } from 'zod';

export const userSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});
