# ⚡ LibroFlow - Quick Reference

## 🚀 Server Status
**URL:** http://localhost:8888
**Status:** ✅ Running
**Functions Loaded:** 21

---

## 👥 User Types

| Type | ID Format | Approval Required |
|------|-----------|-------------------|
| Student | STU001 | No |
| Faculty | FAC001 | No |
| Public | PUB001 | No |
| Librarian | LIB001 | Yes ⚠️ |

---

## 💰 Pricing (Indian Rupees)

| Item | Amount |
|------|--------|
| Book Deposit | ₹50 |
| Late Fine | ₹10/day |
| Default Loan | 14 days |

---

## 📧 Email Types (6 Total)

1. **Registration OTP** - Verify account
2. **Password Reset OTP** - Reset password
3. **Borrow Confirmation** - Quick notification
4. **Borrow Receipt** - Detailed receipt
5. **Due Date Reminder** - 2 days before
6. **Overdue Reminder** - When late
7. **Return + Feedback** - With refund details

---

## 🔑 Default Credentials

**Librarian (if created):**
- Email: admin@libroflow.com
- Password: admin123

---

## 🧪 Quick Test

### 1. Register Student
```
1. Go to /register
2. Select "Student"
3. Fill form
4. Get OTP via email
5. Verify OTP
6. Login
```

### 2. Borrow Book
```
1. Login as student
2. Go to /books
3. Click "Borrow"
4. Check 2 emails (confirmation + receipt)
```

### 3. Return Book
```
1. Go to /history
2. Click "Return"
3. Check email (receipt + feedback link)
```

---

## 🛠️ API Endpoints

### Public:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-otp`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Member:
- `GET /api/books`
- `POST /api/transactions/borrow`
- `POST /api/transactions/return`
- `GET /api/transactions/my-history`
- `POST /api/feedback/submit`

### Librarian:
- `GET /api/librarian/stats`
- `GET /api/librarian/books`
- `GET /api/librarian/users`
- `POST /api/librarian/approve-user`
- `GET /api/librarian/analytics`
- `POST /api/send-due-date-reminders`
- `POST /api/send-overdue-reminders`

---

## 📊 MongoDB Collections

1. **users** - User accounts
2. **books** - Book catalog
3. **transactions** - Borrow/return records
4. **tokens** - OTP tokens
5. **feedback** - User feedback

---

## 🔧 Environment Variables

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FINE_PER_DAY=10
BOOK_DEPOSIT=50
CURRENCY_SYMBOL=₹
```

---

## 🐛 Common Issues

### Registration Fails
- ✅ Check MongoDB connection
- ✅ Check email configuration
- ✅ Verify all fields filled

### Email Not Received
- ✅ Check spam folder
- ✅ Test: `node scripts/test-email.js`
- ✅ Verify Gmail App Password

### Cannot Login
- ✅ Verify email first
- ✅ Librarians need approval
- ✅ Check password

### No ₹ Symbol
- ✅ Check .env: CURRENCY_SYMBOL=₹
- ✅ Restart server
- ✅ Clear browser cache

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| README.md | Main docs |
| DEPLOYMENT.md | Deploy guide |
| INDIAN_LIBRARY_FEATURES.md | Indian features |
| COMPLETE_TESTING_GUIDE.md | Test all features |
| FINAL_SUMMARY.md | Complete summary |
| QUICK_REFERENCE.md | This file |

---

## ✅ Feature Status

| Feature | Status |
|---------|--------|
| Registration (All types) | ✅ |
| OTP Verification | ✅ |
| Librarian Approval | ✅ |
| Borrow Books | ✅ |
| Deposit System (₹50) | ✅ |
| Fine System (₹10/day) | ✅ |
| Custom Loan Period | ✅ |
| Email Notifications | ✅ |
| Due Date Reminders | ✅ |
| Overdue Reminders | ✅ |
| Feedback System | ✅ |
| Indian Rupee (₹) | ✅ |

---

## 🎯 Next Actions

1. ✅ Server running
2. ⏳ Create librarian in MongoDB
3. ⏳ Test registration
4. ⏳ Add sample books
5. ⏳ Test borrowing
6. ⏳ Test all features

---

## 📞 Quick Commands

### Test Email:
```bash
node scripts/test-email.js
```

### Generate Password Hash:
```bash
npm run hash-password
```

### Send Due Date Reminders:
```bash
curl -X POST http://localhost:8888/api/send-due-date-reminders
```

### Send Overdue Reminders:
```bash
curl -X POST http://localhost:8888/api/send-overdue-reminders
```

---

**LibroFlow is ready! 🎉**
**Open:** http://localhost:8888
