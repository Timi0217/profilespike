// AI Service for ProfileSpike
// Centralized service for all AI-powered features

class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
    this.openAIKey = process.env.REACT_APP_OPENAI_API_KEY;
    this.anthropicKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
  }

  // Resume Analysis with real AI
  async analyzeResume(resumeText, targetRole = '') {
    try {
      const response = await fetch(`${this.baseURL}/api/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          resumeText,
          targetRole,
          analysisType: 'comprehensive'
        })
      });

      if (!response.ok) {
        throw new Error(`Resume analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  }

  // LinkedIn Profile Analysis
  async analyzeLinkedInProfile(profileText) {
    try {
      const response = await fetch(`${this.baseURL}/api/analyze-linkedin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          profileText,
          analysisType: 'optimization'
        })
      });

      if (!response.ok) {
        throw new Error(`LinkedIn analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('LinkedIn analysis error:', error);
      throw error;
    }
  }

  // Interview Preparation with AI
  async generateInterviewQuestions(role, difficulty, company = '') {
    try {
      const response = await fetch(`${this.baseURL}/api/interview-prep`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          role,
          difficulty,
          company,
          questionCount: 5
        })
      });

      if (!response.ok) {
        throw new Error(`Interview prep failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Interview prep error:', error);
      throw error;
    }
  }

  // Career Path Mapping
  async generateCareerPath(currentRole, targetRole, experience, skills = []) {
    try {
      const response = await fetch(`${this.baseURL}/api/career-mapping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          currentRole,
          targetRole,
          experience,
          skills
        })
      });

      if (!response.ok) {
        throw new Error(`Career mapping failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Career mapping error:', error);
      throw error;
    }
  }

  // Salary Analysis (using external APIs + AI interpretation)
  async analyzeSalary(jobTitle, location, experience, skills = []) {
    try {
      const response = await fetch(`${this.baseURL}/api/salary-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobTitle,
          location,
          experience,
          skills
        })
      });

      if (!response.ok) {
        throw new Error(`Salary analysis failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Salary analysis error:', error);
      throw error;
    }
  }

  // Portfolio Review
  async reviewPortfolio(portfolioUrl, portfolioType, targetRole) {
    try {
      const response = await fetch(`${this.baseURL}/api/portfolio-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          portfolioUrl,
          portfolioType,
          targetRole
        })
      });

      if (!response.ok) {
        throw new Error(`Portfolio review failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Portfolio review error:', error);
      throw error;
    }
  }

  // Veteran Skills Translation
  async translateVeteranSkills(militaryRole, branch, yearsServed, targetIndustry, experience = '') {
    try {
      const response = await fetch(`${this.baseURL}/api/veteran-translation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          militaryRole,
          branch,
          yearsServed,
          targetIndustry,
          experience
        })
      });

      if (!response.ok) {
        throw new Error(`Veteran skills translation failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Veteran skills translation error:', error);
      throw error;
    }
  }

  // Generic AI prompt for custom analysis
  async sendAIPrompt(prompt, context = {}) {
    try {
      const response = await fetch(`${this.baseURL}/api/ai-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openAIKey}`
        },
        body: JSON.stringify({
          prompt,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`AI prompt failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI prompt error:', error);
      throw error;
    }
  }
}

export default new AIService();