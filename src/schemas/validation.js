import { z } from 'zod'

// User profile validation schema
export const userProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  last_name: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  email: z.string().email('Invalid email address'),
  user_type: z.enum(['recent_grad', 'professional', 'freelancer', 'veteran'], {
    errorMap: () => ({ message: 'Please select a valid user type' })
  }),
  location: z.string().min(1, 'Location is required').max(100, 'Location too long'),
  years_experience: z.number().min(0, 'Experience cannot be negative').max(50, 'Experience seems too high'),
  current_role: z.string().max(100, 'Current role too long').optional(),
  skills: z.array(z.string().max(50, 'Skill name too long')).max(20, 'Too many skills').optional(),
  goals: z.string().max(500, 'Goals description too long').optional()
})

// File upload validation
export const fileUploadSchema = z.object({
  file: z.any().refine(
    (file) => file instanceof File,
    'Please select a valid file'
  ).refine(
    (file) => file.size <= 10 * 1024 * 1024, // 10MB
    'File size must be less than 10MB'
  ).refine(
    (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type),
    'Only PDF, DOC, DOCX, and TXT files are allowed'
  )
})

// Stripe checkout validation
export const checkoutSchema = z.object({
  priceId: z.string().regex(/^price_[a-zA-Z0-9_]+$/, 'Invalid Stripe price ID'),
  userId: z.string().min(1, 'User ID is required'),
  userEmail: z.string().email('Invalid email address'),
  planName: z.string().min(1, 'Plan name is required').max(100, 'Plan name too long')
})