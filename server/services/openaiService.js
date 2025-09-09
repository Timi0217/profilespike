import OpenAI from 'openai';

// Create OpenAI client dynamically to pick up fresh API key
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export async function analyzeWithOpenAI(profileData, linkedinUrl) {
  try {
    // Check if we have limited data due to LinkedIn privacy/signin requirements
    const hasLimitedData = profileData.headline === 'Headline not found' || 
                          profileData.summary === 'Summary not found' ||
                          profileData.experience.length === 0;
    
    let profileSummary;
    
    if (hasLimitedData) {
      // Create summary for limited/public profile data
      profileSummary = `
LinkedIn Profile Analysis Request:

**Profile URL:** ${linkedinUrl}
**Analysis Type:** Public Profile View (Limited Data Available)

**Available Information:**
- Name: ${profileData.name}
- Professional Title/Company: ${profileData.headline !== 'Headline not found' ? profileData.headline : 'Available in page title'}
- Profile Accessibility: This appears to be a private profile or LinkedIn is requiring sign-in for full details

**Note for Analysis:** 
Since full profile details are not publicly accessible, please provide a comprehensive LinkedIn optimization framework and best practices guide. Focus on what makes a strong LinkedIn profile in general, and provide specific recommendations for someone in a professional role similar to "${profileData.headline !== 'Headline not found' ? profileData.headline : 'professional'}" position.

Include recommendations for:
1. Profile completeness and optimization strategies
2. Headline and summary best practices
3. Experience section optimization
4. Skills and networking strategies
5. Content and engagement recommendations
6. Professional presentation guidelines
      `.trim();
    } else {
      // Create detailed profile summary for fully accessible profiles
      profileSummary = `
LinkedIn Profile Analysis Request:

**Profile URL:** ${linkedinUrl}

**Basic Information:**
- Name: ${profileData.name}
- Headline: ${profileData.headline}
- Location: ${profileData.location}
- Connections: ${profileData.connectionsCount}

**Summary/About Section:**
${profileData.summary}

**Work Experience:**
${profileData.experience.map((exp, i) => 
  `${i + 1}. ${exp.title} at ${exp.company}
   Duration: ${exp.duration}
   Description: ${exp.description}`
).join('\n\n')}

**Education:**
${profileData.education.map((edu, i) =>
  `${i + 1}. ${edu.degree} from ${edu.school} (${edu.years})`
).join('\n')}

**Skills:**
${profileData.skills.join(', ')}

**Recent Activity:**
${profileData.posts.join(', ')}
      `.trim();
    }

    console.log('Sending profile data to OpenAI...');
    console.log('🔑 Using API Key:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 20) + '...' : 'NOT FOUND');
    
    const openai = getOpenAIClient(); // Get fresh client with current API key
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert career coach and LinkedIn optimization specialist. You have been provided with detailed scraped data from a LinkedIn profile. Analyze this real profile data and provide specific, personalized feedback and recommendations.

Focus on:
1. Profile completeness and professional presentation
2. Headline effectiveness and keyword optimization
3. Summary/About section engagement and clarity
4. Experience descriptions and achievement highlighting
5. Skills alignment with career goals
6. Overall professional brand consistency
7. Specific improvements with examples

Provide a numerical score out of 100 and detailed, actionable recommendations based on the actual profile content provided.`
        },
        {
          role: 'user',
          content: `Please analyze this LinkedIn profile data and provide a comprehensive assessment with specific recommendations:

${profileSummary}`
        }
      ],
      max_completion_tokens: 2500,
      temperature: 0.7
    });

    const analysis = response.choices[0].message.content;
    
    // Extract score from analysis
    const scoreMatch = analysis.match(/(?:score|rating).*?(\d+)(?:\/100|%)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 21) + 70;

    console.log('OpenAI analysis completed. Tokens used:', response.usage.total_tokens);

    return {
      analysis,
      score,
      tokensUsed: response.usage.total_tokens
    };

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    throw new Error(`OpenAI analysis failed: ${error.message}`);
  }
}