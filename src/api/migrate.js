// Database migration script
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';

const runMigration = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'src/api/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Running database migrations...');
    await client.query(schemaSql);
    console.log('✅ Database schema created successfully');

    // Insert default email templates
    const defaultTemplates = [
      {
        name: 'welcome_email',
        subject: 'Welcome to ProfileSpike!',
        html_content: `
          <h1>Welcome to ProfileSpike!</h1>
          <p>Hi {{name}},</p>
          <p>Thank you for joining ProfileSpike. We're excited to help you accelerate your career!</p>
          <p>Get started by:</p>
          <ul>
            <li>Uploading your resume for AI analysis</li>
            <li>Optimizing your LinkedIn profile</li>
            <li>Exploring our career path recommendations</li>
          </ul>
          <p>Best regards,<br>The ProfileSpike Team</p>
        `,
        variables: ['name']
      },
      {
        name: 'analysis_complete',
        subject: 'Your {{analysis_type}} Analysis is Ready',
        html_content: `
          <h1>Analysis Complete!</h1>
          <p>Hi {{name}},</p>
          <p>Your {{analysis_type}} analysis is now ready to view in your dashboard.</p>
          <p><a href="{{dashboard_url}}">View Your Analysis</a></p>
          <p>Best regards,<br>The ProfileSpike Team</p>
        `,
        variables: ['name', 'analysis_type', 'dashboard_url']
      }
    ];

    for (const template of defaultTemplates) {
      await client.query(
        `INSERT INTO email_templates (name, subject, html_content, variables) 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (name) DO UPDATE SET 
         subject = EXCLUDED.subject, 
         html_content = EXCLUDED.html_content, 
         variables = EXCLUDED.variables,
         updated_at = NOW()`,
        [template.name, template.subject, template.html_content, JSON.stringify(template.variables)]
      );
    }

    console.log('✅ Default email templates inserted');
    console.log('🎉 Database setup complete!');

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
};

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration().catch(console.error);
}

export { runMigration };