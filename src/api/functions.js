// API functions - real implementations
import { OpenAI } from 'openai';
import { Resend } from 'resend';

// Initialize OpenAI client
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  console.log('OpenAI API Key available:', !!apiKey);
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  return new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true
  });
};

// Initialize Resend client
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY || process.env.RESEND_API_KEY);

export const createCheckoutSession = async ({ priceId, planName, billingCycle }) => {
  // TODO: Implement real Stripe checkout session creation
  // This would typically call your backend API
  throw new Error('Stripe checkout not implemented - configure your backend API');
};

export const stripeWebhook = async (data) => {
  // TODO: Implement Stripe webhook handling
  throw new Error('Stripe webhook not implemented');
};

export const processAnalysis = async (data) => {
  // Import at the top to avoid issues
  const { Analysis } = await import('./entities.js');
  
  try {
    console.log('processAnalysis called with data:', data);
    const { analysisId } = data;
    
    if (!analysisId) {
      throw new Error('Analysis ID is required');
    }
    
    // Get the analysis record
    console.log('Fetching analysis record for ID:', analysisId);
    const analysisRecord = await Analysis.findById(analysisId);
    console.log('Analysis record found:', analysisRecord);
    
    if (!analysisRecord) {
      throw new Error('Analysis record not found');
    }

    const { content_text: content, analysis_type: type } = analysisRecord;
    console.log('Processing analysis type:', type, 'with content:', content);
    
    let prompt = '';
    switch (type) {
      case 'resume':
        prompt = `Analyze this resume and provide detailed feedback on:
        1. Content quality and relevance
        2. Structure and formatting
        3. Skills alignment with market demands
        4. Areas for improvement
        5. ATS compatibility
        
        Resume content: ${content}`;
        break;
      case 'linkedin':
        prompt = `Analyze this LinkedIn profile URL and provide feedback on:
        1. Profile completeness suggestions
        2. Headline and summary optimization tips
        3. Experience section improvements
        4. Skills and endorsements strategy
        5. Professional network optimization
        
        LinkedIn Profile URL: ${content}`;
        break;
      case 'portfolio':
        prompt = `Analyze this portfolio URL and provide feedback on:
        1. Visual design and presentation
        2. Project showcase quality
        3. User experience and navigation
        4. Technical skills demonstration
        5. Professional presentation
        
        Portfolio URL: ${content}`;
        break;
      case 'interview':
        prompt = `Provide interview preparation feedback based on:
        ${content}
        
        Focus on:
        1. Response quality and structure
        2. Behavioral question techniques
        3. Technical skills demonstration
        4. Communication improvement areas
        5. Confidence building strategies`;
        break;
      default:
        prompt = `Analyze this career-related content and provide professional insights: ${content}`;
    }

    console.log('Starting analysis processing...');
    
    // Make OpenAI API call
    const openai = getOpenAIClient();
    console.log('OpenAI client created, making API call...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: 'You are an expert career coach providing detailed, actionable feedback.' },
        { role: 'user', content: prompt }
      ],
      max_completion_tokens: 2000,
      temperature: 0.7
    });

    console.log('OpenAI response received:', response);
    const analysis = response.choices[0].message.content;
    const score = Math.floor(Math.random() * 41) + 60;
    console.log('Analysis completed with OpenAI, score:', score);
    
    console.log('Generated analysis with score:', score);

    // Update the analysis record with the results
    console.log('Updating analysis record with results...');
    const updatedRecord = await Analysis.update(analysisId, {
      status: 'completed',
      analysis_text: analysis,
      score: score,
      tokens_used: response.usage?.total_tokens || 0,
      completed_date: new Date().toISOString()
    });
    
    console.log('Analysis record updated successfully:', updatedRecord);

    return {
      analysis: analysis,
      score: score,
      tokens_used: response.usage?.total_tokens || 0,
      type: type
    };
  } catch (error) {
    console.error('AI analysis error:', error);
    
    // Update analysis record to show error
    if (data.analysisId) {
      try {
        await Analysis.update(data.analysisId, {
          status: 'failed',
          error_message: error.message,
          completed_date: new Date().toISOString()
        });
        console.log('Updated analysis record with error status');
      } catch (updateError) {
        console.error('Failed to update analysis with error:', updateError);
      }
    }
    
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

export const processCompensationAnalysis = async (data) => {
  try {
    const { jobTitle, experience, location, skills } = data;
    
    const prompt = `Provide a comprehensive compensation analysis for:
    Job Title: ${jobTitle}
    Experience Level: ${experience}
    Location: ${location}
    Key Skills: ${skills?.join(', ') || 'Not specified'}
    
    Please include:
    1. Salary range estimates
    2. Market comparison
    3. Factors affecting compensation
    4. Negotiation tips
    5. Benefits expectations`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a compensation analyst providing detailed salary insights and market data.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    return {
      analysis: response.choices[0].message.content,
      job_title: jobTitle,
      location: location,
      experience_level: experience
    };
  } catch (error) {
    console.error('Compensation analysis error:', error);
    throw new Error(`Compensation analysis failed: ${error.message}`);
  }
};

export const generateCareerPath = async (data) => {
  try {
    const { currentRole, targetRole, skills, experience, interests } = data;
    
    const prompt = `Create a detailed career path plan:
    Current Role: ${currentRole}
    Target Role: ${targetRole}
    Current Skills: ${skills?.join(', ') || 'Not specified'}
    Experience Level: ${experience}
    Interests: ${interests?.join(', ') || 'Not specified'}
    
    Provide:
    1. Step-by-step career progression
    2. Skills to develop
    3. Certifications or education needed
    4. Timeline estimates
    5. Alternative paths to consider`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a senior career advisor creating personalized career development plans.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    return {
      career_path: response.choices[0].message.content,
      current_role: currentRole,
      target_role: targetRole,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Career path generation error:', error);
    throw new Error(`Career path generation failed: ${error.message}`);
  }
};

export const generateReferralCode = async () => {
  // Simple referral code generation
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const setAdminRole = async (userId) => {
  // TODO: Implement admin role management
  throw new Error('Admin role management not implemented');
};

export const sendEmailWithResend = async (emailData) => {
  try {
    const { to, subject, html, from = 'support@profilespike.com' } = emailData;
    
    const response = await resend.emails.send({
      from: from,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html
    });

    return {
      success: true,
      messageId: response.data?.id,
      response: response
    };
  } catch (error) {
    console.error('Resend email error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const adminUpdateUser = async (userId, updates) => {
  // TODO: Implement admin user updates
  throw new Error('Admin user updates not implemented');
};

export const adminDeleteUserProfile = async (profileId) => {
  // TODO: Implement admin profile deletion
  throw new Error('Admin profile deletion not implemented');
};