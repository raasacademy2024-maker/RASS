# Environment Configuration Guide

## Overview

This guide explains how to set up environment variables for the RASS Academy LMS platform (backend and frontend). Proper configuration is essential for the application to function correctly in different environments (development, staging, production).

## Table of Contents

1. [Quick Start](#quick-start)
2. [Backend Configuration](#backend-configuration)
3. [Frontend Configuration](#frontend-configuration)
4. [Security Best Practices](#security-best-practices)
5. [Environment-Specific Setup](#environment-specific-setup)
6. [Troubleshooting](#troubleshooting)

## Quick Start

### For Development

1. **Backend Setup:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and fill in your values
   npm install
   npm start
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env and fill in your values
   npm install
   npm run dev
   ```

### Minimum Required Variables

**Backend (.env):**
```env
MONGO_URI=mongodb://localhost:27017/rass_academy
JWT_SECRET=your-long-random-secret-key
PORT=8000
NODE_ENV=development
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## Backend Configuration

### Required Variables

#### 1. Database (MongoDB)

```env
MONGO_URI=mongodb://localhost:27017/rass_academy
```

**Options:**
- **Local Development:** `mongodb://localhost:27017/rass_academy`
- **MongoDB Atlas:** `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- **Docker:** `mongodb://mongo:27017/rass_academy` (if using Docker Compose)

**How to get:**
1. Local: Install MongoDB locally
2. Atlas: Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
3. Create cluster → Get connection string → Replace `<password>` and `<database>`

#### 2. JWT Secret

```env
JWT_SECRET=your-super-secret-jwt-key
```

**How to generate a secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Security Notes:**
- Must be at least 32 characters long
- Should be completely random
- Never commit to version control
- Use different secrets for different environments

#### 3. Server Configuration

```env
PORT=8000
NODE_ENV=development
```

**NODE_ENV values:**
- `development` - Enables debug logging, detailed errors
- `production` - Optimized performance, minimal logging
- `test` - Used for running automated tests

### Optional but Recommended

#### 4. Payment Gateway (Razorpay)

```env
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_key
```

**How to get:**
1. Sign up at [razorpay.com](https://razorpay.com/)
2. Go to Dashboard → Settings → API Keys
3. Generate Test Keys (for development) or Live Keys (for production)

**Note:** Test keys start with `rzp_test_`, live keys start with `rzp_live_`

#### 5. Email Service (Nodemailer)

```env
NODEMAILER_USER_EMAIL=your-email@gmail.com
NODEMAILER_USER_PASSWORD=your-app-specific-password
EMAIL_SERVICE=gmail
EMAIL_FROM_NAME=RASS Academy
```

**Gmail Setup:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password: Google Account → Security → App passwords
3. Use the 16-character password (remove spaces)

**Alternative Services:**
- **SendGrid:** Set `EMAIL_SERVICE=sendgrid` and use SendGrid API key
- **Mailgun:** Set `EMAIL_SERVICE=mailgun` with Mailgun credentials
- **AWS SES:** Configure with AWS credentials

#### 6. reCAPTCHA

```env
RECAPTCHA_SECRET_KEY=your_secret_key
```

**How to get:**
1. Go to [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Register a new site
3. Choose reCAPTCHA v2 or v3
4. Add your domain(s)
5. Copy the Secret Key

### Optional Features

#### 7. AI Doubt Solver (OpenAI)

```env
AI_API_KEY=sk-your_openai_api_key
AI_MODEL=gpt-4
AI_API_URL=https://api.openai.com/v1/chat/completions
```

**How to get:**
1. Sign up at [platform.openai.com](https://platform.openai.com/)
2. Go to API Keys section
3. Create new secret key
4. Copy and save (shown only once)

**Models:**
- `gpt-3.5-turbo` - Faster, cheaper
- `gpt-4` - More accurate, expensive
- `gpt-4-turbo` - Best balance

#### 8. Cloud Storage (AWS S3)

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=rass-academy-files
```

**How to get:**
1. Sign up for AWS account
2. Create IAM user with S3 permissions
3. Generate access keys
4. Create S3 bucket

#### 9. Video Hosting (Vimeo)

```env
VIDEO_SERVICE=vimeo
VIMEO_ACCESS_TOKEN=your_access_token
VIMEO_CLIENT_ID=your_client_id
VIMEO_CLIENT_SECRET=your_client_secret
```

**How to get:**
1. Sign up at [developer.vimeo.com](https://developer.vimeo.com/)
2. Create new app
3. Generate access token with required scopes

## Frontend Configuration

### Required Variables

#### 1. API Base URL

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Environment-specific values:**
- **Development:** `http://localhost:8000/api`
- **Staging:** `https://api-staging.yourdomain.com/api`
- **Production:** `https://api.yourdomain.com/api`

**Important:** Must match the backend URL exactly, including the `/api` path.

### Recommended Variables

#### 2. Razorpay (Frontend)

```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

**Note:** This should match the `RAZORPAY_KEY_ID` in backend .env

#### 3. reCAPTCHA (Frontend)

```env
VITE_RECAPTCHA_SITE_KEY=your_site_key
```

**Note:** This is the **Site Key** (public), different from the Secret Key used in backend.

### Optional Variables

#### 4. Analytics

```env
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
```

**How to get:**
- Google Analytics: [analytics.google.com](https://analytics.google.com/)
- Google Tag Manager: [tagmanager.google.com](https://tagmanager.google.com/)

## Security Best Practices

### 1. Never Commit Secrets

✅ **DO:**
- Add `.env` to `.gitignore`
- Commit `.env.example` with placeholder values
- Document required variables

❌ **DON'T:**
- Commit `.env` file with actual secrets
- Share secrets in chat, email, or documentation
- Use production secrets in development

### 2. Use Different Secrets per Environment

```
Development:  JWT_SECRET=dev-secret-123
Staging:      JWT_SECRET=staging-secret-456  
Production:   JWT_SECRET=prod-secret-789
```

### 3. Rotate Secrets Regularly

- Change JWT secret every 90 days
- Rotate API keys after team member changes
- Update database credentials periodically

### 4. Limit Secret Access

- Use secret management tools (AWS Secrets Manager, HashiCorp Vault)
- Give team members only the secrets they need
- Use service accounts with minimal permissions

### 5. Validate Environment Variables

The application should validate that all required environment variables are present on startup.

## Environment-Specific Setup

### Development Environment

**Backend (.env):**
```env
MONGO_URI=mongodb://localhost:27017/rass_academy_dev
JWT_SECRET=dev-secret-change-this
PORT=8000
NODE_ENV=development
RAZORPAY_KEY_ID=rzp_test_dev_key
RAZORPAY_KEY_SECRET=test_secret
```

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_RAZORPAY_KEY_ID=rzp_test_dev_key
```

### Production Environment

**Backend (.env):**
```env
MONGO_URI=mongodb+srv://prod_user:secure_pass@prod-cluster.mongodb.net/rass_prod
JWT_SECRET=<64-character-random-string>
PORT=8000
NODE_ENV=production
RAZORPAY_KEY_ID=rzp_live_prod_key
RAZORPAY_KEY_SECRET=live_secret
CORS_ORIGIN=https://rassacademy.com,https://www.rassacademy.com
```

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://api.rassacademy.com/api
VITE_RAZORPAY_KEY_ID=rzp_live_prod_key
```

### Testing Environment

**Backend (.env.test):**
```env
TEST_MONGO_URI=mongodb://localhost:27017/rass_academy_test
JWT_SECRET=test-secret-key
NODE_ENV=test
PORT=8001
```

## Deployment

### Vercel (Frontend)

1. Add environment variables in Vercel dashboard
2. Go to Project → Settings → Environment Variables
3. Add each `VITE_*` variable
4. Specify environment (Production, Preview, Development)

### Render (Backend)

1. Add environment variables in Render dashboard
2. Go to your service → Environment
3. Add each variable as Key-Value pair
4. Click "Save Changes" and redeploy

### Docker

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    env_file:
      - ./backend/.env
    ports:
      - "8000:8000"
  
  frontend:
    build: ./frontend
    env_file:
      - ./frontend/.env
    ports:
      - "5173:5173"
```

## Troubleshooting

### "Cannot read environment variable"

**Cause:** Environment variable not loaded

**Solution:**
1. Check `.env` file exists
2. Verify variable name spelling
3. Restart the server after adding variables
4. For Vite, ensure variable starts with `VITE_`

### "MongoDB connection failed"

**Cause:** Invalid `MONGO_URI`

**Solution:**
1. Check MongoDB is running (local)
2. Verify connection string format
3. Check username/password in Atlas
4. Ensure IP is whitelisted (Atlas)

### "JWT malformed" or "Invalid token"

**Cause:** `JWT_SECRET` mismatch or not set

**Solution:**
1. Ensure `JWT_SECRET` is set in backend `.env`
2. Same secret used for signing and verifying
3. Clear browser cookies/localStorage
4. Regenerate tokens

### "Payment gateway error"

**Cause:** Invalid Razorpay credentials

**Solution:**
1. Check `RAZORPAY_KEY_ID` matches in backend and frontend
2. Verify you're using test keys in development
3. Ensure Razorpay account is active

### "CORS error" in browser

**Cause:** Frontend URL not allowed by backend

**Solution:**
1. Add frontend URL to `CORS_ORIGIN` in backend
2. Format: `http://localhost:5173` (no trailing slash)
3. Multiple origins: comma-separated

## Validation Checklist

Before deployment, verify:

- [ ] All required variables are set
- [ ] No secrets are hardcoded in source code
- [ ] `.env` is in `.gitignore`
- [ ] Different secrets for different environments
- [ ] Database connection works
- [ ] JWT secret is strong (64+ characters)
- [ ] Payment gateway credentials are correct
- [ ] Email service is configured and tested
- [ ] CORS origins include all necessary domains
- [ ] Production uses live API keys (not test)

## Need Help?

If you encounter issues:

1. Check this documentation first
2. Verify all required variables are set correctly
3. Check server logs for specific error messages
4. Ensure services (MongoDB, etc.) are running
5. Contact the development team

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)
