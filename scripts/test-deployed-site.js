import 'dotenv/config'

// Change this to your actual Netlify URL
const SITE_URL = process.env.SITE_URL || 'https://your-site.netlify.app'

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
}

async function testEndpoint(name, url, options = {}) {
  try {
    const response = await fetch(url, options)
    const data = await response.text()
    
    let parsedData
    try {
      parsedData = JSON.parse(data)
    } catch {
      parsedData = data
    }
    
    if (response.ok) {
      console.log(`${colors.green}✓${colors.reset} ${name}`)
      console.log(`  Status: ${response.status}`)
      if (parsedData.message) console.log(`  Message: ${parsedData.message}`)
      return { success: true, data: parsedData }
    } else {
      console.log(`${colors.red}✗${colors.reset} ${name}`)
      console.log(`  Status: ${response.status}`)
      console.log(`  Error: ${parsedData.message || parsedData}`)
      return { success: false, status: response.status, error: parsedData }
    }
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}`)
    console.log(`  Error: ${error.message}`)
    return { success: false, error: error.message }
  }
}

async function runTests() {
  console.log(`${colors.blue}Testing Deployed Site: ${SITE_URL}${colors.reset}\n`)
  
  const results = {
    passed: 0,
    failed: 0
  }
  
  // Test 1: Site is accessible
  console.log(`${colors.yellow}1. Testing Site Accessibility${colors.reset}`)
  const siteTest = await testEndpoint('Homepage', SITE_URL)
  siteTest.success ? results.passed++ : results.failed++
  console.log()
  
  // Test 2: Login endpoint exists
  console.log(`${colors.yellow}2. Testing Login Endpoint${colors.reset}`)
  const loginTest = await testEndpoint(
    'Login API',
    `${SITE_URL}/api/auth-login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    }
  )
  // We expect 401 for wrong credentials, which means endpoint is working
  if (loginTest.status === 401) {
    console.log(`  ${colors.green}Endpoint is working (401 expected for wrong credentials)${colors.reset}`)
    results.passed++
  } else if (!loginTest.success) {
    results.failed++
  }
  console.log()
  
  // Test 3: Try actual librarian login
  console.log(`${colors.yellow}3. Testing Librarian Login${colors.reset}`)
  const librarianLogin = await testEndpoint(
    'Librarian Login',
    `${SITE_URL}/api/auth-login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'libroflow8@gmail.com',
        password: 'admin123'
      })
    }
  )
  
  let token = null
  if (librarianLogin.success && librarianLogin.data.token) {
    token = librarianLogin.data.token
    console.log(`  ${colors.green}Login successful! Token received.${colors.reset}`)
    results.passed++
  } else {
    console.log(`  ${colors.red}Login failed!${colors.reset}`)
    results.failed++
  }
  console.log()
  
  // Test 4: Test auth-me with token
  if (token) {
    console.log(`${colors.yellow}4. Testing Auth Verification${colors.reset}`)
    const authTest = await testEndpoint(
      'Auth Me',
      `${SITE_URL}/api/auth-me`,
      {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      }
    )
    authTest.success ? results.passed++ : results.failed++
    console.log()
    
    // Test 5: Test dashboard stats
    console.log(`${colors.yellow}5. Testing Dashboard Stats${colors.reset}`)
    const statsTest = await testEndpoint(
      'Dashboard Stats',
      `${SITE_URL}/api/dashboard-stats`,
      {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      }
    )
    statsTest.success ? results.passed++ : results.failed++
    console.log()
    
    // Test 6: Test books endpoint
    console.log(`${colors.yellow}6. Testing Books Endpoint${colors.reset}`)
    const booksTest = await testEndpoint(
      'Books List',
      `${SITE_URL}/api/books-list`,
      {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      }
    )
    booksTest.success ? results.passed++ : results.failed++
    console.log()
  } else {
    console.log(`${colors.yellow}Skipping authenticated tests (no token)${colors.reset}\n`)
    results.failed += 3
  }
  
  // Test 7: Register endpoint
  console.log(`${colors.yellow}7. Testing Register Endpoint${colors.reset}`)
  const registerTest = await testEndpoint(
    'Register API',
    `${SITE_URL}/api/auth-register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'Test123!',
        userId: `TEST${Date.now()}`,
        userType: 'student'
      })
    }
  )
  registerTest.success ? results.passed++ : results.failed++
  console.log()
  
  // Summary
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`)
  console.log(`${colors.blue}Test Summary${colors.reset}`)
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`)
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`)
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`)
  console.log(`Total: ${results.passed + results.failed}`)
  console.log()
  
  if (results.failed === 0) {
    console.log(`${colors.green}🎉 All tests passed! Your site is working correctly.${colors.reset}`)
  } else {
    console.log(`${colors.red}⚠️  Some tests failed. Check the errors above.${colors.reset}`)
  }
}

runTests().catch(console.error)
