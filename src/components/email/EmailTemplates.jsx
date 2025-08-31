import React from 'react';

/**
 * Professional Email Templates with consistent styling
 * All templates use HTML with inline CSS for maximum email client compatibility
 */
export class EmailTemplates {
  
  // Base styles for all emails
  static getBaseStyles() {
    return `
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .email-header { background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; padding: 40px 30px; text-align: center; }
        .email-body { padding: 40px 30px; }
        .email-footer { background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef; }
        .logo { width: 48px; height: 48px; border-radius: 12px; margin-bottom: 16px; }
        .title { font-size: 28px; font-weight: bold; margin: 0; }
        .subtitle { font-size: 16px; opacity: 0.9; margin: 8px 0 0 0; }
        .greeting { font-size: 18px; font-weight: 600; margin-bottom: 20px; color: #000; }
        .paragraph { margin-bottom: 20px; font-size: 16px; line-height: 1.6; }
        .feature-list { list-style: none; padding: 0; margin: 24px 0; }
        .feature-item { margin-bottom: 16px; padding: 16px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #000; }
        .feature-icon { font-size: 18px; margin-right: 8px; }
        .feature-title { font-weight: 600; color: #000; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #000000 0%, #333333 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 24px 0; font-size: 16px; }
        .cta-button:hover { opacity: 0.9; }
        .stats-container { background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center; }
        .stat-item { display: inline-block; margin: 0 20px; }
        .stat-number { font-size: 24px; font-weight: bold; color: #000; display: block; }
        .stat-label { font-size: 14px; color: #666; }
        .footer-text { font-size: 14px; color: #666; margin-bottom: 16px; }
        .footer-links { margin: 16px 0; }
        .footer-link { color: #666; text-decoration: none; margin: 0 12px; font-size: 14px; }
        .unsubscribe { font-size: 12px; color: #999; margin-top: 20px; }
        .highlight-box { background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-left: 4px solid #2196f3; padding: 20px; margin: 24px 0; border-radius: 8px; }
      </style>
    `;
  }

  static getEmailHeader(title, subtitle) {
    return `
      <div class="email-header">
        <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/908552440_Screenshot2025-08-13at75643PM.png" alt="ProfileSpike Logo" class="logo">
        <h1 class="title">${title}</h1>
        <p class="subtitle">${subtitle}</p>
      </div>
    `;
  }

  static getEmailFooter() {
    return `
      <div class="email-footer">
        <p class="footer-text">
          <strong>ProfileSpike</strong> - Your AI Career Coach<br>
          Helping professionals worldwide accelerate their careers
        </p>
        <div class="footer-links">
          <a href="https://profilespike.com/dashboard" class="footer-link">Dashboard</a>
          <a href="https://profilespike.com/help" class="footer-link">Help Center</a>
          <a href="https://profilespike.com/pricing" class="footer-link">Pricing</a>
          <a href="https://profilespike.com/about" class="footer-link">About</a>
        </div>
        <div class="unsubscribe">
          <p>You're receiving this because you have an active ProfileSpike account.</p>
          <p>ProfileSpike, AI Career Platform | <a href="#" style="color: #999;">Unsubscribe</a> | <a href="https://profilespike.com/privacy" style="color: #999;">Privacy Policy</a></p>
        </div>
      </div>
    `;
  }

  static welcome(userProfile) {
    const dashboardUrl = `https://profilespike.com/dashboard`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ProfileSpike</title>
        ${this.getBaseStyles()}
      </head>
      <body>
        <div class="email-container">
          ${this.getEmailHeader('Welcome to ProfileSpike!', 'Your AI-powered career transformation starts now')}
          
          <div class="email-body">
            <p class="greeting">Hi ${userProfile.first_name},</p>
            
            <p class="paragraph">
              Welcome to ProfileSpike! We're thrilled to have you join our community of ambitious professionals who are taking control of their career growth.
            </p>
            
            <p class="paragraph">
              Your account is fully set up and ready to supercharge your career journey. Here's what you can do right now:
            </p>

            <ul class="feature-list">
              <li class="feature-item">
                <span class="feature-icon">🎯</span>
                <strong class="feature-title">AI Resume Analyzer</strong><br>
                Get an instant ATS score and personalized optimization recommendations
              </li>
              <li class="feature-item">
                <span class="feature-icon">🔗</span>
                <strong class="feature-title">LinkedIn Profile Optimizer</strong><br>
                Boost your professional brand and increase your visibility to recruiters
              </li>
              <li class="feature-item">
                <span class="feature-icon">💼</span>
                <strong class="feature-title">Portfolio Review Engine</strong><br>
                Ensure your work showcases maximum impact and tells your story effectively
              </li>
              <li class="feature-item">
                <span class="feature-icon">🎤</span>
                <strong class="feature-title">AI Interview Prep</strong><br>
                Practice with confidence using our AI-powered feedback and coaching
              </li>
            </ul>

            <div class="stats-container">
              <p style="margin-bottom: 16px; font-weight: 600;">Your Free Trial Includes:</p>
              <div class="stat-item">
                <span class="stat-number">3</span>
                <span class="stat-label">Free AI Analyses</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">24/7</span>
                <span class="stat-label">Platform Access</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">∞</span>
                <span class="stat-label">Career Growth Potential</span>
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="cta-button">
                🚀 Launch Your Dashboard
              </a>
            </div>

            <div class="highlight-box">
              <p style="margin: 0; font-weight: 600;">💡 Pro Tip:</p>
              <p style="margin: 8px 0 0 0;">Start with our AI Resume Analyzer to get your baseline score, then work through our recommendations. Most users see a 30-point improvement in their first session!</p>
            </div>

            <p class="paragraph">
              Questions? Our Help Center has detailed guides, or you can reply directly to this email - we read every message and typically respond within a few hours.
            </p>

            <p class="paragraph" style="margin-bottom: 0;">
              Ready to accelerate your career? Let's get started!<br><br>
              <strong>The ProfileSpike Team</strong><br>
              <em>Your AI Career Coaches</em>
            </p>
          </div>

          ${this.getEmailFooter()}
        </div>
      </body>
      </html>
    `;
  }

  static subscriptionConfirmed(userProfile, planName) {
    const dashboardUrl = `https://profilespike.com/dashboard`;
    
    const features = planName.includes('Professional') || planName.includes('Freelance') ? [
      '✅ Unlimited AI analyses and optimizations',
      '✅ Advanced resume templates and formatting',
      '✅ Priority email support with faster response times',
      '✅ Export to PDF/Word with professional templates',
      '✅ Version history and comparison tracking',
      '✅ Advanced keyword optimization engine'
    ] : [
      '✅ Everything in Professional',
      '✅ Team dashboard and collaboration tools',
      '✅ Bulk user management',
      '✅ Custom branding options',
      '✅ API access for integrations',
      '✅ Dedicated account manager'
    ];

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to ProfileSpike ${planName}</title>
        ${this.getBaseStyles()}
      </head>
      <body>
        <div class="email-container">
          ${this.getEmailHeader(`Welcome to ProfileSpike ${planName}!`, 'Your premium career acceleration starts now')}
          
          <div class="email-body">
            <p class="greeting">Hi ${userProfile.first_name},</p>
            
            <p class="paragraph">
              🎉 <strong>Congratulations!</strong> Your ProfileSpike ${planName} subscription is now active, and you've just unlocked the full power of AI-driven career optimization.
            </p>
            
            <div class="stats-container">
              <p style="margin-bottom: 16px; font-weight: 600; color: #000;">Your ${planName} Plan Includes:</p>
            </div>

            <ul class="feature-list">
              ${features.map(feature => `
                <li class="feature-item">
                  ${feature}
                </li>
              `).join('')}
            </ul>

            <div class="highlight-box">
              <p style="margin: 0; font-weight: 600;">🚀 Getting the Most from Your Subscription:</p>
              <p style="margin: 8px 0 0 0;">
                1. Run unlimited analyses on multiple resume versions<br>
                2. Track your improvement scores over time<br>
                3. Export optimized documents for immediate job applications<br>
                4. Use priority support for personalized guidance
              </p>
            </div>

            <div style="text-align: center;">
              <a href="${dashboardUrl}" class="cta-button">
                ⚡ Access Your Premium Dashboard
              </a>
            </div>

            <p class="paragraph">
              As a ${planName} member, you now have <strong>priority support</strong>. If you have any questions or need personalized guidance, reply to this email and we'll get back to you within a few hours.
            </p>

            <p class="paragraph" style="margin-bottom: 0;">
              Thank you for investing in your career growth. We're excited to see the opportunities that open up for you!<br><br>
              <strong>The ProfileSpike Team</strong><br>
              <em>Your Premium AI Career Coaches</em>
            </p>
          </div>

          ${this.getEmailFooter()}
        </div>
      </body>
      </html>
    `;
  }

  static lowCredits(userProfile) {
    const upgradeUrl = `https://profilespike.com/pricing`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Only 1 Analysis Remaining</title>
        ${this.getBaseStyles()}
      </head>
      <body>
        <div class="email-container">
          ${this.getEmailHeader('You\'re Making Great Progress!', 'Only 1 free analysis remaining')}
          
          <div class="email-body">
            <p class="greeting">Hi ${userProfile.first_name},</p>
            
            <p class="paragraph">
              We've noticed you're actively using ProfileSpike to improve your career materials - that's fantastic! 📈
            </p>
            
            <p class="paragraph">
              You're down to your <strong>last free analysis</strong>, which means you've been putting in the work to optimize your professional presence. 
            </p>

            <div class="highlight-box">
              <p style="margin: 0; font-weight: 600;">🎯 Don't Let Your Momentum Stop Here!</p>
              <p style="margin: 8px 0 0 0;">
                You're seeing results, and upgrading to Professional will keep that progress going with unlimited access to all our AI tools.
              </p>
            </div>

            <ul class="feature-list">
              <li class="feature-item">
                <span class="feature-icon">♾️</span>
                <strong class="feature-title">Unlimited AI Analyses</strong><br>
                Perfect and test multiple versions of your resume, LinkedIn profile, and portfolio
              </li>
              <li class="feature-item">
                <span class="feature-icon">📊</span>
                <strong class="feature-title">Advanced Analytics</strong><br>
                Track your improvement scores and see your progress over time
              </li>
              <li class="feature-item">
                <span class="feature-icon">⚡</span>
                <strong class="feature-title">Priority Support</strong><br>
                Get personalized guidance from our career experts
              </li>
              <li class="feature-item">
                <span class="feature-icon">📄</span>
                <strong class="feature-title">Professional Export</strong><br>
                Download your optimized documents in PDF and Word formats
              </li>
            </ul>

            <div style="text-align: center;">
              <a href="${upgradeUrl}" class="cta-button">
                🚀 Upgrade to Professional - From $15/month
              </a>
            </div>

            <p class="paragraph">
              <strong>Special offer:</strong> Upgrade in the next 48 hours and get 20% off your first month with code <strong>MOMENTUM20</strong>
            </p>

            <p class="paragraph" style="margin-bottom: 0;">
              Questions about upgrading? Just reply to this email - we're here to help!<br><br>
              <strong>The ProfileSpike Team</strong><br>
              <em>Keep growing with us</em>
            </p>
          </div>

          ${this.getEmailFooter()}
        </div>
      </body>
      </html>
    `;
  }

  static analysisComplete(userEmail, analysis, userProfile) {
    const analysisTypeMap = {
      resume: "Resume Analysis",
      linkedin: "LinkedIn Optimization", 
      portfolio: "Portfolio Review",
      interview: "Interview Prep Session"
    };

    const viewResultsUrl = `https://profilespike.com/savedinsights`;
    const scoreEmoji = analysis.score >= 80 ? '🎉' : analysis.score >= 60 ? '📈' : '💪';
    const scoreMessage = analysis.score >= 80 ? 
      'Outstanding work! Your profile is in excellent shape.' : 
      analysis.score >= 60 ? 
      'Great progress! A few strategic tweaks will make it even stronger.' : 
      'Lots of opportunity for improvement - let\'s optimize it together!';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Analysis Results Are Ready!</title>
        ${this.getBaseStyles()}
      </head>
      <body>
        <div class="email-container">
          ${this.getEmailHeader(`Your ${analysisTypeMap[analysis.analysis_type]} is Complete!`, `Score: ${analysis.score}/100 ${scoreEmoji}`)}
          
          <div class="email-body">
            <p class="greeting">Hi ${userProfile?.first_name || 'there'},</p>
            
            <p class="paragraph">
              Excellent news! Your ${analysisTypeMap[analysis.analysis_type]} has been completed by our AI engine.
            </p>
            
            <div class="stats-container">
              <div class="stat-item">
                <span class="stat-number">${analysis.score}/100</span>
                <span class="stat-label">Your Score</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${analysis.improvements?.length || 0}</span>
                <span class="stat-label">Improvements Found</span>
              </div>
              <div class="stat-item">
                <span class="stat-number">${userProfile?.credits_remaining || 0}</span>
                <span class="stat-label">Credits Remaining</span>
              </div>
            </div>

            <p class="paragraph">
              <strong>${scoreMessage}</strong>
            </p>

            ${analysis.improvements && analysis.improvements.length > 0 ? `
              <div style="margin: 24px 0;">
                <p style="font-weight: 600; margin-bottom: 16px;">🔍 Top Priority Improvements:</p>
                <ul class="feature-list">
                  ${analysis.improvements.slice(0, 3).map((item, index) => `
                    <li class="feature-item">
                      <strong class="feature-title">${index + 1}. ${item.title || item}</strong>
                      ${item.description ? `<br>${item.description}` : ''}
                    </li>
                  `).join('')}
                </ul>
              </div>
            ` : ''}

            <div style="text-align: center;">
              <a href="${viewResultsUrl}" class="cta-button">
                📊 View Complete Analysis Results
              </a>
            </div>

            ${userProfile?.credits_remaining > 0 ? `
              <div class="highlight-box">
                <p style="margin: 0; font-weight: 600;">🚀 Keep the Momentum Going!</p>
                <p style="margin: 8px 0 0 0;">
                  You have ${userProfile.credits_remaining} ${userProfile.credits_remaining === 1 ? 'analysis' : 'analyses'} remaining. 
                  Ready to optimize another part of your professional presence?
                </p>
              </div>
            ` : `
              <div class="highlight-box">
                <p style="margin: 0; font-weight: 600;">🎯 Ready for Unlimited Optimization?</p>
                <p style="margin: 8px 0 0 0;">
                  You've used all your free analyses! Upgrade to Professional for unlimited AI feedback and advanced features.
                  <a href="https://profilespike.com/pricing" style="color: #2196f3; text-decoration: none; font-weight: 600;"> View Plans →</a>
                </p>
              </div>
            `}

            <p class="paragraph" style="margin-bottom: 0;">
              Questions about your results? Reply to this email and our team will provide personalized guidance.<br><br>
              <strong>The ProfileSpike Team</strong><br>
              <em>Your AI Career Optimization Experts</em>
            </p>
          </div>

          ${this.getEmailFooter()}
        </div>
      </body>
      </html>
    `;
  }
}

export default EmailTemplates;