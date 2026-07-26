import express from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/* ---------------------------------------------------
   🧩 Middleware
--------------------------------------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------------------------------------------------
   📧 Nodemailer Transporter Configuration
--------------------------------------------------- */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_USER_EMAIL,
    pass: process.env.NODEMAILER_USER_PASSWORD,
  },
});

/* ---------------------------------------------------
   🚀 Email Sending Route
--------------------------------------------------- */


const resend = new Resend(process.env.NODEMAILER_USER_PASSWORD);

app.post("/send-mail", async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.body;

    if (!name || !email || !mobileNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const htmlContent = generateEmailTemplate(name, email, mobileNumber);

    await resend.emails.send({
      from: "RAAS Academy <onboarding@resend.dev>",
      to: [process.env.NODEMAILER_USER_EMAIL],
      subject: `🚀 New Course Inquiry - ${name}`,
      html: htmlContent,
    });

    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});


app.post("/send-mail/support", async (req, res) => {
  try {
    const { name, email, mobileNumber } = req.body;

    if (!name || !email || !mobileNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const htmlContent = generateEmailTemplate(name, email, mobileNumber);

    await resend.emails.send({
      from: "RAAS Academy <onboarding@resend.dev>",
      to: [process.env.NODEMAILER_USER_EMAIL],
      subject: `🚀 New Course Inquiry - ${name}`,
      html: htmlContent,
    });

    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});



/* ---------------------------------------------------
   💌 HTML Email Template Generator
--------------------------------------------------- */
function generateEmailTemplate(name, email, mobileNumber) {
  const timestamp = new Date().toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Course Inquiry - RAAS Academy</title>
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
      .info-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 20px;
      }
      .info-box strong {
        display: block;
        color: #4F46E5;
        margin-bottom: 8px;
      }
      .priority {
        background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
        color: white;
        text-align: center;
        padding: 30px;
        border-radius: 16px;
        margin-top: 30px;
      }
      .priority h2 {
        margin: 0 0 10px 0;
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
      @media (max-width: 600px) {
        .content { padding: 25px; }
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="header">
        <h1>New Course Inquiry 🚀</h1>
        <p>Potential student interested in RAAS Academy</p>
      </div>

      <div class="content">
        <div class="info-box">
          <strong>Full Name:</strong> ${name}
        </div>
        <div class="info-box">
          <strong>Email Address:</strong> ${email}
        </div>
        <div class="info-box">
          <strong>Mobile Number:</strong> ${mobileNumber}
        </div>

        <div class="priority">
          <h2>Ready to Connect! 🎯</h2>
          <p>This student is actively waiting for your response.</p>
          <a href="tel:${mobileNumber}" style="color:white;text-decoration:none;font-weight:bold;">📞 Call Now</a>
        </div>
      </div>

      <div class="footer">
        <div class="brand">RAAS Academy</div>
        <p>Transforming careers through quality education 🎓</p>
        <div class="timestamp">📅 Received: ${timestamp}</div>
      </div>
    </div>
  </body>
  </html>
  `;
}

/* ---------------------------------------------------
   ⚡ Start Server
--------------------------------------------------- */
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));