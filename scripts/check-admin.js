// Check Admin User - Direct SQL Query
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

async function checkAdmin() {
  const connectionString = process.env.POSTGRES_URL
  
  if (!connectionString) {
    console.log('❌ POSTGRES_URL not found in environment')
    return
  }

  const client = new Client({
    connectionString: connectionString
  })

  try {
    console.log('🔍 Checking admin user in database...\n')
    console.log('🔗 Connecting to database...')
    
    await client.connect()
    console.log('✅ Database connected!')

    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `)
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ Users table does not exist!')
      return
    }

    console.log('✅ Users table exists')

    // Check admin user
    const adminQuery = await client.query(
      'SELECT id, email, name, role, password IS NOT NULL as has_password, created_at FROM users WHERE email = $1',
      ['admin@niteshhandicraft.com']
    )
    
    if (adminQuery.rows.length === 0) {
      console.log('\n❌ Admin user NOT FOUND in database!')
      console.log('📧 Looking for email: admin@niteshhandicraft.com')
      
      // Check all users
      const allUsersQuery = await client.query('SELECT email, role, name FROM users ORDER BY created_at DESC LIMIT 5')
      console.log(`\n📊 Total users found: ${allUsersQuery.rows.length}`)
      
      if (allUsersQuery.rows.length > 0) {
        console.log('\n👥 Existing users:')
        allUsersQuery.rows.forEach((user, index) => {
          console.log(`${index + 1}. Email: ${user.email}, Role: ${user.role}, Name: ${user.name}`)
        })
      }

      console.log('\n🔧 Creating admin user...')
      await createAdminUser(client)
      
    } else {
      console.log('\n✅ Admin user FOUND!')
      const admin = adminQuery.rows[0]
      console.log('📧 Email:', admin.email)
      console.log('👤 Name:', admin.name)
      console.log('🔑 Role:', admin.role)
      console.log('🔒 Has Password:', admin.has_password ? 'YES' : 'NO')
      console.log('📅 Created:', admin.created_at)

      if (!admin.has_password) {
        console.log('\n🔧 Admin has no password! Updating...')
        await updateAdminPassword(client, admin.id)
      } else {
        console.log('\n🔧 Updating admin password to ensure it works...')
        await updateAdminPassword(client, admin.id)
      }
    }
  } catch (error) {
    console.error('❌ Database Error:', error.message)
  } finally {
    await client.end()
  }
}

async function createAdminUser(client) {
  const { hash } = require('bcrypt-ts-edge')
  
  try {
    const hashedPassword = await hash('nitesh121321421', 10)
    const adminId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
    
    await client.query(
      'INSERT INTO users (id, name, email, password, role, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [adminId, 'Admin', 'admin@niteshhandicraft.com', hashedPassword, 'admin', new Date(), new Date()]
    )
    
    console.log('✅ Admin user created successfully!')
    console.log('📧 Email: admin@niteshhandicraft.com')
    console.log('🔑 Password: nitesh121321421')
    console.log('👤 Role: admin')
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
  }
}

async function updateAdminPassword(client, adminId) {
  const { hash } = require('bcrypt-ts-edge')
  
  try {
    const hashedPassword = await hash('nitesh121321421', 10)
    
    await client.query(
      'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3',
      [hashedPassword, new Date(), adminId]
    )
    
    console.log('✅ Admin password updated successfully!')
    console.log('🔑 New Password: nitesh121321421')
    
  } catch (error) {
    console.error('❌ Error updating admin password:', error.message)
  }
}

checkAdmin()
