# ProfileSpike - AI Career Coach

An AI-powered career development platform built with React and Vite.

## Features

- AI Resume Analysis & Optimization
- LinkedIn Profile Review
- Interview Preparation Tools
- Career Path Mapping
- Compensation Analysis
- Professional Portfolio Review
- Veteran Skills Translation

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Radix UI, Lucide Icons
- **Forms**: React Hook Form, Zod validation
- **Animation**: Framer Motion
- **Charts**: Recharts

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Setup

Copy `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
```

## API Integration Status

⚠️ **Note**: This app currently uses placeholder APIs. To make it fully functional, you need to configure:

- Database (Supabase, Firebase, PostgreSQL)
- Authentication (Auth0, Supabase Auth, Firebase Auth)
- AI/LLM Service (OpenAI, Anthropic Claude)
- Email Service (Resend, SendGrid, Mailgun)
- File Storage (AWS S3, Cloudinary, Supabase Storage)
- Payment Processing (Stripe - partially configured)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request