// Test Admin Login
const fs = require('fs')

// Load .env file manually
function loadEnvFile(filename) {
  const envPath = filename
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
  }
}

loadEnvFile('.env')

const { Client } = require('pg')
const { compare } = require('bcrypt-ts-edge')

async function testAdminLogin() {
  const connectionString = process.env.POSTGRES_URL
  
  if (!connectionString) {
    console.log('❌ POSTGRES_URL not found in environment')
    return
  }

  const client = new Client({
    connectionString: connectionString
  })

  try {
    console.log('🧪 Testing admin login credentials...\n')
    console.log('🔗 Connecting to database...')
    
    await client.connect()
    console.log('✅ Database connected!')

    // Get admin user
    const adminQuery = await client.query(
      'SELECT id, email, name, role, password FROM users WHERE email = $1',
      ['admin@niteshhandicraft.com']
    )
    
    if (adminQuery.rows.length === 0) {
      console.log('❌ Admin user not found!')
      return
    }

    const admin = adminQuery.rows[0]
    console.log('✅ Admin user found!')
    console.log('📧 Email:', admin.email)
    console.log('👤 Name:', admin.name)
    console.log('🔑 Role:', admin.role)

    // Test password
    const testPassword = 'nitesh121321421'
    console.log(`\n🔓 Testing password: "${testPassword}"`)
    
    const isValid = await compare(testPassword, admin.password)
    
    if (isValid) {
      console.log('✅ Password verification SUCCESSFUL!')
      console.log('🎉 Admin login should work now!')
    } else {
      console.log('❌ Password verification FAILED!')
      console.log('🔧 Password hash might be corrupted')
    }

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

testAdminLogin()
