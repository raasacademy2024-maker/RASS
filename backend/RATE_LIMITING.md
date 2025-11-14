# Rate Limiting Implementation Guide

## Overview

Rate limiting has been implemented across the RASS Academy LMS backend to protect against abuse, DDoS attacks, brute force attempts, and excessive API usage. This document explains the implementation, configuration, and best practices.

## What is Rate Limiting?

Rate limiting controls the number of requests a client can make to the API within a specific time window. When the limit is exceeded, the server returns a `429 Too Many Requests` error.

### Benefits
- **Security**: Prevents brute force attacks on authentication endpoints
- **Performance**: Protects server resources from being overwhelmed
- **Fair Usage**: Ensures all users get equitable access to resources
- **Cost Control**: Prevents excessive usage of expensive operations (AI calls, payments)

## Implementation

### Technology Stack
- **express-rate-limit**: Flexible rate limiting middleware for Express
- **In-Memory Store**: Default store (suitable for single-server deployments)
- **Distributed Store Option**: Redis recommended for multi-server production

## Rate Limiters

### 1. General API Limiter (Applied Globally)

**Location**: Applied to all `/api/*` routes in `server.js`

```javascript
windowMs: 15 minutes
max: 100 requests per IP
```

**Purpose**: General protection against excessive API usage

**When triggered**: After 100 requests in 15 minutes from the same IP

**Example Response**:
```json
{
  "status": 429,
  "message": "Too many requests from this IP, please try again after 15 minutes."
}
```

### 2. Authentication Limiter (Strict)

**Applied to**:
- `POST /api/auth/login`

```javascript
windowMs: 15 minutes
max: 5 requests per IP
```

**Purpose**: Prevent brute force password attacks

**Best Practice**: Keep this low (3-10 attempts)

### 3. Account Creation Limiter

**Applied to**:
- `POST /api/auth/register`

```javascript
windowMs: 1 hour
max: 3 accounts per IP
```

**Purpose**: Prevent fake account creation and spam

### 4. Payment Limiter

**Applied to**:
- `POST /api/payments/order`
- `POST /api/payments/verify`

```javascript
windowMs: 15 minutes
max: 10 requests per IP
```

**Purpose**: Prevent payment fraud and abuse

### 5. Submission Limiter

**Applied to**:
- `POST /api/assignments/:id/submit`
- `POST /api/quizzes/:id/submit`

```javascript
windowMs: 1 hour
max: 30 submissions per IP
```

**Purpose**: Prevent rapid-fire submissions and cheating attempts

### 6. AI Limiter

**Applied to**:
- `POST /api/doubts/:id/ai-solve`

```javascript
windowMs: 1 hour
max: 20 requests per IP
```

**Purpose**: Control expensive AI API calls

### 7. File Upload Limiter

```javascript
windowMs: 1 hour
max: 20 uploads per IP
```

**Purpose**: Prevent storage abuse

### 8. Email Limiter

```javascript
windowMs: 1 hour
max: 10 emails per IP
```

**Purpose**: Prevent email spam

### 9. Search Limiter

```javascript
windowMs: 15 minutes
max: 50 searches per IP
```

**Purpose**: Prevent search abuse and database strain

### 10. Strict Limiter

```javascript
windowMs: 1 hour
max: 3 requests per IP
```

**Purpose**: Ultra-sensitive operations (password reset, account deletion)

## Configuration

### Environment Variables (Optional)

Add to `.env` for customization:

```env
# Rate Limiting Configuration
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
AUTH_RATE_LIMIT_MAX=5
PAYMENT_RATE_LIMIT_MAX=10
```

### Customization Example

```javascript
import { createCustomLimiter } from './middleware/rateLimiter.js';

// Create a custom limiter
const customLimiter = createCustomLimiter(
  10 * 60 * 1000,  // 10 minutes
  50,              // 50 requests
  'Custom rate limit exceeded'
);

router.post('/custom-endpoint', customLimiter, handler);
```

## Rate Limit Headers

When rate limiting is active, the following headers are returned:

```
RateLimit-Limit: 100           # Maximum requests allowed
RateLimit-Remaining: 45        # Requests remaining
RateLimit-Reset: 1234567890    # Unix timestamp when limit resets
```

Clients can use these headers to implement intelligent retry logic.

## Error Handling

### Client-Side Handling

**Frontend Example**:
```javascript
try {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.status === 429) {
    const data = await response.json();
    // Show user-friendly message
    alert('Too many login attempts. Please wait 15 minutes.');
    
    // Get retry-after from headers
    const retryAfter = response.headers.get('Retry-After');
    console.log(`Retry after ${retryAfter} seconds`);
  }
} catch (error) {
  console.error('Request failed:', error);
}
```

### Best Practices for Clients

1. **Check headers**: Use `RateLimit-Remaining` to know when to slow down
2. **Implement backoff**: Wait before retrying after 429 errors
3. **Cache responses**: Reduce unnecessary API calls
4. **Batch requests**: Combine multiple operations when possible

## Production Deployment

### Single Server
The default in-memory store works fine for single-server deployments.

### Multiple Servers (Load Balanced)

For production with multiple servers, use a distributed store like Redis:

#### Install Redis Store

```bash
npm install rate-limit-redis redis
```

#### Update rateLimiter.js

```javascript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

await redisClient.connect();

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:', // Redis key prefix
  }),
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

#### Redis Setup (Docker)

```yaml
# docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

## Testing Rate Limits

### Manual Testing

```bash
# Test auth rate limiter (should fail after 5 attempts)
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    -v
  echo "Attempt $i"
done
```

### Automated Testing

```javascript
// test/rateLimiter.test.js
import request from 'supertest';
import app from '../server.js';

describe('Rate Limiting', () => {
  test('should block after 5 failed login attempts', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrong' });
    }

    // 6th attempt should fail with 429
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });

    expect(response.status).toBe(429);
    expect(response.body.message).toContain('Too many');
  });
});
```

## Monitoring

### Logging Rate Limit Hits

Add custom logging when rate limits are hit:

```javascript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  handler: (req, res) => {
    console.warn(`Rate limit exceeded: ${req.ip} - ${req.path}`);
    
    res.status(429).json({
      status: 429,
      message: 'Too many requests, please try again later.',
    });
  },
});
```

### Analytics

Track rate limit hits in your monitoring system:

```javascript
import { sendToAnalytics } from './analytics.js';

export const apiLimiter = rateLimit({
  handler: (req, res) => {
    sendToAnalytics('rate_limit_hit', {
      ip: req.ip,
      path: req.path,
      timestamp: new Date(),
    });
    
    res.status(429).json({ /* ... */ });
  },
});
```

## Bypass for Trusted IPs

Skip rate limiting for internal services or trusted IPs:

```javascript
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) => {
    const trustedIPs = ['192.168.1.1', '10.0.0.1'];
    return trustedIPs.includes(req.ip);
  },
});
```

## Security Considerations

### IP Spoofing
If behind a proxy (nginx, AWS ALB), ensure you trust the proxy headers:

```javascript
// In server.js
app.set('trust proxy', 1); // Trust first proxy
```

### Distributed Attacks
For sophisticated attacks from multiple IPs, consider:
- Using user-based rate limiting (instead of IP)
- Implementing CAPTCHA after multiple failures
- Using Web Application Firewall (WAF)

### Bot Detection
Combine rate limiting with bot detection:
```javascript
import { isSuspiciousBot } from './botDetection.js';

const stricterLimiter = rateLimit({
  max: (req) => {
    return isSuspiciousBot(req) ? 10 : 100;
  },
});
```

## Troubleshooting

### Issue: Legitimate users getting blocked

**Solution**: 
- Increase rate limits
- Use authenticated rate limiting (higher limits for logged-in users)
- Implement request batching on frontend

### Issue: Rate limits reset too frequently

**Solution**: Increase `windowMs` duration

### Issue: Different users sharing same IP

**Solution**: 
- Use user-based rate limiting after authentication
- Combine IP + User ID for rate limit key

```javascript
export const userBasedLimiter = rateLimit({
  keyGenerator: (req) => {
    return req.user ? req.user._id : req.ip;
  },
});
```

## Best Practices

1. ✅ **Start conservative**: Begin with lower limits and adjust based on usage
2. ✅ **Monitor closely**: Track rate limit hits in production
3. ✅ **Inform users**: Show clear error messages with retry time
4. ✅ **Different limits**: Apply stricter limits to sensitive endpoints
5. ✅ **Use Redis**: For multi-server production deployments
6. ✅ **Test thoroughly**: Ensure limits don't affect legitimate usage
7. ✅ **Document limits**: Inform API consumers about rate limits
8. ✅ **Graceful degradation**: Return useful error messages

## Summary

### Implemented Rate Limiters

| Endpoint Type | Limit | Window | Purpose |
|--------------|-------|--------|---------|
| General API | 100 | 15 min | Overall protection |
| Login | 5 | 15 min | Brute force prevention |
| Registration | 3 | 1 hour | Spam prevention |
| Payments | 10 | 15 min | Fraud prevention |
| Submissions | 30 | 1 hour | Abuse prevention |
| AI Calls | 20 | 1 hour | Cost control |
| File Uploads | 20 | 1 hour | Storage abuse prevention |
| Email | 10 | 1 hour | Spam prevention |
| Search | 50 | 15 min | Database protection |

### Security Impact

✅ **Mitigates**:
- Brute force attacks
- DDoS attacks
- API abuse
- Resource exhaustion
- Spam and fake accounts
- Payment fraud

❌ **Does NOT protect against**:
- Distributed attacks from many IPs (need WAF)
- Application-level vulnerabilities
- SQL injection or XSS attacks

## Additional Resources

- [express-rate-limit Documentation](https://github.com/express-rate-limit/express-rate-limit)
- [OWASP Rate Limiting](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [Redis Rate Limiting Patterns](https://redis.io/docs/reference/patterns/rate-limiting/)
