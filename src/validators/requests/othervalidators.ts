import { z } from 'zod';

export const uuidSchema = z.string().uuid('Invalid UUID format');

export const paginationSchema = z.object({
  page: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0, 'Page must be greater than 0')
    .optional()
    .default('1'),
  limit: z.string()
    .transform(val => parseInt(val, 10))
    .refine(val => val > 0 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default('10'),
});

export const emailSchema = z.string()
  .email('Invalid email format')
  .max(255, 'Email must be at most 255 characters');