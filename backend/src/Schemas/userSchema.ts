import { z } from 'zod';

// Zod schema for validation
export const userValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phoneNumber: z.string().regex(/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number'),
  gender: z.enum(['male', 'female', 'other'], {
    message: 'Gender must be male, female, or other',
  }),
  role: z.enum(['admin', 'trainer', 'member']).optional().default('member'),
});
