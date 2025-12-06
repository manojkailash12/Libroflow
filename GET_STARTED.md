# 🚀 Get Started with LibroFlow

Welcome to LibroFlow! This guide will help you get started quickly.

## 📚 What is LibroFlow?

LibroFlow is a complete library management system that runs on Netlify (serverless) with MongoDB. It's built with React and JavaScript - **no Python required!**

## 🎯 Choose Your Path

### 🏃 Quick Start (15 minutes)
**Best for:** Getting it running ASAP
- Follow **QUICKSTART.md**
- Minimal explanation, maximum speed
- Perfect for testing or demos

### 📖 Detailed Setup (30 minutes)
**Best for:** Understanding everything
- Follow **DEPLOYMENT.md**
- Step-by-step with explanations
- Perfect for production deployment

### 🔧 Local Development
**Best for:** Developers who want to customize
- Follow instructions below
- Test locally before deploying
- Perfect for adding features

## 🏃 Quick Start Path

If you want to get started immediately:

1. **Read QUICKSTART.md** - 15-minute setup guide
2. **Use CHECKLIST.md** - Track your progress
3. **Deploy and test** - Get it live!

## 📖 Detailed Setup Path

If you want to understand everything:

1. **Read README.md** - Understand features
2. **Read DEPLOYMENT.md** - Follow detailed steps
3. **Use CHECKLIST.md** - Verify each step
4. **Read FEATURES.md** - Explore all features

## 🔧 Local Development Path

### Prerequisites
```bash
# Check Node.js version (need 18+)
node --version

# Check npm
npm --version
```

### Setup Steps

1. **Install dependencies**
```bash
npm install
```

2. **Generate JWT secret**
```bash
npm run generate-jwt
# Copy the output
```

3. **Hash a password for librarian**
```bash
npm run hash-password
# Enter password when prompted
# Copy the hash
```

4. **Create .env file**
```bash
# Copy the example
cp .env.example .env

# Edit .env with your values
# - Add MongoDB URI
# - Add JWT secret (from step 2)
# - Add Gmail credentials
# - Set APP_URL to http://localhost:8888
```

5. **Setup MongoDB**
- Create free cluster at mongodb.com/cloud/atlas
- Create database user
- Whitelist all IPs (0.0.0.0/0)
- Get connection string
- Create `libroflow` database
- Create collections: `users`, `books`, `transactions`, `tokens`

6. **Create librarian account**
- Go to MongoDB Atlas → Browse Collections
- Select `users` collection
- Insert document:
```json
{
  "name": "Admin",
  "email": "admin@libroflow.com",
  "password": "PASTE_HASH_FROM_STEP_3",
  "studentId": "LIB001",
  "role": "librarian",
  "verified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

7. **Run locally**
```bash
npm run functions:dev
```

8. **Open browser**
- Visit http://localhost:5173
- Login with librarian credentials
- Add some books
- Test features

9. **Deploy when ready**
```bash
# Via Netlify CLI
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod

# Or push to GitHub and deploy via Netlify dashboard
```

## 📁 Important Files

### Documentation
- **README.md** - Main documentation
- **DEPLOYMENT.md** - Deployment guide
- **QUICKSTART.md** - Quick setup
- **FEATURES.md** - Feature list
- **PROJECT_SUMMARY.md** - Architecture
- **CHECKLIST.md** - Deployment checklist
- **GET_STARTED.md** - This file

### Configuration
- **.env.example** - Environment variables template
- **netlify.toml** - Netlify configuration
- **vite.config.js** - Vite configuration
- **package.json** - Dependencies

### Scripts
- **scripts/hash-password.js** - Generate password hash
- **scripts/generate-jwt-secret.js** - Generate JWT secret
- **scripts/sample-data.json** - Sample books

## 🎯 What to Do First?

### If you're a student/user:
1. Wait for your librarian to set up the system
2. Register when the site is live
3. Verify your email
4. Start browsing and borrowing books!

### If you're a librarian/admin:
1. Choose Quick Start or Detailed Setup path
2. Follow the guide step by step
3. Use the checklist to track progress
4. Test everything before inviting users
5. Share the site URL with your users

### If you're a developer:
1. Clone the repository
2. Follow Local Development path
3. Read PROJECT_SUMMARY.md for architecture
4. Explore the code
5. Customize as needed
6. Deploy when ready

## 🆘 Need Help?

### Common Questions

**Q: Do I need to know Python?**
A: No! This is 100% JavaScript (React + Node.js)

**Q: How much does it cost?**
A: $0 to start! Uses free tiers of Netlify and MongoDB Atlas

**Q: Can I use my own domain?**
A: Yes! Configure it in Netlify dashboard

**Q: How do I add books?**
A: Login as librarian → Manage Books → Add Book

**Q: How do I create more librarians?**
A: Insert documents in MongoDB `users` collection with role: "librarian"

**Q: Can students register themselves?**
A: Yes! They click Register, fill the form, and verify email

**Q: What if email doesn't work?**
A: Check Gmail App Password, verify 2FA is enabled, check Netlify logs

**Q: How do I backup data?**
A: MongoDB Atlas → Clusters → ... → Export Data

**Q: Can I customize the design?**
A: Yes! Edit files in `src/` folder and redeploy

**Q: How do I update the code?**
A: Pull latest changes, commit, push to Git, Netlify auto-deploys

### Troubleshooting

**Site not loading?**
- Check Netlify deployment status
- Verify build succeeded
- Check browser console for errors

**Functions not working?**
- Check Netlify function logs
- Verify environment variables are set
- Check MongoDB connection

**Email not sending?**
- Verify Gmail App Password
- Check EMAIL_USER and EMAIL_PASSWORD
- Review function logs

**Can't login?**
- Verify account is verified (check MongoDB)
- Check password is correct
- Try password reset

**Books not showing?**
- Add books via Librarian → Manage Books
- Or insert in MongoDB `books` collection
- Check function logs for errors

### Where to Get Help

1. **Check documentation** - README.md, DEPLOYMENT.md
2. **Review checklist** - CHECKLIST.md
3. **Check logs** - Netlify function logs, MongoDB logs
4. **Test locally** - Run `npm run functions:dev`
5. **Verify environment** - Check all variables are set

## 🎉 Success Checklist

You're ready to go when:
- ✅ Site is accessible
- ✅ Librarian can login
- ✅ Students can register
- ✅ Emails are working
- ✅ Books can be borrowed
- ✅ Books can be returned
- ✅ Fines are calculated
- ✅ Reports can be exported

## 🚀 Next Steps

After successful setup:

1. **Add books** - Import your catalog
2. **Invite users** - Share registration link
3. **Customize** - Update branding, colors
4. **Monitor** - Check Netlify and MongoDB dashboards
5. **Scale** - Upgrade when needed
6. **Enhance** - Add new features

## 📞 Quick Links

- [Netlify Dashboard](https://app.netlify.com)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Gmail App Passwords](https://myaccount.google.com/apppasswords)
- [React Docs](https://react.dev)
- [Netlify Docs](https://docs.netlify.com)

## 🎯 Recommended Reading Order

1. **GET_STARTED.md** (this file) - Choose your path
2. **QUICKSTART.md** or **DEPLOYMENT.md** - Setup guide
3. **CHECKLIST.md** - Track progress
4. **README.md** - Features and API
5. **FEATURES.md** - Complete feature list
6. **PROJECT_SUMMARY.md** - Architecture details

## 💡 Pro Tips

1. **Test locally first** - Catch issues early
2. **Use checklist** - Don't skip steps
3. **Save credentials** - Store securely
4. **Backup data** - Export MongoDB regularly
5. **Monitor usage** - Watch free tier limits
6. **Read logs** - They tell you what's wrong
7. **Start simple** - Add features gradually
8. **Document changes** - Track customizations

## 🎊 Welcome to LibroFlow!

You're about to deploy a complete, production-ready library management system. Whether you're setting it up for a school, organization, or personal use, LibroFlow has everything you need.

**Choose your path above and let's get started!** 🚀

---

**Questions? Check the documentation files or review the troubleshooting section above.**

**Ready to deploy? Start with QUICKSTART.md for the fastest path!**
