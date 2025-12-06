#!/usr/bin/env node

/**
 * Comprehensive Login Diagnostics
 * This script helps identify why login might be failing
 */

import 'dotenv/config'

const SITE_URL = process.env.SITE_URL || 'https://your-site.netlify.app'
const TEST_EMAIL = 'libroflow8@gmail.com'
const TEST_PASSWORD = 'admin123'

console.log('🔍 LibroFlow Login Diagnostics\n')
console.log('═'.repeat(50))

// Step 1: Check if site URL is configured
console.log('\n📋 Step 1: Configuration Check')
console.log('─'.repeat(50))
if (SITE_URL.includes('your-site')) {
  console.log('❌ SITE_URL not configured!')
  console.log('   Please update SITE_URL in .env file')
  console.log('   Example: SITE_URL=https://libroflow.netlify.app')
  process.exit(1)
}
console.log('✓ Site URL:', SITE_URL)
console.log('✓ Test Email:', TEST_EMAIL)

// Step 2: Check if site is accessible
console.log('\n📋 Step 2: Site Accessibility')
console.log('─'.repeat(50))
try {
  const response = await fetch(SITE_URL)
  if (response.ok) {
    console.log('✓ Site is accessible')
    console.log('  Status:', response.status)
  } else {
    console.log('❌ Site returned error:', response.status)
  }
} catch (error) {
  console.log('❌ Cannot reach site:', error.message)
  console.log('   Make sure your site is deployed and URL is correct')
  process.exit(1)
}

// Step 3: Test login endpoint
console.log('\n📋 Step 3: Login Endpoint Test')
console.log('─'.repeat(50))
try {
  const loginUrl = `${SITE_URL}/api/auth-login`
  console.log('Testing:', loginUrl)
  
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    })
  })
  
  const data = await response.json()
  
  console.log('Response Status:', response.status)
  console.log('Response Headers:', Object.fromEntries(response.headers.entries()))
  
  if (response.ok) {
    console.log('✓ Login successful!')
    console.log('  Token received:', data.token ? 'Yes' : 'No')
    console.log('  User data:', data.user ? 'Yes' : 'No')
    
    if (data.user) {
      console.log('\n👤 User Details:')
      console.log('  Name:', data.user.name)
      console.log('  Email:', data.user.email)
      console.log('  Role:', data.user.role)
      console.log('  User ID:', data.user.userId)
    }
    
    // Step 4: Test auth-me endpoint
    if (data.token) {
      console.log('\n📋 Step 4: Auth Verification Test')
      console.log('─'.repeat(50))
      
      const authResponse = await fetch(`${SITE_URL}/api/auth-me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      })
      
      if (authResponse.ok) {
        const authData = await authResponse.json()
        console.log('✓ Auth verification successful')
        console.log('  User:', authData.user.name)
      } else {
        console.log('❌ Auth verification failed')
        console.log('  Status:', authResponse.status)
      }
    }
    
  } else {
    console.log('❌ Login failed!')
    console.log('  Message:', data.message || 'Unknown error')
    console.log('\n🔧 Possible Issues:')
    
    if (response.status === 401) {
      console.log('  • Invalid credentials')
      console.log('  • Password might be incorrect')
      console.log('  • User might not exist')
      console.log('\n  Try running: node scripts/check-librarian.js')
    } else if (response.status === 403) {
      console.log('  • Account not verified')
      console.log('  • Account not approved (for librarians)')
    } else if (response.status === 500) {
      console.log('  • Server error')
      console.log('  • Check Netlify function logs')
      console.log('  • MongoDB connection might be failing')
      console.log('  • Environment variables might be missing')
    } else if (response.status === 404) {
      console.log('  • Function not found')
      console.log('  • Check netlify.toml redirects')
      console.log('  • Redeploy your site')
    }
  }
  
} catch (error) {
  console.log('❌ Request failed:', error.message)
  console.log('\n🔧 Possible Issues:')
  console.log('  • Network error')
  console.log('  • CORS issue')
  console.log('  • Function not deployed')
  console.log('  • Invalid URL')
}

// Step 5: Check environment variables
console.log('\n📋 Step 5: Environment Variables Check')
console.log('─'.repeat(50))
const requiredVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASSWORD'
]

let missingVars = []
for (const varName of requiredVars) {
  if (process.env[varName]) {
    console.log(`✓ ${varName}`)
  } else {
    console.log(`❌ ${varName} - MISSING`)
    missingVars.push(varName)
  }
}

if (missingVars.length > 0) {
  console.log('\n⚠️  Missing environment variables in .env file')
  console.log('   Make sure these are also set in Netlify dashboard!')
}

// Final summary
console.log('\n' + '═'.repeat(50))
console.log('📊 Diagnostic Summary')
console.log('═'.repeat(50))
console.log('\nIf login is failing on your deployed site:')
console.log('1. Check Netlify function logs for errors')
console.log('2. Verify all environment variables in Netlify dashboard')
console.log('3. Ensure MongoDB allows connections from 0.0.0.0/0')
console.log('4. Check browser console (F12) for client-side errors')
console.log('5. Try clearing browser cache and cookies')
console.log('\nFor more help, see: TEST_DEPLOYED_SITE.md')
