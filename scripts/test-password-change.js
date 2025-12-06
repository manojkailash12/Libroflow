#!/usr/bin/env node

/**
 * Test Password Change Functionality
 */

import 'dotenv/config'

const SITE_URL = process.env.SITE_URL || 'http://localhost:8888'
const TEST_EMAIL = 'libroflow8@gmail.com'
const TEST_PASSWORD = 'admin123'
const NEW_PASSWORD = 'admin123new'

console.log('🧪 Testing Password Change Functionality\n')
console.log('═'.repeat(60))

async function testPasswordChange() {
  try {
    // Step 1: Login with current password
    console.log('\n📋 Step 1: Login with Current Password')
    console.log('─'.repeat(60))
    
    const loginResponse = await fetch(`${SITE_URL}/api/auth-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD })
    })
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed')
      const error = await loginResponse.json()
      console.log('Error:', error.message)
      console.log('\n⚠️  Make sure the current password is correct')
      return
    }
    
    const loginData = await loginResponse.json()
    console.log('✓ Login successful')
    console.log('  User:', loginData.user.name)
    
    const token = loginData.token
    
    // Step 2: Try to change password with wrong current password
    console.log('\n📋 Step 2: Test Wrong Current Password')
    console.log('─'.repeat(60))
    
    const wrongPasswordResponse = await fetch(`${SITE_URL}/api/auth-change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: 'wrongpassword',
        newPassword: NEW_PASSWORD
      })
    })
    
    const wrongPasswordData = await wrongPasswordResponse.json()
    
    if (wrongPasswordResponse.status === 401) {
      console.log('✓ Correctly rejected wrong password')
      console.log('  Message:', wrongPasswordData.message)
    } else {
      console.log('⚠️  Should have rejected wrong password')
    }
    
    // Step 3: Change password with correct current password
    console.log('\n📋 Step 3: Change Password (Correct Current Password)')
    console.log('─'.repeat(60))
    
    const changeResponse = await fetch(`${SITE_URL}/api/auth-change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        currentPassword: TEST_PASSWORD,
        newPassword: NEW_PASSWORD
      })
    })
    
    const changeData = await changeResponse.json()
    
    if (changeResponse.ok) {
      console.log('✓ Password changed successfully')
      console.log('  Message:', changeData.message)
    } else {
      console.log('❌ Password change failed')
      console.log('  Status:', changeResponse.status)
      console.log('  Error:', changeData.message)
      
      console.log('\n🔧 Troubleshooting:')
      if (changeResponse.status === 401) {
        console.log('  • Current password is incorrect')
        console.log('  • Or token is invalid')
      } else if (changeResponse.status === 404) {
        console.log('  • User not found in database')
      } else if (changeResponse.status === 500) {
        console.log('  • Server error')
        console.log('  • Check Netlify function logs')
        console.log('  • Check MongoDB connection')
      } else if (changeResponse.status === 405) {
        console.log('  • Wrong HTTP method')
        console.log('  • Should be PUT request')
      }
      return
    }
    
    // Step 4: Verify new password works
    console.log('\n📋 Step 4: Verify New Password')
    console.log('─'.repeat(60))
    
    const verifyResponse = await fetch(`${SITE_URL}/api/auth-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, password: NEW_PASSWORD })
    })
    
    if (verifyResponse.ok) {
      console.log('✓ New password works!')
      console.log('  Successfully logged in with new password')
    } else {
      console.log('⚠️  New password doesn\'t work')
      console.log('  Password might not have been saved')
    }
    
    // Step 5: Restore original password
    console.log('\n📋 Step 5: Restore Original Password')
    console.log('─'.repeat(60))
    
    const newToken = verifyResponse.ok ? (await verifyResponse.json()).token : token
    
    const restoreResponse = await fetch(`${SITE_URL}/api/auth-change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${newToken}`
      },
      body: JSON.stringify({
        currentPassword: NEW_PASSWORD,
        newPassword: TEST_PASSWORD
      })
    })
    
    if (restoreResponse.ok) {
      console.log('✓ Original password restored')
    } else {
      console.log('⚠️  Could not restore original password')
      console.log('  You may need to manually reset it')
    }
    
    // Summary
    console.log('\n' + '═'.repeat(60))
    console.log('✅ Password Change Test Complete!')
    console.log('═'.repeat(60))
    
    if (changeResponse.ok && verifyResponse.ok) {
      console.log('\n✓ Password change is working correctly!')
    } else {
      console.log('\n❌ Password change has issues')
      console.log('\nNext steps:')
      console.log('1. Check Netlify function logs')
      console.log('2. Verify JWT_SECRET is set')
      console.log('3. Check MongoDB connection')
      console.log('4. Test locally with: netlify dev')
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.log('\n🔧 Possible Issues:')
    console.log('  • Site is not running')
    console.log('  • Wrong SITE_URL in .env')
    console.log('  • Network error')
    console.log('  • Function not deployed')
  }
}

testPasswordChange()
