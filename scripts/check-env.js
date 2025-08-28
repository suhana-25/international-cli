// Environment Variables Checker
// Run with: node scripts/check-env.js

const fs = require('fs')
const path = require('path')

// Load .env file manually
function loadEnvFile(filename) {
  const envPath = path.join(process.cwd(), filename)
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8')
    content.split('\n').forEach(line => {
      line = line.trim()
      if (line && !line.startsWith('#') && line.includes('=')) {
        const [key, ...values] = line.split('=')
        const value = values.join('=').replace(/^["']|["']$/g, '')
        if (key && !process.env[key]) {
          process.env[key] = value
        }
      }
    })
    console.log(`📁 Loaded ${filename}`)
  }
}

// Load environment files in order
loadEnvFile('.env')
loadEnvFile('.env.local')

console.log('🔍 Checking Environment Variables...\n')

const requiredVars = [
  'POSTGRES_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL'
]

const optionalVars = [
  'AUTH_SECRET',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'UPLOADTHING_SECRET',
  'UPLOADTHING_APP_ID',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY'
]

let allGood = true

// Check required variables
console.log('✅ Required Variables:')
requiredVars.forEach(varName => {
  const value = process.env[varName]
  if (!value) {
    console.log(`❌ ${varName}: NOT SET`)
    allGood = false
  } else {
    console.log(`✅ ${varName}: SET (${value.substring(0, 20)}...)`)
  }
})

console.log('\n📋 Optional Variables:')
optionalVars.forEach(varName => {
  const value = process.env[varName]
  if (!value) {
    console.log(`⚠️  ${varName}: Not set (optional)`)
  } else {
    console.log(`✅ ${varName}: SET (${value.substring(0, 20)}...)`)
  }
})

console.log('\n🔧 Configuration Check:')

// Check NEXTAUTH_URL format
const nextAuthUrl = process.env.NEXTAUTH_URL
if (nextAuthUrl) {
  if (!nextAuthUrl.startsWith('http')) {
    console.log('❌ NEXTAUTH_URL: Must start with http:// or https://')
    allGood = false
  } else if (nextAuthUrl.endsWith('/')) {
    console.log('⚠️  NEXTAUTH_URL: Ends with "/" - might cause issues')
  } else {
    console.log('✅ NEXTAUTH_URL: Format looks good')
  }
} else {
  console.log('❌ NEXTAUTH_URL: Not set')
  allGood = false
}

// Check secret length
const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET
if (secret) {
  if (secret.length < 32) {
    console.log('⚠️  SECRET: Too short (should be 32+ characters)')
  } else {
    console.log('✅ SECRET: Length is good')
  }
} else {
  console.log('❌ SECRET: Not set')
  allGood = false
}

console.log('\n' + '='.repeat(50))
if (allGood) {
  console.log('🎉 All required environment variables are set!')
  console.log('Your authentication should work correctly.')
} else {
  console.log('❌ Some required environment variables are missing.')
  console.log('Please set them before deploying.')
}
console.log('='.repeat(50))
