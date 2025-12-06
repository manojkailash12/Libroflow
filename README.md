# 📚 LibroFlow - Library Management System

A modern, full-featured web-based library management system built with React, Netlify Functions, and MongoDB.

## 🎯 Features

### For Students
- **Browse & Search Books** - Advanced search with filters by title, author, category, ISBN
- **Secure Authentication** - Email verification and password reset with OTP
- **Borrow & Return Books** - Simple one-click borrowing system
- **Email Notifications** - Automatic emails for borrowed/returned books
- **Borrowing History** - Track all past and current transactions
- **User Profile** - Manage account details and view statistics

### For Librarians
- **Book Management** - Add, edit, delete books with bulk operations
- **User Management** - View and manage all registered users
- **Analytics Dashboard** - Real-time statistics and insights
- **Fine Management** - Automatic calculation of overdue fines ($1/day)
- **Export Reports** - Generate Excel and PDF reports for books, analytics, and fines
- **Transaction History** - Complete audit trail of all library activities
- **Overdue Tracking** - Monitor and manage overdue books

## 🛠️ Technology Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API calls
- Bootstrap 5 for UI
- Font Awesome for icons

### Backend
- Netlify Serverless Functions
- MongoDB Atlas for database
- JWT for authentication
- Nodemailer for emails
- ExcelJS for Excel exports
- PDFKit for PDF exports

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free tier)
- Gmail account for SMTP (or other email service)
- Netlify account (free tier)

### Local Development Setup

1. **Clone the repository**
\`\`\`bash
git clone <your-repo-url>
cd libroflow
\`\`\`

2. **Install dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Set up environment variables**

Create a \`.env\` file in the root directory:

\`\`\`env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/libroflow?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-random

# Email (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# App
APP_URL=http://localhost:8888
LOAN_PERIOD_DAYS=14
FINE_PER_DAY=1
\`\`\`

**Important:** For Gmail, you need to create an App Password:
1. Go to Google Account Settings
2. Security → 2-Step Verification (enable it)
3. App Passwords → Generate new app password
4. Use that password in EMAIL_PASSWORD

4. **Run development server**
\`\`\`bash
npm run functions:dev
\`\`\`

This will start:
- Frontend on http://localhost:5173
- Netlify Functions on http://localhost:8888

## 🚀 Deployment to Netlify

### Step 1: Prepare MongoDB Atlas

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free M0 tier)
3. Create a database user with password
4. Whitelist all IPs (0.0.0.0/0) for Netlify access
5. Get your connection string

### Step 2: Deploy to Netlify

#### Option A: Deploy via Netlify CLI

1. **Install Netlify CLI**
\`\`\`bash
npm install -g netlify-cli
\`\`\`

2. **Login to Netlify**
\`\`\`bash
netlify login
\`\`\`

3. **Initialize and deploy**
\`\`\`bash
netlify init
netlify deploy --prod
\`\`\`

#### Option B: Deploy via Git

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Configure build settings:
   - **Build command:** \`npm run build\`
   - **Publish directory:** \`dist\`
   - **Functions directory:** \`netlify/functions\`

### Step 3: Configure Environment Variables

In Netlify Dashboard:
1. Go to Site Settings → Environment Variables
2. Add all variables from your \`.env\` file:
   - \`MONGODB_URI\`
   - \`JWT_SECRET\`
   - \`EMAIL_HOST\`
   - \`EMAIL_PORT\`
   - \`EMAIL_USER\`
   - \`EMAIL_PASSWORD\`
   - \`APP_URL\` (your Netlify site URL, e.g., https://your-site.netlify.app)
   - \`LOAN_PERIOD_DAYS\`
   - \`FINE_PER_DAY\`

### Step 4: Create Initial Librarian Account

After deployment, you need to manually create a librarian account in MongoDB:

1. Go to MongoDB Atlas → Collections
2. Select \`libroflow\` database → \`users\` collection
3. Insert a document:

\`\`\`json
{
  "name": "Admin",
  "email": "admin@libroflow.com",
  "password": "$2a$10$...", // Use bcrypt to hash your password
  "studentId": "LIB001",
  "role": "librarian",
  "verified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
\`\`\`

To generate a hashed password, you can use this Node.js script:
\`\`\`javascript
const bcrypt = require('bcryptjs');
const password = 'your-password';
bcrypt.hash(password, 10).then(hash => console.log(hash));
\`\`\`

## 📱 Usage

### Student Workflow
1. Register with email and student ID
2. Verify email via link sent to inbox
3. Login and browse available books
4. Borrow books (14-day loan period)
5. Return books before due date to avoid fines
6. View borrowing history and statistics

### Librarian Workflow
1. Login with librarian credentials
2. Access librarian dashboard
3. Add/edit/delete books
4. View all users and their activity
5. Monitor overdue books and fines
6. Export reports in Excel or PDF format
7. View analytics and popular books

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Email verification required
- OTP-based password reset
- Role-based access control
- Secure environment variables
- HTTPS on production

## 📧 Email Templates

The system sends professional HTML emails for:
- Welcome & email verification
- Password reset with OTP
- Book borrowed confirmation
- Book returned confirmation

## 📊 Reports & Analytics

Librarians can export:
- **Books Report** - All books with details (Excel/PDF)
- **Analytics Report** - Library statistics (Excel/PDF)
- **Fines Report** - All fines collected (Excel)

## 🐛 Troubleshooting

### Email not sending
- Verify Gmail App Password is correct
- Check if 2-Step Verification is enabled
- Ensure EMAIL_USER and EMAIL_PASSWORD are set in Netlify

### MongoDB connection issues
- Verify connection string is correct
- Check if IP whitelist includes 0.0.0.0/0
- Ensure database user has read/write permissions

### Functions not working
- Check Netlify Function logs in dashboard
- Verify all environment variables are set
- Ensure MongoDB URI is accessible from Netlify

## 📝 API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - Login user
- \`GET /api/auth/me\` - Get current user
- \`POST /api/auth/forgot-password\` - Send OTP
- \`POST /api/auth/reset-password\` - Reset password

### Books
- \`GET /api/books\` - Get all books
- \`GET /api/books?search=query\` - Search books
- \`GET /api/books?category=Fiction\` - Filter by category

### Transactions
- \`POST /api/transactions/borrow\` - Borrow a book
- \`POST /api/transactions/return\` - Return a book
- \`GET /api/transactions/my-history\` - Get user's history

### Librarian (Protected)
- \`GET /api/librarian/stats\` - Get library statistics
- \`GET /api/librarian/books\` - Get all books
- \`POST /api/librarian/books\` - Add new book
- \`PUT /api/librarian/books/:id\` - Update book
- \`DELETE /api/librarian/books/:id\` - Delete book
- \`GET /api/librarian/users\` - Get all users
- \`GET /api/librarian/analytics\` - Get analytics data
- \`GET /api/librarian/export/books?format=xlsx\` - Export books
- \`GET /api/librarian/export/analytics?format=pdf\` - Export analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

LibroFlow Team

## 🙏 Acknowledgments

- Bootstrap for the UI framework
- Font Awesome for icons
- MongoDB Atlas for database hosting
- Netlify for serverless hosting
- All open-source libraries used in this project
