const crypto = require('crypto');

console.log('=================================');
console.log('LibroFlow JWT Secret Generator');
console.log('=================================\n');

const secret = crypto.randomBytes(32).toString('hex');

console.log('Generated JWT Secret:');
console.log(secret);
console.log('\nUse this value for JWT_SECRET in your .env file or Netlify environment variables.');
console.log('Keep this secret secure and never commit it to Git!\n');
