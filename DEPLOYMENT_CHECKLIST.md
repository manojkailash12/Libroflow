# 🚀 Netlify Deployment Checklist

## Before Testing

### 1. Update Configuration
- [ ] Update `SITE_URL` in `.env` with your actual Netlify URL
  ```
  SITE_URL=https://your-actual-site.netlify.app
  ```

### 2. Verify Netlify Environment Variables
Go to Netlify Dashboard → Site Settings → Environment Variables

Required variables:
- [ ] `MONGODB_URI` - Your MongoDB connection string
- [ ] `JWT_SECRET` - Your JWT secret key
- [ ] `EMAIL_HOST` - smtp.gmail.com
- [ ] `EMAIL_PORT` - 587
- [ ] `EMAIL_USER` - Your Gmail address
- [ ] `EMAIL_PASSWORD` - Your Gmail app password

⚠️ **Important:** After adding/updating env vars, you MUST redeploy!

### 3. MongoDB Atlas Network Access
- [ ] Go to MongoDB Atlas → Network Access
- [ ] Add IP: `0.0.0.0/0` (Allow access from anywhere)
- [ ] Or add Netlify's IP ranges

## Run Diagnostics

### Quick Test (Recommended)
```bash
node scripts/diagnose-login.js
```

This will:
- ✅ Check if your site is accessible
- ✅ Test the login endpoint
- ✅ Verify authentication
- ✅ Check environment variables
- ✅ Show detailed error messages

### Full Test Suite
```bash
node scripts/test-deployed-site.js
```

This tests all major endpoints.

## Manual Testing

### 1. Open Your Site
Visit your Netlify URL in a browser

### 2. Open Browser DevTools
Press `F12` to open DevTools

### 3. Go to Network Tab
This will show all API requests

### 4. Try to Login
**Librarian credentials:**
- Email: `libroflow8@gmail.com`
- Password: `admin123`

### 5. Check for Errors

**In Network Tab:**
- Look for `/api/auth-login` request
- Check status code (should be 200)
- Check response data

**In Console Tab:**
- Look for any red error messages
- Check for CORS errors
- Check for network errors

## Common Issues & Quick Fixes

### ❌ "Login failed" or "Network Error"

**Fix 1: Check Netlify Functions**
1. Go to Netlify Dashboard → Functions
2. Verify functions are deployed
3. Click on `auth-login` function
4. Check the logs for errors

**Fix 2: Redeploy**
1. Go to Netlify Dashboard → Deploys
2. Click "Trigger deploy" → "Deploy site"
3. Wait for deployment to complete

**Fix 3: Check MongoDB**
1. Go to MongoDB Atlas
2. Check if cluster is running
3. Verify network access allows 0.0.0.0/0

### ❌ "Invalid credentials"

**Check if librarian exists:**
```bash
node scripts/check-librarian.js
```

**Create librarian if missing:**
```bash
node scripts/create-first-librarian.js
```

### ❌ Function returns 404

**Fix:**
1. Check `netlify.toml` has correct redirects
2. Verify functions are in `netlify/functions` folder
3. Redeploy the site

### ❌ CORS errors in browser

**This shouldn't happen** as functions include CORS headers.
If it does:
1. Check browser console for exact error
2. Verify you're using the correct URL
3. Clear browser cache

## Testing Checklist

After successful login, test these features:

### User Features
- [ ] Dashboard loads and shows stats
- [ ] Books page displays all books
- [ ] Can view book details
- [ ] Can borrow a book
- [ ] Can return a book
- [ ] Borrow history shows transactions
- [ ] Profile page loads
- [ ] Can update profile
- [ ] Can change password
- [ ] Logout works

### Librarian Features
- [ ] Librarian dashboard loads
- [ ] Can add new books
- [ ] Can edit books
- [ ] Can delete books
- [ ] Can view all users
- [ ] Can approve/reject users
- [ ] Analytics page works
- [ ] Can export data (books, fines, analytics)
- [ ] Can view all transactions

### Email Features
- [ ] Registration sends OTP email
- [ ] Forgot password sends OTP
- [ ] Overdue reminders work (if scheduled)

## Netlify Function Logs

To see real-time logs:
1. Go to Netlify Dashboard
2. Click "Functions"
3. Click on any function (e.g., `auth-login`)
4. View logs in real-time
5. Try the action (e.g., login) and watch for errors

## Still Having Issues?

### 1. Check Netlify Build Log
- Go to Deploys → Click latest deploy
- Check build log for errors
- Look for missing dependencies

### 2. Check Function Logs
- Functions → Click function name
- Look for runtime errors
- Check for MongoDB connection errors

### 3. Test Locally First
```bash
netlify dev
```
If it works locally but not on Netlify:
- Environment variables are different
- Check Netlify env vars match your .env

### 4. Common Mistakes
- ❌ Forgot to add env vars in Netlify
- ❌ Didn't redeploy after adding env vars
- ❌ MongoDB doesn't allow Netlify IPs
- ❌ Wrong MongoDB connection string
- ❌ Wrong password for librarian account

## Need Help?

Run the diagnostic script for detailed analysis:
```bash
node scripts/diagnose-login.js
```

It will tell you exactly what's wrong!
