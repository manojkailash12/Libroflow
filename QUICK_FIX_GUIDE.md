# 🚨 Quick Fix Guide - Login Not Working

## 🎯 Start Here

### Run This Command First:
```bash
npm run diagnose
```

This will tell you EXACTLY what's wrong!

---

## 🔧 Fix Based on Error

### Error: "Invalid credentials"

**Cause:** Wrong password or user doesn't exist

**Fix:**
```bash
# Check if librarian exists
npm run check-librarian

# If not found, create one
npm run create-librarian
```

---

### Error: "Login failed" (Status 500)

**Cause:** Server error (usually MongoDB or env vars)

**Fix:**

1. **Check MongoDB Atlas:**
   - Go to MongoDB Atlas → Network Access
   - Add IP: `0.0.0.0/0` (Allow from anywhere)

2. **Check Netlify Env Vars:**
   - Netlify Dashboard → Site Settings → Environment Variables
   - Make sure these exist:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - `EMAIL_HOST`
     - `EMAIL_PORT`
     - `EMAIL_USER`
     - `EMAIL_PASSWORD`

3. **Redeploy:**
   - Netlify Dashboard → Deploys → Trigger deploy

---

### Error: "Function not found" (Status 404)

**Cause:** Functions not deployed or wrong URL

**Fix:**

1. Check `netlify.toml` exists and has:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. Redeploy:
   ```bash
   npm run deploy
   ```

---

### Error: "Network Error" or "CORS Error"

**Cause:** Wrong URL or site not deployed

**Fix:**

1. Check your site URL in `.env`:
   ```env
   SITE_URL=https://your-actual-site.netlify.app
   ```

2. Make sure site is deployed:
   - Go to Netlify Dashboard
   - Check if latest deploy is successful

---

### Error: "Please verify your email first"

**Cause:** Account not verified

**Fix:**

For librarian account, run:
```bash
npm run check-librarian
```

If `Verified: false`, you need to verify the account.

Get OTP:
```bash
npm run get-otp
```

Then verify on the site.

---

### Error: "Your librarian account is pending approval"

**Cause:** Librarian not approved

**Fix:**

The librarian account needs to be approved. Run:
```bash
npm run check-librarian
```

If `Approved: false`, you need to manually approve in database or create a new librarian with approved status.

---

## 📋 Checklist (Do These in Order)

### ✅ Step 1: Update Site URL
Edit `.env`:
```env
SITE_URL=https://your-actual-netlify-url.netlify.app
```

### ✅ Step 2: Check Netlify Env Vars
Go to: Netlify Dashboard → Site Settings → Environment Variables

Make sure ALL these are set:
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] EMAIL_HOST
- [ ] EMAIL_PORT
- [ ] EMAIL_USER
- [ ] EMAIL_PASSWORD

### ✅ Step 3: Check MongoDB Network Access
Go to: MongoDB Atlas → Network Access

Make sure `0.0.0.0/0` is allowed

### ✅ Step 4: Redeploy
After adding env vars, ALWAYS redeploy:
- Netlify Dashboard → Deploys → Trigger deploy

### ✅ Step 5: Check Librarian Exists
```bash
npm run check-librarian
```

Should show:
- ✓ Verified: true
- ✓ Approved: true

### ✅ Step 6: Test Login
```bash
npm run diagnose
```

---

## 🎯 Most Common Issue

**90% of the time, it's one of these:**

1. ❌ **Forgot to add env vars in Netlify**
   → Go to Netlify Dashboard → Environment Variables

2. ❌ **Added env vars but didn't redeploy**
   → Trigger a new deploy

3. ❌ **MongoDB doesn't allow Netlify IPs**
   → Add 0.0.0.0/0 to Network Access

4. ❌ **Wrong password**
   → Default is `admin123` for librarian

---

## 🔍 Debug in Browser

1. Open your site
2. Press `F12` (DevTools)
3. Go to **Network** tab
4. Try to login
5. Look for `/api/auth-login` request
6. Check the status code:
   - **200** = Success ✅
   - **401** = Wrong password
   - **403** = Not verified/approved
   - **500** = Server error (check Netlify logs)
   - **404** = Function not found

---

## 📞 Need More Help?

### View Netlify Function Logs:
1. Netlify Dashboard → Functions
2. Click `auth-login`
3. Try to login
4. Watch for errors in real-time

### Run Full Diagnostics:
```bash
npm run diagnose
```

### Test All Endpoints:
```bash
npm run test-deployed
```

---

## 💡 Pro Tips

- Always check Netlify function logs for detailed errors
- Use browser DevTools Network tab to see API responses
- Test locally first with `netlify dev`
- After changing env vars, ALWAYS redeploy
- MongoDB must allow 0.0.0.0/0 for Netlify to connect

---

**Still stuck?** Run `npm run diagnose` and share the output!
