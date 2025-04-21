import { z } from 'zod';

export const xSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type X = z.infer<typeof xSchema>;
