const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Resume Analysis Endpoint
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    
    const prompt = `Analyze this resume for a ${targetRole || 'professional'} role. Provide a comprehensive analysis with:
    1. Overall score (0-100)
    2. ATS compatibility score
    3. Content quality score  
    4. Format score
    5. Keyword optimization score
    6. Top 5 strengths
    7. Top 5 improvement areas
    8. Missing keywords for the role
    9. Section-by-section feedback

    Resume content:
    ${resumeText}

    Return as JSON with the structure: {
      "overall_score": number,
      "ats_score": number,
      "content_score": number,
      "format_score": number,
      "keyword_score": number,
      "strengths": array,
      "improvements": array,
      "keywords_found": array,
      "keywords_missing": array,
      "sections_analysis": object
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert HR professional and ATS system analyzer. Provide detailed, actionable feedback on resumes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.json(analysis);
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// LinkedIn Profile Analysis
app.post('/api/analyze-linkedin', async (req, res) => {
  try {
    const { profileText } = req.body;
    
    const prompt = `Analyze this LinkedIn profile and provide optimization recommendations:

    Profile content:
    ${profileText}

    Return as JSON: {
      "success": true,
      "score": number (0-100),
      "analysis": "detailed analysis string",
      "extractedData": {
        "name": string,
        "headline": string,
        "location": string,
        "experience": array
      },
      "recommendations": array of specific improvements,
      "tokensUsed": number
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a LinkedIn optimization expert. Analyze profiles for recruiter visibility and professional branding."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.json(analysis);
  } catch (error) {
    console.error('LinkedIn analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze LinkedIn profile' });
  }
});

// Interview Preparation
app.post('/api/interview-prep', async (req, res) => {
  try {
    const { role, difficulty, company } = req.body;
    
    const prompt = `Generate interview preparation for a ${role} position at ${company || 'a company'} with ${difficulty} difficulty level.

    Provide:
    1. 5 role-specific interview questions
    2. Suggested answers with STAR method examples
    3. Company-specific insights (if company provided)
    4. Performance tips
    5. Common mistakes to avoid

    Return as JSON: {
      "questions": array of questions,
      "answers": array of suggested answers,
      "tips": array of preparation tips,
      "companyInsights": string or null,
      "score": estimated preparation score
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert interview coach with experience in various industries and roles."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4
    });

    const prep = JSON.parse(completion.choices[0].message.content);
    res.json(prep);
  } catch (error) {
    console.error('Interview prep error:', error);
    res.status(500).json({ error: 'Failed to generate interview preparation' });
  }
});

// Career Path Mapping
app.post('/api/career-mapping', async (req, res) => {
  try {
    const { currentRole, targetRole, experience, skills } = req.body;
    
    const prompt = `Create a detailed career transition plan from ${currentRole} to ${targetRole} for someone with ${experience} years of experience.

    Current skills: ${skills.join(', ') || 'Not specified'}

    Provide:
    1. Realistic timeline
    2. Step-by-step roadmap with phases
    3. Skills gap analysis
    4. Required certifications/training
    5. Networking strategies
    6. Potential intermediate roles

    Return as JSON: {
      "timeline": string,
      "steps": array of phase objects with tasks,
      "skills": {
        "current": array,
        "needed": array,
        "recommended": array
      },
      "certifications": array,
      "resources": array,
      "intermediateRoles": array
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a career counselor with expertise in career transitions across industries."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const careerPath = JSON.parse(completion.choices[0].message.content);
    res.json(careerPath);
  } catch (error) {
    console.error('Career mapping error:', error);
    res.status(500).json({ error: 'Failed to generate career path' });
  }
});

// Portfolio Review
app.post('/api/portfolio-review', async (req, res) => {
  try {
    const { portfolioUrl, portfolioType, targetRole } = req.body;
    
    // Note: In production, you'd want to scrape the portfolio URL
    // For now, we'll ask the user to provide portfolio content
    
    const prompt = `Review this ${portfolioType} portfolio for a ${targetRole} position: ${portfolioUrl}

    Provide detailed feedback on:
    1. Visual design and branding
    2. Content quality and presentation
    3. Technical implementation
    4. User experience
    5. Professional impact

    Return as JSON: {
      "overallScore": number (0-100),
      "categories": {
        "design": {"score": number, "feedback": string},
        "content": {"score": number, "feedback": string},
        "technical": {"score": number, "feedback": string},
        "ux": {"score": number, "feedback": string},
        "professional": {"score": number, "feedback": string}
      },
      "strengths": array,
      "improvements": array,
      "recommendations": array
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a design and portfolio expert who reviews creative and technical portfolios for hiring purposes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const review = JSON.parse(completion.choices[0].message.content);
    res.json(review);
  } catch (error) {
    console.error('Portfolio review error:', error);
    res.status(500).json({ error: 'Failed to review portfolio' });
  }
});

// Veteran Skills Translation
app.post('/api/veteran-translation', async (req, res) => {
  try {
    const { militaryRole, branch, yearsServed, targetIndustry, experience } = req.body;
    
    const prompt = `Translate military experience to civilian career opportunities:

    Military Role: ${militaryRole}
    Branch: ${branch}
    Years Served: ${yearsServed}
    Target Industry: ${targetIndustry}
    Additional Experience: ${experience}

    Provide:
    1. Best civilian role matches with scores
    2. Military-to-civilian skill translations
    3. Certification equivalencies
    4. Recommended career paths
    5. Resume/interview tips for veterans
    6. Salary expectations

    Return as JSON: {
      "translatedRole": string,
      "matchScore": number,
      "translatedSkills": array of skill mappings,
      "certifications": array,
      "recommendedRoles": array with salaries,
      "resumeTips": array,
      "interviewTips": array
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a veteran career counselor specializing in military-to-civilian transitions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const translation = JSON.parse(completion.choices[0].message.content);
    res.json(translation);
  } catch (error) {
    console.error('Veteran translation error:', error);
    res.status(500).json({ error: 'Failed to translate veteran skills' });
  }
});

// Salary Analysis (combining multiple data sources)
app.post('/api/salary-analysis', async (req, res) => {
  try {
    const { jobTitle, location, experience, skills } = req.body;
    
    // In production, you'd integrate with Glassdoor, PayScale, or Bureau of Labor Statistics APIs
    const prompt = `Provide comprehensive salary analysis for:

    Job Title: ${jobTitle}
    Location: ${location}
    Experience: ${experience}
    Skills: ${skills.join(', ') || 'Not specified'}

    Analyze market rates, negotiation strategies, and provide:
    1. Salary ranges (25th, 50th, 75th percentile)
    2. Top paying companies
    3. Factors affecting compensation
    4. Negotiation tips
    5. Skills that increase earning potential

    Return as JSON: {
      "marketRange": {
        "low": string,
        "median": string,
        "high": string
      },
      "recommendedRange": string,
      "topCompanies": array,
      "negotiationTips": array,
      "marketPosition": string,
      "skills": {
        "inDemand": array,
        "emerging": array
      }
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a compensation analyst with access to current market salary data and trends."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3
    });

    const analysis = JSON.parse(completion.choices[0].message.content);
    res.json(analysis);
  } catch (error) {
    console.error('Salary analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze salary data' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`ProfileSpike AI Server running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});

module.exports = app;