// Create Test Categories Script
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
  }
}

loadEnvFile('.env')

const { Client } = require('pg')

async function createTestCategories() {
  const connectionString = process.env.POSTGRES_URL
  if (!connectionString) {
    console.error('❌ POSTGRES_URL not found in environment variables')
    return
  }

  const client = new Client({ connectionString })
  
  try {
    await client.connect()
    console.log('✅ Database connected!')

    // Check existing categories
    const existingQuery = await client.query('SELECT * FROM categories ORDER BY created_at')
    console.log(`📊 Found ${existingQuery.rows.length} existing categories:`)
    existingQuery.rows.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`)
    })

    if (existingQuery.rows.length === 0) {
      console.log('\n🔧 Creating test categories...')
      
      const testCategories = [
        { name: 'Stone Sculptures', slug: 'stone-sculptures', description: 'Beautiful handcrafted stone sculptures and statues' },
        { name: 'Wooden Handicrafts', slug: 'wooden-handicrafts', description: 'Traditional wooden art and decorative pieces' },
        { name: 'Metal Art', slug: 'metal-art', description: 'Elegant metal sculptures and artistic creations' },
        { name: 'Traditional Paintings', slug: 'traditional-paintings', description: 'Authentic traditional paintings and artwork' },
        { name: 'Home Decor', slug: 'home-decor', description: 'Beautiful decorative items for your home' }
      ]

      for (const category of testCategories) {
        const categoryId = Date.now().toString() + Math.random().toString(36).substr(2, 9)
        await client.query(
          'INSERT INTO categories (id, name, slug, description, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
          [categoryId, category.name, category.slug, category.description, new Date(), new Date()]
        )
        console.log(`✅ Created: ${category.name}`)
      }
      
      console.log('\n🎉 Test categories created successfully!')
    } else {
      console.log('\n✅ Categories already exist in database')
    }

    // Final check
    const finalQuery = await client.query('SELECT COUNT(*) as count FROM categories')
    console.log(`\n📊 Total categories in database: ${finalQuery.rows[0].count}`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await client.end()
  }
}

createTestCategories()
