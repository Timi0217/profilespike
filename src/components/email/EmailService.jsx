import { EmailTemplates } from './EmailTemplates';
import { sendEmailWithResend } from '@/api/functions';

/**
 * Centralized service for sending application emails.
 * All methods now use the `sendEmailWithResend` backend function,
 * ensuring emails are sent from support@profilespike.com via Resend.
 */
class EmailService {
  /**
   * Sends the welcome email to a new user.
   * @param {object} userProfile - The user's profile data.
   */
  static async sendWelcomeEmail(userProfile) {
    if (!userProfile?.created_by) {
      console.error("sendWelcomeEmail: Invalid userProfile object provided.");
      return;
    }
    
    try {
      const subject = `🚀 Welcome to ProfileSpike, ${userProfile.first_name}!`;
      const htmlContent = EmailTemplates.welcome(userProfile);
      
      await sendEmailWithResend({
        to: userProfile.created_by,
        subject: subject,
        html: htmlContent,
      });
      console.log(`Welcome email sent to ${userProfile.created_by}`);
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't re-throw, just log the error.
    }
  }

  /**
   * Sends a low credits warning email.
   * @param {object} userProfile - The user's profile data, including credits_remaining.
   */
  static async sendLowCreditsEmail(userProfile) {
    if (!userProfile?.created_by) {
      console.error("sendLowCreditsEmail: Invalid userProfile object provided.");
      return;
    }
    
    try {
      const subject = `⚠️ Your ProfileSpike credits are running low!`;
      const htmlContent = EmailTemplates.lowCredits(userProfile);
      
      await sendEmailWithResend({
        to: userProfile.created_by,
        subject: subject,
        html: htmlContent,
      });
      console.log(`Low credits email sent to ${userProfile.created_by}`);
    } catch (error) {
      console.error("Failed to send low credits email:", error);
    }
  }
}

export default EmailService;