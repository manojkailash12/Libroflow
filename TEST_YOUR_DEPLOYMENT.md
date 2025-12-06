# 🧪 Test Your Deployed Site

## Quick Start (3 Steps)

### Step 1: Update Your Site URL
Edit `.env` file and replace with your actual Netlify URL:
```env
SITE_URL=https://your-actual-site.netlify.app
```

### Step 2: Run Diagnostics
```bash
npm run diagnose
```

This will:
- ✅ Check if your site is accessible
- ✅ Test login functionality
- ✅ Verify authentication
- ✅ Show exactly what's wrong (if anything)

### Step 3: Fix Issues (if any)

The diagnostic script will tell you exactly what to fix!

---

## All Available Test Commands

```bash
# Quick diagnosis (recommended first)
npm run diagnose

# Full test suite (tests all endpoints)
npm run test-deployed

# Verify all functions are properly structured
npm run verify-functions

# Check if librarian account exists
npm run check-librarian

# Create librarian if missing
npm run create-librarian
```

---

## What to Check in Netlify Dashboard

### 1. Build Status
- Go to: **Deploys** tab
- Check: Latest deploy is successful (green checkmark)
- If failed: Click on deploy → View build log

### 2. Functions
- Go to: **Functions** tab
- Check: All functions are listed (should see ~30+ functions)
- Click any function to see logs

### 3. Environment Variables
- Go to: **Site settings** → **Environment variables**
- Check these are set:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `EMAIL_HOST`
  - `EMAIL_PORT`
  - `EMAIL_USER`
  - `EMAIL_PASSWORD`

⚠️ **After adding/changing env vars, you MUST redeploy!**

---

## Manual Browser Test

### 1. Open Your Site
Visit your Netlify URL

### 2. Open DevTools
Press `F12` (or right-click → Inspect)

### 3. Go to Network Tab
This shows all API requests

### 4. Try to Login
**Librarian Account:**
- Email: `libroflow8@gmail.com`
- Password: `admin123`

### 5. Check the Request
In Network tab, find `/api/auth-login`:
- **Status 200** = Success ✅
- **Status 401** = Wrong password ❌
- **Status 403** = Not verified/approved ❌
- **Status 500** = Server error ❌
- **Status 404** = Function not found ❌

### 6. Check Console Tab
Look for any red error messages

---

## Common Issues & Solutions

### ❌ Login shows "Login failed"

**Run diagnostics first:**
```bash
npm run diagnose
```

**Common causes:**
1. **Wrong password** → Check with: `npm run check-librarian`
2. **MongoDB not accessible** → Add 0.0.0.0/0 to Network Access
3. **Missing env vars** → Check Netlify dashboard
4. **Didn't redeploy after env vars** → Trigger new deploy

### ❌ "Function not found" (404)

**Solution:**
1. Check `netlify.toml` has redirects
2. Verify functions are in `netlify/functions` folder
3. Trigger a new deploy

### ❌ "Network Error" in browser

**Check:**
1. Is your site URL correct?
2. Is the site deployed and live?
3. Check browser console for CORS errors

### ❌ "Invalid credentials" but password is correct

**Check database:**
```bash
npm run check-librarian
```

If no librarian found:
```bash
npm run create-librarian
```

---

## MongoDB Atlas Setup

### Allow Netlify Access

1. Go to MongoDB Atlas
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Choose **Allow Access from Anywhere**
5. Enter: `0.0.0.0/0`
6. Click **Confirm**

⚠️ This allows connections from any IP (including Netlify)

---

## Netlify Function Logs (Real-time Debugging)

### View Logs:
1. Go to Netlify Dashboard
2. Click **Functions**
3. Click on `auth-login` (or any function)
4. You'll see real-time logs

### Test and Watch:
1. Keep the logs page open
2. Try to login on your site
3. Watch for errors in the logs
4. Errors will show MongoDB issues, missing env vars, etc.

---

## Complete Testing Checklist

After login works, test these:

### User Features
- [ ] Dashboard shows stats
- [ ] Books page loads
- [ ] Can borrow a book
- [ ] Can return a book
- [ ] Borrow history works
- [ ] Profile page loads
- [ ] Can change password

### Librarian Features
- [ ] Librarian dashboard
- [ ] Add/edit/delete books
- [ ] View all users
- [ ] Approve users
- [ ] Analytics page
- [ ] Export data

### Email Features
- [ ] Registration sends OTP
- [ ] Forgot password sends OTP

---

## Still Not Working?

### 1. Test Locally First
```bash
netlify dev
```

If it works locally but not on Netlify:
→ Environment variables are the issue

### 2. Compare Env Vars
- Check `.env` file (local)
- Check Netlify dashboard (production)
- Make sure they match!

### 3. Check Build Log
- Netlify Dashboard → Deploys → Latest deploy
- Look for errors during build
- Check for missing dependencies

### 4. Ask for Help
Include this info:
- Output of `npm run diagnose`
- Netlify function logs (screenshot)
- Browser console errors (screenshot)
- Your Netlify site URL

---

## Pro Tips

✅ **Always redeploy after changing env vars**
✅ **Check function logs for detailed errors**
✅ **Use browser DevTools Network tab**
✅ **Test locally with `netlify dev` first**
✅ **Keep MongoDB Network Access open (0.0.0.0/0)**

---

## Quick Reference

```bash
# Diagnose issues
npm run diagnose

# Test all endpoints
npm run test-deployed

# Check librarian exists
npm run check-librarian

# Create librarian
npm run create-librarian

# Test locally
netlify dev

# Deploy to Netlify
npm run deploy
```

---

**Need more help?** See `DEPLOYMENT_CHECKLIST.md` for detailed troubleshooting!
