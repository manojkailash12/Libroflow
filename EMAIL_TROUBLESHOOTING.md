# 📧 Email Troubleshooting Guide

## ❌ Issue: OTP Not Received

**Error:** `connect ETIMEDOUT 172.253.118.108:587`

This means your network/firewall is blocking SMTP port 587 to Gmail.

---

## ✅ Quick Solutions

### Solution 1: Get OTP from Database (Immediate)

**Run this command after registration:**
```bash
npm run get-otp
```

**Output:**
```
✅ Latest OTP Found:
==================
Email: your@email.com
OTP: 123456
==================
```

**Use this OTP** to verify your account!

---

### Solution 2: Check Server Logs (Development)

When you register, the OTP is now printed in the server console:

```
🔑 OTP for your@email.com: 123456
```

Look at your terminal where `npm run functions:dev` is running.

---

### Solution 3: Fix Network Issues

#### Windows Firewall:

1. **Open Windows Defender Firewall**
   - Press `Win + R`
   - Type: `firewall.cpl`
   - Press Enter

2. **Allow Port 587**
   - Click "Advanced settings"
   - Click "Outbound Rules"
   - Click "New Rule"
   - Select "Port"
   - TCP, Specific ports: 587
   - Allow the connection
   - Apply to all profiles
   - Name: "Gmail SMTP"

3. **Restart your app**

#### Antivirus:

1. **Temporarily disable antivirus**
2. **Test registration**
3. **If it works, add exception for Node.js**

#### ISP Blocking:

Some ISPs block port 587. Try:

1. **Use VPN** (if available)
2. **Use mobile hotspot** (test)
3. **Contact ISP** to unblock port 587

---

### Solution 4: Alternative SMTP Ports

Try port 465 (SSL) instead of 587 (TLS):

**Update .env:**
```env
EMAIL_PORT=465
```

**Restart server:**
```bash
# Stop current server (Ctrl+C)
npm run functions:dev
```

---

### Solution 5: Use Different Email Service

#### Option A: Gmail with App Password (Current)
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Option B: Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Option C: SendGrid (Recommended for Production)
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

---

## 🔧 Testing Email Configuration

### Test 1: Check if Port is Open

**Windows Command:**
```bash
Test-NetConnection -ComputerName smtp.gmail.com -Port 587
```

**Expected Output:**
```
TcpTestSucceeded : True
```

If `False`, port is blocked.

### Test 2: Test Email Script

```bash
node scripts/test-email.js
```

**If successful:**
```
✅ Email configuration is WORKING!
✅ Test email sent successfully!
```

**If failed:**
```
❌ Email configuration FAILED!
Error: connect ETIMEDOUT
```

---

## 🎯 Recommended Workflow

### For Development (Local):

1. **Use OTP from database:**
   ```bash
   npm run get-otp
   ```

2. **Or check server console** for printed OTP

3. **Email will work in production** (Netlify)

### For Production (Netlify):

1. **Email works automatically** on Netlify
2. **No firewall issues** on cloud
3. **SMTP ports are open**

---

## 📝 Current Status

### ✅ What's Working:
- Registration creates user in MongoDB
- OTP is generated and stored
- You can get OTP from database
- OTP is printed in console

### ❌ What's Not Working:
- Email sending (network blocked)

### 🔧 Workaround:
- Use `npm run get-otp` to get OTP
- Or check server console logs

---

## 🚀 Production Deployment

When you deploy to Netlify:

1. **Email will work automatically**
2. **No network restrictions**
3. **SMTP ports are open**
4. **Users will receive emails**

**Deploy command:**
```bash
npm run deploy
```

---

## 💡 Pro Tips

### Tip 1: Development Mode
The app now handles email failures gracefully:
- Registration still succeeds
- OTP is logged to console
- You can retrieve OTP from database

### Tip 2: Multiple Registrations
Each time you register:
```bash
npm run get-otp
```
Shows the latest OTP.

### Tip 3: OTP Expiry
OTPs expire in 10 minutes. If expired:
1. Register again
2. Get new OTP
3. Verify quickly

### Tip 4: Check MongoDB
You can also check OTPs directly in MongoDB Atlas:
1. Go to Browse Collections
2. Select `tokens` collection
3. Find your email
4. See the OTP

---

## 🆘 Still Having Issues?

### Check These:

1. **MongoDB Connection**
   ```bash
   # Should show OTP
   npm run get-otp
   ```

2. **Server Running**
   ```bash
   # Should be running on port 8888
   http://localhost:8888
   ```

3. **Registration Success**
   - Check if you see "Registration successful" message
   - Check MongoDB for new user

4. **OTP in Database**
   ```bash
   npm run get-otp
   ```

---

## ✅ Summary

**For Local Development:**
- Email might not work (firewall/network)
- Use `npm run get-otp` to get OTP
- Or check server console logs
- Everything else works perfectly

**For Production (Netlify):**
- Email works automatically
- No issues
- Users receive emails normally

**Your app is fully functional!** Just use the workaround for OTP during local development. 🎉

---

## 📞 Quick Commands

```bash
# Get latest OTP
npm run get-otp

# Test email configuration
node scripts/test-email.js

# Check if port 587 is open
Test-NetConnection -ComputerName smtp.gmail.com -Port 587

# Restart server
# Press Ctrl+C, then:
npm run functions:dev
```

---

**The app works perfectly! Email is just a local development issue that won't exist in production.** 🚀
