/**
 * Rate Limiting Middleware for RASS Academy LMS
 * 
 * Implements various rate limiters to protect against abuse, DDoS attacks,
 * and brute force attempts. Uses express-rate-limit with in-memory store.
 * 
 * For production with multiple servers, consider using a distributed store
 * like Redis with rate-limit-redis.
 */

import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Applies to all API routes
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip rate limiting for successful requests in some cases
  skipSuccessfulRequests: false,
  // Skip rate limiting for failed requests
  skipFailedRequests: false,
});

/**
 * Authentication Rate Limiter (Strict)
 * Applies to login, register, password reset endpoints
 * 5 requests per 15 minutes per IP to prevent brute force
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 429,
    message: 'Too many authentication attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // Count all attempts
  skipFailedRequests: false,
});

/**
 * Payment Rate Limiter
 * Applies to payment creation and verification endpoints
 * 10 requests per 15 minutes per IP
 */
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 payment requests per windowMs
  message: {
    status: 429,
    message: 'Too many payment requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * File Upload Rate Limiter
 * Applies to file upload endpoints
 * 20 uploads per hour per IP
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 uploads per hour
  message: {
    status: 429,
    message: 'Too many file uploads from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Email/Notification Rate Limiter
 * Applies to email sending and notification endpoints
 * 10 requests per hour per IP to prevent spam
 */
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 emails per hour
  message: {
    status: 429,
    message: 'Too many email requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Strict Rate Limiter (Very Restrictive)
 * Applies to sensitive operations like password reset, account deletion
 * 3 requests per hour per IP
 */
export const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 requests per hour
  message: {
    status: 429,
    message: 'Too many sensitive operation requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Create Account Rate Limiter
 * Applies to user registration endpoint
 * 3 accounts per hour per IP to prevent fake account creation
 */
export const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 account creations per hour
  message: {
    status: 429,
    message: 'Too many accounts created from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Quiz/Assignment Submission Rate Limiter
 * Prevents rapid-fire submissions
 * 30 submissions per hour per IP
 */
export const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 submissions per hour
  message: {
    status: 429,
    message: 'Too many submissions from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Search Rate Limiter
 * Prevents abuse of search endpoints
 * 50 searches per 15 minutes per IP
 */
export const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 searches per windowMs
  message: {
    status: 429,
    message: 'Too many search requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * AI API Rate Limiter
 * For AI doubt solver and other AI features
 * 20 requests per hour per IP (AI calls are expensive)
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 AI requests per hour
  message: {
    status: 429,
    message: 'Too many AI requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Custom rate limiter factory
 * Creates a rate limiter with custom configuration
 * 
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Maximum number of requests per window
 * @param {string} message - Custom error message
 * @returns {Function} Rate limiter middleware
 */
export const createCustomLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 429,
      message: message || 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

/**
 * Rate limiter that skips authenticated users
 * Useful for endpoints that should be more lenient for logged-in users
 * 
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} max - Maximum number of requests per window
 * @returns {Function} Rate limiter middleware
 */
export const createAuthSkipLimiter = (windowMs, max) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 429,
      message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip rate limiting for authenticated users
    skip: (req) => {
      return req.user !== undefined; // If user is authenticated, skip rate limiting
    },
  });
};

export default {
  apiLimiter,
  authLimiter,
  paymentLimiter,
  uploadLimiter,
  emailLimiter,
  strictLimiter,
  createAccountLimiter,
  submissionLimiter,
  searchLimiter,
  aiLimiter,
  createCustomLimiter,
  createAuthSkipLimiter,
};
