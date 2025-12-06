# ⚡ LibroFlow Quick Start Guide

Get LibroFlow running in 15 minutes!

## 🎯 What You'll Need

1. **MongoDB Atlas** (free) - Database
2. **Gmail Account** - For sending emails
3. **Netlify Account** (free) - Hosting
4. **5 minutes** - Setup time

## 📋 Quick Setup Checklist

### 1. MongoDB Atlas (2 minutes)

```
✅ Sign up at mongodb.com/cloud/atlas
✅ Create free M0 cluster
✅ Create database user
✅ Allow access from anywhere (0.0.0.0/0)
✅ Copy connection string
```

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/libroflow?retryWrites=true&w=majority
```

### 2. Gmail App Password (2 minutes)

```
✅ Enable 2-Step Verification
✅ Go to myaccount.google.com/apppasswords
✅ Generate app password for "Mail"
✅ Copy 16-character password
```

### 3. Deploy to Netlify (5 minutes)

#### Via GitHub (Recommended)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/libroflow.git
git push -u origin main
```

Then:
1. Go to app.netlify.com
2. "Add new site" → "Import from Git"
3. Select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
5. Click "Deploy"

#### Via Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### 4. Environment Variables (3 minutes)

In Netlify Dashboard → Site Settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/libroflow
JWT_SECRET=your-random-32-character-secret-key-here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
APP_URL=https://your-site.netlify.app
LOAN_PERIOD_DAYS=14
FINE_PER_DAY=1
```

**Then:** Trigger a new deploy!

### 5. Create Librarian Account (3 minutes)

#### Generate Password Hash

```bash
npm install
node scripts/hash-password.js
# Enter your password when prompted
# Copy the hash output
```

#### Insert in MongoDB

1. Go to MongoDB Atlas → Browse Collections
2. Create collection: `users`
3. Insert document:

```json
{
  "name": "Admin",
  "email": "admin@libroflow.com",
  "password": "PASTE_YOUR_HASH_HERE",
  "studentId": "LIB001",
  "role": "librarian",
  "verified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

#### Create Other Collections

Create these empty collections:
- `books`
- `transactions`
- `tokens`

## 🎉 You're Done!

Visit your Netlify URL and login:
- **Email:** admin@libroflow.com
- **Password:** (the one you hashed)

## 🚀 Next Steps

### Add Sample Books

1. Login as librarian
2. Go to "Librarian" → "Manage Books"
3. Click "Add Book" and fill in details

Or bulk import from `scripts/sample-data.json` in MongoDB.

### Test Student Flow

1. Logout
2. Click "Register"
3. Create student account
4. Verify email
5. Login and browse books

## 🔧 Common Issues

### Functions not working?
- Check Netlify Function logs
- Verify all environment variables are set
- Redeploy the site

### Email not sending?
- Verify Gmail App Password (no spaces)
- Check 2-Step Verification is enabled
- Try generating new App Password

### Can't connect to MongoDB?
- Verify connection string
- Check IP whitelist (0.0.0.0/0)
- Test connection locally first

## 📚 Full Documentation

- **README.md** - Complete feature list and API docs
- **DEPLOYMENT.md** - Detailed deployment guide
- **Troubleshooting** - See DEPLOYMENT.md

## 🎯 Default Credentials

**Librarian:**
- Email: admin@libroflow.com
- Password: (your chosen password)

**⚠️ Change the default password after first login!**

## 📞 Need Help?

1. Check DEPLOYMENT.md for detailed steps
2. Review Netlify function logs
3. Check MongoDB Atlas logs
4. Verify all environment variables

---

**Happy Library Managing! 📚**
