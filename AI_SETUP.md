# ProfileSpike AI Integration Setup

This guide explains how to set up ProfileSpike with real AI functionality instead of mock data.

## Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI](https://platform.openai.com/api-keys)
2. **Node.js**: Version 18 or higher
3. **npm**: Latest version

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in your project root based on `.env.example`:

```bash
cp .env.example .env
```

Add your OpenAI API key to the `.env` file:

```bash
OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_API_BASE_URL=http://localhost:3002
```

### 2. Install Dependencies

Install frontend dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd server
npm install
```

### 3. Start the Application

**Terminal 1 - Start the AI Backend Server:**
```bash
cd server
npm run dev
```

The AI server will start on `http://localhost:3002`

**Terminal 2 - Start the Frontend:**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Verify AI Integration

1. Go to `http://localhost:5173`
2. Test any of the AI features:
   - **Resume Analyzer**: Upload/paste a resume to get real AI analysis
   - **LinkedIn Optimizer**: Paste LinkedIn profile text for AI optimization
   - **Interview Prep**: Generate AI-powered interview questions and tips
   - **Career Mapping**: Get AI-generated career transition plans
   - **Salary Analysis**: Get AI-analyzed market compensation data
   - **Portfolio Review**: Get AI feedback on your portfolio
   - **Veteran Skills Translation**: AI-powered military-to-civilian skill translation

### 5. AI Features Overview

| Feature | Real AI Functionality |
|---------|---------------------|
| 📄 **Resume Analyzer** | ✅ OpenAI GPT-4 powered ATS optimization and scoring |
| 🔗 **LinkedIn Optimizer** | ✅ AI profile analysis and improvement recommendations |
| 🎯 **Interview Prep** | ✅ Role-specific questions and coaching with AI feedback |
| 🗺️ **Career Mapping** | ✅ Personalized career transition roadmaps via AI |
| 💰 **Salary Analysis** | ✅ AI-enhanced market analysis and negotiation tips |
| 🎨 **Portfolio Review** | ✅ AI-powered portfolio critique and recommendations |
| 🎖️ **Veteran Skills Translation** | ✅ Military-to-civilian skill mapping with AI |

### 6. API Endpoints

The AI server provides the following endpoints:

- `POST /api/analyze-resume` - Resume analysis with ATS scoring
- `POST /api/analyze-linkedin` - LinkedIn profile optimization
- `POST /api/interview-prep` - Interview question generation
- `POST /api/career-mapping` - Career transition planning
- `POST /api/salary-analysis` - Compensation analysis
- `POST /api/portfolio-review` - Portfolio feedback
- `POST /api/veteran-translation` - Military skills translation
- `GET /health` - Health check

### 7. Troubleshooting

**AI Server not responding:**
- Check if the server is running on port 3002
- Verify your OpenAI API key is valid
- Check the server logs for errors

**Frontend can't connect to AI:**
- Ensure `REACT_APP_API_BASE_URL=http://localhost:3002` in your `.env`
- Check that both frontend and backend are running
- Verify CORS configuration in the server

**OpenAI API errors:**
- Check your API key is valid and has credits
- Monitor your OpenAI usage limits
- Check the server logs for detailed error messages

### 8. Cost Considerations

Each AI analysis uses OpenAI tokens:
- **Resume Analysis**: ~1,000-2,000 tokens (~$0.01-0.03)
- **LinkedIn Analysis**: ~800-1,500 tokens (~$0.01-0.02)
- **Interview Prep**: ~500-1,000 tokens (~$0.005-0.015)
- **Career Mapping**: ~1,200-2,000 tokens (~$0.02-0.03)
- **Salary Analysis**: ~800-1,200 tokens (~$0.01-0.02)
- **Portfolio Review**: ~600-1,000 tokens (~$0.01-0.015)
- **Veteran Translation**: ~1,000-1,800 tokens (~$0.015-0.03)

### 9. Production Deployment

For production deployment:

1. Set environment variables on your hosting platform
2. Update API URLs to production endpoints
3. Consider implementing rate limiting
4. Add API key rotation
5. Set up monitoring and error tracking
6. Consider caching responses to reduce costs

## Development Notes

- The system falls back to mock data if AI calls fail
- All AI prompts are optimized for consistent JSON responses
- Error handling includes graceful degradation
- Each component has built-in retry mechanisms

## Support

If you encounter issues:
1. Check the console logs in both frontend and backend
2. Verify your OpenAI API key and billing status
3. Ensure all dependencies are installed correctly
4. Test the `/health` endpoint to verify server status

---

**Note**: This implementation uses OpenAI GPT-4 for all AI features. You can modify the backend to use different AI providers (Anthropic Claude, Google Gemini, etc.) by updating the API calls in `server/server.js`.