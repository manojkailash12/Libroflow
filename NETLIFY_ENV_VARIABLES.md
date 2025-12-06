# 🔐 Netlify Environment Variables Setup

## Complete List of Environment Variables for LibroFlow

Copy and paste these environment variables into your Netlify dashboard.

### How to Add Environment Variables in Netlify:

1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** for each one below
5. After adding all variables, click **Trigger deploy** → **Deploy site**

---

## Required Environment Variables

### 1. MongoDB Configuration

**Variable Name:** `MONGODB_URI`  
**Value:** `mongodb+srv://manoj:Manoj270105@cluster0.r7cpajr.mongodb.net/libroflow`  
**Description:** MongoDB Atlas connection string

---

### 2. JWT Secret

**Variable Name:** `JWT_SECRET`  
**Value:** `41f32648632772820681bf9cd9ae8d182a9ce1ca7bed5b31c9a8a8f73978bb9b`  
**Description:** Secret key for JWT token generation (keep this secure!)

---

### 3. Email Configuration (Gmail SMTP)

**Variable Name:** `EMAIL_HOST`  
**Value:** `smtp.gmail.com`  
**Description:** SMTP server for sending emails

**Variable Name:** `EMAIL_PORT`  
**Value:** `587`  
**Description:** SMTP port number

**Variable Name:** `EMAIL_USER`  
**Value:** `libroflow8@gmail.com`  
**Description:** Gmail address for sending emails

**Variable Name:** `EMAIL_PASSWORD`  
**Value:** `afha ifwi grgh kequ`  
**Description:** Gmail App Password (16-character password from Google)

---

### 4. Application URL

**Variable Name:** `APP_URL`  
**Value:** `https://your-site-name.netlify.app`  
**Description:** Your Netlify site URL (update after deployment)

⚠️ **IMPORTANT:** After your first deployment, update this with your actual Netlify URL!

---

### 5. Library Settings

**Variable Name:** `LOAN_PERIOD_DAYS`  
**Value:** `14`  
**Description:** Number of days a book can be borrowed

**Variable Name:** `FINE_PER_DAY`  
**Value:** `10`  
**Description:** Fine amount per day in Rupees (₹10)

**Variable Name:** `CURRENCY`  
**Value:** `INR`  
**Description:** Currency code (Indian Rupees)

**Variable Name:** `CURRENCY_SYMBOL`  
**Value:** `₹`  
**Description:** Currency symbol to display

**Variable Name:** `BOOK_DEPOSIT`  
**Value:** `50`  
**Description:** Refundable deposit amount in Rupees (₹50)

**Variable Name:** `FEEDBACK_URL`  
**Value:** `https://your-site-name.netlify.app/feedback`  
**Description:** URL for feedback page (update after deployment)

---

## Quick Copy-Paste Format

For easy copying, here's the list in a simple format:

```
MONGODB_URI=mongodb+srv://manoj:Manoj270105@cluster0.r7cpajr.mongodb.net/libroflow
JWT_SECRET=41f32648632772820681bf9cd9ae8d182a9ce1ca7bed5b31c9a8a8f73978bb9b
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=libroflow8@gmail.com
EMAIL_PASSWORD=afha ifwi grgh kequ
APP_URL=https://your-site-name.netlify.app
LOAN_PERIOD_DAYS=14
FINE_PER_DAY=10
CURRENCY=INR
CURRENCY_SYMBOL=₹
BOOK_DEPOSIT=50
FEEDBACK_URL=https://your-site-name.netlify.app/feedback
```

---

## Step-by-Step Deployment Process

### Step 1: Deploy to Netlify

1. Go to https://app.netlify.com
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub**
4. Select repository: `manojkailash12/Libroflow`
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
6. Click **Deploy site**

### Step 2: Add Environment Variables

1. While the site is deploying, go to **Site settings**
2. Click **Environment variables** in the left sidebar
3. Add each variable from the list above
4. Click **Save** after adding all variables

### Step 3: Update URLs

After your first deployment, you'll get a URL like: `https://libroflow-xyz123.netlify.app`

1. Go back to **Environment variables**
2. Update these two variables with your actual URL:
   - `APP_URL` → `https://libroflow-xyz123.netlify.app`
   - `FEEDBACK_URL` → `https://libroflow-xyz123.netlify.app/feedback`
3. Click **Save**

### Step 4: Redeploy

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete (2-3 minutes)

### Step 5: Create Librarian Account

You have two options:

#### Option A: Use MongoDB Atlas (Recommended)

1. Go to https://cloud.mongodb.com
2. Click **Browse Collections**
3. Select `libroflow` database → `users` collection
4. Click **Insert Document**
5. Paste this JSON:

```json
{
  "name": "Admin Librarian",
  "email": "libroflow8@gmail.com",
  "password": "$2a$10$YourHashedPasswordHere",
  "userId": "LIB001",
  "userType": "librarian",
  "role": "librarian",
  "verified": true,
  "approved": true,
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

To get the hashed password, run locally:
```bash
node scripts/hash-password.js
```

#### Option B: Register via UI

1. Visit your Netlify site
2. Click **Register**
3. Select **Librarian (Staff)** as user type
4. Fill in details and register
5. The first librarian is auto-approved

### Step 6: Add Sample Books

1. Login as librarian
2. Go to **Manage Books**
3. Click **Add Book** and add some books

OR run the script locally to add 15 sample books:
```bash
npm run add-books
```

---

## Testing Your Deployment

### Test Checklist:

- [ ] Site loads at your Netlify URL
- [ ] Can register a new student account
- [ ] Receive OTP email for verification
- [ ] Can verify email and login
- [ ] Can browse books
- [ ] Librarian can login
- [ ] Librarian can add/edit/delete books
- [ ] Librarian can manage users
- [ ] Students can borrow books
- [ ] Email notifications work
- [ ] Profile update works
- [ ] Password change works
- [ ] Logout works

---

## Troubleshooting

### Issue: Functions not working

**Solution:**
- Check Netlify Function logs: Site → Functions → Select function → View logs
- Verify all environment variables are set correctly
- Redeploy the site

### Issue: Email not sending

**Solution:**
- Verify `EMAIL_PASSWORD` is the App Password (not regular Gmail password)
- Check if 2-Step Verification is enabled on Gmail
- Generate a new App Password if needed

### Issue: Database connection failed

**Solution:**
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- Test connection string locally first

### Issue: "Unauthorized" errors

**Solution:**
- Check if `JWT_SECRET` is set in Netlify
- Clear browser cache and cookies
- Try logging in again

---

## Security Notes

⚠️ **IMPORTANT SECURITY REMINDERS:**

1. **Never commit .env file to GitHub** (it's already in .gitignore)
2. **Keep JWT_SECRET secure** - don't share it publicly
3. **Use Gmail App Password** - not your regular Gmail password
4. **MongoDB IP Whitelist** - ensure 0.0.0.0/0 is added for Netlify
5. **Change default passwords** - update librarian password after first login

---

## Custom Domain (Optional)

To use your own domain:

1. Go to Netlify Dashboard → **Domain settings**
2. Click **Add custom domain**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update `APP_URL` and `FEEDBACK_URL` environment variables with your custom domain
6. Redeploy the site

---

## Support

If you encounter any issues:

1. Check Netlify build logs
2. Check Netlify function logs
3. Review MongoDB Atlas logs
4. Check browser console for errors
5. Refer to DEPLOYMENT.md for detailed troubleshooting

---

## 🎉 Congratulations!

Your LibroFlow system is now deployed and accessible from anywhere!

**Your site will be live at:** `https://your-site-name.netlify.app`

No need to run `npm run` commands - everything runs automatically on Netlify! 🚀
