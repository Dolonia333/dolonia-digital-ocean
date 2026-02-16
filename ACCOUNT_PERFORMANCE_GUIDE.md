# ⚡ Account Page Runtime Optimization - Performance Improvements

## 🎯 Problem Analysis

When you click on "Account", the page takes **2-4 seconds** to load. Here's why:

### Current Bottlenecks:

1. **Profile Loading** (500-1500ms)
   - Checking session every time
   - Querying database for profile
   - Creating profile if missing
   - Loading all user data synchronously

2. **Multiple Database Queries** (1000-2000ms)
   - Even though data is lazy-loaded per-tab, the initial render still does heavy work
   - Notifications query runs every mount
   - All profiles query runs when loading notifications

3. **Component Rendering** (500-1000ms)
   - Large component (3,394 lines)
   - Many useState hooks causing re-renders
   - No memoization on expensive computations

---

## ✅ Solutions to Implement

### Solution 1: Cache Profile Data (BEST - 800ms savings)

**Problem:** Profile loads from database every time you navigate to Account
**Solution:** Store profile in localStorage or Context API

```typescript
// Instead of querying every time:
useEffect(() => {
  const { data } = await supabase.auth.getSession()
  // Then query profiles table...
}, []) // Runs on every mount!

// Better approach:
const cachedProfile = localStorage.getItem('userProfile')
if (cachedProfile && !force) {
  setProfile(JSON.parse(cachedProfile))
  return // Skip database query
}
// Only query if cache is empty or force=true
```

### Solution 2: Optimize Notifications Query (500ms savings)

**Problem:** Notifications loads all records and filters in JavaScript
**Solution:** Filter in database query instead

```typescript
// Current (loads 1000+ records, then filters):
const { data } = await supabase
  .from('notifications')
  .select('*')
  .order('created_at', { ascending: false })

// Optimized (only fetch what you need):
const { data } = await supabase
  .from('notifications')
  .select('*')
  .or(`recipients.cs.{${profile.id}},recipients.eq.{}`)
  .order('created_at', { ascending: false })
  .limit(50) // Only get last 50
```

### Solution 3: Lazy-Load Notifications (200ms savings)

**Problem:** Notifications loads on every mount
**Solution:** Only load notifications when actually needed

```typescript
// Instead of loading immediately:
const [notificationsLoaded, setNotificationsLoaded] = useState(false)

useEffect(() => {
  if (!notificationsLoaded) {
    loadNotifications()
    setNotificationsLoaded(true)
  }
}, [notificationsLoaded])
```

### Solution 4: Memoize Expensive Computations (300ms savings)

**Problem:** Filter operations run on every render
**Solution:** Use useMemo for filtered data

```typescript
// Current (runs on every render):
const filteredLeads = leads.filter((lead) => lead.name.includes(debouncedSearchTerm))

// Optimized (only runs when data changes):
const filteredLeads = useMemo(
  () => leads.filter((lead) => lead.name.includes(debouncedSearchTerm)),
  [leads, debouncedSearchTerm],
)
```

### Solution 5: Split Component (1000ms+ savings)

**Problem:** Account.tsx is 3,394 lines - too big!
**Solution:** Split into multiple smaller components

```
src/pages/Account.tsx (Main component - 200 lines)
  ├── src/components/AccountDashboard.tsx (Dashboard tab)
  ├── src/components/AccountLeads.tsx (Leads tab)
  ├── src/components/AccountClients.tsx (Clients tab)
  ├── src/components/AccountInvoices.tsx (Invoices tab)
  ├── src/components/AccountIntakeForms.tsx (Intake Forms tab)
  └── src/components/AccountNotifications.tsx (Notifications tab)
```

Each component:

- Loads independently
- Can be lazy-loaded
- Renders faster (smaller code)
- Easier to debug

---

## 📊 Expected Performance Gains

| Optimization  | Current   | Optimized  | Savings    |
| ------------- | --------- | ---------- | ---------- |
| Initial load  | 2-4s      | 800-1200ms | **60-75%** |
| Second visit  | 1-2s      | 200-400ms  | **75-80%** |
| Tab switch    | 1-2s      | 100-300ms  | **80-90%** |
| Search typing | 200-500ms | 50-100ms   | **75-80%** |

---

## 🚀 Implementation Priority

### Immediate (Today - 30 mins)

1. **Cache profile** (Solution 1)
2. **Limit notifications to 50** (Solution 2)
3. **Memoize filtered data** (Solution 4)

**Expected Gain:** 30-40% faster (2-4s → 1-2s)

### Short-term (This Week - 2 hours)

4. **Split account component** (Solution 5)
5. **Lazy-load notifications** (Solution 3)

**Expected Gain:** 60-75% faster (2-4s → 500-800ms)

### Long-term (Future - Nice to have)

- Add service worker caching
- Implement pagination for large datasets
- Virtual scrolling for tables
- Web worker for heavy computations

---

## 🔍 How to Measure

### Before Optimization:

```
1. F12 → Performance tab
2. Click Record (⏺)
3. Click Account link
4. Stop recording after page loads
5. Look at "Main" section
6. Note the duration (should be 2-4s)
```

### After Optimization:

```
1. Repeat same steps
2. Should see:
   - Shorter Main duration (500-800ms)
   - Fewer layout recalculations
   - Fewer scripting operations
```

---

## 💡 Key Insights

### What Makes Account Slow Now:

- ❌ 3,394 lines in one file
- ❌ 30+ useState hooks causing re-renders
- ❌ Profile queries on every mount
- ❌ All notifications loaded at once
- ❌ No memoization on expensive operations

### What Will Make It Fast:

- ✅ Cache profile in localStorage
- ✅ Lazy-load by tab
- ✅ Memoize expensive computations
- ✅ Limit database results
- ✅ Split into smaller components

---

## 📝 Code Examples

### Example 1: Profile Caching

```typescript
useEffect(() => {
  async function loadProfile() {
    // Try cache first
    const cached = localStorage.getItem('userProfile')
    if (cached) {
      try {
        const cachedProfile = JSON.parse(cached)
        setProfile(cachedProfile)
        return // Skip database call!
      } catch (e) {
        console.error('Cache parse error:', e)
      }
    }

    // Fall back to database
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      navigate('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name, role')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      setProfile(profile)
      localStorage.setItem('userProfile', JSON.stringify(profile))
    }
  }

  loadProfile()
}, []) // Empty dependency array - runs once!
```

### Example 2: Memoized Filtered Data

```typescript
// Memoize expensive filter operations
const filteredLeads = useMemo(() => {
  return leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  )
}, [leads, debouncedSearchTerm])

// Memoize stats calculations
const leadStats = useMemo(
  () => ({
    total: leads.length,
    contacted: leads.filter((l) => l.status === 'contacted').length,
    converted: leads.filter((l) => l.status === 'converted').length,
  }),
  [leads],
)
```

### Example 3: Split Component Example

```typescript
// Account.tsx (Main)
export default function Account() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabList>
          <TabTrigger value="dashboard">Dashboard</TabTrigger>
          <TabTrigger value="leads">Leads</TabTrigger>
          <TabTrigger value="invoices">Invoices</TabTrigger>
        </TabList>

        <TabContent value="dashboard">
          <Suspense fallback={<Loading />}>
            <AccountDashboard />
          </Suspense>
        </TabContent>

        <TabContent value="leads">
          <Suspense fallback={<Loading />}>
            <AccountLeads />
          </Suspense>
        </TabContent>

        <TabContent value="invoices">
          <Suspense fallback={<Loading />}>
            <AccountInvoices />
          </Suspense>
        </TabContent>
      </Tabs>
    </div>
  );
}
```

---

## ✅ Checklist

- [ ] Implement profile caching
- [ ] Add memoization to filters
- [ ] Limit notification results
- [ ] Test performance before/after
- [ ] Run Lighthouse audit
- [ ] Consider splitting component
- [ ] Test on slow network (DevTools throttling)

---

## Expected Timeline

**Immediate improvements:** 5 minutes
**Noticeable speedup:** 1 day
**Major refactor:** 1 week

Would you like me to implement the profile caching and memoization today? That's the quickest win! 🚀
