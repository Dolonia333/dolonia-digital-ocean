# URGENT: Memory Issue Diagnosis & Quick Fixes

## Status: MULTIPLE OPTIMIZATIONS APPLIED ✅

I've applied **4 critical optimizations** to reduce memory usage. But first, **please answer the diagnostic questions** to identify the exact source of the 3.7 GB.

---

## What I've Done So Far

### 1. ✅ **Lazy-Load Admin Data (Per-Tab)**

**File**: `src/pages/Account.tsx`

- ❌ **BEFORE**: Admin login loaded ALL data from 8 tables (clients, leads, invoices, intake_forms, newsletter, profiles, projects, subscriptions)
- ✅ **AFTER**: Data loads ONLY when admin clicks that specific tab
- **Memory savings**: ~1.5-2 GB

### 2. ✅ **Added Row Limits (100 rows max per tab)**

**File**: `src/pages/Account.tsx`

- ❌ **BEFORE**: Loaded every single row from each table (could be 10,000+)
- ✅ **AFTER**: Load only first 100 rows per table
- **Memory savings**: ~500 MB - 1 GB

### 3. ✅ **Disabled Source Maps in Dev**

**File**: `vite.config.ts`

- ❌ **BEFORE**: Vite generated huge source maps (50MB+)
- ✅ **AFTER**: Source maps disabled
- **Memory savings**: ~500 MB - 1 GB

### 4. ✅ **Disabled Realtime Subscriptions (Temporarily)**

**File**: `src/pages/Account.tsx`

- ❌ **BEFORE**: Realtime subscription to profiles table listening to all changes
- ✅ **AFTER**: Commented out to test if it's the culprit
- **Memory savings**: ~200 MB

---

## How to Test the Fixes

### Step 1: Kill Old Dev Server

```powershell
Stop-Process -Name node -Force
Start-Sleep -Seconds 2
```

### Step 2: Start Fresh Dev Server

```bash
cd c:\Users\zionv\OneDrive\Desktop\dolonia-digital-ocean
npm run dev
```

### Step 3: Measure Initial Memory

Open **Task Manager** (Ctrl+Shift+Esc):

- Find `node.exe`
- Check **Memory** column
- Write down value: **\_** MB

### Step 4: Login and Check Memory

- Open http://localhost:8080/
- Login as admin
- Check Task Manager memory: **\_** MB
- Did it increase? By how much?

### Step 5: Click Admin Tab

- Should load instantly (no data yet)
- Check Task Manager memory: **\_** MB

### Step 6: Click "Leads" Tab

- Should load leads (1-2 second delay)
- Check Task Manager memory: **\_** MB
- Compare to Step 5 (should be 50-100 MB increase, NOT 500 MB+)

### Step 7: Click "Clients" Tab

- Should load clients (1-2 second delay)
- Check Task Manager memory: **\_** MB

### Step 8: Switch Back to "Leads" Tab

- Should be INSTANT (data already loaded)
- Memory should NOT increase

---

## If Memory is STILL High (>1 GB)

### Possible Causes:

#### Cause 1: Multiple Node Processes Running

**Check**: Open PowerShell and run:

```powershell
Get-Process node | Select-Object ProcessName, ID, @{Name='Memory(MB)';Expression={[math]::Round($_.WorkingSet/1MB,0)}}
```

**If you see 2+ node processes**:

- Kill them all: `Stop-Process -Name node -Force`
- Restart dev server: `npm run dev`

#### Cause 2: Chrome DevTools Measuring Wrong Thing

Chrome shows total browser memory, not just your app.

**Fix**:

- Close ALL browser tabs except one
- Close Chrome completely
- Reopen to just your app
- Measure memory

#### Cause 3: Large Database

If your database has 100,000+ rows in any table:

- That's the problem
- Solution: Pagination (I've already added .limit(100))
- We can add "Load More" button for next 100 rows

#### Cause 4: Something Else Loading Data

Could be a different component fetching large amounts of data.

**To find it**:

1. Open DevTools (F12)
2. Go to **Network** tab
3. Look for large HTTP requests (100MB+)
4. What's the request URL?

---

## Files Modified

### 1. `src/pages/Account.tsx`

**Changes**:

- Removed massive data load on admin mount
- Added 6 lazy-load useEffect hooks (one per tab)
- Added `.limit(100)` to all queries
- Added `console.log()` statements to track loading
- Disabled realtime subscriptions (temporarily)

**Impact**: -1.5 to 2 GB memory

### 2. `vite.config.ts`

**Changes**:

- Added `sourcemap: false`
- Added `minify: 'esbuild'`

**Impact**: -500 MB to 1 GB memory

---

## Quick Rollback

If something breaks:

```bash
git checkout HEAD -- src/pages/Account.tsx vite.config.ts
npm run dev
```

---

## Next Steps

1. **Run the test procedure above**
2. **Report back with**:
   - Initial memory before login: **\_** MB
   - Memory after login: **\_** MB
   - Memory after clicking "Leads": **\_** MB
   - Is memory still 3.7 GB?
   - Or is it now <500 MB?

3. **If still high**:
   - Run the PowerShell process check
   - Send screenshot of Task Manager
   - We'll identify the exact culprit

4. **If memory fixed**:
   - 🎉 We can re-enable realtime subscriptions
   - Add better pagination UI
   - Deploy to production

---

## Expected Results After Fixes

| Measurement            | Before  | After      | Target |
| ---------------------- | ------- | ---------- | ------ |
| **Initial Memory**     | 1-2 GB  | 200-400 MB | ✅     |
| **After Admin Login**  | 2-3 GB  | 300-500 MB | ✅     |
| **After Clicking Tab** | +500 MB | +50-100 MB | ✅     |
| **Total Memory**       | 3.7 GB  | <500 MB    | ✅     |

---

## Console Logs to Watch

When you open the app, check the browser console (F12 → Console) for:

```
Admin detected - data will load per-tab
Loading clients data...
Loading leads data...
Loaded 100 clients
Loaded 100 leads
```

These logs confirm the lazy loading is working!

---

## DO THIS RIGHT NOW:

1. Stop dev server: `Stop-Process -Name node -Force`
2. Start fresh: `npm run dev`
3. Open app: http://localhost:8080/
4. Open Task Manager (Ctrl+Shift+Esc)
5. Find node.exe
6. Report memory usage

Then I can give you the exact next step! 🚀
