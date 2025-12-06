#!/usr/bin/env node

/**
 * Verify all Netlify functions are properly structured
 */

import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

const FUNCTIONS_DIR = 'netlify/functions'

console.log('🔍 Verifying Netlify Functions\n')
console.log('═'.repeat(60))

async function checkFunction(filename) {
  const filepath = join(FUNCTIONS_DIR, filename)
  const content = await readFile(filepath, 'utf-8')
  
  const checks = {
    hasHandler: content.includes('export async function handler'),
    hasStatusCode: content.includes('statusCode'),
    hasErrorHandling: content.includes('try') && content.includes('catch'),
    hasReturn: content.includes('return {'),
    hasBody: content.includes('body:') || content.includes('body :'),
  }
  
  const allPassed = Object.values(checks).every(v => v)
  
  return { filename, checks, allPassed }
}

async function main() {
  try {
    const files = await readdir(FUNCTIONS_DIR)
    const jsFiles = files.filter(f => f.endsWith('.js') && !f.includes('utils'))
    
    console.log(`\nFound ${jsFiles.length} function files\n`)
    
    let passed = 0
    let failed = 0
    const issues = []
    
    for (const file of jsFiles) {
      const result = await checkFunction(file)
      
      if (result.allPassed) {
        console.log(`✓ ${file}`)
        passed++
      } else {
        console.log(`✗ ${file}`)
        failed++
        
        const problems = []
        if (!result.checks.hasHandler) problems.push('Missing handler export')
        if (!result.checks.hasStatusCode) problems.push('Missing statusCode')
        if (!result.checks.hasErrorHandling) problems.push('Missing error handling')
        if (!result.checks.hasReturn) problems.push('Missing return statement')
        if (!result.checks.hasBody) problems.push('Missing body property')
        
        issues.push({ file, problems })
      }
    }
    
    console.log('\n' + '═'.repeat(60))
    console.log(`\n✓ Passed: ${passed}`)
    console.log(`✗ Failed: ${failed}`)
    
    if (issues.length > 0) {
      console.log('\n⚠️  Issues Found:\n')
      for (const issue of issues) {
        console.log(`${issue.file}:`)
        issue.problems.forEach(p => console.log(`  - ${p}`))
        console.log()
      }
    } else {
      console.log('\n🎉 All functions are properly structured!')
    }
    
    // Check utils
    console.log('\n' + '═'.repeat(60))
    console.log('Checking utility files...\n')
    
    const utilFiles = ['utils/db.js', 'utils/auth.js', 'utils/email.js']
    for (const util of utilFiles) {
      try {
        await readFile(join(FUNCTIONS_DIR, util), 'utf-8')
        console.log(`✓ ${util}`)
      } catch {
        console.log(`✗ ${util} - MISSING`)
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
