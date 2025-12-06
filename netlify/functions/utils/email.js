import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export async function sendEmail(to, subject, html) {
  try {
    await transporter.sendMail({
      from: `"LibroFlow" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    return true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}

export function getWelcomeEmailTemplate(name, verificationLink) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .button { display: inline-block; padding: 12px 30px; background: #4a90e2; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to LibroFlow!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for registering with LibroFlow. We're excited to have you join our library community!</p>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verificationLink}" class="button">Verify Email</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${verificationLink}</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 LibroFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getOTPEmailTemplate(name, otp, purpose = 'verification') {
  const title = purpose === 'registration' ? 'Verify Your Account' : 'Password Reset'
  const message = purpose === 'registration' 
    ? 'Thank you for registering with LibroFlow! Please use the OTP below to verify your account:'
    : 'You requested to reset your password. Use the OTP below:'
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .otp { font-size: 32px; font-weight: bold; color: #4a90e2; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; letter-spacing: 5px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${title}</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>${message}</p>
          <div class="otp">${otp}</div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 LibroFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getBorrowEmailTemplate(name, bookTitle, dueDate, deposit, finePerDay) {
  const currency = process.env.CURRENCY_SYMBOL || '₹'
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #50c878; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info { background: white; padding: 15px; border-left: 4px solid #50c878; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 Book Borrowed Successfully!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>You have successfully borrowed the following book:</p>
          <div class="info">
            <strong>Book:</strong> ${bookTitle}<br>
            <strong>Due Date:</strong> ${dueDate}<br>
            <strong>Deposit Paid:</strong> ${currency}${deposit}<br>
            <strong>Late Fine:</strong> ${currency}${finePerDay} per day after due date
          </div>
          <p><strong>Important:</strong> Please return the book on or before the due date to avoid fines and get your deposit back.</p>
          <p>Your deposit of ${currency}${deposit} will be refunded when you return the book in good condition.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 LibroFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getReturnEmailTemplate(name, bookTitle, fine, deposit, depositRefund, feedbackUrl) {
  const currency = process.env.CURRENCY_SYMBOL || '₹'
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .info { background: white; padding: 15px; border-left: 4px solid #4a90e2; margin: 20px 0; }
        .refund-box { background: #d4edda; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; text-align: center; }
        .refund-amount { font-size: 28px; font-weight: bold; color: #28a745; }
        .feedback-btn { display: inline-block; padding: 12px 30px; background: #4a90e2; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Book Returned Successfully!</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>You have successfully returned the following book:</p>
          <div class="info">
            <strong>Book:</strong> ${bookTitle}<br>
            <strong>Deposit Paid:</strong> ${currency}${deposit}<br>
            ${fine > 0 ? `<strong>Late Fine:</strong> ${currency}${fine}<br>` : ''}
            <strong>Status:</strong> ${fine > 0 ? 'Returned Late' : 'Returned on Time ✓'}
          </div>
          ${depositRefund > 0 ? `
          <div class="refund-box">
            <p><strong>Deposit Refund:</strong></p>
            <div class="refund-amount">${currency}${depositRefund}</div>
            <p><small>${fine > 0 ? `(${currency}${deposit} deposit - ${currency}${fine} fine)` : 'Full deposit refunded'}</small></p>
          </div>
          ` : `
          <div class="info" style="background: #ffe6e6; border-left-color: #e74c3c;">
            <strong>⚠️ Notice:</strong> Your deposit has been used to cover the late fine.<br>
            ${fine > deposit ? `<strong>Additional Payment Due:</strong> ${currency}${fine - deposit}` : ''}
          </div>
          `}
          <p>Thank you for using LibroFlow!</p>
          <div style="text-align: center;">
            <p><strong>📝 We'd love your feedback!</strong></p>
            <p>Help us improve by sharing your experience:</p>
            <a href="${feedbackUrl}" class="feedback-btn">Give Feedback</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; 2024 LibroFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getOverdueReminderTemplate(name, bookTitle, daysOverdue, fine, dueDate, finePerDay, deposit) {
  const currency = process.env.CURRENCY_SYMBOL || '₹'
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #e74c3c; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .warning { background: #fff3cd; padding: 15px; border-left: 4px solid #f39c12; margin: 20px 0; }
        .fine-box { background: #ffe6e6; padding: 15px; border-left: 4px solid #e74c3c; margin: 20px 0; text-align: center; }
        .fine-amount { font-size: 32px; font-weight: bold; color: #e74c3c; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Overdue Book Reminder</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>This is a reminder that you have an overdue book:</p>
          <div class="warning">
            <strong>Book:</strong> ${bookTitle}<br>
            <strong>Due Date:</strong> ${dueDate}<br>
            <strong>Days Overdue:</strong> ${daysOverdue} days
          </div>
          <div class="fine-box">
            <p><strong>Current Fine:</strong></p>
            <div class="fine-amount">${currency}${fine}</div>
            <p><small>(${currency}${finePerDay} per day)</small></p>
          </div>
          <p><strong>⚠️ Important Notice:</strong></p>
          <ul>
            <li>Your deposit of ${currency}${deposit} is being held</li>
            <li>Fine will be deducted from your deposit</li>
            <li>If fine exceeds deposit, you must pay the difference</li>
            <li>Please return the book immediately to stop additional charges</li>
          </ul>
          <p>You can return the book at the library during operating hours.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 LibroFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getDueDateReminderTemplate(name, bookTitle, dueDate, daysLeft, finePerDay) {
  const currency = process.env.CURRENCY_SYMBOL || '₹'
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f39c12; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .reminder { background: #fff3cd; padding: 15px; border-left: 4px solid #f39c12; margin: 20px 0; }
        .days-box { background: white; padding: 15px; text-align: center; margin: 20px 0; border: 2px solid #f39c12; }
        .days-number { font-size: 48px; font-weight: bold; color: #f39c12; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Due Date Reminder</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>This is a friendly reminder about your borrowed book:</p>
          <div class="reminder">
            <strong>Book:</strong> ${bookTitle}<br>
            <strong>Due Date:</strong> ${dueDate}
          </div>
          <div class="days-box">
            <div class="days-number">${daysLeft}</div>
            <p><strong>Days Remaining</strong></p>
          </div>
          <p><strong>⏰ Important Reminders:</strong></p>
          <ul>
            <li>Please return the book by ${dueDate}</li>
            <li>Late fee: ${currency}${finePerDay} per day after due date</li>
            <li>Return during library operating hours</li>
            <li>Your deposit will be refunded on timely return</li>
          </ul>
          <p>Thank you for being a responsible library member!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 LibroFlow. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getReceiptEmailTemplate(name, bookTitle, borrowDate, dueDate, transactionId, deposit, finePerDay, loanPeriod) {
  const currency = process.env.CURRENCY_SYMBOL || '₹'
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #50c878; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .receipt { background: white; padding: 20px; border: 2px solid #50c878; margin: 20px 0; }
        .receipt-header { text-align: center; border-bottom: 2px dashed #ccc; padding-bottom: 15px; margin-bottom: 15px; }
        .receipt-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .receipt-footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 2px dashed #ccc; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📚 Library Receipt</h1>
        </div>
        <div class="content">
          <h2>Hello ${name},</h2>
          <p>Thank you for borrowing from LibroFlow! Here's your receipt:</p>
          <div class="receipt">
            <div class="receipt-header">
              <h3>LIBROFLOW LIBRARY</h3>
              <p>Book Borrowing Receipt</p>
            </div>
            <div class="receipt-row">
              <span><strong>Transaction ID:</strong></span>
              <span>${transactionId}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Member Name:</strong></span>
              <span>${name}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Book Title:</strong></span>
              <span>${bookTitle}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Borrow Date:</strong></span>
              <span>${borrowDate}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Due Date:</strong></span>
              <span>${dueDate}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Loan Period:</strong></span>
              <span>${loanPeriod} days</span>
            </div>
            <div class="receipt-row">
              <span><strong>Deposit Paid:</strong></span>
              <span>${currency}${deposit}</span>
            </div>
            <div class="receipt-row">
              <span><strong>Late Fee:</strong></span>
              <span>${currency}${finePerDay} per day after due date</span>
            </div>
            <div class="receipt-footer">
              <p><strong>Please return the book on or before the due date.</strong></p>
              <p>Keep this receipt for your records.</p>
            </div>
          </div>
          <p><strong>Important Reminders:</strong></p>
          <ul>
            <li>Return the book by ${dueDate} to avoid late fees</li>
            <li>Late fee is ${currency}${finePerDay} per day after the due date</li>
            <li>Your deposit of ${currency}${deposit} will be refunded on return</li>
            <li>You will receive reminder emails before and after the due date</li>
            <li>Take good care of the book and return it in good condition</li>
            <li>Damaged books may result in deposit forfeiture</li>
          </ul>
        </div>
        <div class="footer">
          <p>&copy; 2024 LibroFlow. All rights reserved.</p>
          <p>This is an automated receipt. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
