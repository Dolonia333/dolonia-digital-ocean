# User Role System ✅ IMPLEMENTED

Your application now fully supports **four distinct user roles** with role-specific features!

## Role Definitions

### 1. **Admin** (Full Administrator)

- Complete platform access and control
- Can view and manage all data (clients, leads, projects, invoices, etc.)
- Can send notifications to all users
- Can view and respond to all support tickets
- **Can manage user roles** (promote/demote users)
- Access to analytics and reports
- Database configuration and management tools

### 2. **Team Member** (Staff/Limited Admin)

- Staff access to administrative features
- Can view and manage tickets
- Can send notifications
- Can view client data, projects, and analytics
- **Cannot manage user roles** (restricted feature)
- Cannot change critical system settings
- Ideal for support staff, project managers, etc.

### 3. **Client** (Customer)

- Access to client-specific dashboard
- Can view their own projects, invoices, and subscriptions
- Can submit support tickets
- Receives notifications from admin
- Limited to their own data only

### 3. **User** (General User)

- Similar to client but with potential for different permissions
- Can submit support tickets
- Receives notifications
- Lighter access than clients (useful for prospects, partners, etc.)

## Current Implementation

### Database

✅ Profiles table constraint supports all four roles:

```sql
CHECK ((role = ANY (ARRAY['admin'::text, 'team_member'::text, 'client'::text, 'user'::text])))
```

### TypeScript Types

✅ Updated in both:

- `src/pages/Account.tsx` - Profile type
- `src/integrations/supabase/types.ts` - Supabase types

### Access Control Logic

#### Admin Features (role === 'admin')

- All staff features PLUS:
- **User & Role Management** (can change any user's role)
- Full system control and settings

#### Team Member Features (role === 'team_member')

- Staff dashboard (`adminViewMode === 'admin'`)
- Lead velocity charts
- Client management (view/edit)
- Newsletter subscriber management
- Intake form management
- Full ticket management system
- Send notifications
- **Cannot change user roles**

#### Client Features (role === 'client')

- Client dashboard view
- Personal projects view
- Personal invoices and subscriptions
- Ticket submission via dedicated page
- Notifications from admin

#### User Features (role === 'user')

- Basic dashboard
- Ticket submission
- Notifications
- Can be extended for specific use cases

## How to Assign Roles

### Method 1: Database Direct (Supabase Dashboard)

1. Go to Supabase Dashboard → Table Editor
2. Open `profiles` table
3. Find the user row
4. Update the `role` column to 'admin', 'client', or 'user'

### Method 2: SQL Query

```sql
-- Make someone an admin
UPDATE profiles SET role = 'admin' WHERE id = 'user-id-here';

-- Make someone a team member
UPDATE profiles SET role = 'team_member' WHERE id = 'user-id-here';

-- Make someone a client
UPDATE profiles SET role = 'client' WHERE id = 'user-id-here';

-- Make someone a user
UPDATE profiles SET role = 'user' WHERE id = 'user-id-here';
```

### Method 3: During Account Creation

When creating new profiles programmatically, specify the role:

```typescript
await supabase.from('profiles').insert({
  id: userId,
  name: userName,
  role: 'client', // or 'admin', 'team_member', or 'user'
})
```

## Notification Targeting

The notification system can target:

- **all_users** - Sends to everyone (admin, team_member, client, user)
- **all_clients** - Sends only to clients
- **individual** - Sends to specific user IDs

## Permission Hierarchy

```
Admin (Full Control)
  ↓
Team Member (Staff Access, No User Management)
  ↓
Client (Customer Access)
  ↓
User (General/Prospect Access)
```

## Key Differences: Admin vs Team Member

| Feature                | Admin | Team Member |
| ---------------------- | ----- | ----------- |
| View Staff Dashboard   | ✅    | ✅          |
| Manage Tickets         | ✅    | ✅          |
| Send Notifications     | ✅    | ✅          |
| View Client Data       | ✅    | ✅          |
| View Analytics         | ✅    | ✅          |
| **Manage User Roles**  | ✅    | ❌          |
| Change System Settings | ✅    | ❌          |

## Future Enhancements

You can extend the role system by:

1. Adding role-specific features in the dashboard
2. Creating different ticket submission flows per role
3. Customizing notifications per role
4. Adding role-based analytics
5. Implementing role-based pricing/subscription tiers

## Files Modified

1. ✅ `src/pages/Account.tsx` - Profile type updated
2. ✅ `src/integrations/supabase/types.ts` - Supabase types updated
3. ✅ Database constraint - Already supports all three roles

## NEW FEATURES IMPLEMENTED

### 1. Role-Specific Quick Actions

- **Admin**: N/A (admin uses dedicated admin dashboard)
- **Client**: Submit Ticket, Request Update, View Invoices, Contact Manager
- **User**: Submit Ticket, Browse Services, Become a Client, Documentation

### 2. User & Role Management (Admin Only)

- View all users in a searchable table
- See current role for each user with visual badges
- Change user roles via dropdown (Admin/Client/User)
- Cannot change own role (security feature)
- Real-time updates with visual feedback
- Role descriptions and permissions guide

### 3. My Support Tickets (Users & Clients)

- View personal support tickets in dashboard
- Click tickets to view conversation threads
- Add messages/responses to tickets
- See ticket status with visual indicators
- Quick action to submit new tickets
- Shows ticket priority, category, and timestamps

### 4. Enhanced Ticket Management

- Admin sees all tickets with full management controls
- Users/Clients see only their own tickets
- Modal-based conversation threads work for all roles
- Role-specific placeholders and button text
- Status controls hidden from non-admins

The system is now ready to distinguish between admins (team members), clients (customers), and users (general users)!

## ⚡ LATEST UPDATE: Team Member Role Added

### What Changed:

- Added **Team Member** role for staff with limited permissions
- Admin can now assign 4 roles: Admin, Team Member, Client, User
- **User & Role Management is now Admin-only** (Team Members cannot access)
- Team Member badge styled in purple (���)
- Both Admin and Team Member can use Staff View
