// Create Admin User Script
const fs = require('fs')
const path = require('path')

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

async function createAdminUser() {
  const connectionString = process.env.POSTGRES_URL
  
  if (!connectionString) {
    console.log('❌ POSTGRES_URL not found in environment')
    return
  }

  const client = new Client({
    connectionString: connectionString
  })

  try {
    console.log('🔐 Creating Admin User...\n')
    console.log('🔗 Connecting to database...')
    
    await client.connect()
    console.log('✅ Database connected!')

    // Check if admin user already exists
    const existingUser = await client.query(
      'SELECT id, email, role FROM users WHERE email = $1',
      ['admin@niteshhandicraft.com']
    )

    if (existingUser.rows.length > 0) {
      console.log('✅ Admin user already exists:')
      console.log(`   Email: ${existingUser.rows[0].email}`)
      console.log(`   Role: ${existingUser.rows[0].role}`)
      console.log(`   ID: ${existingUser.rows[0].id}`)
      return
    }

    // Create admin user
    const adminUser = {
      id: crypto.randomUUID(),
      name: 'Admin User',
      email: 'admin@niteshhandicraft.com',
      password: 'nitesh121321421', // Plain text for development
      role: 'admin',
      address: 'Admin Address',
      paymentMethod: 'admin'
    }

    const result = await client.query(`
      INSERT INTO users (id, name, email, password, role, address, payment_method, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING id, email, role
    `, [
      adminUser.id,
      adminUser.name,
      adminUser.email,
      adminUser.password,
      adminUser.role,
      adminUser.address,
      adminUser.paymentMethod
    ])

    console.log('✅ Admin user created successfully!')
    console.log(`   Email: ${result.rows[0].email}`)
    console.log(`   Role: ${result.rows[0].role}`)
    console.log(`   ID: ${result.rows[0].id}`)
    console.log('\n🔐 Admin Login Credentials:')
    console.log(`   Email: ${adminUser.email}`)
    console.log(`   Password: ${adminUser.password}`)
    console.log(`   URL: http://localhost:3000/admin`)

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
  } finally {
    await client.end()
  }
}

createAdminUser().catch(console.error)
