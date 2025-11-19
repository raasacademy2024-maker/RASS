import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter using environment variables
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER_EMAIL,
      pass: process.env.NODEMAILER_USER_PASSWORD,
    },
  });
};

// Email templates
const emailTemplates = {
  'course-update': (data) => ({
    subject: `📚 Course Update: ${data.courseTitle}`,
    html: generateCourseUpdateTemplate(data)
  }),
  'bulk-notification': (data) => ({
    subject: data.title,
    html: generateBulkNotificationTemplate(data)
  }),
  'announcement': (data) => ({
    subject: `📢 New Announcement: ${data.title}`,
    html: generateAnnouncementTemplate(data)
  }),
  'system': (data) => ({
    subject: `🔔 ${data.title}`,
    html: generateSystemNotificationTemplate(data)
  })
};

// Generate course update email template
function generateCourseUpdateTemplate(data) {
  const { courseTitle, message, userName, updateDetails } = data;
  const timestamp = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Course Update - RASS Academy</title>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #334155;
        margin: 0;
        padding: 40px;
      }
      .container {
        max-width: 650px;
        margin: auto;
        background: #fff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      }
      .header {
        background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
        color: white;
        text-align: center;
        padding: 40px 20px;
      }
      .header h1 {
        margin-bottom: 10px;
        font-size: 30px;
      }
      .content {
        padding: 40px 30px;
      }
      .course-box {
        background: #f8fafc;
        border-left: 4px solid #4F46E5;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .course-box h2 {
        color: #4F46E5;
        margin-top: 0;
      }
      .message-box {
        background: #fff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .cta-button {
        display: inline-block;
        background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
        color: white;
        text-decoration: none;
        padding: 12px 30px;
        border-radius: 8px;
        font-weight: bold;
        margin-top: 20px;
      }
      .footer {
        text-align: center;
        background: #0F172A;
        color: #94A3B8;
        padding: 30px 20px;
      }
      .footer .brand {
        font-size: 18px;
        font-weight: 700;
        color: white;
      }
      .timestamp {
        background: rgba(255,255,255,0.1);
        padding: 10px 18px;
        border-radius: 10px;
        margin-top: 15px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📚 Course Update</h1>
        <p>New updates for your enrolled course</p>
      </div>

      <div class="content">
        <p>Dear ${userName || 'Student'},</p>
        
        <div class="course-box">
          <h2>${courseTitle}</h2>
          ${updateDetails ? `<p>${updateDetails}</p>` : ''}
        </div>

        <div class="message-box">
          ${message}
        </div>

        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/student/courses" class="cta-button">
          View Course
        </a>
      </div>

      <div class="footer">
        <div class="brand">RASS Academy</div>
        <p>Transforming careers through quality education 🎓</p>
        <div class="timestamp">📅 Sent: ${timestamp}</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

// Generate bulk notification template
function generateBulkNotificationTemplate(data) {
  const { title, message, userName } = data;
  const timestamp = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - RASS Academy</title>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #334155;
        margin: 0;
        padding: 40px;
      }
      .container {
        max-width: 650px;
        margin: auto;
        background: #fff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      }
      .header {
        background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
        color: white;
        text-align: center;
        padding: 40px 20px;
      }
      .header h1 {
        margin-bottom: 10px;
        font-size: 30px;
      }
      .content {
        padding: 40px 30px;
      }
      .message-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
        white-space: pre-wrap;
      }
      .footer {
        text-align: center;
        background: #0F172A;
        color: #94A3B8;
        padding: 30px 20px;
      }
      .footer .brand {
        font-size: 18px;
        font-weight: 700;
        color: white;
      }
      .timestamp {
        background: rgba(255,255,255,0.1);
        padding: 10px 18px;
        border-radius: 10px;
        margin-top: 15px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔔 ${title}</h1>
        <p>Important notification from RASS Academy</p>
      </div>

      <div class="content">
        <p>Dear ${userName || 'Student'},</p>
        
        <div class="message-box">
          ${message}
        </div>

        <p>If you have any questions, please don't hesitate to contact us.</p>
      </div>

      <div class="footer">
        <div class="brand">RASS Academy</div>
        <p>Transforming careers through quality education 🎓</p>
        <div class="timestamp">📅 Sent: ${timestamp}</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

// Generate announcement template
function generateAnnouncementTemplate(data) {
  const { title, message, userName } = data;
  const timestamp = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - RASS Academy</title>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #334155;
        margin: 0;
        padding: 40px;
      }
      .container {
        max-width: 650px;
        margin: auto;
        background: #fff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      }
      .header {
        background: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
        color: white;
        text-align: center;
        padding: 40px 20px;
      }
      .header h1 {
        margin-bottom: 10px;
        font-size: 30px;
      }
      .content {
        padding: 40px 30px;
      }
      .message-box {
        background: #fff7ed;
        border-left: 4px solid #F59E0B;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        white-space: pre-wrap;
      }
      .footer {
        text-align: center;
        background: #0F172A;
        color: #94A3B8;
        padding: 30px 20px;
      }
      .footer .brand {
        font-size: 18px;
        font-weight: 700;
        color: white;
      }
      .timestamp {
        background: rgba(255,255,255,0.1);
        padding: 10px 18px;
        border-radius: 10px;
        margin-top: 15px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📢 ${title}</h1>
        <p>New announcement from RASS Academy</p>
      </div>

      <div class="content">
        <p>Dear ${userName || 'Student'},</p>
        
        <div class="message-box">
          ${message}
        </div>

        <p>Stay updated with our announcements for the best learning experience.</p>
      </div>

      <div class="footer">
        <div class="brand">RASS Academy</div>
        <p>Transforming careers through quality education 🎓</p>
        <div class="timestamp">📅 Sent: ${timestamp}</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

// Generate system notification template
function generateSystemNotificationTemplate(data) {
  const { title, message, userName } = data;
  const timestamp = new Date().toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - RASS Academy</title>
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #334155;
        margin: 0;
        padding: 40px;
      }
      .container {
        max-width: 650px;
        margin: auto;
        background: #fff;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
      }
      .header {
        background: linear-gradient(135deg, #10B981 0%, #059669 100%);
        color: white;
        text-align: center;
        padding: 40px 20px;
      }
      .header h1 {
        margin-bottom: 10px;
        font-size: 30px;
      }
      .content {
        padding: 40px 30px;
      }
      .message-box {
        background: #f0fdf4;
        border-left: 4px solid #10B981;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 20px;
        white-space: pre-wrap;
      }
      .footer {
        text-align: center;
        background: #0F172A;
        color: #94A3B8;
        padding: 30px 20px;
      }
      .footer .brand {
        font-size: 18px;
        font-weight: 700;
        color: white;
      }
      .timestamp {
        background: rgba(255,255,255,0.1);
        padding: 10px 18px;
        border-radius: 10px;
        margin-top: 15px;
        display: inline-block;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>🔔 ${title}</h1>
        <p>System notification from RASS Academy</p>
      </div>

      <div class="content">
        <p>Dear ${userName || 'User'},</p>
        
        <div class="message-box">
          ${message}
        </div>

        <p>Thank you for being part of RASS Academy.</p>
      </div>

      <div class="footer">
        <div class="brand">RASS Academy</div>
        <p>Transforming careers through quality education 🎓</p>
        <div class="timestamp">📅 Sent: ${timestamp}</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

/**
 * Send notification email to a user
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.userName - Recipient name
 * @param {string} options.type - Notification type
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {Object} options.data - Additional data for templates
 * @returns {Promise<Object>} - Email send result
 */
export const sendNotificationEmail = async (options) => {
  try {
    const { to, userName, type, title, message, data = {} } = options;
    
    // Get email template based on type
    const templateType = type === 'course-update' || type === 'bulk' ? type : 'system';
    const template = emailTemplates[templateType] || emailTemplates['system'];
    
    const emailContent = template({
      userName,
      title,
      message,
      ...data
    });

    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"RASS Academy" <${process.env.NODEMAILER_USER_EMAIL}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      messageId: result.messageId,
      response: result.response
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Send bulk notification emails
 * @param {Array} recipients - Array of recipient objects with email, name
 * @param {Object} notification - Notification data
 * @returns {Promise<Object>} - Bulk send result
 */
export const sendBulkNotificationEmails = async (recipients, notification) => {
  const results = {
    successful: [],
    failed: []
  };

  for (const recipient of recipients) {
    try {
      const result = await sendNotificationEmail({
        to: recipient.email,
        userName: recipient.name,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data || {}
      });

      if (result.success) {
        results.successful.push({
          email: recipient.email,
          messageId: result.messageId
        });
      } else {
        results.failed.push({
          email: recipient.email,
          error: result.error
        });
      }
    } catch (error) {
      results.failed.push({
        email: recipient.email,
        error: error.message
      });
    }
  }

  return results;
};

export default {
  sendNotificationEmail,
  sendBulkNotificationEmails
};
