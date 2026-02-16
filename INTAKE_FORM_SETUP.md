# Intake Form Implementation Guide

## What Was Built

Created a comprehensive multi-division intake form system spanning three business units:

- **Dolonia Data Tech** - Technology & Automation
- **Royal Society Management** - Media & Creative
- **1921 Holding Co.** - Business & Government Contracting

## Files Created/Modified

### New Files

1. **`src/pages/IntakeForm.tsx`** - Main intake form component with 4-step wizard
2. **`supabase-migration-intake-forms.sql`** - Database schema migration

### Modified Files

1. **`src/App.tsx`** - Added `/intake` route

## Database Setup Required

**IMPORTANT**: You must run the database migration before the form will work.

### Step 1: Run Migration in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open `supabase-migration-intake-forms.sql`
4. Copy the entire contents
5. Paste into SQL Editor
6. Click **Run**

### What the Migration Creates

- `intake_forms` table with comprehensive fields
- Division-specific JSONB columns (`tech_details`, `media_details`, `business_details`)
- Budget/timeline tracking
- Service tier recommendation fields
- Status workflow (new → reviewing → quoted → converted → archived)
- Row Level Security policies
- Indexes for performance

## Form Features

### 4-Step Wizard Flow

**Step 1: Basic Information**

- Full name, email, phone
- Preferred contact method (email/text/call)
- Budget range (under $1k, $1k-$3k, $3k-$10k, $10k+)
- Timeline (ASAP, this month, 1-3 months, long-term)
- Referral source

**Step 2: Division Selection**

- Visual cards for each division
- Icons and service descriptions
- Single selection required

**Step 3: Division-Specific Details**

- Custom questions based on selected division
- Currently shows basic service description field
- Ready for expansion with division-specific fields

**Step 4: Review & Submit**

- Summary of all collected information
- Final submission to Supabase
- Success/error toast notifications

### Division Structure

```
Dolonia Data Tech (dolonia_data_tech)
├── Websites & Apps
├── Cloud Infrastructure
├── AI Automation
└── Cybersecurity

Royal Society Management (royal_society)
├── Photography & Video
├── Editing & Production
├── Branding & Design
└── Social Media

1921 Holding Co. (1921_holding)
├── Business Startup
├── Funding & Grants
├── Government Contracts
└── Consulting
```

## Accessing the Form

Once the migration is run:

1. Navigate to `http://localhost:8080/intake`
2. Or add link to navigation: `<Link to="/intake">Get Started</Link>`

## Next Steps (Recommended Enhancements)

### 1. Expand Division-Specific Fields

**Dolonia Data Tech Questions:**

```tsx
- Current tech stack
- Integration requirements
- Hosting preferences
- Security compliance needs
- Team size/technical expertise
```

**Royal Society Questions:**

```tsx
- Content type (photo/video/design)
- Delivery format requirements
- Brand guidelines available?
- Target audience
- Usage rights needed
```

**1921 Holding Questions:**

```tsx
- Business structure
- Industry/sector
- Funding stage
- Government agency target
- Compliance requirements
```

### 2. Tier Recommendation Engine

Add logic in `handleSubmit` to calculate:

```tsx
const calculateTier = (budget: string, services: string[]) => {
  if (budget === '10k_plus') return 'Elite'
  if (budget === '3k_10k') return 'Standard'
  return 'Basic'
}

const estimateCost = (tier: string, services: string[]) => {
  // Calculate based on service complexity
}

const priorityScore = (timeline: string, budget: string) => {
  // Higher score for ASAP + high budget
}
```

### 3. Admin Dashboard View

Add to `Account.tsx`:

```tsx
<IntakeFormsManager />
```

Features needed:

- List all intake submissions
- Filter by division, status, date
- Assign to team members
- Add notes/follow-up tasks
- Mark as quoted/converted
- Email templates for responses

### 4. Email Notifications

Options:

- **Supabase Edge Function** - Send email on new submission
- **Zapier/Make.com** - Webhook integration
- **Resend/SendGrid** - Direct API integration

### 5. Service Focus Checkboxes

Replace single service field with multi-select:

```tsx
const techServices = [
  'Website Development',
  'Mobile App',
  'Cloud Migration',
  'AI Automation',
  'Cybersecurity Audit',
  'DevOps Setup',
]

// Render as checkboxes with updateFormData
```

### 6. Lead Scoring

Implement automatic lead qualification:

```tsx
const leadScore = {
  budget: budget === '10k_plus' ? 40 : budget === '3k_10k' ? 30 : 20,
  timeline: timeline === 'asap' ? 30 : 20,
  division: division === 'dolonia_data_tech' ? 30 : 25,
  // Total out of 100
}
```

## Database Schema

### Main Columns

```sql
id UUID PRIMARY KEY
full_name TEXT NOT NULL
company_name TEXT
email TEXT NOT NULL
phone TEXT
preferred_contact TEXT CHECK (email|text|call)
division TEXT CHECK (dolonia_data_tech|royal_society|1921_holding)
service_category TEXT
service_focus TEXT[]
budget_range TEXT CHECK (under_1k|1k_3k|3k_10k|10k_plus)
timeline TEXT CHECK (asap|this_month|1_3_months|long_term)
referral_source TEXT
```

### JSONB Fields (Flexible Schema)

```sql
tech_details JSONB -- For Dolonia Data Tech
media_details JSONB -- For Royal Society
business_details JSONB -- For 1921 Holding
```

### Recommendation Fields

```sql
recommended_tier TEXT
estimated_cost NUMERIC
priority_score INTEGER
```

### Workflow Fields

```sql
status TEXT CHECK (new|reviewing|quoted|converted|archived)
assigned_to UUID REFERENCES profiles(id)
notes TEXT
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

## RLS Policies

1. **Public Insert** - Anyone can submit intake forms
2. **User View Own** - Authenticated users see their submissions
3. **Admin Full Access** - Admins can manage all submissions

## Testing Checklist

- [ ] Run migration in Supabase
- [ ] Navigate to `/intake`
- [ ] Fill out Step 1 (basic info)
- [ ] Select a division in Step 2
- [ ] Add service details in Step 3
- [ ] Review and submit in Step 4
- [ ] Verify entry in Supabase `intake_forms` table
- [ ] Check toast notification appears
- [ ] Verify RLS policies work (test as public user)

## Troubleshooting

### "intake_forms table doesn't exist"

- Run the migration SQL in Supabase Dashboard

### Form submits but no data appears

- Check RLS policies are enabled
- Verify user has insert permission
- Check browser console for errors

### TypeScript errors

- After running migration, regenerate types:
  ```bash
  npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
  ```

## Integration Ideas

### Link from Homepage

```tsx
<Button asChild>
  <Link to="/intake">Start Your Project</Link>
</Button>
```

### Replace Contact Form

Update Contact page to redirect:

```tsx
<p>
  For detailed project inquiries, please use our
  <Link to="/intake">intake form</Link>
</p>
```

### Add to Navigation

In `Layout.tsx`:

```tsx
<Button variant="outline" asChild>
  <Link to="/intake">Get Started</Link>
</Button>
```

## Future Enhancements

1. **Multi-file Upload** - Allow users to attach project files
2. **Calendar Integration** - Schedule consultation directly
3. **Payment Deposit** - Capture initial deposit for serious inquiries
4. **Progress Tracking** - Client portal to track intake status
5. **Automated Workflows** - Trigger actions based on division/budget
6. **CRM Integration** - Sync with HubSpot, Salesforce, etc.
7. **Analytics** - Track conversion rates by division
8. **A/B Testing** - Optimize form fields for conversions

---

**Built**: Multi-division intake form with 4-step wizard
**Status**: Ready for testing after migration
**Route**: `/intake`
**Database**: Migration pending
