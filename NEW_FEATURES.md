# 🎉 LibroFlow - New Features

## ✨ What's New

### 1. Multiple User Types Support
LibroFlow now supports different types of users:
- **Students** - School/college students
- **Faculty** - Teachers and professors  
- **Public Members** - General public library members
- **Librarians** - Library staff (admin access)

### 2. OTP-Based Registration
- Users register and receive a 6-digit OTP via email
- Verify OTP directly on the registration page
- No need to click email links
- OTP expires in 10 minutes

### 3. Enhanced Email Notifications

#### Book Borrowing Receipt
When a user borrows a book, they receive:
- **Confirmation email** - Simple notification
- **Detailed receipt** - Professional receipt with:
  - Transaction ID
  - Member name
  - Book title
  - Borrow date
  - Due date
  - Loan period
  - Late fee information

#### Overdue Reminders
Automatic email reminders for overdue books showing:
- Book title
- Due date
- Days overdue
- Current fine amount
- Warning to return soon

### 4. Automated Reminder System
New endpoint: `/api/send-overdue-reminders`
- Sends reminders to all users with overdue books
- Calculates current fines
- Can be scheduled to run daily

## 📧 Email Templates

### 1. Registration OTP
- Clean, professional design
- Large 6-digit OTP display
- 10-minute expiry notice

### 2. Password Reset OTP
- Security-focused design
- Clear instructions
- Expiry information

### 3. Book Borrowing Receipt
- Professional receipt format
- All transaction details
- Important reminders
- Late fee policy

### 4. Overdue Reminder
- Warning-style design
- Prominent fine display
- Days overdue counter
- Call to action

## 🚀 How to Use

### For Users

#### Registration:
1. Go to registration page
2. Select user type (Student/Faculty/Public)
3. Fill in details with appropriate ID
4. Submit form
5. Check email for OTP
6. Enter OTP to verify
7. Login with credentials

#### Borrowing Books:
1. Browse available books
2. Click "Borrow"
3. Receive two emails:
   - Confirmation email
   - Detailed receipt
4. Keep receipt for records

#### Overdue Books:
- Receive automatic reminder emails
- See current fine amount
- Return book to stop fines

### For Librarians

#### Send Overdue Reminders:
You can manually trigger overdue reminders by calling:
```bash
POST /api/send-overdue-reminders
```

Or set up a cron job to run daily:
```bash
# Example: Run daily at 9 AM
0 9 * * * curl -X POST https://your-site.netlify.app/api/send-overdue-reminders
```

#### View User Types:
- Go to "Manage Users"
- See user type badges:
  - 🔵 Student (blue)
  - 🟢 Faculty (green)
  - 🟡 Public (yellow)

## 🔧 Technical Details

### Database Schema Updates

#### Users Collection:
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  userId: String,           // NEW: Replaces studentId
  userType: String,          // NEW: student/faculty/public
  role: String,              // member/librarian
  verified: Boolean,
  createdAt: Date
}
```

#### Tokens Collection:
```javascript
{
  email: String,
  otp: String,
  type: String,              // registration/password-reset
  expiresAt: Date,
  createdAt: Date
}
```

### New API Endpoints

#### POST /api/auth/verify-otp
Verify OTP for registration
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### POST /api/send-overdue-reminders
Send reminders to all overdue users
```json
Response: {
  "message": "Overdue reminders sent",
  "emailsSent": 5,
  "totalOverdue": 5
}
```

### Email Functions

#### getReceiptEmailTemplate(name, bookTitle, borrowDate, dueDate, transactionId)
Generates professional receipt email

#### getOverdueReminderTemplate(name, bookTitle, daysOverdue, fine, dueDate)
Generates overdue reminder email

#### getOTPEmailTemplate(name, otp, purpose)
Generates OTP email (registration or password reset)

## 📝 Setup Instructions

### 1. Update MongoDB
If you have existing users, you may want to migrate:
```javascript
// Add userType and userId to existing users
db.users.updateMany(
  { studentId: { $exists: true } },
  { 
    $set: { 
      userId: "$studentId",
      userType: "student"
    }
  }
)
```

### 2. Update Librarian Account
Use the new `librarian-account.json` format:
```json
{
  "name": "Admin Librarian",
  "email": "admin@libroflow.com",
  "password": "HASHED_PASSWORD",
  "userId": "LIB001",
  "userType": "librarian",
  "role": "librarian",
  "verified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

### 3. Test Email System
Run the email test:
```bash
node scripts/test-email.js
```

### 4. Test Registration
1. Register a new user
2. Check email for OTP
3. Verify OTP
4. Login

### 5. Test Borrowing
1. Login as member
2. Borrow a book
3. Check email for:
   - Confirmation
   - Receipt

### 6. Test Overdue Reminders
1. Manually set a book as overdue in MongoDB
2. Call `/api/send-overdue-reminders`
3. Check email for reminder

## 🎯 Benefits

### For Users:
- ✅ Faster registration (OTP vs email link)
- ✅ Professional receipts for records
- ✅ Automatic overdue reminders
- ✅ Clear fine information
- ✅ Multiple user type support

### For Librarians:
- ✅ Better user categorization
- ✅ Automated reminder system
- ✅ Reduced manual follow-ups
- ✅ Professional communication
- ✅ Better record keeping

### For Library:
- ✅ Improved user experience
- ✅ Better fine collection
- ✅ Professional image
- ✅ Automated workflows
- ✅ Scalable system

## 🔮 Future Enhancements

- SMS notifications for overdue books
- Payment gateway integration for fines
- Automatic daily reminder scheduling
- Push notifications (mobile app)
- WhatsApp integration
- Multi-language support
- Custom reminder schedules
- Fine payment receipts

## 📞 Support

For issues or questions:
1. Check the main README.md
2. Review DEPLOYMENT.md
3. Check function logs in Netlify
4. Verify email configuration

---

**LibroFlow** - Now with enhanced user management and automated notifications! 🎉
