import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('=================================');
console.log('LibroFlow Password Hash Generator');
console.log('=================================\n');

rl.question('Enter password to hash: ', (password) => {
  if (!password || password.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    rl.close();
    return;
  }

  bcrypt.hash(password, 10).then(hash => {
    console.log('\n✅ Password hashed successfully!\n');
    console.log('Hashed password:');
    console.log(hash);
    console.log('\nUse this hash in MongoDB for the password field.');
    rl.close();
  }).catch(err => {
    console.error('❌ Error hashing password:', err);
    rl.close();
  });
});
