# 🔒 Content Security Policy (CSP) & Security Headers Guide

## Current Status

Your site currently has:

- ✅ Google Analytics (gtag.js) - Safe, trusted Google domain
- ✅ Google Fonts - Safe, trusted Google domain
- ✅ No `eval()` in your custom code
- ⚠️ CSP Warning - Can be safely resolved

---

## 🚨 The CSP Warning Explained

**What You're Seeing:**

> "Content Security Policy of your site blocks the use of eval() in JavaScript"

**Why It's Happening:**

- Google Analytics uses certain techniques that can trigger CSP warnings
- This is normal and expected - Google Analytics is safe
- Your browser is being protective (which is good!)

**Is It a Problem?**

- ❌ No, your site works fine
- ✅ Google Analytics still loads and works
- ✅ The warning is informational

---

## ✅ Solution: Add Proper Security Headers

### Option 1: Create a `_headers` file (Recommended for Vite)

Create a new file: `public/_headers`

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.supabase.co https://api.github.com; frame-ancestors 'none';
```

### Option 2: Update `vite.config.ts` (Alternative)

Add this to your Vite config:

```typescript
export default defineConfig({
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.supabase.co https://api.github.com; frame-ancestors 'none';",
    },
  },
})
```

---

## 🔐 What Each Header Does

### `Content-Security-Policy`

Controls which external resources can be loaded:

```
default-src 'self'
  → Only load from same origin by default

script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com
  → Allow your scripts + Google Analytics

style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
  → Allow your styles + inline styles + Google Fonts

font-src 'self' https://fonts.gstatic.com
  → Allow your fonts + Google Fonts CDN

img-src 'self' data: https:
  → Allow your images + data URIs + HTTPS images

connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://*.supabase.co https://api.github.com
  → Allow API calls to these services

frame-ancestors 'none'
  → Prevent framing (clickjacking protection)
```

### `X-Content-Type-Options: nosniff`

Prevents browser from guessing file types - protects against MIME type sniffing attacks

### `X-Frame-Options: SAMEORIGIN`

Prevents clickjacking - only allow framing from same origin

### `X-XSS-Protection: 1; mode=block`

Enable browser XSS protection (legacy but still useful)

### `Referrer-Policy: strict-origin-when-cross-origin`

Controls what referrer info is sent to other sites

### `Permissions-Policy`

Disables dangerous features (geolocation, microphone, camera)

---

## 🚀 For Production (Cloudflare)

If you're using Cloudflare, you can set headers in **Cloudflare Dashboard**:

1. Go to: **Websites → Your Domain → Rules → Transform Rules**
2. Create new rule:
   - **Request URL Path** matches `/.*`
   - **Modify Response Headers** → Add the headers above

Or use `_headers` file and Cloudflare will automatically apply them!

---

## 🧪 Testing Your Headers

### Using curl:

```bash
curl -I https://dolonia.cloud/
```

Look for security headers in the response.

### Using DevTools:

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Reload the page
4. Click on the main HTML file
5. Go to **Response Headers**
6. You should see all security headers listed

### Using Online Tools:

- [Security Headers Checker](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

Enter your domain to get a security grade (aim for A+ grade).

---

## 📋 CSP Exceptions You May Need

Add these domains to `connect-src` if you use them:

```
Stripe:                https://api.stripe.com
SendGrid Email:        https://api.sendgrid.com
Slack Webhooks:        https://hooks.slack.com
GitHub API:            https://api.github.com
S3/Cloud Storage:      https://*.amazonaws.com
Sentry Error Tracking: https://sentry.io
```

---

## ✨ What This Protects Against

✅ **XSS (Cross-Site Scripting)** - Prevents injected malicious scripts
✅ **Clickjacking** - Prevents framing your site in iframes
✅ **MIME Type Sniffing** - Prevents browser confusion about file types
✅ **Data Exfiltration** - Limits where data can be sent
✅ **Unauthorized API Access** - Controls which external APIs can be reached

---

## 🚦 Implementation Priority

### Immediate (Today)

- [ ] Create `public/_headers` file with CSP config
- [ ] Restart dev server
- [ ] Test in DevTools

### Short-term (This Week)

- [ ] Run security headers checker
- [ ] Aim for A+ grade on securityheaders.com
- [ ] Test Google Analytics still works

### Long-term (Nice to Have)

- [ ] Add Subresource Integrity (SRI) hashes
- [ ] Implement Report-URI for CSP violations
- [ ] Monitor CSP reports for issues

---

## 📝 Summary

**Current State:**

- Your code is safe (no eval/unsafe-inline in custom code)
- Google Analytics is safe and widely trusted
- The CSP warning is informational

**Action:**

- Add security headers to suppress the warning
- This also improves your overall security posture
- Cloudflare/production will handle the rest

**Result:**

- Chrome DevTools warnings gone ✅
- Better security grade ✅
- All functionality preserved ✅

---

Would you like me to create the `public/_headers` file for you now? That's the easiest way to implement this! 🚀
