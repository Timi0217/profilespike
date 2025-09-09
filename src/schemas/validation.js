import { z } from 'zod'

// User profile validation schema
export const userProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  last_name: z.string().max(50, 'Last name too long').optional(),
  user_type: z.enum(['recent_grad', 'professional', 'freelancer', 'skilled_veteran', 'ex_offender', 'returning_citizen'], {
    errorMap: () => ({ message: 'Please select a valid user type' })
  }),
  current_role: z.string().max(100, 'Current role too long').optional(),
  industry: z.string().max(100, 'Industry too long').optional(),
  country: z.string().max(100, 'Country too long').optional(),
  linkedin_url: z.string().max(500, 'LinkedIn URL too long').optional(),
  portfolio_url: z.string().max(500, 'Portfolio URL too long').optional(),
  referral_code: z.string().max(10, 'Referral code too long').optional()
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