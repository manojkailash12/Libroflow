# 🇮🇳 LibroFlow - Indian Library Features

## 🎉 Complete Feature Implementation

### ✅ All Requested Features Implemented

1. **Indian Currency (₹)** - All amounts in Rupees
2. **Book Deposit System** - Refundable deposit on borrowing
3. **Custom Loan Period** - Librarian can set days per transaction
4. **Email Notifications** - Complete email workflow
5. **Feedback System** - Post-return feedback collection
6. **Due Date Reminders** - Automatic reminders before due date
7. **Overdue Reminders** - Automatic reminders with fine calculation
8. **Receipt Generation** - Professional receipts for all transactions

---

## 💰 Pricing & Deposits

### Default Configuration (Configurable in .env)
- **Book Deposit:** ₹50 (refundable)
- **Late Fine:** ₹10 per day
- **Default Loan Period:** 14 days
- **Currency:** Indian Rupee (₹)

### How It Works

#### When Borrowing:
1. User pays **₹50 deposit** (refundable)
2. Librarian can set custom loan period (e.g., 7, 14, 21 days)
3. User receives:
   - Confirmation email
   - Detailed receipt with all terms

#### When Returning:

**On Time Return:**
- Full deposit refunded: **₹50**
- No charges
- Feedback link sent

**Late Return (e.g., 3 days late):**
- Fine calculated: 3 days × ₹10 = **₹30**
- Deposit refund: ₹50 - ₹30 = **₹20**
- User gets ₹20 back

**Very Late Return (e.g., 7 days late):**
- Fine calculated: 7 days × ₹10 = **₹70**
- Deposit used: ₹50
- Additional payment due: ₹70 - ₹50 = **₹20**
- User must pay ₹20 extra

---

## 📧 Complete Email Workflow

### 1. Registration Email (OTP)
**Sent:** When user registers
**Contains:**
- 6-digit OTP
- Verification instructions
- 10-minute expiry notice

### 2. Book Borrowed - Confirmation
**Sent:** Immediately after borrowing
**Contains:**
- Book title
- Due date
- Deposit amount (₹50)
- Late fine rate (₹10/day)
- Important reminders

### 3. Book Borrowed - Receipt
**Sent:** Immediately after borrowing
**Contains:**
- Transaction ID
- Member details
- Book details
- Borrow date & due date
- Loan period (custom days)
- Deposit paid (₹50)
- Late fee policy (₹10/day)
- Terms and conditions

### 4. Due Date Reminder
**Sent:** 2 days before due date
**Contains:**
- Book title
- Due date
- Days remaining (large display)
- Late fine warning (₹10/day)
- Deposit refund reminder

### 5. Overdue Reminder
**Sent:** When book becomes overdue
**Contains:**
- Book title
- Days overdue
- **Current fine amount** (₹ prominently displayed)
- Deposit status
- Warning about additional charges
- Urgent return request

### 6. Book Returned - Receipt & Feedback
**Sent:** When book is returned
**Contains:**
- Book title
- Deposit paid (₹50)
- Fine charged (if any)
- **Deposit refund amount** (₹)
- Additional payment due (if fine > deposit)
- **Feedback link** (clickable button)
- Thank you message

---

## 🔄 Complete User Journey

### Student/Faculty/Public Member Journey

#### 1. Registration
```
User fills form → OTP sent to email → User enters OTP → Account verified → Can login
```

#### 2. Borrowing a Book
```
Browse books → Click "Borrow" → 
Librarian sets loan period (e.g., 14 days) →
Pay ₹50 deposit →
Receive 2 emails:
  - Confirmation email
  - Detailed receipt
```

#### 3. During Loan Period
```
Day 12 (2 days before due): Receive due date reminder email
Day 14 (due date): Book should be returned
Day 15+ (overdue): Receive overdue reminder emails
```

#### 4. Returning the Book
```
Return book to library →
System calculates:
  - Days late (if any)
  - Fine amount (days × ₹10)
  - Deposit refund (₹50 - fine)
→ Receive return email with:
  - Deposit refund details
  - Fine breakdown
  - Feedback link
→ Click feedback link →
Rate book & service →
Submit feedback
```

---

## 🎯 Librarian Features

### Custom Loan Period
Librarian can set custom days when issuing book:
- Quick loans: 3-7 days
- Standard loans: 14 days
- Extended loans: 21-30 days

### Automated Reminders
Two automated reminder systems:

#### 1. Due Date Reminders
```bash
POST /api/send-due-date-reminders
```
- Sends reminders 2 days before due date
- Shows days remaining
- Reminds about deposit refund

#### 2. Overdue Reminders
```bash
POST /api/send-overdue-reminders
```
- Sends reminders for overdue books
- Shows current fine amount
- Warns about deposit usage

### Schedule Automation
Set up cron jobs to run daily:

```bash
# Due date reminders (run daily at 9 AM)
0 9 * * * curl -X POST https://your-site.netlify.app/api/send-due-date-reminders

# Overdue reminders (run daily at 10 AM)
0 10 * * * curl -X POST https://your-site.netlify.app/api/send-overdue-reminders
```

---

## 📊 Email Templates

### All Templates Include:
- ✅ Indian Rupee (₹) symbol
- ✅ Professional design
- ✅ Mobile responsive
- ✅ Clear call-to-action
- ✅ LibroFlow branding

### Template Features:

**Receipt Template:**
- Professional invoice-style layout
- All transaction details
- Deposit and fine information
- Terms and conditions
- Print-ready format

**Reminder Templates:**
- Attention-grabbing design
- Large, prominent displays
- Color-coded urgency
- Clear action items

**Feedback Template:**
- Friendly, appreciative tone
- Easy-to-click button
- Simple feedback form
- Star ratings

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# Library Settings
LOAN_PERIOD_DAYS=14          # Default loan period
FINE_PER_DAY=10              # Fine in Rupees
CURRENCY=INR                 # Currency code
CURRENCY_SYMBOL=₹            # Currency symbol
BOOK_DEPOSIT=50              # Deposit amount in Rupees
FEEDBACK_URL=https://your-site.netlify.app/feedback
```

### Customization Options

#### Change Fine Amount:
```env
FINE_PER_DAY=15  # ₹15 per day
```

#### Change Deposit:
```env
BOOK_DEPOSIT=100  # ₹100 deposit
```

#### Change Default Loan Period:
```env
LOAN_PERIOD_DAYS=21  # 21 days default
```

---

## 📱 User Interface Updates

### Borrow Books Page
- Shows deposit amount
- Shows fine per day
- Librarian can set custom days

### Return Books Page
- Shows deposit refund calculation
- Shows fine breakdown
- Shows additional payment (if any)

### Transaction History
- Shows deposit paid
- Shows deposit refunded
- Shows fine charged
- Shows loan period

---

## 🗄️ Database Schema Updates

### Transactions Collection
```javascript
{
  userId: ObjectId,
  bookId: ObjectId,
  borrowDate: Date,
  dueDate: Date,
  returnDate: Date,
  loanPeriod: Number,        // NEW: Custom days
  deposit: Number,           // NEW: ₹50
  finePerDay: Number,        // NEW: ₹10
  fine: Number,              // Calculated fine
  depositRefund: Number,     // NEW: Refund amount
  depositPaid: Boolean,      // NEW: Payment status
  status: String,
  createdAt: Date
}
```

### Feedback Collection (NEW)
```javascript
{
  transactionId: ObjectId,
  rating: Number,            // 1-5 stars
  bookCondition: String,     // excellent/good/fair/poor
  serviceRating: Number,     // 1-5 stars
  comments: String,
  createdAt: Date
}
```

---

## 🚀 Testing Guide

### 1. Test Registration
1. Register new user
2. Check email for OTP
3. Enter OTP
4. Verify account created

### 2. Test Borrowing
1. Login as member
2. Browse books
3. Click "Borrow"
4. Check email for:
   - Confirmation (with ₹ amounts)
   - Receipt (detailed)

### 3. Test Due Date Reminder
1. Manually call: `POST /api/send-due-date-reminders`
2. Check email for reminder
3. Verify ₹ amounts shown

### 4. Test Overdue Reminder
1. Set a book as overdue in MongoDB
2. Call: `POST /api/send-overdue-reminders`
3. Check email for:
   - Fine amount in ₹
   - Deposit warning

### 5. Test Return & Feedback
1. Return a book
2. Check email for:
   - Deposit refund in ₹
   - Fine breakdown
   - Feedback link
3. Click feedback link
4. Submit feedback
5. Verify saved in database

---

## 💡 Key Benefits

### For Users:
- ✅ Clear pricing in Indian Rupees
- ✅ Refundable deposit system
- ✅ Transparent fine calculation
- ✅ Multiple email reminders
- ✅ Easy feedback submission
- ✅ Professional receipts

### For Library:
- ✅ Automated reminder system
- ✅ Reduced manual follow-ups
- ✅ Better fine collection
- ✅ User feedback collection
- ✅ Flexible loan periods
- ✅ Professional communication

### For Librarians:
- ✅ Custom loan period per transaction
- ✅ Automated email workflows
- ✅ Deposit management
- ✅ Fine tracking
- ✅ Feedback analytics
- ✅ Easy configuration

---

## 📞 API Endpoints

### New Endpoints:

#### Send Due Date Reminders
```
POST /api/send-due-date-reminders
Response: {
  "emailsSent": 5,
  "totalUpcoming": 5
}
```

#### Send Overdue Reminders
```
POST /api/send-overdue-reminders
Response: {
  "emailsSent": 3,
  "totalOverdue": 3
}
```

#### Submit Feedback
```
POST /api/feedback/submit
Body: {
  "transactionId": "...",
  "rating": 5,
  "bookCondition": "good",
  "serviceRating": 5,
  "comments": "Great service!"
}
```

---

## 🎨 Email Preview

### Receipt Email Structure:
```
┌─────────────────────────────────┐
│   📚 LIBRARY RECEIPT            │
├─────────────────────────────────┤
│ Transaction ID: ABC123          │
│ Member: John Doe                │
│ Book: The Great Gatsby          │
│ Borrow Date: Jan 15, 2024       │
│ Due Date: Jan 29, 2024          │
│ Loan Period: 14 days            │
│ Deposit Paid: ₹50               │
│ Late Fee: ₹10 per day           │
├─────────────────────────────────┤
│ Important Reminders:            │
│ • Return by due date            │
│ • Deposit refunded on return    │
│ • Late fee: ₹10/day             │
│ • Take care of the book         │
└─────────────────────────────────┘
```

### Overdue Reminder Structure:
```
┌─────────────────────────────────┐
│   ⚠️ OVERDUE BOOK REMINDER      │
├─────────────────────────────────┤
│ Book: The Great Gatsby          │
│ Due Date: Jan 29, 2024          │
│ Days Overdue: 3 days            │
├─────────────────────────────────┤
│      Current Fine:              │
│         ₹30                     │
│      (₹10 per day)              │
├─────────────────────────────────┤
│ ⚠️ Your deposit: ₹50            │
│ Fine will be deducted           │
│ Return immediately!             │
└─────────────────────────────────┘
```

---

## 🎉 Summary

LibroFlow now has a **complete Indian library management system** with:

✅ **Indian Rupee (₹)** throughout
✅ **Refundable deposit system** (₹50)
✅ **Custom loan periods** (librarian-set)
✅ **Automated email reminders** (due date & overdue)
✅ **Professional receipts** (detailed transactions)
✅ **Feedback system** (post-return)
✅ **Transparent pricing** (₹10/day fine)
✅ **Complete email workflow** (6 types of emails)

**Perfect for Indian schools, colleges, and public libraries!** 🇮🇳📚

---

**Ready to use at:** http://localhost:8888
