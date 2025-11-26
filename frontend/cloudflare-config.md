# Cloudflare Configuration for RASS Academy
# This file contains recommended settings for Cloudflare CDN

# ================================================
# 1. CACHING RULES (Page Rules)
# ================================================

# Rule 1: Cache static assets aggressively
# URL Pattern: www.raasacademy.com/assets/*
# Cache Level: Cache Everything
# Edge Cache TTL: 1 month
# Browser Cache TTL: 1 year

# Rule 2: Cache images
# URL Pattern: www.raasacademy.com/images/*
# Cache Level: Cache Everything
# Edge Cache TTL: 1 month
# Browser Cache TTL: 1 year

# Rule 3: Bypass cache for API
# URL Pattern: www.raasacademy.com/api/*
# Cache Level: Bypass

# Rule 4: Cache sitemap and robots
# URL Pattern: www.raasacademy.com/sitemap.xml
# Cache Level: Cache Everything
# Edge Cache TTL: 1 day

# ================================================
# 2. TRANSFORM RULES
# ================================================

# Auto Minify: HTML, CSS, JavaScript - ENABLED
# Brotli Compression: ENABLED
# Early Hints: ENABLED (for preloading)
# Rocket Loader: ENABLED (defers JavaScript loading)
# Mirage: ENABLED (optimizes images for mobile)
# Polish: Lossless (optimize images)

# ================================================
# 3. SECURITY SETTINGS
# ================================================

# SSL/TLS: Full (Strict)
# Minimum TLS Version: TLS 1.2
# Automatic HTTPS Rewrites: ON
# Always Use HTTPS: ON
# HTTP Strict Transport Security (HSTS): 
#   - Max Age: 1 year (31536000 seconds)
#   - Include Subdomains: ON
#   - Preload: ON

# ================================================
# 4. FIREWALL RULES
# ================================================

# Block known bad bots
# Rate limiting for login page
# Challenge suspicious IPs

# ================================================
# 5. PERFORMANCE SETTINGS
# ================================================

# Browser Cache TTL: Respect Existing Headers
# Development Mode: OFF (for production)
# Caching Level: Standard

# ================================================
# 6. CDN CONFIGURATION (workers/edge functions)
# ================================================

# Example Cloudflare Worker for additional caching headers:

# addEventListener('fetch', event => {
#   event.respondWith(handleRequest(event.request))
# })
# 
# async function handleRequest(request) {
#   const response = await fetch(request)
#   const newResponse = new Response(response.body, response)
#   
#   // Add custom headers
#   const url = new URL(request.url)
#   const extension = url.pathname.split('.').pop()
#   
#   // Static assets - long cache
#   if (['js', 'css', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'woff', 'woff2'].includes(extension)) {
#     newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
#   }
#   
#   // HTML - no cache
#   if (extension === 'html' || url.pathname === '/' || !url.pathname.includes('.')) {
#     newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
#   }
#   
#   return newResponse
# }

# ================================================
# 7. DNS SETTINGS
# ================================================

# A Record: www.raasacademy.com -> Proxied (Orange Cloud)
# A Record: raasacademy.com -> Proxied (Orange Cloud)
# CNAME Record: cdn -> Cloudflare CDN

# ================================================
# 8. IMAGE OPTIMIZATION
# ================================================

# Polish: Lossless or Lossy (choose based on needs)
# WebP: ENABLED (automatic conversion)
# Mirage: ENABLED (mobile optimization)

# ================================================
# 9. RECOMMENDED CACHE-TAG HEADERS
# ================================================

# For programmatic cache purging, use Cache-Tags:
# Cache-Tag: static-assets
# Cache-Tag: images
# Cache-Tag: courses
# Cache-Tag: user-content

# ================================================
# 10. ANALYTICS & MONITORING
# ================================================

# Enable Web Analytics for real-time monitoring
# Enable Core Web Vitals tracking
# Set up alerts for error spikes
