import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=================================');
console.log('LibroFlow Email Configuration Test');
console.log('=================================\n');

console.log('Testing email configuration...\n');

console.log('Configuration:');
console.log(`- Host: ${process.env.EMAIL_HOST}`);
console.log(`- Port: ${process.env.EMAIL_PORT}`);
console.log(`- User: ${process.env.EMAIL_USER}`);
console.log(`- Password: ${process.env.EMAIL_PASSWORD ? '***' + process.env.EMAIL_PASSWORD.slice(-4) : 'NOT SET'}\n`);

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

console.log('Verifying SMTP connection...\n');

transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ Email configuration FAILED!\n');
    console.log('Error:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Gmail App Password is incorrect');
    console.log('2. 2-Step Verification is not enabled');
    console.log('3. Email address is incorrect');
    console.log('4. Network/firewall blocking SMTP\n');
    console.log('To fix:');
    console.log('- Go to https://myaccount.google.com/apppasswords');
    console.log('- Generate a new App Password');
    console.log('- Update EMAIL_PASSWORD in .env file\n');
    process.exit(1);
  } else {
    console.log('✅ Email configuration is WORKING!\n');
    console.log('SMTP server is ready to send emails.');
    console.log('\nSending test email...\n');
    
    // Send test email
    transporter.sendMail({
      from: `"LibroFlow Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: 'LibroFlow Email Test',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4a90e2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .success { color: #50c878; font-size: 24px; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 LibroFlow Email Test</h1>
            </div>
            <div class="content">
              <p class="success">✅ Success!</p>
              <p>Your email configuration is working correctly!</p>
              <p><strong>Configuration Details:</strong></p>
              <ul>
                <li>Host: ${process.env.EMAIL_HOST}</li>
                <li>Port: ${process.env.EMAIL_PORT}</li>
                <li>From: ${process.env.EMAIL_USER}</li>
              </ul>
              <p>LibroFlow is ready to send emails for:</p>
              <ul>
                <li>User registration verification</li>
                <li>Password reset OTP</li>
                <li>Book borrow confirmation</li>
                <li>Book return confirmation</li>
              </ul>
              <p>This is an automated test email from LibroFlow.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }, (error, info) => {
      if (error) {
        console.log('❌ Failed to send test email!');
        console.log('Error:', error.message);
        process.exit(1);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log(`Message ID: ${info.messageId}`);
        console.log(`\nCheck your inbox: ${process.env.EMAIL_USER}`);
        console.log('\nEmail system is fully operational! 🎉\n');
        process.exit(0);
      }
    });
  }
});
