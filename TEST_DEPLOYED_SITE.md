# Testing Your Deployed Netlify Site

## Quick Test

1. **Update your Netlify URL** in `.env`:
   ```
   SITE_URL=https://your-actual-site.netlify.app
   ```

2. **Run the test script**:
   ```bash
   node scripts/test-deployed-site.js
   ```

## What Gets Tested

✅ Site accessibility
✅ Login endpoint
✅ Librarian authentication
✅ Auth verification
✅ Dashboard stats
✅ Books listing
✅ User registration

## Manual Testing Checklist

### 1. Check Netlify Deployment
- Go to your Netlify dashboard
- Check if the build succeeded
- Check the deploy log for errors

### 2. Check Environment Variables
In Netlify dashboard → Site settings → Environment variables, verify:
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USER`
- `EMAIL_PASSWORD`

### 3. Test Login on Live Site

**Librarian Account:**
- Email: `libroflow8@gmail.com`
- Password: `admin123`

**Steps:**
1. Open your deployed site
2. Click "Login"
3. Enter credentials
4. Check browser console (F12) for errors

### 4. Common Issues & Solutions

#### Issue: "Login failed" or "Network Error"

**Check 1: Functions are deployed**
- Go to Netlify dashboard → Functions
- Verify all functions are listed (auth-login, auth-me, etc.)

**Check 2: Environment variables**
- Ensure all env vars are set in Netlify
- Redeploy after adding env vars

**Check 3: MongoDB connection**
- Check if MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- Or add Netlify's IP ranges

**Check 4: CORS issues**
- Check browser console for CORS errors
- Functions should return proper headers

#### Issue: "Invalid credentials"

**Possible causes:**
1. Password is incorrect
2. User doesn't exist in database
3. Password hash doesn't match

**Solution:**
Run locally to verify:
```bash
node scripts/check-librarian.js
```

#### Issue: Functions not found (404)

**Check:**
1. `netlify.toml` has correct redirects
2. Functions are in `netlify/functions` folder
3. Redeploy the site

### 5. Test Each Feature

After successful login, test:

- [ ] Dashboard loads
- [ ] Books page shows books
- [ ] Can add a new book (librarian)
- [ ] Can borrow a book (user)
- [ ] Can return a book
- [ ] Profile page loads
- [ ] Analytics page works (librarian)
- [ ] User management works (librarian)

### 6. Check Netlify Function Logs

To see real-time errors:
1. Go to Netlify dashboard
2. Click on "Functions"
3. Click on a function (e.g., auth-login)
4. View the logs
5. Try logging in and watch for errors

### 7. Test with Browser DevTools

1. Open your site
2. Press F12 (DevTools)
3. Go to Network tab
4. Try to login
5. Check the request/response:
   - Request URL should be: `https://your-site.netlify.app/api/auth-login`
   - Status should be 200 (success) or 401 (wrong password)
   - Response should have JSON data

## Quick Fixes

### If login doesn't work:

1. **Check MongoDB connection string** in Netlify env vars
2. **Verify JWT_SECRET** is set in Netlify
3. **Check function logs** in Netlify dashboard
4. **Ensure librarian exists** by running: `node scripts/check-librarian.js`
5. **Try creating a new librarian**: `node scripts/create-first-librarian.js`

### If you see "Function not found":

1. Check `netlify.toml` redirects
2. Verify functions are in `netlify/functions`
3. Trigger a new deploy

### If you see CORS errors:

Add headers to your functions (already included in the code):
```javascript
return {
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  },
  body: JSON.stringify(data)
}
```

## Need More Help?

Run the automated test to get detailed diagnostics:
```bash
node scripts/test-deployed-site.js
```

This will test all major endpoints and show you exactly what's working and what's not.
