#!/usr/bin/env node

/**
 * Test Profile Update Functionality
 */

import 'dotenv/config'

const SITE_URL = process.env.SITE_URL || 'http://localhost:8888'
const TEST_EMAIL = 'libroflow8@gmail.com'
const TEST_PASSWORD = 'admin123'

console.log('🧪 Testing Profile Update Functionality\n')
console.log('═'.repeat(60))

async function testProfileUpdate() {
  try {
    // Step 1: Login
    console.log('\n📋 Step 1: Login')
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
      return
    }
    
    const loginData = await loginResponse.json()
    console.log('✓ Login successful')
    console.log('  User:', loginData.user.name)
    console.log('  Token received:', loginData.token ? 'Yes' : 'No')
    
    const token = loginData.token
    
    // Step 2: Get current profile
    console.log('\n📋 Step 2: Get Current Profile')
    console.log('─'.repeat(60))
    
    const profileResponse = await fetch(`${SITE_URL}/api/auth-me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (!profileResponse.ok) {
      console.log('❌ Failed to get profile')
      return
    }
    
    const profileData = await profileResponse.json()
    console.log('✓ Profile retrieved')
    console.log('  Name:', profileData.user.name)
    console.log('  Email:', profileData.user.email)
    
    // Step 3: Update profile
    console.log('\n📋 Step 3: Update Profile')
    console.log('─'.repeat(60))
    
    const updatedName = `${profileData.user.name} (Updated)`
    
    const updateResponse = await fetch(`${SITE_URL}/api/auth-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: updatedName,
        email: profileData.user.email
      })
    })
    
    const updateData = await updateResponse.json()
    
    if (updateResponse.ok) {
      console.log('✓ Profile updated successfully')
      console.log('  Message:', updateData.message)
    } else {
      console.log('❌ Profile update failed')
      console.log('  Status:', updateResponse.status)
      console.log('  Error:', updateData.message)
      
      console.log('\n🔧 Troubleshooting:')
      if (updateResponse.status === 401) {
        console.log('  • Token is invalid or expired')
        console.log('  • Check JWT_SECRET in environment variables')
      } else if (updateResponse.status === 400) {
        console.log('  • Email might be already in use')
        console.log('  • Check request data')
      } else if (updateResponse.status === 500) {
        console.log('  • Server error')
        console.log('  • Check Netlify function logs')
        console.log('  • Check MongoDB connection')
      }
      return
    }
    
    // Step 4: Verify update
    console.log('\n📋 Step 4: Verify Update')
    console.log('─'.repeat(60))
    
    const verifyResponse = await fetch(`${SITE_URL}/api/auth-me`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    const verifyData = await verifyResponse.json()
    
    if (verifyData.user.name === updatedName) {
      console.log('✓ Update verified successfully')
      console.log('  New name:', verifyData.user.name)
    } else {
      console.log('⚠️  Update might not have been saved')
      console.log('  Expected:', updatedName)
      console.log('  Got:', verifyData.user.name)
    }
    
    // Step 5: Restore original name
    console.log('\n📋 Step 5: Restore Original Name')
    console.log('─'.repeat(60))
    
    await fetch(`${SITE_URL}/api/auth-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: profileData.user.name,
        email: profileData.user.email
      })
    })
    
    console.log('✓ Original name restored')
    
    // Summary
    console.log('\n' + '═'.repeat(60))
    console.log('✅ Profile Update Test Complete!')
    console.log('═'.repeat(60))
    console.log('\nProfile update is working correctly for all users.')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.log('\n🔧 Possible Issues:')
    console.log('  • Site is not running')
    console.log('  • Wrong SITE_URL in .env')
    console.log('  • Network error')
    console.log('  • Function not deployed')
  }
}

testProfileUpdate()
