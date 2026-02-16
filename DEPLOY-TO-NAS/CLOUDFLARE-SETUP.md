# 🌐 Cloudflare Setup Guide for Dolonia.cloud

## ⚠️ Issue: Cloudflare Overriding Nginx CSP Headers

Your Nginx is configured correctly, but Cloudflare is overriding the Content Security Policy headers, blocking:

- Google Fonts
- Inline dark mode scripts
- External stylesheets

## ✅ Fix: Configure Cloudflare to Respect Your CSP

### Step 1: Disable Cloudflare Security Overrides

**Navigate to:** Security → WAF → Custom Rules

1. Click **Create Rule**
2. **Rule Name:** `Allow Dolonia CSP`
3. **Field:** `Hostname`
4. **Operator:** `equals`
5. **Value:** `dolonia.cloud`
6. **Then:** Choose action **Skip**
7. Check these boxes under "Skip components":
   - ✅ Browser Integrity Check
   - ✅ Managed Rules
   - ✅ Security Level
   - ✅ All remaining custom rules
8. **Save and Deploy**

---

### Step 2: Disable HTML/CSS Rewrites

**Navigate to:** SSL/TLS → Edge Certificates

Turn **OFF** these features (they rewrite your headers):

- ❌ Automatic HTTPS Rewrites
- ❌ Email Obfuscation

**Why:** These features can silently modify your HTML and override security headers.

---

### Step 3: Add Transform Rule for CSP (Recommended)

**Navigate to:** Rules → Transform Rules → Modify Response Headers

1. Click **Create Rule**
2. **Rule Name:** `Force Dolonia CSP`
3. **When incoming requests match:**
   - Field: `Hostname`
   - Operator: `equals`
   - Value: `dolonia.cloud`
4. **Then:** Modify response header
   - **Set static**
   - **Header name:** `Content-Security-Policy`
   - **Value:**
     ```
     default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://supabase.dolonia.cloud https://*.supabase.co wss://*.supabase.co https://www.googletagmanager.com; frame-ancestors 'self';
     ```
5. **Save and Deploy**

---

### Step 4: Clear Cloudflare Cache

**Navigate to:** Caching → Configuration

1. Click **Purge Everything**
2. Confirm purge
3. Wait 30 seconds

---

### Step 5: Test Your Site

1. Open **Incognito/Private Window**
2. Navigate to `https://dolonia.cloud`
3. Open **Developer Console** (F12)
4. Check for:
   - ✅ No CSP errors
   - ✅ Dark background visible
   - ✅ Google Fonts loaded
   - ✅ No blocked resources

**Hard refresh:** `Ctrl + Shift + F5` (Windows) or `Cmd + Shift + R` (Mac)

---

## 🔍 Troubleshooting

### Still seeing white background?

1. **Check Console:** Look for CSP violations
2. **Verify nginx.conf:** Make sure CSP header is present
3. **Check Cloudflare Rules:** Ensure they're deployed and active
4. **Clear cache again:** Both browser and Cloudflare

### Fonts not loading?

1. Check Network tab for blocked `fonts.googleapis.com` requests
2. Verify `style-src` and `font-src` in CSP include Google domains
3. Clear Cloudflare cache

### Supabase connection errors?

1. Verify `connect-src` includes:
   - `https://supabase.dolonia.cloud`
   - `https://*.supabase.co`
   - `wss://*.supabase.co` (for realtime)

---

## 📋 Quick Reference: What Each CSP Directive Does

| Directive                                                       | What It Allows                        |
| --------------------------------------------------------------- | ------------------------------------- |
| `default-src 'self' data: blob:`                                | Base policy: own domain + data URIs   |
| `script-src 'self' 'unsafe-inline' 'unsafe-eval'`               | React/Vite scripts + inline dark mode |
| `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` | Tailwind CSS + Google Fonts           |
| `font-src 'self' data: https://fonts.gstatic.com`               | Web fonts from Google                 |
| `img-src 'self' data: blob: https:`                             | All images (including external)       |
| `connect-src 'self' https://supabase...`                        | API calls to Supabase                 |
| `frame-ancestors 'self'`                                        | Prevents clickjacking                 |

---

## ✅ Expected Result

After following these steps, you should see:

```
https://dolonia.cloud
├── ✅ Dark background (matrix theme)
├── ✅ "DOLONIA" logo visible
├── ✅ Google Fonts loaded (Inter)
├── ✅ No CSP errors in console
├── ✅ Supabase connected
└── ✅ All features working
```

---

## 🚀 Next Steps After Fix

Once dark mode is working:

1. **Test all pages:** Login, Dashboard, Account, etc.
2. **Verify Supabase:** Check database connections
3. **Monitor Console:** Look for any new errors
4. **Set up monitoring:** Consider using Cloudflare Analytics

---

## 📞 Need Help?

If you're still seeing issues after following this guide:

1. Export your Cloudflare rules (Rules → Export)
2. Check your nginx logs: `docker logs dolonia-web`
3. Share console errors (F12 → Console tab)

Your Nginx is configured correctly - Cloudflare just needs to stop overriding it! 🎯
