# Database Connection Verification Guide

## How to Tell if Your Supabase Database is Properly Connected

### 🔍 **Quick Check Method**

1. **Navigate to your website** at `http://localhost:8080/` (or your live URL)
2. **Login** to your account (create one if needed)
3. **Go to Account page** - you'll see a "Database Connection Verifier" section at the bottom
4. **Click "Run Full Database Test"** - this will check everything automatically

### ✅ **What You Should See for a Healthy Connection**

The verifier will test these components and show green checkmarks for success:

- **Auth Status**: ✅ "Logged in as: your@email.com"
- **Profile Access**: ✅ "Profile found: admin" (or role assigned)
- **Admin Permissions**: ✅ "Admin role confirmed - full access granted"
- **Database Tables**: ✅ All tables (leads, projects, subscriptions, invoices, clients) accessible
- **RLS Policies**: ✅ "RLS policies working correctly"
- **Real-time**: ✅ "Real-time subscriptions working"

### ⚠️ **Common Issues and Solutions**

#### 🔴 **Authentication Fails**

- **Problem**: "Auth error: Invalid JWT" or connection refused
- **Solution**: Check your `.env` file:
  ```
  VITE_SUPABASE_URL="your-supabase-url"
  VITE_SUPABASE_ANON_KEY="your-anon-key"
  ```

#### 🟡 **Profile Missing**

- **Problem**: "No profile found - may need to create one"
- **Solution**: The profile will auto-create when you visit /account page while logged in

#### 🟡 **Not Admin User**

- **Problem**: "Not an admin user - limited access"
- **Solution**: In your Supabase dashboard:
  1. Go to Table Editor → profiles
  2. Find your user record
  3. Set `role` field to `'admin'`

#### 🔴 **Tables Missing**

- **Problem**: "Table error: relation does not exist"
- **Solution**: Run the SQL schema in your Supabase project:
  1. Copy content from `supabase-schema.sql`
  2. Go to Supabase Dashboard → SQL Editor
  3. Paste and run the schema

#### 🟡 **RLS Too Restrictive**

- **Problem**: "RLS policies may be too restrictive"
- **Solution**: Run the RLS policies from `supabase-rls.sql`

### 📊 **Admin Panel Functionality Check**

After database verification passes, test these admin features:

1. **Dashboard Stats**: Should show real numbers from your database
2. **Client Management**: Can view/edit client records
3. **Project Tracking**: Projects display correctly
4. **Financial Data**: Invoices and subscriptions load
5. **Lead Management**: Contact form submissions appear

### 🔄 **After Updates**

When you update your NAS deployment:

1. **Database stays the same** - Supabase is cloud-hosted
2. **Environment variables** - Ensure `.env` is properly configured on NAS
3. **Re-run the verifier** - Check connection after each deployment
4. **Test admin functions** - Verify all dashboard features work

### 🛠️ **Environment Files for Different Setups**

Your project has multiple environment templates:

- **`.env`** - Current local development
- **`.env.nas-to-pc`** - NAS pointing to PC Supabase
- **`.env.local-option`** - Alternative local config
- **`.env.template`** - Clean template for new setups

Make sure you're using the right one for your deployment target.

### 🆘 **Troubleshooting Steps**

1. **Check Network Connection**: Can you reach your Supabase URL in browser?
2. **Verify API Keys**: Are they correct and not expired?
3. **Test in Incognito**: Rules out browser cache issues
4. **Check Browser Console**: Look for error messages
5. **Run the Database Verifier**: Use the automated tool in /account

### 📱 **Quick Health Check Commands**

You can also test connection via browser console:

```javascript
// Test basic connection
fetch('YOUR_SUPABASE_URL/rest/v1/leads?select=count', {
  headers: {
    apikey: 'YOUR_ANON_KEY',
    Authorization: 'Bearer YOUR_ANON_KEY',
  },
})

// Check if authenticated
console.log(await supabase.auth.getUser())
```

### ✨ **Success Indicators**

Your database is fully connected and admin panel ready when:

- ✅ All verifier tests pass
- ✅ Dashboard shows real data (not "No data available")
- ✅ You can create/edit records
- ✅ Contact form submissions appear in leads
- ✅ Real-time updates work (new data appears without refresh)

The Database Connection Verifier automates all these checks - just run it after any deployment to ensure everything is working correctly!
