# 🚀 LibroFlow Deployment Guide

Complete step-by-step guide to deploy LibroFlow to Netlify.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] GitHub/GitLab account
- [ ] MongoDB Atlas account (free)
- [ ] Gmail account for SMTP
- [ ] Netlify account (free)

## Step 1: MongoDB Atlas Setup (5 minutes)

### 1.1 Create MongoDB Cluster

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for free account
3. Create a new project (e.g., "LibroFlow")
4. Click "Build a Database"
5. Choose **FREE** M0 tier
6. Select a cloud provider and region (closest to you)
7. Name your cluster (e.g., "libroflow-cluster")
8. Click "Create"

### 1.2 Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: \`libroflow_user\`
5. Password: Generate a secure password (save it!)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.3 Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### 1.4 Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace \`<password>\` with your database user password
6. Replace \`<dbname>\` with \`libroflow\`

Example:
\`\`\`
mongodb+srv://libroflow_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/libroflow?retryWrites=true&w=majority
\`\`\`

## Step 2: Gmail SMTP Setup (3 minutes)

### 2.1 Enable 2-Step Verification

1. Go to https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click and follow steps to enable it

### 2.2 Generate App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select app: "Mail"
3. Select device: "Other (Custom name)"
4. Enter: "LibroFlow"
5. Click "Generate"
6. Copy the 16-character password (save it!)

## Step 3: Prepare Your Code

### 3.1 Clone/Download Project

\`\`\`bash
# If you have the code locally
cd libroflow

# Or clone from repository
git clone <your-repo-url>
cd libroflow
\`\`\`

### 3.2 Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3.3 Test Locally (Optional)

Create \`.env\` file:
\`\`\`env
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-random-secret-key-min-32-chars
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
APP_URL=http://localhost:8888
LOAN_PERIOD_DAYS=14
FINE_PER_DAY=1
\`\`\`

Run locally:
\`\`\`bash
npm run functions:dev
\`\`\`

Visit http://localhost:5173

## Step 4: Deploy to Netlify

### Option A: Deploy via GitHub (Recommended)

#### 4.1 Push to GitHub

\`\`\`bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/libroflow.git
git push -u origin main
\`\`\`

#### 4.2 Connect to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" (authorize if needed)
4. Select your repository
5. Configure build settings:
   - **Build command:** \`npm run build\`
   - **Publish directory:** \`dist\`
   - **Functions directory:** \`netlify/functions\`
6. Click "Deploy site"

### Option B: Deploy via Netlify CLI

\`\`\`bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
\`\`\`

## Step 5: Configure Environment Variables

### 5.1 Add Variables in Netlify

1. Go to your site in Netlify Dashboard
2. Click "Site settings"
3. Click "Environment variables" in left sidebar
4. Click "Add a variable"

Add these variables one by one:

| Variable | Value | Example |
|----------|-------|---------|
| \`MONGODB_URI\` | Your MongoDB connection string | \`mongodb+srv://user:pass@cluster.mongodb.net/libroflow\` |
| \`JWT_SECRET\` | Random 32+ character string | \`your-super-secret-jwt-key-change-this\` |
| \`EMAIL_HOST\` | \`smtp.gmail.com\` | \`smtp.gmail.com\` |
| \`EMAIL_PORT\` | \`587\` | \`587\` |
| \`EMAIL_USER\` | Your Gmail address | \`your-email@gmail.com\` |
| \`EMAIL_PASSWORD\` | Your Gmail App Password | \`abcd efgh ijkl mnop\` |
| \`APP_URL\` | Your Netlify site URL | \`https://your-site.netlify.app\` |
| \`LOAN_PERIOD_DAYS\` | \`14\` | \`14\` |
| \`FINE_PER_DAY\` | \`1\` | \`1\` |

### 5.2 Redeploy

After adding variables:
1. Go to "Deploys" tab
2. Click "Trigger deploy" → "Deploy site"

## Step 6: Create Librarian Account

### 6.1 Generate Password Hash

Create a file \`hash-password.js\`:
\`\`\`javascript
const bcrypt = require('bcryptjs');
const password = 'admin123'; // Change this!
bcrypt.hash(password, 10).then(hash => console.log(hash));
\`\`\`

Run:
\`\`\`bash
node hash-password.js
\`\`\`

Copy the output hash.

### 6.2 Insert Librarian in MongoDB

1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Select \`libroflow\` database
4. Click "Create Collection" → Name it \`users\`
5. Click "Insert Document"
6. Paste this JSON (replace the password hash):

\`\`\`json
{
  "name": "Admin Librarian",
  "email": "admin@libroflow.com",
  "password": "$2a$10$YOUR_HASHED_PASSWORD_HERE",
  "studentId": "LIB001",
  "role": "librarian",
  "verified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
\`\`\`

7. Click "Insert"

### 6.3 Create Collections

Create these empty collections in MongoDB:
- \`books\`
- \`transactions\`
- \`tokens\`

## Step 7: Test Your Deployment

### 7.1 Test Student Flow

1. Visit your Netlify URL
2. Click "Register"
3. Fill in details and submit
4. Check email for verification link
5. Click verification link
6. Login with credentials
7. Browse books (will be empty initially)

### 7.2 Test Librarian Flow

1. Visit your Netlify URL
2. Click "Login"
3. Use librarian credentials:
   - Email: \`admin@libroflow.com\`
   - Password: (the one you used to generate hash)
4. Access "Librarian" menu
5. Add some sample books
6. Test borrowing as student

## Step 8: Add Sample Books (Optional)

### Via Librarian Dashboard

1. Login as librarian
2. Go to "Librarian" → "Manage Books"
3. Click "Add Book"
4. Fill in details:
   - Title: "The Great Gatsby"
   - Author: "F. Scott Fitzgerald"
   - ISBN: "9780743273565"
   - Category: "Fiction"
   - Total: 5
   - Available: 5

### Via MongoDB (Bulk Insert)

1. Go to MongoDB Atlas → Collections
2. Select \`books\` collection
3. Click "Insert Document"
4. Use this sample:

\`\`\`json
[
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "9780743273565",
    "category": "Fiction",
    "total": 5,
    "available": 5,
    "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
  },
  {
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "isbn": "9780061120084",
    "category": "Fiction",
    "total": 3,
    "available": 3,
    "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
  },
  {
    "title": "1984",
    "author": "George Orwell",
    "isbn": "9780451524935",
    "category": "Fiction",
    "total": 4,
    "available": 4,
    "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
  }
]
\`\`\`

## Troubleshooting

### Issue: Functions not working

**Solution:**
1. Check Netlify Function logs: Site → Functions → Click function → View logs
2. Verify all environment variables are set
3. Redeploy the site

### Issue: Email not sending

**Solution:**
1. Verify Gmail App Password is correct (no spaces)
2. Check if 2-Step Verification is enabled
3. Try generating a new App Password

### Issue: MongoDB connection failed

**Solution:**
1. Verify connection string is correct
2. Check if IP whitelist includes 0.0.0.0/0
3. Ensure database user has correct permissions
4. Test connection string locally first

### Issue: "Unauthorized" errors

**Solution:**
1. Check if JWT_SECRET is set in Netlify
2. Clear browser cache and cookies
3. Try logging in again

### Issue: Build fails

**Solution:**
1. Check build logs in Netlify
2. Verify package.json has all dependencies
3. Try building locally: \`npm run build\`

## Custom Domain (Optional)

1. Go to Netlify Dashboard → Domain settings
2. Click "Add custom domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 24 hours)

## Monitoring & Maintenance

### Check Function Logs
- Netlify Dashboard → Functions → Select function → Logs

### Monitor Usage
- Netlify Dashboard → Analytics
- MongoDB Atlas → Metrics

### Backup Database
- MongoDB Atlas → Clusters → ... → Export Data

## Security Checklist

- [ ] Changed default librarian password
- [ ] JWT_SECRET is random and secure (32+ chars)
- [ ] Gmail App Password is used (not regular password)
- [ ] Environment variables are set in Netlify (not in code)
- [ ] MongoDB IP whitelist is configured
- [ ] HTTPS is enabled (automatic on Netlify)

## Next Steps

1. Customize branding and colors
2. Add more book categories
3. Configure email templates
4. Set up custom domain
5. Add more librarian accounts
6. Import your book catalog

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Netlify function logs
3. Check MongoDB Atlas logs
4. Review the README.md file

---

🎉 **Congratulations!** Your LibroFlow system is now live on Netlify!

Your site URL: https://your-site.netlify.app
