#!/usr/bin/env node

/**
 * Verify all API endpoints in frontend match the Netlify functions
 */

import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

console.log('🔍 Verifying API Endpoints\n')
console.log('═'.repeat(70))

// Get all function files
const functionsDir = 'netlify/functions'
const srcDir = 'src'

async function getFunctionNames() {
  const files = await readdir(functionsDir)
  return files
    .filter(f => f.endsWith('.js') && !f.startsWith('utils'))
    .map(f => f.replace('.js', ''))
}

async function findApiCalls(dir) {
  const apiCalls = new Set()
  
  async function scanDir(currentDir) {
    const entries = await readdir(currentDir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name)
      
      if (entry.isDirectory()) {
        await scanDir(fullPath)
      } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.js')) {
        const content = await readFile(fullPath, 'utf-8')
        
        // Find all API calls
        const regex = /['"`]\/api\/([a-z-]+)/g
        let match
        while ((match = regex.exec(content)) !== null) {
          apiCalls.add(match[1])
        }
      }
    }
  }
  
  await scanDir(dir)
  return Array.from(apiCalls).sort()
}

async function main() {
  try {
    console.log('\n📋 Step 1: Scanning Netlify Functions')
    console.log('─'.repeat(70))
    
    const functionNames = await getFunctionNames()
    console.log(`Found ${functionNames.length} functions:\n`)
    functionNames.forEach(name => console.log(`  • ${name}`))
    
    console.log('\n📋 Step 2: Scanning Frontend API Calls')
    console.log('─'.repeat(70))
    
    const apiCalls = await findApiCalls(srcDir)
    console.log(`Found ${apiCalls.length} unique API endpoints:\n`)
    apiCalls.forEach(name => console.log(`  • /api/${name}`))
    
    console.log('\n📋 Step 3: Verification')
    console.log('─'.repeat(70))
    
    let allMatch = true
    const missingFunctions = []
    const unusedFunctions = []
    
    // Check if all API calls have corresponding functions
    for (const apiCall of apiCalls) {
      if (!functionNames.includes(apiCall)) {
        console.log(`❌ API call /api/${apiCall} has NO matching function`)
        missingFunctions.push(apiCall)
        allMatch = false
      } else {
        console.log(`✓ /api/${apiCall}`)
      }
    }
    
    // Check for unused functions
    for (const funcName of functionNames) {
      if (!apiCalls.includes(funcName)) {
        unusedFunctions.push(funcName)
      }
    }
    
    console.log('\n' + '═'.repeat(70))
    
    if (allMatch) {
      console.log('✅ All API endpoints match their functions!')
    } else {
      console.log('⚠️  Some API endpoints do not match!')
      console.log('\nMissing functions:')
      missingFunctions.forEach(name => console.log(`  • ${name}.js`))
    }
    
    if (unusedFunctions.length > 0) {
      console.log('\n📝 Unused functions (not called from frontend):')
      unusedFunctions.forEach(name => console.log(`  • ${name}`))
      console.log('\nNote: These might be called from scheduled tasks or webhooks.')
    }
    
    console.log('\n' + '═'.repeat(70))
    console.log('Summary:')
    console.log(`  Functions: ${functionNames.length}`)
    console.log(`  API Calls: ${apiCalls.length}`)
    console.log(`  Matched: ${apiCalls.filter(c => functionNames.includes(c)).length}`)
    console.log(`  Missing: ${missingFunctions.length}`)
    console.log(`  Unused: ${unusedFunctions.length}`)
    
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
