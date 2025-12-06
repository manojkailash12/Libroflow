# 🧪 Complete Testing Guide - LibroFlow

## ✅ All Features Working

This guide will help you test every feature of LibroFlow.

---

## 📋 Pre-Testing Setup

### 1. Ensure Server is Running
```
Server: http://localhost:8888
Status: ✅ Running
```

### 2. MongoDB Collections Required
- `users` - User accounts
- `books` - Book catalog
- `transactions` - Borrow/return records
- `tokens` - OTP tokens
- `feedback` - User feedback

### 3. Environment Variables Set
```
✅ MONGODB_URI
✅ JWT_SECRET
✅ EMAIL_USER
✅ EMAIL_PASSWORD
✅ FINE_PER_DAY=10
✅ BOOK_DEPOSIT=50
✅ CURRENCY_SYMBOL=₹
```

---

## 🧪 Test Scenarios

### Test 1: Student Registration ✅

**Steps:**
1. Go to http://localhost:8888
2. Click "Register"
3. Fill in details:
   - Name: Test Student
   - Email: student@test.com
   - User Type: **Student**
   - Student ID: STU001
   - Password: test123
   - Confirm Password: test123
4. Click "Register"

**Expected Result:**
- ✅ Success message: "OTP sent to your email"
- ✅ Email received with 6-digit OTP
- ✅ OTP verification form appears

**Verify OTP:**
1. Check email for OTP
2. Enter OTP in form
3. Click "Verify OTP"

**Expected Result:**
- ✅ "Account verified successfully!"
- ✅ Redirected to login page

---

### Test 2: Faculty Registration ✅

**Steps:**
1. Click "Register"
2. Fill in details:
   - Name: Test Faculty
   - Email: faculty@test.com
   - User Type: **Faculty**
   - Faculty ID: FAC001
   - Password: test123
3. Submit and verify OTP

**Expected Result:**
- ✅ Registration successful
- ✅ OTP received and verified
- ✅ Can login

---

### Test 3: Public Member Registration ✅

**Steps:**
1. Click "Register"
2. Fill in details:
   - Name: Test Public
   - Email: public@test.com
   - User Type: **Public Member**
   - Member ID: PUB001
   - Password: test123
3. Submit and verify OTP

**Expected Result:**
- ✅ Registration successful
- ✅ Can login

---

### Test 4: Librarian Registration ✅

**Steps:**
1. Click "Register"
2. Fill in details:
   - Name: Test Librarian
   - Email: librarian@test.com
   - User Type: **Librarian (Staff)**
   - Staff ID: LIB002
   - Password: test123
3. Submit and verify OTP

**Expected Result:**
- ✅ Registration successful
- ✅ Note shown: "Librarian accounts require admin approval"
- ✅ OTP verified
- ⚠️ Cannot login yet (pending approval)

**Approve Librarian:**
1. Login as existing librarian (admin@libroflow.com)
2. Go to "Manage Users"
3. Find pending librarian
4. Click "Approve"

**Expected Result:**
- ✅ Status changes to "Approved"
- ✅ Email sent to librarian
- ✅ Librarian can now login

---

### Test 5: Login ✅

**Steps:**
1. Go to login page
2. Enter credentials:
   - Email: student@test.com
   - Password: test123
3. Click "Login"

**Expected Result:**
- ✅ Logged in successfully
- ✅ Redirected to dashboard
- ✅ Name shown in navbar

---

### Test 6: Add Books (Librarian) ✅

**Steps:**
1. Login as librarian
2. Go to "Librarian" → "Manage Books"
3. Click "Add Book"
4. Fill in details:
   - Title: The Great Gatsby
   - Author: F. Scott Fitzgerald
   - ISBN: 9780743273565
   - Category: Fiction
   - Total: 5
   - Available: 5
5. Click "Add"

**Expected Result:**
- ✅ Book added successfully
- ✅ Appears in book list

---

### Test 7: Borrow Book ✅

**Steps:**
1. Login as student
2. Go to "Books"
3. Find available book
4. Click "Borrow"

**Expected Result:**
- ✅ Success message shown
- ✅ **2 emails received:**
  1. **Confirmation Email:**
     - Book title
     - Due date
     - Deposit: ₹50
     - Fine: ₹10/day
  2. **Receipt Email:**
     - Transaction ID
     - All details
     - Deposit: ₹50
     - Loan period: 14 days
     - Fine policy: ₹10/day

**Verify in Database:**
- ✅ Transaction created
- ✅ Book available count decreased
- ✅ Deposit: 50
- ✅ FinePerDay: 10

---

### Test 8: Due Date Reminder ✅

**Steps:**
1. Manually call API:
```bash
curl -X POST http://localhost:8888/api/send-due-date-reminders
```

**Expected Result:**
- ✅ Email sent to users with books due in 2 days
- ✅ Email shows:
  - Book title
  - Due date
  - Days remaining (large display)
  - Fine warning: ₹10/day
  - Deposit reminder: ₹50

---

### Test 9: Overdue Reminder ✅

**Steps:**
1. Set a transaction as overdue in MongoDB:
```javascript
db.transactions.updateOne(
  { _id: ObjectId("...") },
  { $set: { dueDate: new Date("2024-01-01") } }
)
```

2. Call API:
```bash
curl -X POST http://localhost:8888/api/send-overdue-reminders
```

**Expected Result:**
- ✅ Email sent with:
  - Book title
  - Days overdue
  - **Current fine in ₹** (prominently displayed)
  - Deposit warning
  - Urgent return request

---

### Test 10: Return Book ✅

**Steps:**
1. Login as student
2. Go to "History"
3. Find borrowed book
4. Click "Return"

**Expected Result:**
- ✅ Success message
- ✅ **Email received with:**
  - Book title
  - Deposit paid: ₹50
  - Fine charged: ₹0 (if on time) or ₹X (if late)
  - **Deposit refund: ₹50** (or ₹50 - fine)
  - **Feedback link** (clickable button)

**If Returned Late (e.g., 3 days):**
- Fine: ₹30 (3 × ₹10)
- Deposit refund: ₹20 (₹50 - ₹30)
- Email shows breakdown

**If Very Late (e.g., 7 days):**
- Fine: ₹70 (7 × ₹10)
- Deposit used: ₹50
- Additional payment: ₹20
- Email shows warning

---

### Test 11: Feedback Submission ✅

**Steps:**
1. After returning book, check email
2. Click "Give Feedback" button
3. Fill in feedback form:
   - Book rating: 5 stars
   - Book condition: Good
   - Service rating: 5 stars
   - Comments: "Great service!"
4. Click "Submit Feedback"

**Expected Result:**
- ✅ Success message
- ✅ Redirected to dashboard
- ✅ Feedback saved in database

**Verify in MongoDB:**
```javascript
db.feedback.find()
```

---

### Test 12: Password Reset ✅

**Steps:**
1. Click "Forgot Password"
2. Enter email
3. Click "Send OTP"
4. Check email for OTP
5. Enter OTP
6. Enter new password
7. Click "Reset Password"

**Expected Result:**
- ✅ OTP received
- ✅ Password reset successful
- ✅ Can login with new password

---

### Test 13: View Analytics (Librarian) ✅

**Steps:**
1. Login as librarian
2. Go to "Librarian" → "Analytics"

**Expected Result:**
- ✅ Popular books shown
- ✅ Category distribution
- ✅ Overdue books with fines in ₹
- ✅ Fine summary in ₹

---

### Test 14: Export Reports (Librarian) ✅

**Steps:**
1. Go to "Manage Books"
2. Click "Export Excel"
3. Click "Export PDF"

**Expected Result:**
- ✅ Excel file downloaded
- ✅ PDF file downloaded
- ✅ Both contain book data

---

### Test 15: User Management (Librarian) ✅

**Steps:**
1. Go to "Manage Users"

**Expected Result:**
- ✅ All users shown
- ✅ User types displayed (Student/Faculty/Public/Librarian)
- ✅ Approval status for librarians
- ✅ Active loans count
- ✅ Approve button for pending librarians

---

## 🎯 Currency Verification

### Check All ₹ Symbols:

**Emails:**
- ✅ Borrow confirmation: ₹50 deposit, ₹10/day
- ✅ Receipt: ₹50, ₹10/day
- ✅ Due date reminder: ₹10/day
- ✅ Overdue reminder: ₹X fine, ₹50 deposit
- ✅ Return receipt: ₹X refund

**UI:**
- ✅ Dashboard: ₹X fines
- ✅ Analytics: ₹X total fines
- ✅ Transaction history: ₹X amounts

---

## 🐛 Troubleshooting

### Registration Fails:
1. Check MongoDB connection
2. Check email configuration
3. Check server logs
4. Verify all fields filled

### Email Not Received:
1. Check spam folder
2. Verify EMAIL_USER and EMAIL_PASSWORD
3. Test email: `node scripts/test-email.js`

### OTP Invalid:
1. Check if OTP expired (10 minutes)
2. Request new OTP
3. Check tokens collection in MongoDB

### Cannot Login:
1. Verify email is verified
2. Check if librarian is approved
3. Verify password is correct

### Deposit Not Showing:
1. Check .env: BOOK_DEPOSIT=50
2. Restart server
3. Check transaction in database

### Fine Not in ₹:
1. Check .env: CURRENCY_SYMBOL=₹
2. Restart server
3. Clear browser cache

---

## ✅ Complete Feature Checklist

### User Management:
- [x] Student registration
- [x] Faculty registration
- [x] Public member registration
- [x] Librarian registration
- [x] OTP verification
- [x] Librarian approval system
- [x] Login/logout
- [x] Password reset

### Book Management:
- [x] Add books
- [x] Edit books
- [x] Delete books
- [x] Search books
- [x] Filter by category
- [x] View availability

### Borrowing System:
- [x] Borrow books
- [x] Custom loan period
- [x] Deposit payment (₹50)
- [x] Return books
- [x] Deposit refund
- [x] Fine calculation (₹10/day)
- [x] Transaction history

### Email System:
- [x] Registration OTP
- [x] Password reset OTP
- [x] Borrow confirmation (₹)
- [x] Borrow receipt (₹)
- [x] Due date reminder (₹)
- [x] Overdue reminder (₹)
- [x] Return receipt with feedback (₹)

### Feedback System:
- [x] Feedback link in email
- [x] Star ratings
- [x] Comments
- [x] Database storage

### Librarian Features:
- [x] Dashboard with stats
- [x] Manage books
- [x] Manage users
- [x] Approve librarians
- [x] Analytics
- [x] Export reports (Excel/PDF)
- [x] Send reminders

### Currency:
- [x] All amounts in ₹
- [x] Deposit: ₹50
- [x] Fine: ₹10/day
- [x] Emails show ₹
- [x] UI shows ₹

---

## 🎉 Success Criteria

Your LibroFlow system is working perfectly if:

✅ All user types can register
✅ OTP verification works
✅ Librarians can be approved
✅ Books can be borrowed
✅ Deposit system works (₹50)
✅ Fines calculated correctly (₹10/day)
✅ All emails sent with ₹ symbols
✅ Reminders work (due date & overdue)
✅ Feedback system works
✅ All features accessible

---

## 📞 Support

If any test fails:
1. Check server logs
2. Check MongoDB collections
3. Verify environment variables
4. Test email configuration
5. Review error messages

---

**LibroFlow is ready for production use!** 🎉🇮🇳📚
