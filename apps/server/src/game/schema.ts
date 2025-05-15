import { z } from 'zod';

export const xSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export type X = z.infer<typeof xSchema>;

export const generateMinesInputSchema = z.object({
  sessionId: z.string(),
  rows: z.number().min(1),
  cols: z.number().min(1),
  mines: z.number().min(1),
  backspin: z.boolean().optional(),
});

export const generateMinesOutputSchema = z.object({
  sessionId: z.string(),
  grid: z.array(
    z.array(
      z.union([z.literal('bomb'), z.literal('success'), z.literal('hidden')]),
    ),
  ),
  status: z.string(),
});

export const resumeSessionInputSchema = z.object({
  sessionId: z.string(),
});

export const resumeSessionOutputSchema = z.object({
  sessionId: z.string(),
  grid: z.array(
    z.array(
      z.union([z.literal('bomb'), z.literal('success'), z.literal('hidden')]),
    ),
  ),
  status: z.string(),
});
